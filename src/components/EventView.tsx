'use client';

import type * as PrismaTypes from '@prisma/client';
import { FC } from 'react';
import { GiftView } from './GiftView';
import { Tooltip } from 'flowbite-react';

interface EventViewProps {
  event: PrismaTypes.Event & {
    gift: PrismaTypes.Gift[];
  };
}

export const EventView: FC<EventViewProps> = ({ event }) => {
  return (
    <div className="flex w-full max-w-screen-md flex-col gap-12">
      <div className="flex items-center justify-between gap-6">
        <Tooltip content={event.name}>
          <div className="truncate text-4xl font-bold">{event.name}</div>
        </Tooltip>
        <div className="text-2xl opacity-75">
          {event.date?.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </div>
      </div>
      <div className="overflow-hidden text-ellipsis text-xl">{event.description}</div>
      <div className="flex flex-col gap-6">
        {event.gift.map((item) => (
          <GiftView key={item.id} gift={item} eventPublicId={event.publicId} />
        ))}
      </div>
    </div>
  );
};
