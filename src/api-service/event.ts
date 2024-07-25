import axios from 'axios';
import type * as PrismaTypes from '@prisma/client';

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
    image?: File | null;
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
      if (k !== 'image' && v) {
        paramsFormData.append(`gifts[${idx}].${k}`, String(v));
      } else if (v && v instanceof File) {
        paramsFormData.append(`gifts[${idx}].${k}`, v);
      }
    });
  });

  const response = await axios.patch<FullEvent>(`/api/event/${id}`, paramsFormData);
  return response.data;
};
