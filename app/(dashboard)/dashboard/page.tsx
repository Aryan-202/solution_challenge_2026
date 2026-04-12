import { StatsBar } from '@/components/dashboard/StatsBar';
import { ViolationTable } from '@/components/dashboard/ViolationTable';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">Overview</h1>
        <p className="text-slate-500 dark:text-slate-400">Monitor your protected assets and view recent violations.</p>
      </div>
      
      <StatsBar />
      <ViolationTable />
    </div>
  );
}
