'use client';

import Logo from '../../../public/svgs/logo.svg';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const OnBoarding = () => {
  const router = useRouter();

  useEffect(() => {
    // 1.5초 뒤 페이지 이동
    const timer = setTimeout(() => {
      if (window.localStorage.getItem('user_id')) {
        router.push('/home');
      } else {
        router.push('/signIn');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 bg-primary-1">
      <div className="animate-rotate">
        <Logo width="80" height="80" className="mb-4 text-primary" />
      </div>
      <div className="animate-fade-in-up text-7xl font-bold text-primary delay-100">
        C A M
      </div>
      <div className="animate-fade-in-up mt-6 text-3xl font-medium text-primary delay-200">
        Can Anyone Meet?
      </div>
    </div>
  );
};

export default OnBoarding;
