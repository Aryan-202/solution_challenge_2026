'use client';
import { useState } from 'react';
import { useAssets } from '@/hooks/useAssets';
import { useViolations } from '@/hooks/useViolations';
import { Asset } from '@/lib/types';
import { format } from 'date-fns';
import { Search, Loader2, PlayCircle, Image as ImageIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function AssetGrid() {
  const { assets } = useAssets();
  const { violations } = useViolations();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
    if (sortBy === 'oldest') return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
    
    // Sort by most violations
    const vCountA = violations.filter(v => v.assetId === a.id).length;
    const vCountB = violations.filter(v => v.assetId === b.id).length;
    return vCountB - vCountA;
  });

  const getStatusBadge = (status: Asset['status']) => {
    switch (status) {
      case 'protected':
        return <Badge variant="outline" className="border-green-500 text-green-600 bg-green-50 dark:bg-green-950/20 dark:border-green-800 dark:text-green-400">Protected</Badge>;
      case 'violation':
        return <Badge variant="outline" className="border-red-500 text-red-600 bg-red-50 dark:bg-red-950/20 dark:border-red-800 dark:text-red-400">Violation Found</Badge>;
      case 'scanning':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-800 dark:text-yellow-400">Scanning</Badge>;
      case 'uploading':
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800 dark:text-blue-400 flex items-center gap-1">
            <Loader2 size={10} className="animate-spin" /> Uploading
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <Input 
            className="pl-9 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-sm h-9" 
            placeholder="Search assets..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex w-full sm:w-auto items-center gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-[130px] border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="protected">Protected</SelectItem>
              <SelectItem value="violation">Violations</SelectItem>
              <SelectItem value="scanning">Scanning</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-9 w-[150px] border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="violations">Most Violations</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="text-sm text-slate-500 font-medium px-1">
        Showing {filteredAssets.length} of {assets.length} assets
      </div>

      {filteredAssets.length === 0 ? (
        <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center bg-slate-50 dark:bg-slate-900/50">
          <p className="text-slate-500">No assets found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredAssets.map((asset) => (
            <div key={asset.id} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer flex flex-col">
              <div className="aspect-video bg-slate-100 dark:bg-slate-950 relative overflow-hidden flex items-center justify-center">
                {asset.mediaType === 'video' ? (
                  <div className="flex flex-col items-center">
                    <PlayCircle size={48} className="text-slate-300 dark:text-slate-700 group-hover:scale-110 group-hover:text-blue-500 transition-all" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <ImageIcon size={48} className="text-slate-300 dark:text-slate-700 group-hover:scale-110 group-hover:text-blue-500 transition-all" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex flex-col gap-2 items-end">
                  {getStatusBadge(asset.status)}
                  {asset.storageUrl && (
                    <a 
                      href={asset.storageUrl} 
                      download 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full backdrop-blur-sm transition-all"
                      title="Download Asset"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    </a>
                  )}
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-medium text-slate-900 dark:text-white truncate text-sm mb-1" title={asset.name}>{asset.name}</h3>
                <p className="text-xs text-slate-500 mb-3">{format(new Date(asset.uploadedAt), 'MMM d, yyyy')}</p>
                
                <div className="mt-auto">
                  <div className="bg-slate-50 dark:bg-slate-950 p-2 rounded border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <span className="text-[10px] uppercase text-slate-400 font-semibold">Fingerprint ID</span>
                    <span className="font-mono text-xs text-slate-600 dark:text-slate-300">{asset.fingerprintHash.substring(0, 8)}...</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
