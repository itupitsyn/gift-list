import { revalidatePath } from 'next/cache';
import { createEvent } from '../../../prisma/model/event';
import { notFound, redirect, RedirectType } from 'next/navigation';

export default async function Page() {
  let id = '';
  try {
    const event = await createEvent();
    revalidatePath('/event');
    id = event.privateId;
  } catch (e) {
    notFound();
  } finally {
    if (id) {
      redirect(`/event/${id}`, RedirectType.replace);
    }
    notFound();
  }
}
