'use client';

import { Button, Card, Checkbox, Label, TextInput } from 'flowbite-react';
import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { EventFormData } from './EventForm';
import { Dropzone } from './Dropzone';
import { IMG_FORMATS } from '@/constants/images';
import { FaRegTrashAlt } from 'react-icons/fa';
import { FaRegPaste } from 'react-icons/fa6';

interface GiftFormProps {
  index: number;
  onDeleteClick: () => void;
}

export const GiftForm: FC<GiftFormProps> = ({ index, onDeleteClick }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<EventFormData>();

  const currentErrors = errors.gifts?.[index];

  return (
    <Card>
      <div className="flex justify-between gap-4">
        <div>
          <Controller
            control={control}
            name={`gifts.${index}.booked`}
            render={({ field }) => (
              <Label>
                <Checkbox {...field} value={undefined} checked={field.value} color="purple" className="mr-2" />
                Забронировано
              </Label>
            )}
          />
        </div>

        <Button type="button" size="xs" gradientDuoTone="purpleToPink" onClick={onDeleteClick} className="self-end">
          <FaRegTrashAlt className="h-3 w-3" />
        </Button>
      </div>

      <div>
        <Controller
          control={control}
          name={`gifts.${index}.name`}
          render={({ field }) => <TextInput {...field} placeholder="Название" />}
        />
        {currentErrors?.name?.message && <div className="mt-2 text-xs text-red-500">{currentErrors.name.message}</div>}
      </div>

      <div>
        <Controller
          control={control}
          name={`gifts.${index}.link`}
          render={({ field }) => <TextInput {...field} value={field.value || ''} placeholder="Ссылка" type="url" />}
        />
        {currentErrors?.link?.message && <div className="mt-2 text-xs text-red-500">{currentErrors.link.message}</div>}
      </div>
      <div>
        <Controller
          control={control}
          name={`gifts.${index}.price`}
          render={({ field }) => <TextInput type="number" {...field} value={field.value || ''} helperText="Цена" />}
        />
        {currentErrors?.price?.message && (
          <div className="mt-2 text-xs text-red-500">{currentErrors.price.message}</div>
        )}
      </div>

      <div className="relative">
        <Controller
          control={control}
          name={`gifts.${index}.image`}
          render={({ field }) => (
            <>
              <Dropzone
                {...field}
                value={field.value || ''}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && IMG_FORMATS.includes(file.type)) {
                    field.onChange(URL.createObjectURL(file));
                  }
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (IMG_FORMATS.includes(file.type)) {
                    field.onChange(URL.createObjectURL(file));
                  }
                }}
              />

              <Button
                className="absolute right-2 top-2"
                onClick={async () => {
                  try {
                    const itemList = await navigator.clipboard.read();
                    const currItem = itemList[0];
                    let imgType = '';

                    const isAllowed = currItem.types.some((item) => {
                      if (IMG_FORMATS.includes(item)) {
                        imgType = item;
                        return true;
                      }
                    });

                    if (isAllowed) {
                      const file = await currItem.getType(imgType);
                      field.onChange(URL.createObjectURL(file));
                    }
                  } catch {
                    ///
                  }
                }}
                outline
                gradientDuoTone="purpleToPink"
                size="sm"
              >
                <FaRegPaste />
              </Button>
            </>
          )}
        />

        {currentErrors?.image?.message && (
          <div className="mt-2 text-xs text-red-500">{currentErrors.image.message}</div>
        )}
      </div>
    </Card>
  );
};
