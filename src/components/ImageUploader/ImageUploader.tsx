'use client';

import { FC } from 'react';
import { useDropzone } from 'react-dropzone';
import { Loader } from '../Loader';
import Image from 'next/image';
import { Ghost, X } from 'lucide-react';
import { IMG_FORMATS } from '@/lib/constants/images';

export type ImageUploaderElement = { id: number; src: string; file?: File; uploaded: boolean };

interface ImageUploaderProps {
  images: ImageUploaderElement[];
  isLoading?: boolean;
  onDrop: (data: File[]) => void;
  onDelete: (img: ImageUploaderElement) => void;
  onBlur?: () => void;
}

export const ImageUploader: FC<ImageUploaderProps> = ({ images, isLoading, onDrop, onDelete, onBlur }) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: Object.fromEntries(IMG_FORMATS.map((item) => [item, []])),
  });

  return (
    <>
      <div className="relative flex flex-wrap gap-4" onBlur={onBlur}>
        {isLoading && <Loader />}

        {images.map((item) => (
          <div key={item.id} className="relative border border-dashed">
            {item.src ? (
              <Image src={item.src} alt="" unoptimized width={192} height={192} className="size-24 object-contain" />
            ) : (
              <div className="flex size-24 items-center justify-center">
                {!isLoading && <Ghost className="size-6 object-contain" />}
              </div>
            )}

            <button
              type="button"
              disabled={isLoading}
              className="absolute top-1 right-1 cursor-pointer transition-colors hover:text-red-600 disabled:cursor-default"
              onClick={() => onDelete(item)}
            >
              <X className="size-3" />
            </button>
          </div>
        ))}
      </div>

      <div
        {...getRootProps()}
        className="hover:border-brown-2 hover:text-brown-2 flex items-center justify-center rounded-b-sm border border-dashed p-6 transition-colors"
      >
        <input {...getInputProps()} disabled={isLoading} />
        <p className="text-sm">Переместите сюда файлы, или кликните, чтобы выбрать файлы с диска</p>
      </div>
    </>
  );
};
