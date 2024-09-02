import { useCallback, useEffect, useRef } from 'react';

export const useToaster = () => {
  const parent = useRef<Element | null>();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      parent.current = document.querySelector('.extremely-serious-toaster') || null;
    }
  }, []);

  const addToast = useCallback((content: string) => {
    if (!parent.current) return null;
    const className =
      'flex w-full max-w-xs items-center rounded-lg bg-white p-4 text-gray-500 shadow dark:bg-gray-800 dark:text-gray-400';

    const newElement = document.createElement('div');
    newElement.innerText = content;
    newElement.className = className;
    newElement.classList.add('toast');
    parent.current.appendChild(newElement);

    setTimeout(() => {
      parent.current?.removeChild(newElement);
    }, 3300);

    setTimeout(() => {
      newElement.classList.add('hideToast');
    }, 3000);
  }, []);

  return { addToast };
};
