import axios from 'axios';

import { FullEvent } from './event';

type ArrayItem<T> = T extends Array<infer E> ? E : never;

export type FullGift = ArrayItem<FullEvent['gifts']>;

export const bookGift = async (eventId: string, giftId: number, booked: boolean) => {
  const response = await axios.patch<FullGift>(`/api/event/${eventId}/gift/${giftId}`, { booked });
  return response.data;
};
