'use client';

import { Card, TextInput } from 'flowbite-react';
import { FC } from 'react';
import { Control, Controller } from 'react-hook-form';
import { EventFormData } from './EventForm';
import { Dropzone } from './Dropzone';

interface GiftFormProps {
  index: number;
  control: Control<EventFormData>;
}

export const GiftForm: FC<GiftFormProps> = ({ control, index }) => {
  return (
    <Card>
      <Controller
        control={control}
        name={`gifts.${index}.name`}
        render={({ field }) => <TextInput {...field} placeholder="Название" />}
      />
      <Controller
        control={control}
        name={`gifts.${index}.link`}
        render={({ field }) => <TextInput {...field} placeholder="Ссылка" type="url" />}
      />
      <div>
        <Controller
          control={control}
          name={`gifts.${index}.price`}
          render={({ field }) => <TextInput type="number" {...field} helperText="Цена" />}
        />
      </div>
      <Controller control={control} name={`gifts.${index}.image`} render={({ field }) => <Dropzone {...field} />} />
    </Card>
  );
};
