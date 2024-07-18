'use client';

import { Button, Card, Checkbox, Label, TextInput } from 'flowbite-react';
import { FC } from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { EventFormData } from './EventForm';
import { Dropzone } from './Dropzone';

interface GiftFormProps {
  index: number;
  control: Control<EventFormData>;
  errors: FieldErrors<EventFormData>;
  onDeleteClick: () => void;
}

export const GiftForm: FC<GiftFormProps> = ({ control, index, errors, onDeleteClick }) => {
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
          utilize
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

      <div>
        <Controller
          control={control}
          name={`gifts.${index}.image`}
          render={({ field }) => (
            <Dropzone
              {...field}
              value={field.value || ''}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  field.onChange(URL.createObjectURL(file));
                } else {
                  field.onChange('');
                }
              }}
            />
          )}
        />
        {currentErrors?.image?.message && (
          <div className="mt-2 text-xs text-red-500">{currentErrors.image.message}</div>
        )}
      </div>
    </Card>
  );
};
