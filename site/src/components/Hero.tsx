"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "./Icons";
import { BeanPoster } from "./three/BeanPoster";
import { useReducedMotion } from "./motion/MotionProvider";
import type { SceneDriver } from "./three/BeanScene";
import { canUse3D } from "@/lib/device";

const BeanScene = dynamic(() => import("./three/BeanScene"), { ssr: false });

type Mode = "pending" | "3d" | "poster";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const driver = useRef<SceneDriver>({ progress: 0, px: 0, py: 0 });
  const [mode, setMode] = useState<Mode>("pending");
  const [active, setActive] = useState(true);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    setMode(canUse3D() ? "3d" : "poster");
    const mq = window.matchMedia("(max-width: 767px)");
    const upd = () => setCompact(mq.matches);
    upd();
    mq.addEventListener("change", upd);
    const onMove = (e: PointerEvent) => {
      driver.current.px = (e.clientX / window.innerWidth) * 2 - 1;
      driver.current.py = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "120px" });
    if (root.current) io.observe(root.current);
    return () => {
      mq.removeEventListener("change", upd);
      window.removeEventListener("pointermove", onMove);
      io.disconnect();
    };
  }, []);

  useGSAP(
    () => {
      (window as unknown as { __motionReady?: boolean }).__motionReady = true;
      if (reduced) {
        gsap.set("[data-enter], .hero-word, .hero-art", { clearProps: "all", opacity: 1 });
        return;
      }
      // entrada única ao carregar
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(".hero-word", { y: 0, yPercent: 110 }, { y: 0, yPercent: 0, duration: 1.1, stagger: 0.07 }, 0.15)
        .fromTo("[data-enter]", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 }, 0.5)
        .fromTo(".hero-art", { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 1.6, ease: "power2.out" }, 0.1);

      // o progresso do scroll alimenta o grão 3D
      gsap.to(driver.current, {
        progress: 1,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      // o texto se afasta devagar enquanto o grão se abre
      gsap.to(".hero-copy", {
        opacity: 0,
        y: -40,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "35% top", end: "85% top", scrub: true },
      });
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  const words = ["Café", "de", "especialidade", "em", "Pinheiros"];

  return (
    <section
      id="inicio"
      ref={root}
      className="on-night relative isolate flex min-h-[100svh] overflow-hidden bg-night text-cream"
      aria-labelledby="hero-titulo"
    >
      {/* brilho de brasa atrás do grão */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 55% at 72% 52%, rgba(224,121,58,0.28) 0%, rgba(224,121,58,0.08) 38%, rgba(21,16,12,0) 70%), radial-gradient(40% 40% at 10% 100%, rgba(163,71,43,0.18) 0%, rgba(21,16,12,0) 70%)",
        }}
      />

      {/* arte: grão 3D (ou versão estática) */}
      <div
        className="hero-art pointer-events-none absolute inset-x-0 top-[var(--nav-h)] bottom-[46%] sm:bottom-[44%] lg:bottom-0 lg:left-[38%] lg:top-0"
        aria-hidden={mode === "3d"}
      >
        {mode === "3d" ? (
          <BeanScene
            driver={driver.current}
            still={reduced}
            active={active}
            compact={compact}
            onFallback={() => setMode("poster")}
          />
        ) : (
          <div className="grid h-full place-items-center">
            <BeanPoster className="h-[62%] max-h-[480px] w-auto drop-shadow-[0_30px_60px_rgba(224,121,58,0.25)] lg:h-[58%]" />
          </div>
        )}
      </div>

      <div className="wrap relative flex flex-col justify-end pb-[max(32px,env(safe-area-inset-bottom))] pt-[calc(var(--nav-h)+32px)] sm:pb-16 lg:justify-center lg:pb-24">
        <div className="hero-copy max-w-[620px]">
          <p data-enter className="mb-5 text-[14px] font-medium text-cream/70">
            Torra própria · Rua dos Pinheiros, São Paulo
          </p>
          <h1
            id="hero-titulo"
            className="font-display text-[clamp(40px,7.4vw,88px)] leading-[1.02] tracking-[-0.035em]"
          >
            {words.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <span className="hero-word inline-block">{w}</span>
                {i < words.length - 1 && <span>&nbsp;</span>}
              </span>
            ))}
          </h1>
          <p data-enter className="font-display mt-5 text-[clamp(22px,2.4vw,30px)] italic text-ember-soft">
            Torra lenta. Conversa longa.
          </p>
          <p data-enter className="mt-4 max-w-[480px] text-[17px] leading-[1.6] text-cream/80 md:text-[18px]">
            Grãos torrados aqui toda semana, espressos, coados e pão de queijo saindo do forno. De terça a
            domingo, a partir das 7h30.
          </p>
          <div data-enter className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#cardapio" className="btn btn--ember">
              Montar pedido <ArrowRight />
            </a>
            <a href="#visita" className="btn btn--ghost-night">
              Como chegar
            </a>
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-8 right-[var(--gut)] hidden items-center gap-3 text-[13px] text-cream/55 lg:flex"
      >
        <span>Role para abrir o grão</span>
        <span className="relative h-10 w-px overflow-hidden bg-cream/20">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.2s_ease-in-out_infinite] bg-ember" />
        </span>
      </div>
    </section>
  );
}
