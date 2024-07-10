import { createEvent } from '../../../prisma/model/event';
import { redirect } from 'next/navigation';

export default async function Page() {
  const event = await createEvent();
  redirect(`/event/${event.privateId}`);
}
