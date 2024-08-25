import React, { ReactNode, useCallback, useEffect, useRef } from 'react';
import { Toast } from 'flowbite-react';
import { createPortal } from 'react-dom';

export const useToaster = () => {
  const parent = useRef<Element | null>();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      parent.current = document.querySelector('.extremely-serious-toaster') || null;
    }
  }, []);

  const addToast = useCallback((content: ReactNode) => {
    if (!parent.current) return null;

    // return React.cre;
  }, []);

  return { addToast };
};
