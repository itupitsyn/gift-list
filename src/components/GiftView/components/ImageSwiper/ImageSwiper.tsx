import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import type * as PrismaTypes from '@prisma/client';
import { CSSProperties, FC, useMemo } from 'react';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { ImgSlide } from '../ImgSlide';

interface ImageSwiperProps {
  images: PrismaTypes.Image[];
}

export const ImageSwiper: FC<ImageSwiperProps> = ({ images }) => {
  const imgList: PrismaTypes.Image[] = useMemo(() => {
    if (images.length) {
      return images;
    }
    return [
      {
        id: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        fileName: '',
        eventId: null,
        giftId: null,
      },
    ];
  }, [images]);

  return (
    <div className="w-full">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={5}
        slidesPerView={1}
        style={
          {
            '--swiper-pagination-color': 'var(--color-fuchsia-700)',
          } as CSSProperties
        }
        pagination={{ clickable: true }}
        centeredSlides
        className="flex"
      >
        {imgList.map((img) => (
          <SwiperSlide key={img.id} className="!h-auto self-stretch">
            <ImgSlide image={img} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
