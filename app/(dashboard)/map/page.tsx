'use client';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const SpreadMap = dynamic(() => import('@/components/map/SpreadMap'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-500">
      <Loader2 size={32} className="animate-spin mb-4 text-blue-500" />
      <p>Loading interactive map...</p>
    </div>
  )
});

export default function MapPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">Content Spread Map</h1>
        <p className="text-slate-500 dark:text-slate-400">Visualize where your protected content is being used globally.</p>
      </div>

      <SpreadMap />
    </div>
  );
}
