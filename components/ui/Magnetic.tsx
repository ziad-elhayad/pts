"use client";

import { memo, useCallback, useRef } from "react";

interface MagneticProps {
  children: React.ReactNode;
  strength?: number;
}

export const Magnetic = memo(function Magnetic({ children, strength = 0.5 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.pointerType !== "mouse") return;
      const node = ref.current;
      if (!node) return;

      const { left, top, width, height } = node.getBoundingClientRect();
      const distanceX = event.clientX - (left + width / 2);
      const distanceY = event.clientY - (top + height / 2);

      if (Math.abs(distanceX) < 100 && Math.abs(distanceY) < 100) {
        node.style.transform = `translate3d(${distanceX * strength}px, ${distanceY * strength}px, 0)`;
      } else {
        node.style.transform = "translate3d(0, 0, 0)";
      }
    },
    [strength]
  );

  const handlePointerLeave = useCallback(() => {
    if (ref.current) {
      ref.current.style.transform = "translate3d(0, 0, 0)";
    }
  }, []);

  return (
    <div
      ref={ref}
      className="transform-gpu transition-transform duration-300 ease-out"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {children}
    </div>
  );
});
