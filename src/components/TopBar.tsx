'use client';

import { useRouter, usePathname } from 'next/navigation';
import Logo from '../../public/svgs/logo.svg';
import Profile from '../../public/svgs/profile.svg';
import Button from './Button';
import { useHotkeys } from 'react-hotkeys-hook';

export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();

  // 로그아웃
  const handleSignOut = () => {
    window.localStorage.removeItem('user_id');
    window.localStorage.removeItem('user_name');
    router.replace('/signIn');
  };

  // 로그아웃 단축키: x
  useHotkeys('x', handleSignOut, {
    enabled: window.localStorage.getItem('shortcut') === 'true',
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
          className="hover:!bg-white-hover-2 !h-fit !border !border-primary !bg-[#ffffff] p-2 !text-primary"
        >
          로그아웃
        </Button>
      )}

      {/* <button>{pathname.includes('/meeting') ? '' : <Profile />}</button> */}
    </div>
  );
}
