'use client';

import Home from '@/containers/home/Home';
import OnBoarding from '@/containers/onBoarding/OnBoarding';
import SignIn from '@/containers/signIn/SignIn';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RootPage() {
  return <OnBoarding />;
}
