'use client';

import type * as PrismaTypes from '@prisma/client';
import { Button, Textarea, TextInput } from 'flowbite-react';
import { FC, useCallback } from 'react';
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { GiftForm } from './GiftForm';
import { updateEvent, UpdateEventRequest } from '@/api-service/event';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

interface EventFormProps {
  event: PrismaTypes.Event;
  publicLink: string;
  privateLink: string;
  gifts: PrismaTypes.Gift[];
}

export type EventFormData = {
  name: string;
  description?: string | null;
  gifts: GiftFormData[];
};

export type GiftFormData = {
  id?: number;
  name: string;
  link?: string | null;
  price?: number | null;
  image?: string | null;
  booked: boolean;
};

const schema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string().nullable().max(1024),
  gifts: yup
    .array()
    .required()
    .of(
      yup.object().shape({
        name: yup.string().required(),
        link: yup.string().nullable(),
        price: yup.number().nullable(),
        image: yup.string().nullable(),
        booked: yup.bool().required(),
      }),
    ),
});

export const EventForm: FC<EventFormProps> = ({ event, publicLink, privateLink, gifts }) => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<EventFormData>({
    defaultValues: {
      description: event.description,
      name: event.name,
      gifts,
    },
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'gifts' });

  const submitHandler: SubmitHandler<EventFormData> = useCallback(
    async (formData) => {
      try {
        const params: UpdateEventRequest = {
          name: formData.name,
          description: formData.description ?? '',
          gifts: formData.gifts.map((item) => ({
            id: item.id,
            name: item.name || '',
            booked: item.booked || false,
            image: item.image || '',
            link: item.link || '',
            price: item.price || 0,
          })),
        };
        await updateEvent(event.privateId, params);
      } catch {
        ///
      }
    },
    [event.privateId],
  );

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

        <div>
          <Controller
            control={control}
            name="name"
            render={({ field }) => <TextInput {...field} placeholder="Название" />}
          />
          {errors.name?.message && <div className="mt-2 text-xs text-red-500">{errors.name.message}</div>}
        </div>

        <div>
          <Controller
            control={control}
            name="description"
            render={({ field }) => <Textarea {...field} value={field.value ?? ''} placeholder="Описание" />}
          />
          {errors.description?.message && <div className="mt-2 text-xs text-red-500">{errors.description.message}</div>}
        </div>
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
            <GiftForm key={item.id} index={idx} control={control} errors={errors} onDeleteClick={() => remove(idx)} />
          ))}
        </div>
      </div>

      <Button type="submit" gradientDuoTone="purpleToPink" outline className="sm:self-end" disabled={isSubmitting}>
        Сохранить
      </Button>
    </form>
  );
};
