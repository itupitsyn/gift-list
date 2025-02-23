import Link from 'next/link';
import { FaChevronLeft } from 'react-icons/fa';
import { FC, PropsWithChildren } from 'react';

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <div className="flex flex-col items-center pt-6">
        <div className="flex w-full max-w-screen-md justify-end">
          <Link
            href="/"
            className="flex items-center gap-2 text-fuchsia-500 backdrop-blur-sm transition-colors hover:text-fuchsia-700"
          >
            <FaChevronLeft className="h-3 w-3" />
            На главную
          </Link>
        </div>
      </div>
      <main>{children}</main>
    </>
  );
};

export default Layout;
