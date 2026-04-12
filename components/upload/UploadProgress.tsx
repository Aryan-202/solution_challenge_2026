'use client';
import { Upload, Fingerprint, Shield, CheckCircle2 } from 'lucide-react';

interface UploadProgressProps {
  step: number; // 0 = not started, 1 = uploading, 2 = fingerprinting, 3 = protected
  progress: number; // 0-100 for actual file upload progress
}

export function UploadProgress({ step, progress }: UploadProgressProps) {
  const steps = [
    { id: 1, title: 'Uploading', icon: Upload },
    { id: 2, title: 'Generating Fingerprint', icon: Fingerprint },
    { id: 3, title: 'Protected', icon: Shield },
  ];

  return (
    <div className="w-full mt-8">
      <div className="relative">
        <div className="absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 bg-slate-200 dark:bg-slate-800 rounded-full z-0"></div>
        <div 
          className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-blue-500 rounded-full z-0 transition-all duration-500"
          style={{ width: `${step >= 3 ? 100 : step === 2 ? 66 : step === 1 ? 33 : 0}%` }}
        ></div>
        
        <div className="relative z-10 flex justify-between">
          {steps.map((s, i) => {
            const isCompleted = step > s.id;
            const isCurrent = step === s.id;
            const isPending = step < s.id;
            
            const Icon = isCompleted && s.id !== 3 ? CheckCircle2 : s.icon;
            
            return (
              <div key={s.id} className="flex flex-col items-center">
                <div 
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-300 ${
                    isCompleted 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : isCurrent 
                        ? 'bg-white dark:bg-slate-900 border-blue-600 text-blue-600 dark:text-blue-400 font-bold' 
                        : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-400'
                  }`}
                >
                  <Icon size={18} className={isCompleted && s.id !== 3 ? 'text-white' : ''} />
                </div>
                <div className="mt-3 text-center">
                  <p className={`text-sm font-medium ${
                    isCompleted || isCurrent ? 'text-slate-900 dark:text-white' : 'text-slate-500'
                  }`}>
                    {s.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {step === 1 && (
        <div className="mt-8 max-w-sm mx-auto">
          <div className="flex justify-between text-sm mb-2 text-slate-600 dark:text-slate-400">
            <span>Uploading to secure storage</span>
            <span className="font-medium text-slate-900 dark:text-white">{progress}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
            <div 
              className="bg-blue-600 rounded-full h-2 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="mt-8 text-center animate-pulse text-slate-600 dark:text-slate-400 text-sm">
          Generating cryptographic perceptual hash...
        </div>
      )}
      
      {step === 3 && (
        <div className="mt-8 text-center text-green-600 dark:text-green-400 font-medium flex items-center justify-center gap-2">
          <CheckCircle2 size={24} />
          Your content is now protected!
        </div>
      )}
    </div>
  );
}
