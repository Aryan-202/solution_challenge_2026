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
      
      // Mock successful result
      const newAsset = {
        id: `asset_${Date.now()}`,
        orgId: 'mock_org',
        name: file.name,
        mediaType: file.type.startsWith('image/') ? 'image' as const : 'video' as const,
        status: 'protected' as const,
        fingerprintHash: Array.from({length: 16}, () => Math.floor(Math.random()*16).toString(16)).join(''),
        fingerprintFrames: [],
        storageUrl: '',
        storagePath: '',
        uploadedAt: new Date().toISOString(),
        fileSize: file.size,
      };
      
      addAsset(newAsset);
      
      // Step 3: Done
      setStep(3);
      toast.success('Your content has been protected successfully!');
      
    } catch (error) {
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
