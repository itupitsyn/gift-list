import Link from 'next/link';
import ChevronLeftIcon from '../../assets/chevron-left.svg';
import { FC, PropsWithChildren } from 'react';

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <div className="flex flex-col items-center pt-6">
        <div className="flex w-full max-w-screen-md justify-end">
          <Link href="/" className="flex text-fuchsia-500 backdrop-blur-sm transition-colors hover:text-fuchsia-700">
            <ChevronLeftIcon />
            На главную
          </Link>
        </div>
      </div>
      <main>{children}</main>
    </>
  );
};

export default Layout;
