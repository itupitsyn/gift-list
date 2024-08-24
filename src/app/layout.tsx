import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import cn from 'classnames';
import './globals.css';
import { Background } from '@/components/Background';
import { Toaster } from '@/components/Toaster';
import Link from 'next/link';
import ChevronLeftIcon from '../assets/chevron-left.svg';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gift list',
  description: 'This is my symphony',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <body className={cn(inter.className, 'min-w-[250px] dark:bg-gray-900 dark:text-white')}>
        <div className="flex flex-col items-center pt-6">
          <div className="flex w-full max-w-screen-md justify-end">
            <Link href="/" className="flex text-fuchsia-500 backdrop-blur-sm transition-colors hover:text-fuchsia-400">
              <ChevronLeftIcon />
              На главную
            </Link>
          </div>
        </div>
        {children}
        <Background />
        <Toaster />
      </body>
    </html>
  );
}
