'use client';
import { useEffect } from 'react';
import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

export function useAuth() {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const user = session?.user || null;
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    const isAuth = !!user;
    
    if (!isAuth && pathname !== '/login') {
      router.push('/login');
    } else if (isAuth && pathname === '/login') {
      router.push('/dashboard');
    }
  }, [user, loading, pathname, router]);

  const signOut = () => {
    nextAuthSignOut({ callbackUrl: '/login' });
  };

  const signIn = async (provider?: string) => {
    await nextAuthSignIn(provider || "google", { callbackUrl: '/dashboard' });
  };

  return { user, loading, signOut, signIn };
}
