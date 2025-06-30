'use client';

import { FC } from 'react';
import { GiftView } from './GiftView';
import { FullEvent } from '@/api-service/event';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface EventViewProps {
  event: FullEvent;
}

export const EventView: FC<EventViewProps> = ({ event }) => {
  return (
    <div className="flex w-full max-w-screen-md flex-col gap-12 overflow-hidden px-2">
      <div className="flex max-w-full flex-wrap items-start justify-between gap-6 backdrop-blur-sm">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="overflow-hidden text-4xl font-bold text-ellipsis">{event.name}</div>
          </TooltipTrigger>
          <TooltipContent>{event.name}</TooltipContent>
        </Tooltip>
        <div className="text-2xl whitespace-nowrap opacity-75">
          {event.date?.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </div>
      </div>
      <div className="overflow-hidden text-xl text-ellipsis backdrop-blur-sm">{event.description}</div>
      <div className="flex flex-col gap-6">
        {event.gifts.map((item) => (
          <GiftView key={item.id} gift={item} eventPublicId={event.publicId} />
        ))}
      </div>
    </div>
  );
};
