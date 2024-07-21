import { RefObject, useEffect, useState } from 'react';

export const useShowBottomPanelBorder = (ref: RefObject<HTMLDivElement>) => {
  const [showBorder, setShowBorder] = useState(false);
  useEffect(() => {
    const handler = () => {
      if (!ref.current) return;
      const rect = ref.current?.getBoundingClientRect();
      setShowBorder(rect.bottom - window.innerHeight >= 0);
    };

    handler();

    addEventListener('scroll', handler);
    const resizeObserver = new ResizeObserver(handler);
    resizeObserver.observe(document.body);

    return () => {
      removeEventListener('scroll', handler);
      resizeObserver.unobserve(document.body);
    };
  }, [ref]);

  return showBorder;
};
