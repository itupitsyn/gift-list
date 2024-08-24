'use client';

import { FC } from 'react';
import { GiftView } from './GiftView';
import { Tooltip } from 'flowbite-react';
import { FullEvent } from '@/api-service/event';

interface EventViewProps {
  event: FullEvent;
}

export const EventView: FC<EventViewProps> = ({ event }) => {
  return (
    <div className="flex w-full max-w-screen-md flex-col gap-12 overflow-hidden">
      <div className="flex max-w-full flex-wrap items-start justify-between gap-6 backdrop-blur-sm">
        <div className="overflow-hidden text-ellipsis text-4xl font-bold [&>div]:!w-auto [&>div]:overflow-hidden [&>div]:text-ellipsis">
          <Tooltip content={event.name}>{event.name}</Tooltip>
        </div>
        <div className="whitespace-nowrap text-2xl opacity-75">
          {event.date?.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </div>
      </div>
      <div className="overflow-hidden text-ellipsis text-xl backdrop-blur-sm">{event.description}</div>
      <div className="flex flex-col gap-6">
        {event.gifts.map((item) => (
          <GiftView key={item.id} gift={item} eventPublicId={event.publicId} />
        ))}
      </div>
    </div>
  );
};
