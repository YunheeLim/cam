'use client';

import Home from '@/containers/home/Home';
import OnBoarding from '@/containers/onBoarding/OnBoarding';
import SignIn from '@/containers/signIn/SignIn';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    if (window.localStorage.getItem('user_id')) {
      router.push('/home');
    } else {
      router.push('/signIn');
    }
  }, [router]);

  return <SignIn />;
}
