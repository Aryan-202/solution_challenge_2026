'use client';
import { useState } from 'react';
import { useViolations } from '@/hooks/useViolations';
import { useAssets } from '@/hooks/useAssets';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, ExternalLink, CheckCircle } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { toast } from 'sonner';

export function ViolationTable() {
  const { violations, resolveViolation, ignoreViolation } = useViolations();
  const { assets } = useAssets();
  const [selectedViolationId, setSelectedViolationId] = useState<string | null>(null);

  const selectedViolation = violations.find((v) => v.id === selectedViolationId);
  const relatedAsset = selectedViolation ? assets.find((a) => a.id === selectedViolation.assetId) : null;

  const handleResolve = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    resolveViolation(id);
    toast.success('Violation marked as resolved');
  };

  const handleIgnore = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    ignoreViolation(id);
    toast.success('Violation ignored');
  };

  const sortedViolations = [...violations].sort((a, b) => 
    new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime()
  );

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Recent Detections</h2>
      </div>
      
      {sortedViolations.length === 0 ? (
        <div className="p-12 text-center flex flex-col items-center">
          <CheckCircle size={48} className="text-green-500 mb-4" />
          <h3 className="text-xl font-medium text-slate-800 dark:text-white mb-2">No violations detected yet</h3>
          <p className="text-slate-500">Your content is safe and secure across the web.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">Asset</th>
                <th className="px-6 py-4 font-medium">Platform</th>
                <th className="px-6 py-4 font-medium">Similarity</th>
                <th className="px-6 py-4 font-medium">Detected</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {sortedViolations.map((violation) => {
                const asset = assets.find((a) => a.id === violation.assetId);
                const assetName = asset?.name || 'Unknown Asset';
                
                return (
                  <tr 
                    key={violation.id} 
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedViolationId(violation.id)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                          {asset?.mediaType === 'image' ? (
                            <div className="w-full h-full bg-blue-500/20 flex items-center justify-center">
                              <span className="text-xs font-semibold text-blue-600">IMG</span>
                            </div>
                          ) : (
                            <div className="w-full h-full bg-orange-500/20 flex items-center justify-center">
                              <span className="text-xs font-semibold text-orange-600">VID</span>
                            </div>
                          )}
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white truncate max-w-[200px]">
                          {assetName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">
                      {violation.platform}
                    </td>
                    <td className="px-6 py-4">
                      <Badge 
                        variant={violation.similarityScore >= 90 ? "destructive" : violation.similarityScore >= 70 ? "outline" : "secondary"}
                        className={
                          violation.similarityScore >= 90 ? '' : 
                          violation.similarityScore >= 70 ? 'border-orange-500 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950' : 
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500'
                        }
                      >
                        {violation.similarityScore}%
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                      {formatDistanceToNow(new Date(violation.detectedAt), { addSuffix: true })}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={
                        violation.status === 'open' ? 'border-red-500 text-red-600 bg-red-50 dark:bg-red-950/20 dark:border-red-800 dark:text-red-400' :
                        violation.status === 'resolved' ? 'border-green-500 text-green-600 bg-green-50 dark:bg-green-950/20 dark:border-green-800 dark:text-green-400' :
                        'border-slate-300 text-slate-600 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                      }>
                        {violation.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {violation.status === 'open' && (
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" className="h-8 shadow-sm" onClick={(e) => handleResolve(violation.id, e)}>
                            Resolve
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 text-slate-500" onClick={(e) => handleIgnore(violation.id, e)}>
                            Ignore
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Violation Detail Sheet */}
      <Sheet open={!!selectedViolationId} onOpenChange={(open) => !open && setSelectedViolationId(null)}>
        <SheetContent className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-2xl font-bold dark:text-white">Violation Details</SheetTitle>
            <SheetDescription>
              Unauthorized usage of your protected asset.
            </SheetDescription>
          </SheetHeader>
          
          {selectedViolation && relatedAsset && (
            <div className="space-y-6">
              <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-4 flex items-center justify-between border border-slate-200 dark:border-slate-800">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Similarity Score</p>
                  <p className={`text-4xl font-black ${selectedViolation.similarityScore >= 90 ? 'text-red-600' : selectedViolation.similarityScore >= 70 ? 'text-orange-500' : 'text-yellow-500'}`}>
                    {selectedViolation.similarityScore}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500 mb-1">Platform</p>
                  <p className="text-lg font-bold dark:text-white">{selectedViolation.platform}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Protected Asset</h4>
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3">
                  <p className="font-medium text-slate-800 dark:text-slate-200 break-all">{relatedAsset.name}</p>
                  <p className="text-xs text-slate-500 mt-1 font-mono">ID: {relatedAsset.fingerprintHash.substring(0, 16)}...</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Infringing URL</h4>
                <a href={selectedViolation.matchedUrl} target="_blank" rel="noopener noreferrer" 
                  className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-lg hover:underline hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors break-all text-sm font-medium">
                  {selectedViolation.matchedUrl}
                  <ExternalLink size={14} className="shrink-0" />
                </a>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Detected Time</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {new Date(selectedViolation.detectedAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Location</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {selectedViolation.geoLocation.city}, {selectedViolation.geoLocation.country}
                  </p>
                </div>
              </div>

              {selectedViolation.status === 'open' && (
                <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex gap-3 mt-8">
                  <Button 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" 
                    onClick={() => {
                      handleResolve(selectedViolation.id);
                      setSelectedViolationId(null);
                    }}
                  >
                    Mark Resolved
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-slate-300 dark:border-slate-700 dark:text-slate-300"
                    onClick={() => {
                      handleIgnore(selectedViolation.id);
                      setSelectedViolationId(null);
                    }}
                  >
                    Ignore
                  </Button>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
