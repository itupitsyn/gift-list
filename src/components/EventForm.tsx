'use client';

import * as PrismaTypes from '@prisma/client';
import { Button, Datepicker, Textarea, TextInput, Tooltip } from 'flowbite-react';
import { FC, useCallback, useRef, useState } from 'react';
import { Controller, FormProvider, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { GiftForm } from './GiftForm';
import { FullEvent, updateEvent, UpdateEventRequest } from '@/api-service/event';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { convertLocalToUTCDate } from '@/utils/date';
import { useShowBottomPanelBorder } from '@/hooks/useShowBottomPanelBorder';
import { getFileFromObjectUrl, getImageUrl } from '@/utils/file';
import { useToaster } from '@/hooks/useToaster';
import { FaRegCopy } from 'react-icons/fa';

interface EventFormProps {
  event: FullEvent;
  publicLink: string;
  privateLink: string;
}

export type EventFormData = {
  name: string;
  date?: Date | null;
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

const getGiftsFormDataFromGifts = (gifts: EventFormProps['event']['gifts']) => {
  return gifts.map((item) => {
    const { images, ...result }: GiftFormData & { images: PrismaTypes.Image[] } = item;
    result.image = getImageUrl(images[0]?.fileName);
    return result;
  });
};

export const EventForm: FC<EventFormProps> = ({ event, publicLink, privateLink }) => {
  const [unexpectedError, setUnexpectedError] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const showBorder = useShowBottomPanelBorder(ref);

  const methods = useForm<EventFormData>({
    defaultValues: {
      description: event.description,
      name: event.name,
      date: event.date,
      gifts: getGiftsFormDataFromGifts(event.gifts),
    },
    resolver: yupResolver(schema),
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = methods;

  const { fields, prepend, remove } = useFieldArray({ control, name: 'gifts', keyName: 'fieldId' });

  const { addToast } = useToaster();

  const submitHandler: SubmitHandler<EventFormData> = useCallback(
    async (formData) => {
      try {
        setUnexpectedError('');

        const imgs = await Promise.all(formData.gifts.map((item) => getFileFromObjectUrl(item.image, 'image')));

        const params: UpdateEventRequest = {
          name: formData.name,
          description: formData.description ?? '',
          date: convertLocalToUTCDate(formData.date),
          gifts: formData.gifts.map((item, idx) => ({
            id: item.id,
            name: item.name || '',
            booked: item.booked || false,
            image: imgs[idx],
            link: item.link || '',
            price: item.price || 0,
          })),
        };
        const response = await updateEvent(event.privateId, params);
        setValue('gifts', getGiftsFormDataFromGifts(response.gifts));
        addToast('Изменения сохранены');
      } catch (e) {
        setUnexpectedError('Неизвестная ошибка');
      }
    },
    [addToast, event.privateId, setValue],
  );

  return (
    <FormProvider {...methods}>
      <div className="flex w-full flex-col items-center justify-between gap-6">
        <form
          noValidate
          className="flex w-full max-w-screen-md flex-col gap-12 rounded p-2 backdrop-blur-sm"
          id="event-form"
          onSubmit={handleSubmit(submitHandler)}
        >
          <div className="flex w-full flex-col gap-6">
            <div className="text-2xl font-bold">Событие</div>
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="max-w-full truncate">{privateLink}</div>
                <Tooltip content="Скопировано" trigger="click" arrow={false}>
                  <Button
                    type="button"
                    size="xs"
                    gradientDuoTone="purpleToPink"
                    onClick={() => {
                      navigator.clipboard.writeText(privateLink);
                    }}
                  >
                    <FaRegCopy className="h-3 w-3" />
                  </Button>
                </Tooltip>
              </div>
              <div className="mt-1 text-xs opacity-60">Это ваша ссылка. Сохраните ее и никому не показывайте</div>

              <div className="mt-6 flex items-center justify-between gap-2">
                <div className="max-w-full truncate">{publicLink}</div>
                <Tooltip content="Скопировано" trigger="click" arrow={false}>
                  <Button
                    type="button"
                    size="xs"
                    gradientDuoTone="purpleToPink"
                    onClick={() => {
                      navigator.clipboard.writeText(publicLink);
                    }}
                  >
                    <FaRegCopy className="h-3 w-3" />
                  </Button>
                </Tooltip>
              </div>
              <div className="mt-1 text-xs opacity-60">Это публичная ссылка для ваших друзей</div>
            </div>

            <div>
              <Controller
                control={control}
                name="date"
                render={({ field }) => <Datepicker {...field} language="ru-RU" weekStart={1} placeholder="Дата" />}
              />
              {errors.date?.message && <div className="mt-2 text-xs text-red-500">{errors.date.message}</div>}
            </div>

            <div>
              <Controller
                control={control}
                name="name"
                render={({ field }) => <TextInput {...field} placeholder="Название" className="w-auto" />}
              />
              {errors.name?.message && <div className="mt-2 text-xs text-red-500">{errors.name.message}</div>}
            </div>

            <div>
              <Controller
                control={control}
                name="description"
                render={({ field }) => <Textarea {...field} value={field.value ?? ''} placeholder="Описание" />}
              />
              {errors.description?.message && (
                <div className="mt-2 text-xs text-red-500">{errors.description.message}</div>
              )}
            </div>
          </div>

          {unexpectedError && <div className="text-red-500">{unexpectedError}</div>}

          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-2">
              <div className="text-2xl font-bold">Подарки</div>
              <Button
                type="button"
                gradientDuoTone="purpleToPink"
                className="sm:self-end"
                onClick={() => prepend({ image: '', link: '', name: '', price: 0, booked: false })}
              >
                Добавить
              </Button>
            </div>
            <div className="flex flex-col gap-6">
              {fields.map((item, idx) => (
                <GiftForm key={item.fieldId} index={idx} onDeleteClick={() => remove(idx)} />
              ))}
            </div>
          </div>
        </form>
        <div className="sticky bottom-0 flex flex-col items-center self-stretch bg-gray-900" ref={ref}>
          {showBorder && <div className="h-[1px] self-stretch bg-gradient-to-r from-purple-500 to-pink-500" />}
          <div className="flex w-full max-w-screen-md justify-end py-6">
            <Button
              type="submit"
              gradientDuoTone="purpleToPink"
              outline
              disabled={isSubmitting}
              form="event-form"
              className="w-full sm:w-auto"
            >
              Сохранить
            </Button>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};
