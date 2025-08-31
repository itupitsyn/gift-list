'use client';

import type * as PrismaTypes from '@prisma/client';
import { Ghost } from 'lucide-react';
import Image from 'next/image';
import { FC, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { getImageUrl } from '@/lib/utils';

interface ImgSlideProps {
  image: PrismaTypes.Image;
}

export const ImgSlide: FC<ImgSlideProps> = ({ image }) => {
  const [img, setImg] = useState<string>(getImageUrl(image.fileName) || '');
  const [isFS, setIsFS] = useState(false);

  useEffect(() => {
    setImg(getImageUrl(image.fileName) || '');
  }, [image.fileName]);

  return (
    <>
      <div className="relative h-60">
        {img ? (
          <Image
            src={img}
            alt=""
            priority
            width={580}
            height={580}
            onError={() => {
              setImg('');
            }}
            className="size-full cursor-zoom-in object-cover"
            onClick={() => {
              setIsFS(true);
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-white">
            <Ghost className="size-6 object-contain text-black" />
          </div>
        )}
      </div>

      {isFS &&
        createPortal(
          <div
            className="fixed top-0 right-0 bottom-0 left-0 z-50 flex w-full cursor-zoom-out items-center backdrop-blur-sm backdrop-brightness-50"
            onClick={() => {
              setIsFS(false);
            }}
          >
            <Image src={img} unoptimized alt="" fill className="h-full w-full object-contain" />
          </div>,
          document.body,
        )}
    </>
  );
};
