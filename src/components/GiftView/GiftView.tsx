'use client';

import { FC, KeyboardEvent, RefObject, useCallback, useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';

import { bookGift, FullGift } from '@/api-service/gift';
import { cn } from '@/lib/utils';

import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { ImageSwiper } from './components';

interface GiftViewProps {
  eventPublicId: string;
  gift: FullGift;
}

export const GiftView: FC<GiftViewProps> = ({ gift, eventPublicId }) => {
  const [unexpectedError, setUnexpectedError] = useState('');
  const [giftState, setGiftState] = useState(gift);
  const [changedNow, setChangedNow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [clickClack, setClickClack] = useState(false);

  const ref = useRef<HTMLButtonElement>(null);

  const clickOutsideHandler = useCallback(() => setClickClack(false), []);
  useOnClickOutside(ref as RefObject<HTMLButtonElement>, clickOutsideHandler);

  const onBookClick = useCallback(
    async (booked: boolean) => {
      if (!clickClack) {
        setClickClack(true);
        return;
      }

      try {
        setIsLoading(true);
        setUnexpectedError('');
        const updatedGift = await bookGift(eventPublicId, gift.id, booked);
        setGiftState(updatedGift);
        setChangedNow(true);
      } catch {
        setUnexpectedError('Неизвестная ошибка');
      } finally {
        setIsLoading(false);
        setClickClack(false);
      }
    },
    [clickClack, eventPublicId, gift.id],
  );

  return (
    <Card className="px-6">
      <div className="flex flex-col items-stretch gap-6 overflow-hidden sm:flex-row sm:justify-between">
        <div className={cn('w-full max-w-96 flex-none', giftState.booked && 'grayscale')}>
          <ImageSwiper images={gift.images} />
        </div>

        <div className="flex grow flex-col justify-between gap-6 overflow-hidden">
          <div className="flex flex-col items-end gap-4 overflow-hidden">
            <div className="max-w-full overflow-hidden">
              {giftState.link ? (
                <a
                  href={giftState.link}
                  className="block overflow-hidden text-xl text-ellipsis underline underline-offset-4 transition-colors hover:text-purple-600"
                  target="_blank"
                  rel="noreferrer"
                >
                  {giftState.name}
                </a>
              ) : (
                <div className="overflow-hidden text-xl text-ellipsis">{giftState.name}</div>
              )}
            </div>

            {giftState.price && (
              <div>
                {giftState.price.toLocaleString('ru')}
                {'\u00A0'}₽
              </div>
            )}

            {giftState.booked && <Badge variant="outline">Забронировано</Badge>}
          </div>

          {(!giftState.booked || changedNow) && (
            <div className="flex flex-col items-end gap-2 p-1">
              <Tooltip open={clickClack}>
                <TooltipTrigger asChild>
                  <Button
                    ref={ref}
                    type="button"
                    onClick={() => onBookClick(!giftState.booked)}
                    disabled={isLoading}
                    variant={clickClack ? 'default' : 'secondary'}
                    onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => {
                      if (e.key === 'Escape') {
                        setClickClack(false);
                      }
                    }}
                  >
                    {giftState.booked ? 'Снять бронь' : 'Забронировать'}
                  </Button>
                </TooltipTrigger>

                <TooltipContent>Нажмите ещё раз для подтверждения</TooltipContent>
              </Tooltip>

              {unexpectedError && <div className="text-red-500">{unexpectedError}</div>}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
