import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Upload, Archive, Globe, LogOut, Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/upload', label: 'Upload Media', icon: Upload },
  { href: '/library', label: 'Asset Library', icon: Archive },
  { href: '/map', label: 'Spread Map', icon: Globe },
  { href: '/checker', label: 'URL Checker', icon: Search },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <div className={cn('flex flex-col h-full bg-sidebar text-sidebar-foreground w-60 border-r border-sidebar-border', className)}>
      <div className="p-6 flex items-center gap-3">
        <span className="text-xl font-bold text-sidebar-foreground tracking-tight">SportShield</span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border mt-auto">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
              {user?.name?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full justify-start text-sidebar-foreground border-sidebar-border bg-transparent hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={signOut}
        >
          <LogOut size={16} className="mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
