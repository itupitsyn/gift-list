import { EventForm } from '@/components/EventForm';
import { getEvent } from '../../../../prisma/model/event';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { getGifts } from '../../../../prisma/model/gift';

interface PageParams {
  params: { id: string };
}

export default async function Page({ params: { id } }: PageParams) {
  const event = await getEvent(id);

  if (!event.event) {
    notFound();
  }

  const gifts = await getGifts(event.event.id);

  const headersList = headers();
  const fullUrl = headersList.get('referer') || '';

  const parts = fullUrl.split('/');
  parts.pop();

  const publicLink = [...parts, event.event.publicId].join('/');
  const privateLink = [...parts, event.event.privateId].join('/');

  return (
    <main className="flex justify-center px-2 py-24">
      {event.isPrivate ? (
        <EventForm event={event.event} publicLink={publicLink} privateLink={privateLink} gifts={gifts} />
      ) : (
        <></>
      )}
    </main>
  );
}
