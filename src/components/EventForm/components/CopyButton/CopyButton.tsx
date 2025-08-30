import { CopyIcon } from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface CopyButtonProps {
  textToCopy: string;
}

export const CopyButton: FC<CopyButtonProps> = ({ textToCopy }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const id = setTimeout(() => {
        setIsOpen(false);
      }, 1000);

      return () => {
        clearTimeout(id);
      };
    }
  }, [isOpen]);

  return (
    <Tooltip open={isOpen} onOpenChange={() => {}}>
      <TooltipTrigger asChild>
        <Button
          type="button"
          className="group"
          variant="ghost"
          size="sm"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(textToCopy);
              setIsOpen(true);
            } catch {
              toast.error('Не далось скопировать ссылку');
            }
          }}
        >
          <CopyIcon className="size-4 transition-colors group-hover:text-fuchsia-500" />
        </Button>
      </TooltipTrigger>

      <TooltipContent>Скопировано</TooltipContent>
    </Tooltip>
  );
};
