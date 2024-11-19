import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { TopBar } from './top-bar';
import { VideoProvider } from './contexts/VideoContext';
import 'regenerator-runtime/runtime';

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
      <body className={`${pretendard.variable} flex h-screen flex-col`}>
        <TopBar />
        <VideoProvider>
          <div className="flex h-full w-full">{children}</div>
        </VideoProvider>
      </body>
    </html>
  );
}
