'use client';

import { useRouter, usePathname } from 'next/navigation';
import Logo from '../../public/svgs/logo.svg';
import Profile from '../../public/svgs/profile.svg';
import Button from './Button';
import { useHotkeys } from 'react-hotkeys-hook';
import { useEffect, useState } from 'react';

export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();

  const [isShortcut, setIsShortcut] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem('shortcut') === 'true') {
      setIsShortcut(true);
    }
  }, []);

  // 로그아웃
  const handleSignOut = () => {
    window.localStorage.removeItem('user_id');
    window.localStorage.removeItem('user_name');
    router.replace('/signIn');
  };

  // 로그아웃 단축키: x
  useHotkeys('x', handleSignOut, {
    enabled: isShortcut,
  });

  return (
    <div
      className={`flex h-24 flex-row items-center justify-between px-8 ${
        pathname.includes('/meeting') ? 'bg-black' : 'bg-[#ffffff]'
      } `}
    >
      <div
        onClick={() => router.push('/home')}
        className="flex cursor-pointer items-center"
      >
        <Logo width={30} height={30} />
        <h1 className="mx-2 text-3xl font-semibold text-primary">C.A.M</h1>
      </div>
      {pathname.includes('/meeting') ? (
        ''
      ) : (
        <Button
          onClick={handleSignOut}
          className="!h-fit !border !border-primary !bg-[#ffffff] p-2 !text-primary hover:!bg-white-hover-2"
        >
          로그아웃
        </Button>
      )}

      {/* <button>{pathname.includes('/meeting') ? '' : <Profile />}</button> */}
    </div>
  );
}
