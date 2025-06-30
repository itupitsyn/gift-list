import { LoaderCircle } from 'lucide-react';
import { FC } from 'react';

export const Loader: FC = () => {
  return (
    <div className="absolute top-0 right-0 bottom-0 left-0 z-[1] flex items-center justify-center bg-white opacity-85">
      <LoaderCircle className="size-8 animate-spin" />
    </div>
  );
};
