import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import cn from 'classnames';
import './globals.css';

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
      <body className={cn(inter.className, 'dark:bg-gray-900 dark:text-white')}>{children}</body>
    </html>
  );
}
