'use client';

import { ExternalLink, Trash } from 'lucide-react';
import Link from 'next/link';
import { FC } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { EventFormData } from './EventForm';
import { ImageUploader } from './ImageUploader';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { FormField, FormItem, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface GiftFormProps {
  index: number;
  isDisabled?: boolean;
  onDeleteClick: () => void;
}

export const GiftForm: FC<GiftFormProps> = ({ index, isDisabled, onDeleteClick }) => {
  const { control } = useFormContext<EventFormData>();

  const {
    append,
    remove,
    fields: imgFields,
  } = useFieldArray({ control, name: `gifts.${index}.images`, keyName: 'id' });

  return (
    <Card className="px-4">
      <div className="flex justify-between gap-4">
        <div>
          <FormField
            control={control}
            name={`gifts.${index}.booked`}
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <Label>
                  <Checkbox
                    {...field}
                    checked={value}
                    onCheckedChange={onChange}
                    color="purple"
                    className="mr-2"
                    disabled={isDisabled}
                  />
                  Забронировано
                </Label>
              </FormItem>
            )}
          />
        </div>

        <Button variant="ghost" type="button" onClick={onDeleteClick} className="group self-end" disabled={isDisabled}>
          <Trash className="size-4 transition-colors group-hover:text-red-500" />
        </Button>
      </div>

      <FormField
        control={control}
        name={`gifts.${index}.name`}
        render={({ field }) => (
          <FormItem>
            <Input {...field} placeholder="Название" disabled={isDisabled} />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`gifts.${index}.link`}
        render={({ field }) => (
          <FormItem>
            <div className="flex gap-2">
              <Input {...field} value={field.value || ''} placeholder="Ссылка" type="url" disabled={isDisabled} />

              {field.value ? (
                <Button variant="ghost" asChild>
                  <Link href={field.value || '#'} prefetch={false} target="_blank">
                    <ExternalLink />
                  </Link>
                </Button>
              ) : (
                <Button disabled variant="ghost">
                  <ExternalLink />
                </Button>
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`gifts.${index}.price`}
        render={({ field }) => (
          <FormItem>
            <Label htmlFor={`price-${index}`}>Цена</Label>
            <Input type="number" id={`price-${index}`} {...field} value={field.value || ''} disabled={isDisabled} />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`gifts.${index}.images`}
        render={({ field }) => {
          const { onBlur } = field;

          return (
            <FormItem>
              <ImageUploader
                images={imgFields}
                onBlur={onBlur}
                isDisabled={isDisabled}
                onDrop={(data) => {
                  data.forEach((file) =>
                    append({
                      id: Math.random(),
                      src: window.URL.createObjectURL(file),
                      file,
                      uploaded: false,
                    }),
                  );
                }}
                onDelete={(img) => {
                  const idx = imgFields.findIndex((item) => item.id === img.id);
                  if (idx >= 0) {
                    remove(idx);
                  }
                }}
              />

              <FormMessage />
            </FormItem>
          );
        }}
      />
    </Card>
  );
};
