'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DropZone } from '@/components/upload/DropZone';
import { UploadProgress } from '@/components/upload/UploadProgress';
import { Button } from '@/components/ui/button';
import { useAssets } from '@/hooks/useAssets';
import { toast } from 'sonner';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState(0); // 0=idle, 1=upload, 2=fingerprint, 3=done
  const [progress, setProgress] = useState(0);
  const { addAsset } = useAssets();
  const router = useRouter();

  const handleUploadAndProtect = async () => {
    if (!file) return;
    
    try {
      // Step 1: Uploading
      setStep(1);
      
      // Mock upload progression
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise(r => setTimeout(r, 200));
      }
      
      // Step 2: Fingerprinting
      setStep(2);
      await new Promise(r => setTimeout(r, 2000));
      
      const formData = new FormData();
      formData.append('file', file);

      // Save to MongoDB via Go API route
      const res = await fetch('http://localhost:8080/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        throw new Error('Failed to upload and protect via Go backend');
      }

      const { asset } = await res.json();
      
      // Add to local state using the returned database asset
      addAsset({
        ...asset,
        id: asset.id || asset._id || `asset_${Date.now()}`
      });
      
      // Step 3: Done
      setStep(3);
      toast.success('Your content has been protected and stored successfully!');
      
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload and protect media');
      setStep(0);
      setProgress(0);
    }
  };

  const resetFlow = () => {
    setFile(null);
    setStep(0);
    setProgress(0);
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">Upload Media</h1>
        <p className="text-slate-500 dark:text-slate-400">Protect your original content by generating an immutable perceptual fingerprint.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        {step === 0 && (
          <DropZone onFileSelect={setFile} disabled={step > 0} />
        )}
        
        {step > 0 && (
          <UploadProgress step={step} progress={progress} />
        )}

        {step === 0 && file && (
          <div className="mt-8 flex justify-end">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 w-full sm:w-auto shadow-md"
              onClick={handleUploadAndProtect}
            >
              Upload & Protect
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="mt-8 flex gap-4 justify-center">
            <Button variant="outline" onClick={resetFlow}>Upload Another</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => router.push('/library')}>View Library</Button>
          </div>
        )}
      </div>
    </div>
  );
}
