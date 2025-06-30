import { FC } from 'react';
import type * as PrismaTypes from '@prisma/client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { ImgSlide } from '../ImgSlide';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface ImageSwiperProps {
  images: PrismaTypes.Image[];
}

export const ImageSwiper: FC<ImageSwiperProps> = ({ images }) => {
  return (
    <div className="w-full">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={5}
        slidesPerView={1}
        pagination={{ clickable: true }}
        centeredSlides
        height={300}
        className="flex"
      >
        {images.map((img) => (
          <SwiperSlide key={img.id} className="!h-auto self-stretch">
            <ImgSlide image={img} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
