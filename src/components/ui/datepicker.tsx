'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ru } from 'react-day-picker/locale';

interface DatePickerProps {
  placeholder?: string;
  value?: Date | null;
  onChange?: (value: Date | undefined | null) => void;
  onBlur?: () => void;
}

export function DatePicker({ placeholder, value, onChange, onBlur }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!value}
          className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
          onBlur={onBlur}
        >
          <CalendarIcon />
          {value ? (
            format(value, 'PPP', {
              locale: ru,
            })
          ) : (
            <span>{placeholder ?? 'Pick a date'}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={value || undefined} onSelect={onChange} locale={ru} />
      </PopoverContent>
    </Popover>
  );
}
