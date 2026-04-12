'use client';
import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useRouter, usePathname } from 'next/navigation';

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Mocking auth sequence since we disable backend/firebase
    const checkAuth = () => {
      const isAuth = !!user;
      setLoading(false);
      
      if (!isAuth && pathname !== '/login') {
        router.push('/login');
      } else if (isAuth && pathname === '/login') {
        router.push('/dashboard');
      }
    };
    
    // Slight delay to mock loading
    const timer = setTimeout(checkAuth, 500);
    return () => clearTimeout(timer);
  }, [user, pathname, router]);

  const signOut = () => {
    setUser(null);
    router.push('/login');
  };

  const signIn = () => {
    setUser({ uid: 'mock_org', displayName: 'Demo User', email: 'user@sportshield.demo' });
    router.push('/dashboard');
  };

  return { user, loading, signOut, signIn };
}
