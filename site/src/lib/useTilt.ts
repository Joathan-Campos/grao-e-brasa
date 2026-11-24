"use client";

import { useCallback } from "react";

/** Inclinação 3D sutil que segue o ponteiro. Ignorada em toque e com movimento reduzido. */
export function useTilt(max = 5) {
  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (e.pointerType !== "mouse") return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const el = e.currentTarget;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.classList.add("is-tilting");
      el.style.setProperty("--ry", `${(x * max).toFixed(2)}deg`);
      el.style.setProperty("--rx", `${(-y * max).toFixed(2)}deg`);
      el.style.setProperty("--ty", "-2px");
    },
    [max],
  );
  const onPointerLeave = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.classList.remove("is-tilting");
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--ty", "0px");
  }, []);
  return { onPointerMove, onPointerLeave };
}
