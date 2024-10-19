import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Logo from '../../public/svgs/logo.svg';
import Profile from '../../public/svgs/profile.svg';

const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

export const metadata: Metadata = {
  title: 'CAM',
  description: 'This is online meeting platform, CAM',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kr" className={`${pretendard.variable}`}>
      <body className={`${pretendard.variable} h-screen flex flex-col`}>
        <div className="h-24 px-8 flex flex-row justify-between items-center">
          <div className="flex">
            <Logo />
            <h1 className="mx-2 text-3xl font-semibold text-primary">C.A.M</h1>
          </div>
          <button>
            <Profile />
          </button>
        </div>
        <div className="flex h-full w-full">{children}</div>
      </body>
    </html>
  );
}
