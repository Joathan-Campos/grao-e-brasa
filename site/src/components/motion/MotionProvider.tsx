"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ReducedCtx = createContext(false);
export const useReducedMotion = () => useContext(ReducedCtx);

let lenisInstance: Lenis | null = null;
/** pausa a rolagem suave enquanto um diálogo (pedido, foto ampliada) está aberto */
export function setScrollLocked(locked: boolean) {
  if (!lenisInstance) return;
  if (locked) lenisInstance.stop();
  else lenisInstance.start();
}
/** rola até um alvo usando o Lenis quando ativo, ou o scroll nativo */
export function scrollToTarget(target: string | HTMLElement) {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;
  if (lenisInstance) lenisInstance.scrollTo(el, { offset: 0, duration: 1.1 });
  else el.scrollIntoView({ behavior: "auto", block: "start" });
}

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reduced) {
      document.documentElement.classList.remove("js-motion");
      return;
    }
    const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95, anchors: false });
    lenisInstance = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, [reduced]);

  // âncoras internas passam pelo Lenis para manter a rolagem suave
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector<HTMLElement>(id);
      if (!el) return;
      e.preventDefault();
      scrollToTarget(el);
      history.replaceState(null, "", id);
      // leva o foco para a seção (acessibilidade de teclado)
      if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return <ReducedCtx.Provider value={reduced}>{children}</ReducedCtx.Provider>;
}

/** entradas suaves dos elementos marcados com data-reveal dentro de um container */
export function useReveal(scope: React.RefObject<HTMLElement | null>) {
  const reduced = useReducedMotion();
  useGSAP(
    () => {
      (window as unknown as { __motionReady?: boolean }).__motionReady = true;
      const els = gsap.utils.toArray<HTMLElement>("[data-reveal]", scope.current);
      if (reduced) {
        gsap.set(els, { clearProps: "all", opacity: 1 });
        return;
      }
      els.forEach((el) => {
        const delay = Number(el.dataset.revealDelay ?? 0);
        gsap.fromTo(
          el,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            delay,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          },
        );
      });
    },
    { scope, dependencies: [reduced], revertOnUpdate: true },
  );
}
