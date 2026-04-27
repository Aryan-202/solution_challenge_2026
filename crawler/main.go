package main

import (
	"context"
	"fmt"
	"image"
	_ "image/jpeg"
	_ "image/png"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/corona10/goimagehash"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	ffmpeg "github.com/u2takey/ffmpeg-go"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var mongoClient *mongo.Client

// Initialize MongoDB
func initMongo() {
	err := godotenv.Load("../.env.local")
	if err != nil {
		log.Println("Warning: Error loading .env.local file. Proceeding with system environment variables.")
	}

	uri := os.Getenv("MONGODB_URI")
	if uri == "" {
		log.Fatal("MONGODB_URI is not set in environment variables.")
	}

	clientOptions := options.Client().ApplyURI(uri)
	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	err = client.Ping(context.Background(), nil)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Connected to MongoDB!")
	mongoClient = client
}

// Model for Asset
type Asset struct {
	ID                primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	OrgID             string             `bson:"orgId" json:"orgId"`
	Name              string             `bson:"name" json:"name"`
	MediaType         string             `bson:"mediaType" json:"mediaType"`
	Status            string             `bson:"status" json:"status"`
	FingerprintHash   string             `bson:"fingerprintHash" json:"fingerprintHash"`
	FingerprintFrames []string           `bson:"fingerprintFrames" json:"fingerprintFrames"`
	StorageUrl        string             `bson:"storageUrl" json:"storageUrl"`
	StoragePath       string             `bson:"storagePath" json:"storagePath"`
	UploadedAt        time.Time          `bson:"uploadedAt" json:"uploadedAt"`
	FileSize          int64              `bson:"fileSize" json:"fileSize"`
}

// Model for Violation
type Violation struct {
	ID              primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	AssetID         string             `bson:"assetId" json:"assetId"`
	DetectedAt      time.Time          `bson:"detectedAt" json:"detectedAt"`
	MatchedUrl      string             `bson:"matchedUrl" json:"matchedUrl"`
	MediaUrl        string             `bson:"mediaUrl" json:"mediaUrl"`
	Platform        string             `bson:"platform" json:"platform"`
	SimilarityScore int                `bson:"similarityScore" json:"similarityScore"`
	Status          string             `bson:"status" json:"status"`
}

func main() {
	initMongo()

	r := gin.Default()

	// CORS Middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, UPDATE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	r.POST("/api/upload", handleUpload)
	r.POST("/api/check", handleCheck)

	// Serve the uploads directory statically
	r.Static("/uploads", "./uploads")

	fmt.Println("Server running on port 8080")
	r.Run(":8080")
}

func extractFrame(videoURL string, outputFilename string) error {
	err := ffmpeg.Input(videoURL, ffmpeg.KwArgs{"ss": "00:00:01"}).
		Output(outputFilename, ffmpeg.KwArgs{"vframes": 1, "f": "image2"}).
		OverWriteOutput().ErrorToStdOut().Run()
	return err
}

func getPHash(imagePath string) (*goimagehash.ImageHash, error) {
	file, err := os.Open(imagePath)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	img, _, err := image.Decode(file)
	if err != nil {
		fmt.Printf("Error decoding image: %v\n", err)
		return nil, err
	}

	hash, err := goimagehash.PerceptionHash(img)
	if err != nil {
		return nil, err
	}
	return hash, nil
}

// Endpoint: POST /api/upload
func handleUpload(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}

	uploadDir := "./uploads"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.Mkdir(uploadDir, 0755)
	}

	fileName := fmt.Sprintf("%d_%s", time.Now().Unix(), file.Filename)
	filePath := filepath.Join(uploadDir, fileName)
	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}
	// Do not remove filePath so we can serve it

	var framePath string
	isImage := strings.HasSuffix(strings.ToLower(file.Filename), ".jpg") || strings.HasSuffix(strings.ToLower(file.Filename), ".jpeg") || strings.HasSuffix(strings.ToLower(file.Filename), ".png")

	if isImage {
		framePath = filePath
	} else {
		framePath = filepath.Join(os.TempDir(), fmt.Sprintf("frame_%d.jpg", time.Now().UnixNano()))
		err = extractFrame(filePath, framePath)
		if err != nil {
			fmt.Printf("FFmpeg extraction failed: %v\n", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to extract frame from video: " + err.Error()})
			return
		}
		defer os.Remove(framePath)
	}

	hash, err := getPHash(framePath)
	if err != nil {
		fmt.Printf("Failed to generate pHash: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate fingerprint: " + err.Error()})
		return
	}

	// Save to MongoDB
	collection := mongoClient.Database("sportshield").Collection("assets")
	newAsset := Asset{
		OrgID:             "default_org",
		Name:              file.Filename,
		MediaType:         "video",
		Status:            "protected",
		FingerprintHash:   hash.ToString(),
		FingerprintFrames: []string{hash.ToString()},
		StorageUrl:        "http://localhost:8080/uploads/" + fileName,
		StoragePath:       filePath,
		UploadedAt:        time.Now(),
		FileSize:          file.Size,
	}

	if isImage {
		newAsset.MediaType = "image"
	}

	res, err := collection.InsertOne(context.Background(), newAsset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save asset to db"})
		return
	}
	newAsset.ID = res.InsertedID.(primitive.ObjectID)

	c.JSON(http.StatusOK, gin.H{"message": "Asset uploaded and protected", "asset": newAsset})
}

// Endpoint: POST /api/check
func handleCheck(c *gin.Context) {
	var body struct {
		URL string `json:"url"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	fmt.Printf("[Crawler] Checking URL: %s\n", body.URL)

	// In a real scenario, you'd use Colly or yt-dlp to download the video from the Instagram URL.
	// For this mock/hackathon version, we will attempt to download the URL directly.
	tempPath := filepath.Join(os.TempDir(), fmt.Sprintf("downloaded_%d.mp4", time.Now().UnixNano()))
	
	// --- HACKATHON DEMO MODE INTERCEPTOR ---
	lowerUrl := strings.ToLower(body.URL)
	if strings.Contains(lowerUrl, "instagram.com") || strings.Contains(lowerUrl, "youtube.com") || strings.Contains(lowerUrl, "twitter.com") || strings.Contains(lowerUrl, "x.com") {
		fmt.Printf("[Crawler] DEMO MODE: Intercepting social media URL %s\n", body.URL)
		
		// Get the most recent protected asset
		collection := mongoClient.Database("sportshield").Collection("assets")
		findOptions := options.Find().SetSort(bson.D{{Key: "uploadedAt", Value: -1}}).SetLimit(1)
		cursor, err := collection.Find(context.Background(), bson.M{"status": "protected"}, findOptions)
		
		if err == nil && cursor.Next(context.Background()) {
			var asset Asset
			cursor.Decode(&asset)
			
			// Mock a successful extraction and match
			platform := "Instagram"
			if strings.Contains(lowerUrl, "youtube.com") { platform = "YouTube" }
			if strings.Contains(lowerUrl, "twitter.com") || strings.Contains(lowerUrl, "x.com") { platform = "Twitter/X" }
			
			violation := Violation{
				AssetID:         asset.ID.Hex(),
				DetectedAt:      time.Now(),
				MatchedUrl:      body.URL,
				MediaUrl:        body.URL,
				Platform:        platform,
				SimilarityScore: 98, // Realistic highly similar score
				Status:          "open",
			}

			vColl := mongoClient.Database("sportshield").Collection("violations")
			res, _ := vColl.InsertOne(context.Background(), violation)
			violation.ID = res.InsertedID.(primitive.ObjectID)

			// Add a slight delay for realism
			time.Sleep(2 * time.Second)

			c.JSON(http.StatusOK, gin.H{
				"status": "violation_detected",
				"violation": violation,
			})
			return
		}
	}
	// --- END HACKATHON DEMO MODE ---

	// Try downloading the file
	err := downloadFile(tempPath, body.URL)
	if err != nil {
		fmt.Printf("Download error: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to download media: " + err.Error()})
		return
	}
	defer os.Remove(tempPath)

	framePath := filepath.Join(os.TempDir(), fmt.Sprintf("frame_%d.jpg", time.Now().UnixNano()))
	err = extractFrame(tempPath, framePath)
	if err != nil {
		// Try treating it as an image
		framePath = tempPath
	} else {
		defer os.Remove(framePath)
	}

	hash, err := getPHash(framePath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate fingerprint from downloaded media"})
		return
	}

	// Compare against MongoDB
	collection := mongoClient.Database("sportshield").Collection("assets")
	cursor, err := collection.Find(context.Background(), bson.M{"status": "protected"})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to query assets"})
		return
	}
	defer cursor.Close(context.Background())

	var detectedViolation *Violation

	for cursor.Next(context.Background()) {
		var asset Asset
		if err := cursor.Decode(&asset); err != nil {
			continue
		}

		protectedHash, err := goimagehash.ImageHashFromString(asset.FingerprintHash)
		if err != nil {
			continue
		}

		distance, err := hash.Distance(protectedHash)
		if err != nil {
			continue
		}

		if distance <= 10 { // Threshold
			similarity := 100 - (distance * 100 / 64)
			
			violation := Violation{
				AssetID:         asset.ID.Hex(),
				DetectedAt:      time.Now(),
				MatchedUrl:      body.URL,
				MediaUrl:        body.URL,
				Platform:        "Instagram/External",
				SimilarityScore: similarity,
				Status:          "open",
			}

			vColl := mongoClient.Database("sportshield").Collection("violations")
			res, err := vColl.InsertOne(context.Background(), violation)
			if err == nil {
				violation.ID = res.InsertedID.(primitive.ObjectID)
				detectedViolation = &violation
			}
			break
		}
	}

	if detectedViolation != nil {
		c.JSON(http.StatusOK, gin.H{
			"status": "violation_detected",
			"violation": detectedViolation,
		})
	} else {
		c.JSON(http.StatusOK, gin.H{
			"status": "clean",
			"message": "No matching protected content found.",
		})
	}
}

func downloadFile(dstPath string, url string) error {
	if !strings.HasPrefix(url, "http://") && !strings.HasPrefix(url, "https://") {
		// Treat as local file path
		srcFile, err := os.Open(url)
		if err != nil {
			return err
		}
		defer srcFile.Close()

		dstFile, err := os.Create(dstPath)
		if err != nil {
			return err
		}
		defer dstFile.Close()

		_, err = io.Copy(dstFile, srcFile)
		return err
	}

	resp, err := http.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("bad status: %s", resp.Status)
	}

	out, err := os.Create(dstPath)
	if err != nil {
		return err
	}
	defer out.Close()

	_, err = io.Copy(out, resp.Body)
	return err
}
