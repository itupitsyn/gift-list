import axios from 'axios';
import type * as PrismaTypes from '@prisma/client';
import { ImageUploaderElement } from '@/components/ImageUploader';

export type FullEvent = PrismaTypes.Event & {
  gifts: (PrismaTypes.Gift & { images: PrismaTypes.Image[] })[];
};

export interface UpdateEventRequest {
  name: string;
  description: string;
  date?: string | null;
  gifts: {
    id?: number;
    name: string;
    link: string;
    price: number;
    images?: ImageUploaderElement[] | null;
    booked: boolean;
  }[];
}

export const updateEvent = async (id: string, params: UpdateEventRequest) => {
  const paramsFormData = new FormData();
  paramsFormData.append('name', params.name);
  paramsFormData.append('description', params.description ?? '');
  if (params.date) {
    paramsFormData.append('date', params.date);
  }

  params.gifts.forEach((item, idx) => {
    Object.entries(item).forEach(async ([k, v]) => {
      if (k !== 'images' && v) {
        paramsFormData.append(`gifts[${idx}].${k}`, String(v));
      } else if (k === 'images' && Array.isArray(v)) {
        v.forEach((item, fileIdx) => {
          paramsFormData.append(`gifts[${idx}].${k}[${fileIdx}]`, item.file || String(item.id));
        });
      }
    });
  });

  const response = await axios.patch<FullEvent>(`/api/event/${id}`, paramsFormData);
  return response.data;
};
