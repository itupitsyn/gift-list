import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { FC, PropsWithChildren } from 'react';

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <div className="mx-auto flex w-full max-w-screen-md justify-end pt-6">
        <Link href="/" className="flex items-center gap-2 backdrop-blur-sm transition-colors hover:text-fuchsia-500">
          <ChevronLeft className="size-4" />
          На главную
        </Link>
      </div>

      <main>{children}</main>
    </>
  );
};

export default Layout;
