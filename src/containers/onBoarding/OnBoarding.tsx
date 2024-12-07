'use client';

import Logo from '../../../public/svgs/logo.svg';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const OnBoarding = () => {
  const router = useRouter();

  useEffect(() => {
    // 1.5초 뒤 페이지 이동
    const timer = setTimeout(() => {
      router.push('/home'); // 이동할 페이지 경로
    }, 1500);

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
      <div className="animate-fade-in-up mt-6 text-3xl font-medium text-primary-2 delay-200">
        Can Anyone Meet?
      </div>
      {/* <button className="mt-10 rounded-lg bg-primary px-6 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:bg-primary-hover">
        시작하기
      </button> */}
    </div>
  );
};

export default OnBoarding;
