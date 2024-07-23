import type * as PrismaTypes from '@prisma/client';
import axios from 'axios';

export const bookGift = async (eventId: string, giftId: number, booked: boolean) => {
  const response = await axios.patch<PrismaTypes.Gift>(`/api/event/${eventId}/gift/${giftId}`, { booked });
  return response.data;
};
