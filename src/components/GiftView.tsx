'use client';

import { bookGift } from '@/api-service/gift';
import type * as PrismaTypes from '@prisma/client';
import { Button, Card, Tooltip } from 'flowbite-react';
import { FC, KeyboardEvent, useCallback, useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';

interface GiftViewProps {
  eventPublicId: string;
  gift: PrismaTypes.Gift;
}

export const GiftView: FC<GiftViewProps> = ({ gift, eventPublicId }) => {
  const [unexpectedError, setUnexpectedError] = useState('');
  const [giftState, setGiftState] = useState(gift);
  const [changedNow, setChangedNow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [clickClack, setClickClack] = useState(false);

  const ref = useRef<HTMLButtonElement>(null);
  const handler = useCallback(() => setClickClack(false), []);
  useOnClickOutside(ref, handler);

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
    <Card>
      <div className="flex justify-between gap-6">
        {giftState.link ? (
          <a href={giftState.link} className="text-xl hover:text-lime-400" target="_blank" rel="noreferrer">
            {giftState.name}
          </a>
        ) : (
          <div className="text-xl">{giftState.name}</div>
        )}
        {giftState.booked && <div className="text-lime-400">Забронировано</div>}
      </div>
      {giftState.price && (
        <div>
          {giftState.price}
          {'\u00A0'}₽
        </div>
      )}
      {unexpectedError && <div className="text-red-500">{unexpectedError}</div>}
      {(!giftState.booked || changedNow) && (
        <div className="flex justify-end">
          <Tooltip content="Нажмите ещё раз для подтверждения" trigger="click">
            <Button
              ref={ref}
              type="button"
              gradientDuoTone={clickClack ? 'purpleToPink' : 'tealToLime'}
              outline
              onClick={() => onBookClick(!giftState.booked)}
              disabled={isLoading}
              onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => {
                if (e.key === 'Escape') {
                  setClickClack(false);
                }
              }}
            >
              {giftState.booked ? 'Снять бронь' : 'Забронировать'}
            </Button>
          </Tooltip>
        </div>
      )}
    </Card>
  );
};
