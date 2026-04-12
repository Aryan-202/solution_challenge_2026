import { usePathname } from 'next/navigation';
import { Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const { user } = useAuth();
  
  const getPageTitle = () => {
    if (pathname.includes('/dashboard')) return 'Violations Dashboard';
    if (pathname.includes('/upload')) return 'Upload Media';
    if (pathname.includes('/library')) return 'Asset Library';
    if (pathname.includes('/map')) return 'Content Spread Map';
    return 'Dashboard';
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-8 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          onClick={onMenuClick}
        >
          <Menu size={20} />
        </Button>
        <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
          {getPageTitle()}
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
        <Avatar className="h-8 w-8 cursor-pointer border border-slate-200 dark:border-slate-700">
          <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 text-xs">
            {user?.displayName?.[0] || 'U'}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
