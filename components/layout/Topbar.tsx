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
    if (pathname.includes('/checker')) return 'URL Checker';
    return 'Dashboard';
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-8 bg-background border-b border-border shrink-0">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden text-muted-foreground hover:text-foreground"
          onClick={onMenuClick}
        >
          <Menu size={20} />
        </Button>
        <h1 className="text-lg font-semibold text-foreground">
          {getPageTitle()}
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full"></span>
        </Button>
        <Avatar className="h-8 w-8 cursor-pointer border border-border">
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
            {user?.name?.[0] || 'U'}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
