'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { useAuth } from '@/hooks/useAuth';
import { Sheet, SheetContent } from '@/components/ui/sheet';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Loading...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden md:flex" />

      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 border-r-0 max-w-60 bg-sidebar">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-background border-l border-border">
          <div className="p-4 md:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
