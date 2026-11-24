"use client";

import { useEffect, useState, type RefObject } from "react";

let cached: boolean | null = null;

/** WebGL disponível e aparelho com fôlego para o 3D */
export function canUse3D(): boolean {
  if (cached !== null) return cached;
  cached = (() => {
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl2") || c.getContext("webgl");
      if (!gl) return false;
    } catch {
      return false;
    }
    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    if (nav.connection?.saveData) return false;
    const cores = nav.hardwareConcurrency ?? 8;
    const mem = nav.deviceMemory ?? 8;
    if (cores <= 2 || mem <= 2) return false;
    if (cores <= 4 && mem <= 4 && window.matchMedia("(pointer: coarse)").matches) return false;
    return true;
  })();
  return cached;
}

export function useInView(ref: RefObject<Element | null>, rootMargin = "100px") {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return inView;
}

export function useMediaQuery(q: string) {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const u = () => setM(mq.matches);
    u();
    mq.addEventListener("change", u);
    return () => mq.removeEventListener("change", u);
  }, [q]);
  return m;
}
