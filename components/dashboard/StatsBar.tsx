'use client';
import { useAssets } from '@/hooks/useAssets';
import { useViolations } from '@/hooks/useViolations';
import { Shield, CheckCircle, AlertTriangle, Activity } from 'lucide-react';

export function StatsBar() {
  const { assets } = useAssets();
  const { violations } = useViolations();

  const totalAssets = assets.length;
  const protectedAssets = assets.filter((a) => a.status === 'protected').length;
  const openViolations = violations.filter((v) => v.status === 'open').length;
  const avgSimilarity = 
    violations.length > 0 
      ? Math.round(violations.reduce((acc, v) => acc + v.similarityScore, 0) / violations.length) 
      : 0;

  const stats = [
    { label: 'Total Assets', value: totalAssets, icon: Shield, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Protected', value: protectedAssets, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Violations Found', value: openViolations, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' },
    { label: 'Avg Similarity', value: `${avgSimilarity}%`, icon: Activity, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <Icon size={24} className={stat.color} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
