'use client';

import { bookGift, FullGift } from '@/api-service/gift';
import { getImageUrl } from '@/utils/file';
import { Button, Card, Tooltip } from 'flowbite-react';
import Image from 'next/image';
import { FC, KeyboardEvent, useCallback, useMemo, useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';

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
  useOnClickOutside(ref, clickOutsideHandler);

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

  const imgSrc = useMemo(() => getImageUrl(giftState.images[0]?.fileName), [giftState.images]);

  return (
    <Card>
      <div className="flex flex-col items-stretch gap-6 sm:flex-row sm:justify-between">
        {imgSrc ? (
          <Image
            src={imgSrc}
            width={512}
            height={512}
            alt=""
            className="max-h-64 max-w-64 object-contain object-left-top"
          />
        ) : (
          <div />
        )}

        <div className="flex grow flex-col justify-between gap-6 overflow-hidden">
          <div className="flex flex-col items-end gap-4 overflow-hidden">
            <div className="max-w-full overflow-hidden">
              {giftState.link ? (
                <a
                  href={giftState.link}
                  className="block overflow-hidden text-ellipsis text-xl hover:text-lime-400"
                  target="_blank"
                  rel="noreferrer"
                >
                  {giftState.name}
                </a>
              ) : (
                <div className="overflow-hidden text-ellipsis text-xl">{giftState.name}</div>
              )}
            </div>

            {giftState.price && (
              <div>
                {giftState.price.toLocaleString('ru')}
                {'\u00A0'}₽
              </div>
            )}

            {giftState.booked && <div className="text-lime-400">Забронировано</div>}
          </div>

          {(!giftState.booked || changedNow) && (
            <div className="flex flex-col items-end gap-2 p-1">
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

              {unexpectedError && <div className="text-red-500">{unexpectedError}</div>}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
