import { EventForm } from '@/components/EventForm';
import { getEvent } from '../../../../prisma/model/event';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { EventView } from '@/components/EventView';

interface PageParams {
  params: { id: string };
}

export default async function Page({ params: { id } }: PageParams) {
  const event = await getEvent(id);

  if (!event.event) {
    notFound();
  }

  const headersList = headers();
  const fullUrl = headersList.get('x-current-origin') || '';

  const publicLink = [fullUrl, 'event', event.event.publicId].join('/');
  const privateLink = [fullUrl, 'event', event.event.privateId].join('/');

  return (
    <main className="flex justify-center px-2 py-24">
      {event.isPrivate ? (
        <EventForm event={event.event} publicLink={publicLink} privateLink={privateLink} />
      ) : (
        <EventView event={event.event} />
      )}
    </main>
  );
}
