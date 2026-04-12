import { AssetGrid } from '@/components/library/AssetGrid';

export default function LibraryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">Asset Library</h1>
        <p className="text-slate-500 dark:text-slate-400">View and manage your protected digital assets.</p>
      </div>

      <AssetGrid />
    </div>
  );
}
