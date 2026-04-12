'use client';
import { useState, useRef } from 'react';
import { Upload as UploadIcon, X, FileImage, FileVideo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export function DropZone({ onFileSelect, disabled }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<{ url: string; type: 'image' | 'video'; name: string; size: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    if (file.size > 100 * 1024 * 1024) {
      toast.error('File size exceeds 100MB limit');
      return;
    }
    
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      toast.error('Only images and videos are supported');
      return;
    }

    const isImage = file.type.startsWith('image/');
    
    if (isImage) {
      const url = URL.createObjectURL(file);
      setPreview({ url, type: 'image', name: file.name, size: file.size });
    } else {
      setPreview({ url: '', type: 'video', name: file.name, size: file.size });
    }
    
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (e.dataTransfer.files.length > 1) {
        toast.warning('Only one file can be uploaded at a time. Using the first file.');
      }
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const clearSelection = () => {
    if (preview?.type === 'image' && preview.url) {
      URL.revokeObjectURL(preview.url);
    }
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  if (preview) {
    return (
      <div className="border-2 border-solid border-slate-200 dark:border-slate-800 rounded-xl p-6 bg-white dark:bg-slate-900 relative">
        {!disabled && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={clearSelection}
            className="absolute top-4 right-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full h-8 w-8"
          >
            <X size={16} />
          </Button>
        )}
        
        <div className="flex flex-col items-center">
          {preview.type === 'image' ? (
            <div className="w-full max-w-sm h-64 relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview.url} alt="Preview" className="max-w-full max-h-full object-contain" />
            </div>
          ) : (
            <div className="w-full max-w-sm h-64 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center">
              <FileVideo size={64} className="text-slate-400 mb-4" />
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Video File Selected</p>
            </div>
          )}
          
          <div className="mt-6 text-center">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white truncate max-w-md">{preview.name}</h3>
            <p className="text-slate-500 text-sm mt-1">{formatSize(preview.size)} • {preview.type}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
        isDragging 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 bg-slate-50 dark:bg-slate-900'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !disabled && fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileInput} 
        className="hidden" 
        accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
        disabled={disabled}
      />
      
      <div className="flex justify-center mb-4">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-200 dark:border-slate-700">
          <UploadIcon size={32} className="text-blue-500" />
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
        Drag & drop your media here
      </h3>
      <p className="text-slate-500 mb-6 text-sm max-w-sm mx-auto">
        Or click to browse from your computer. Supports images (JPG, PNG, WEBP) and videos (MP4, MOV) up to 100MB.
      </p>
      
      <Button variant="outline" className="pointer-events-none" disabled={disabled}>Select File</Button>
    </div>
  );
}
