export interface Asset {
  id: string;
  orgId: string;
  name: string;
  mediaType: 'image' | 'video';
  storageUrl: string;
  storagePath: string;
  fingerprintHash: string;
  fingerprintFrames: string[];
  status: 'uploading' | 'protected' | 'scanning' | 'violation';
  uploadedAt: any; // Using any for Firebase Timestamp in frontend
  fileSize: number;
  thumbnailUrl?: string;
}

export interface Violation {
  id: string;
  assetId: string;
  orgId: string;
  matchedUrl: string;
  platform: string;
  similarityScore: number;
  detectedAt: any; // Using any for Firebase Timestamp in frontend
  status: 'open' | 'resolved' | 'ignored';
  geoLocation: { lat: number; lng: number; country: string; city: string };
  thumbnailUrl?: string;
}
