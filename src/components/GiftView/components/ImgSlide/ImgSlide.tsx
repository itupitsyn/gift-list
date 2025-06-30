'use client';
import { getImageUrl } from '@/lib/utils';
import type * as PrismaTypes from '@prisma/client';
import { Ghost } from 'lucide-react';

import Image from 'next/image';
import { FC, useEffect, useState } from 'react';

interface ImgSlideProps {
  image: PrismaTypes.Image;
}

export const ImgSlide: FC<ImgSlideProps> = ({ image }) => {
  const [img, setImg] = useState<string>(getImageUrl(image.fileName) || '');

  useEffect(() => {
    setImg(getImageUrl(image.fileName) || '');
  }, [image.fileName]);

  return (
    <div className="relative h-full max-h-[360px] sm:max-h-[480px]">
      {img ? (
        <Image
          src={img}
          alt=""
          width={640}
          height={640}
          onError={() => {
            setImg('');
          }}
          className="size-full object-contain"
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-white">
          <Ghost className="size-6 object-contain text-black" />
        </div>
      )}
    </div>
  );
};
