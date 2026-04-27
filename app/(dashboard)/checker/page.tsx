'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ShieldAlert, ShieldCheck, Loader2, Link2, Activity, Info } from 'lucide-react';
import { format } from 'date-fns';

export default function CheckerPage() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async () => {
    if (!url) return;
    
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch('http://localhost:8080/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      if (!res.ok) {
        throw new Error('Failed to verify content');
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred during verification.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">URL Inspector</h1>
        <p className="text-muted-foreground text-lg">
          Analyze any suspicious media URL instantly. Our AI perceptual fingerprinting will cross-reference it against your protected asset library.
        </p>
      </div>

      <div className="bg-card text-card-foreground border border-border rounded-xl p-6 md:p-8 shadow-sm mb-8 relative overflow-hidden">
        {/* Decorative element using primary color */}
        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
        
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Search className="text-primary" /> Scan Content
        </h2>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input 
              placeholder="Paste Instagram, Twitter, or local URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="pl-10 h-12 bg-background border-border text-foreground text-md"
              onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
            />
          </div>
          <Button 
            onClick={handleCheck} 
            disabled={!url || isLoading}
            className="h-12 px-8 text-md font-medium shadow-sm transition-all bg-primary text-primary-foreground hover:opacity-90"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing
              </>
            ) : (
              'Verify Content'
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-6 py-4 rounded-xl flex items-center gap-3">
          <Info size={20} />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {result && !isLoading && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {result.status === 'violation_detected' ? (
            <div className="bg-card border border-destructive rounded-xl overflow-hidden shadow-lg">
              <div className="bg-destructive px-6 py-4 flex items-center justify-between text-background">
                <div className="flex items-center gap-3">
                  <ShieldAlert size={28} />
                  <h2 className="text-xl font-bold">Violation Detected</h2>
                </div>
                <div className="bg-background text-destructive font-bold px-3 py-1 rounded-full text-sm">
                  {result.violation?.similarityScore}% Match
                </div>
              </div>
              
              <div className="p-6 md:p-8 space-y-6">
                <p className="text-foreground text-lg">
                  This content is highly similar to a protected asset in your library.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg border border-border">
                      <div className="text-sm text-muted-foreground uppercase font-semibold mb-1">Detected URL</div>
                      <div className="font-mono text-sm break-all text-foreground">
                        {result.violation?.matchedUrl}
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-1 bg-muted p-4 rounded-lg border border-border">
                        <div className="text-sm text-muted-foreground uppercase font-semibold mb-1">Platform</div>
                        <div className="text-foreground font-medium flex items-center gap-2">
                          <Activity size={16} className="text-primary" />
                          {result.violation?.platform}
                        </div>
                      </div>
                      <div className="flex-1 bg-muted p-4 rounded-lg border border-border">
                        <div className="text-sm text-muted-foreground uppercase font-semibold mb-1">Status</div>
                        <div className="text-destructive font-medium uppercase tracking-wide">
                          {result.violation?.status}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-accent text-accent-foreground p-4 rounded-lg border border-border">
                      <div className="text-sm opacity-80 uppercase font-semibold mb-1">Matched Asset ID</div>
                      <div className="font-mono font-bold">
                        {result.violation?.assetId}
                      </div>
                    </div>
                    
                    <div className="bg-background p-4 rounded-lg border border-border">
                      <div className="text-sm text-muted-foreground uppercase font-semibold mb-1">Detection Time</div>
                      <div className="text-foreground font-medium">
                        {result.violation?.detectedAt ? format(new Date(result.violation.detectedAt), 'PPpp') : 'Just now'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card border-2 border-primary/20 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-secondary px-6 py-4 flex items-center gap-3 border-b border-border">
                <ShieldCheck size={28} className="text-primary" />
                <h2 className="text-xl font-bold text-foreground">Content Clean</h2>
              </div>
              <div className="p-6 md:p-8">
                <p className="text-foreground text-lg mb-2">
                  No matching protected content found.
                </p>
                <p className="text-muted-foreground">
                  The perceptual fingerprint of this media did not match any assets in your protected library.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
