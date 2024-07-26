import { revalidatePath } from 'next/cache';
import { createEvent } from '../../../prisma/model/event';
import { redirect, RedirectType } from 'next/navigation';

export default async function Page() {
  const event = await createEvent();
  revalidatePath('/event');
  redirect(`/event/${event.privateId}`, RedirectType.replace);
}
