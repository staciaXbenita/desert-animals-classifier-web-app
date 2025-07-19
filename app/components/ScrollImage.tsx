"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import FoxIcon from "./FoxIcon";

export default function ScrollImage() {
  const imgRef = useRef<HTMLImageElement | null>(null);
  // const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const factor = 0.5; // Increase factor for smoother movement
    const maxMove = 600; // Reduce maxMove for less abrupt stop

    let lastOffset = 0;
    let ticking = false;

    const updateTransform = (offset: number) => {
      if (imgRef.current) {
        imgRef.current.style.transform = `translateX(${offset}px)`;
        // svgRef.current!.style.transform = `translateX(${offset}px)`;
      }
    };

    const onScroll = () => {
      lastOffset = Math.min(window.scrollY * factor, maxMove);
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateTransform(lastOffset);
          ticking = false;
        });
        ticking = true;
      }
    };

    updateTransform(window.scrollY * factor);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Image
      ref={imgRef}
      src="fox.svg"
      alt="fox"
      width={200}
      height={200}
      priority
      className="
        pointer-events-none
        absolute           /* take it out of the flow                     */
        left-0 top-1/2  /* start at right edge, vertically centered    */
        -translate-y-1/2 /* center on y-axis                            */
        transition-transform
        will-change-transform
        
      "
      style={{
        filter:
          "invert(14%) sepia(88%) saturate(5374%) hue-rotate(233deg) brightness(91%) contrast(101%)",
      }}
    />
    // <FoxIcon ref={svgRef} />
  );
}