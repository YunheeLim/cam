'use client';

import { useRouter, usePathname } from 'next/navigation';
import Logo from '../../public/svgs/logo.svg';
import Profile from '../../public/svgs/profile.svg';

export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      className={`flex h-24 flex-row items-center justify-between px-8 ${
        pathname.includes('/meeting') ? 'bg-black' : 'bg-[#ffffff]'
      } `}
    >
      <div
        onClick={() => router.push('/')}
        className="flex cursor-pointer items-center"
      >
        <Logo width={30} height={30} />
        <h1 className="mx-2 text-3xl font-semibold text-primary">C.A.M</h1>
      </div>
      <button>{pathname.includes('/meeting') ? '' : <Profile />}</button>
    </div>
  );
}
