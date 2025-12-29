import '../styles/globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Background } from '@/components/Background';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gift list',
  description: 'Share your gift lists with friends',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <body className={cn(inter.className, 'min-w-75 dark:text-white')}>
        {children}
        <Background />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
