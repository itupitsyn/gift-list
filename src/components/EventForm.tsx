'use client';

import type * as PrismaTypes from '@prisma/client';
import { Button, Textarea, TextInput } from 'flowbite-react';
import { FC, useCallback, useMemo } from 'react';
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { GiftForm } from './GiftForm';

interface EventFormProps {
  event: PrismaTypes.Event;
  publicLink: string;
  privateLink: string;
}

export type EventFormData = {
  name: string;
  description?: string | null;
  gifts: GiftFormData[];
};

export type GiftFormData = {
  name: string;
  link: string;
  price: number;
  image: string;
  booked: boolean;
};

export const EventForm: FC<EventFormProps> = ({ event, publicLink, privateLink }) => {
  const { control, handleSubmit, formState } = useForm<EventFormData>({
    defaultValues: {
      description: event.description,
      name: event.name,
    },
  });

  const { fields, append } = useFieldArray({ control, name: 'gifts' });

  const submitHandler: SubmitHandler<EventFormData> = useCallback(async (formData) => {}, []);

  return (
    <form
      noValidate
      className="flex max-w-screen-md flex-col gap-12 overflow-hidden"
      onSubmit={handleSubmit(submitHandler)}
    >
      <div className="flex flex-col gap-6">
        <div className="text-2xl font-bold">Событие</div>
        <div>
          <div className="flex items-center gap-2">
            <div className="truncate">{privateLink}</div>
            <Button
              type="button"
              size="xs"
              gradientDuoTone="purpleToPink"
              onClick={() => {
                navigator.clipboard.writeText(privateLink);
              }}
            >
              copy
            </Button>
          </div>
          <div className="mt-1 text-xs opacity-60">Это ваша ссылка. Сохраните ее и никому не показывайте</div>

          <div className="mt-6 flex items-center gap-2">
            <div className="truncate">{publicLink}</div>
            <Button
              type="button"
              size="xs"
              gradientDuoTone="purpleToPink"
              onClick={() => {
                navigator.clipboard.writeText(publicLink);
              }}
            >
              copy
            </Button>
          </div>
          <div className="mt-1 text-xs opacity-60">Это публичная ссылка для ваших друзей</div>
        </div>

        <Controller
          control={control}
          name="name"
          render={({ field }) => <TextInput {...field} placeholder="Название" />}
        />

        <Controller
          control={control}
          name="description"
          render={({ field }) => <Textarea {...field} value={field.value ?? ''} placeholder="Описание" />}
        />
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">Подарки</div>
          <Button
            type="button"
            gradientDuoTone="purpleToPink"
            className="sm:self-end"
            onClick={() => append({ image: '', link: '', name: '', price: 0, booked: false })}
          >
            Добавить
          </Button>
        </div>
        <div className="flex flex-col-reverse gap-6">
          {fields.map((item, idx) => (
            <GiftForm key={item.id} index={idx} control={control} />
          ))}
        </div>
      </div>

      <Button type="submit" gradientDuoTone="purpleToPink" outline className="sm:self-end">
        Сохранить
      </Button>
    </form>
  );
};
