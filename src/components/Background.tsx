'use client';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useDebounceValue } from 'usehooks-ts';

import Icon2 from '../assets/purple-festive-baloons-with-transparent-background.svg';
import Icon1 from '../assets/purple-festive-baloons-with-transparent-background-2.svg';
import Icon3 from '../assets/purple-gift-with-transparent-background-1.svg';
import Icon4 from '../assets/purple-gift-with-transparent-background-2.svg';
import Icon5 from '../assets/purple-gift-with-transparent-background-3.svg';
import Icon6 from '../assets/purple-two-baloons-with-transparent-background-2.svg';

const iconsSet = [Icon1, Icon2, Icon3, Icon4, Icon5, Icon6] as const;
const wSizeApprox = 138;
const hSizeApprox = 181;

// 963 x 1266;

export const Background = () => {
  const [pageSize, setPageSize] = useState({ w: 0, h: 0 });
  const [pageSizeDeb] = useDebounceValue(pageSize, 500);

  useEffect(() => {
    const handler = () => {
      setPageSize({ w: window.innerWidth, h: window.innerHeight });
    };
    handler();
    window.addEventListener('resize', handler);

    return () => {
      window.removeEventListener('resize', handler);
    };
  }, []);

  const icons = useMemo(() => {
    const result: ReactNode[] = [];

    const wNum = Math.round(pageSizeDeb.w / wSizeApprox);
    const hNum = Math.round(pageSizeDeb.h / hSizeApprox);

    const wSize = Math.round(pageSizeDeb.w / wNum);
    const hSize = Math.round(pageSizeDeb.h / hNum);

    for (let i = 0; i < wNum; i += 1) {
      const x = Math.ceil(Math.random() * wSize) + i * wSize;

      for (let j = 0; j < hNum; j += 1) {
        const idx = Math.floor(Math.random() * iconsSet.length);
        const Component = iconsSet[idx];

        const y = Math.ceil(Math.random() * hSize) + j * hSize;
        const rotate = Math.ceil(Math.random() * 360);

        result.push(
          <Component
            key={`icon-${Math.random()}`}
            className="fixed -z-10"
            width={56}
            height={56}
            style={{
              transform: `rotate(${rotate}deg)`,
              left: `${x}px`,
              top: `${y}px`,
            }}
          />,
        );
      }
    }

    return result;
  }, [pageSizeDeb.h, pageSizeDeb.w]);

  return <div>{icons}</div>;
};
