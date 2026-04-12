import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Upload, Archive, Globe, Shield, LogOut, Menu } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/upload', label: 'Upload Media', icon: Upload },
  { href: '/library', label: 'Asset Library', icon: Archive },
  { href: '/map', label: 'Spread Map', icon: Globe },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <div className={cn('flex flex-col h-full bg-slate-950 text-slate-300 w-60 border-r border-slate-800', className)}>
      <div className="p-6 flex items-center gap-3">
        <Shield size={32} className="text-blue-600" />
        <span className="text-xl font-bold text-white tracking-tight">SportShield</span>
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
                  ? 'bg-blue-600 text-white font-medium border-l-4 border-blue-400'
                  : 'hover:bg-slate-900 hover:text-white border-l-4 border-transparent'
              )}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 mt-auto">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-blue-900 text-blue-200">
              {user?.name?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full justify-start text-slate-300 border-slate-800 bg-transparent hover:bg-slate-900 hover:text-white"
          onClick={signOut}
        >
          <LogOut size={16} className="mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
