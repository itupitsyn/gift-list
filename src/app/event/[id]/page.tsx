import { EventForm } from '@/components/EventForm';
import { getEvent } from '../../../../prisma/model/event';
import { notFound } from 'next/navigation';
import { EventView } from '@/components/EventView';
import { Metadata } from 'next';

interface PageParams {
  params: Promise<{ id: string }>;
}

export const generateMetadata = async ({ params }: PageParams): Promise<Metadata> => {
  const { id } = await params;
  const event = await getEvent(id);
  return {
    title: event.event?.name || 'My gift list',
    description: event.event?.description,
  };
};

export default async function Page({ params }: PageParams) {
  try {
    const { id } = await params;
    const event = await getEvent(id);

    if (!event.event) {
      notFound();
    }
    const fullUrl = process.env.APP_HOST;
    const publicLink = [fullUrl, 'event', event.event.publicId].join('/');
    const privateLink = [fullUrl, 'event', event.event.privateId].join('/');

    return (
      <main className="flex justify-center pt-4">
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
