'use client'          

import { forwardRef, JSX } from 'react';

const FoxIcon = forwardRef<SVGSVGElement, JSX.IntrinsicElements['svg']>(
  function FoxIcon(props, ref) {
    return (
      <svg
        ref={ref}
        {...props}
        viewBox="0 0 24 24"
        className={`
          pointer-events-none absolute left-0 top-1/2 -translate-y-1/2
          w-[200px] h-[200px] transition-transform will-change-transform
          fill-current text-blue-800
          ${props.className ?? ''}
        `}
      >
        {/* …all the <path> elements from fox.svg… */}
      </svg>
    );
  },
);

export default FoxIcon;