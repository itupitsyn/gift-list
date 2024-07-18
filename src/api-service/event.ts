import axios from 'axios';
import type * as PrismaTypes from '@prisma/client';

export interface UpdateEventRequest {
  name: string;
  description: string;
  gifts: {
    id?: number;
    name: string;
    link: string;
    price: number;
    image?: string;
    booked: boolean;
  }[];
}

export const updateEvent = async (id: string, params: UpdateEventRequest) => {
  const paramsFormData = new FormData();
  paramsFormData.append('name', params.name);
  paramsFormData.append('description', params.description ?? '');

  params.gifts.forEach((item, idx) => {
    Object.entries(item).forEach(async ([k, v]) => {
      if (k !== 'image') {
        if (v) {
          paramsFormData.append(`gifts[${idx}].${k}`, String(v));
        }
      } else {
        const data = await fetch(String(v)).then((r) => r.blob());
        paramsFormData.append(`gifts[${idx}].${k}`, data);
      }
    });
  });

  const result = await axios.patch<PrismaTypes.Event>(`/api/event/${id}`, paramsFormData);
  return result.data;
};
