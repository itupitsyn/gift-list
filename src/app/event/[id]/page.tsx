import { EventForm } from '@/components/EventForm';
import { getEvent } from '../../../../prisma/model/event';
import { notFound } from 'next/navigation';
import { EventView } from '@/components/EventView';

interface PageParams {
  params: { id: string };
}

export default async function Page({ params: { id } }: PageParams) {
  try {
    const event = await getEvent(id);

    if (!event.event) {
      notFound();
    }
    const fullUrl = process.env.APP_HOST;
    const publicLink = [fullUrl, 'event', event.event.publicId].join('/');
    const privateLink = [fullUrl, 'event', event.event.privateId].join('/');

    return (
      <main className="flex justify-center px-2 pb-24 pt-4">
        {event.isPrivate ? (
          <EventForm event={event.event} publicLink={publicLink} privateLink={privateLink} />
        ) : (
          <EventView event={event.event} />
        )}
      </main>
    );
  } catch {
    notFound();
  }
}
