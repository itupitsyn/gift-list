import { notFound, redirect, RedirectType } from 'next/navigation';

import { createEvent } from '../../../prisma/model/event';

export default async function Page() {
  let id = '';
  try {
    const event = await createEvent();
    id = event.privateId;
  } catch (e) {
    console.error(e);
    notFound();
  } finally {
    if (id) {
      redirect(`/event/${id}`, RedirectType.replace);
    }
    notFound();
  }
}

export const dynamic = 'force-dynamic';
