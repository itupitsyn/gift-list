'use client';

import { Button } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

export const CreateEventButton: FC = () => {
  const router = useRouter();

  return (
    <Button gradientDuoTone="tealToLime" outline onClick={() => router.push('/event')}>
      Создать событие
    </Button>
  );
};
