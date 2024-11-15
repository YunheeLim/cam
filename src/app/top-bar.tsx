'use client';

import { usePathname } from 'next/navigation';
import Logo from '../../public/svgs/logo.svg';
import Profile from '../../public/svgs/profile.svg';

export function TopBar() {
  const pathname = usePathname();

  return (
    <div
      className={`h-24 px-8 flex flex-row justify-between items-center ${
        pathname.includes('/meeting') ? 'bg-black' : 'bg-white'
      } `}
    >
      <div className="flex">
        <Logo width={30} height={30} />
        <h1 className="mx-2 text-3xl font-semibold text-primary">C.A.M</h1>
      </div>
      <button>{pathname.includes('/meeting') ? '' : <Profile />}</button>
    </div>
  );
}
