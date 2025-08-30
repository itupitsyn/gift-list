'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useCallback, useRef } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { FullEvent, updateEvent, UpdateEventRequest } from '@/api-service/event';
import { useShowBottomPanelBorder } from '@/lib/hooks/useShowBottomPanelBorder';
import { convertLocalToUTCDate, getImageUrl } from '@/lib/utils';

import { GiftForm } from '../GiftForm';
import { ImageUploaderElement } from '../ImageUploader';
import { Button } from '../ui/button';
import { DatePicker } from '../ui/datepicker';
import { Form, FormField, FormItem, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { CopyButton } from './components';

interface EventFormProps {
  event: FullEvent;
  publicLink: string;
  privateLink: string;
}

const schema = z.object({
  name: z.string().trim().max(255, 'Максимальная длина 255').min(1, 'Обязательное поле'),
  date: z.date().nullable().optional(),
  description: z.string().max(1024, 'Максимальная длина 1024').nullable().optional(),
  gifts: z.array(
    z.object({
      id: z.number().optional(),
      name: z.string().trim().max(255, 'Максимальная длина 255').min(1, 'Обязательное поле'),
      link: z.union([z.literal(''), z.string().url('Неверный формат').nullable().optional()]),
      price: z.coerce.number().nullable().optional(),
      booked: z.boolean().optional(),
      images: z
        .array(
          z.object({
            id: z.number(),
            src: z.string(),
            uploaded: z.boolean(),
            file: z.any().optional(),
          }),
        )
        .optional(),
    }),
  ),
});

export type EventFormData = z.infer<typeof schema>;

type ValueOf<T> = T extends Array<infer P> ? P : never;

export type GiftFormData = ValueOf<EventFormData['gifts']>;

export const EventForm: FC<EventFormProps> = ({ event, publicLink, privateLink }) => {
  const ref = useRef<HTMLDivElement>(null);
  const showBorder = useShowBottomPanelBorder(ref);

  const methods = useForm({
    defaultValues: {
      description: event.description,
      name: event.name,
      date: event.date,
      gifts: event.gifts.map((item) => ({
        ...item,
        images: item.images.map(
          (img): ImageUploaderElement => ({ id: img.id, src: getImageUrl(img.fileName) || '', uploaded: true }),
        ),
      })),
    },
    resolver: zodResolver(schema),
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const { fields, append, remove } = useFieldArray({ control, name: 'gifts', keyName: 'fieldId' });

  const submitHandler = useCallback(
    async (formData: EventFormData) => {
      let gifts = formData.gifts.filter((item) => item.id === undefined).reverse();

      gifts = gifts.concat(formData.gifts.filter((item) => item.id !== undefined));

      try {
        const params: UpdateEventRequest = {
          name: formData.name,
          description: formData.description ?? '',
          date: convertLocalToUTCDate(formData.date),
          gifts: gifts.map((item) => ({
            id: item.id,
            name: item.name || '',
            booked: item.booked || false,
            images: item.images,
            link: item.link || '',
            price: item.price || 0,
          })),
        };

        const response = await updateEvent(event.privateId, params);

        setValue(
          'gifts',
          response.gifts.map((item) => ({
            ...item,
            images: item.images.map(
              (img): ImageUploaderElement => ({ id: img.id, src: getImageUrl(img.fileName) || '', uploaded: true }),
            ),
          })),
        );
        toast.success('Изменения сохранены');
      } catch {
        toast.error('Неизвестная ошибка');
      }
    },
    [event.privateId, setValue],
  );

  const fieldsExisted = fields.filter((item) => item.id !== undefined);
  const fieldsNew = fields.filter((item) => item.id === undefined);

  return (
    <Form {...methods}>
      <div className="flex w-full flex-col items-center justify-between gap-6">
        <form
          noValidate
          className="flex w-full max-w-screen-md flex-col gap-12 rounded px-2 backdrop-blur-sm"
          id="event-form"
          onSubmit={handleSubmit(submitHandler)}
        >
          <div className="flex w-full flex-col gap-6">
            <div className="text-2xl font-bold">Событие</div>
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="max-w-full truncate">{privateLink}</div>

                <CopyButton textToCopy={privateLink} />
              </div>
              <div className="mt-1 text-xs font-light opacity-60">
                Это ваша ссылка. Сохраните ее и никому не показывайте
              </div>

              <div className="mt-6 flex items-center justify-between gap-2">
                <div className="max-w-full truncate">{publicLink}</div>
                <CopyButton textToCopy={publicLink} />
              </div>
              <div className="mt-1 text-xs font-light opacity-60">Это публичная ссылка для ваших друзей</div>
            </div>

            <div>
              <FormField
                control={control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <DatePicker placeholder="Дата" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Input {...field} placeholder="Название" />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <Textarea {...field} value={field.value || ''} placeholder="Описание" />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-2">
              <div className="text-2xl font-bold">Подарки</div>
              <Button
                type="button"
                variant="outline"
                className="sm:self-end"
                onClick={() => append({ name: '', price: 0, booked: false })}
              >
                Добавить
              </Button>
            </div>

            {fieldsNew.length > 0 && (
              <div className="flex flex-col-reverse gap-6">
                {fieldsNew.map((item, idx) => {
                  const currentIdx = idx + fieldsExisted.length;
                  return <GiftForm key={item.fieldId} index={currentIdx} onDeleteClick={() => remove(currentIdx)} />;
                })}
              </div>
            )}

            <div className="flex flex-col gap-6">
              {fieldsExisted.map((item, idx) => (
                <GiftForm key={item.fieldId} index={idx} onDeleteClick={() => remove(idx)} />
              ))}
            </div>
          </div>
        </form>

        <div className="sticky bottom-0 flex flex-col items-center self-stretch backdrop-blur-sm" ref={ref}>
          {showBorder && <div className="h-[1px] self-stretch bg-gradient-to-r from-purple-500 to-pink-500" />}
          <div className="flex w-full max-w-screen-md justify-end px-2 py-6">
            <Button
              type="submit"
              variant="outline"
              disabled={isSubmitting}
              form="event-form"
              className="w-full sm:w-auto"
            >
              Сохранить
            </Button>
          </div>
        </div>
      </div>
    </Form>
  );
};
