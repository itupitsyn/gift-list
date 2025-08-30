'use client';

import { useRouter } from 'next/navigation';
import { FC } from 'react';

import { Button } from './ui/button';

export const CreateEventButton: FC = () => {
  const router = useRouter();

  return (
    <Button onClick={() => router.push('/event')} variant="outline">
      Создать событие
    </Button>
  );
};
