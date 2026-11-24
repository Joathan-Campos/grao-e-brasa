"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./motion/MotionProvider";

/** Vídeo da marca em loop (feito com HyperFrames). Toca só quando visível; parado com movimento reduzido. */
export function LoopVideo({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (reduced) {
      v.pause();
      setPaused(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !v.dataset.userPaused) v.play().catch(() => setPaused(true));
        else v.pause();
      },
      { threshold: 0.2 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduced]);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      delete v.dataset.userPaused;
      v.play().then(() => setPaused(false)).catch(() => {});
    } else {
      v.dataset.userPaused = "1";
      v.pause();
      setPaused(true);
    }
  };

  return (
    <div className={`relative overflow-hidden bg-night ${className}`}>
      <video
        ref={ref}
        className="h-full w-full object-cover"
        muted
        loop
        playsInline
        preload="metadata"
        poster="/video/grao-e-brasa-poster.jpg"
        aria-label="Animação da marca: grão de café girando com vapor e o nome Grão & Brasa"
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
      >
        <source src="/video/grao-e-brasa-loop-16x9.webm" type="video/webm" />
        <source src="/video/grao-e-brasa-loop-16x9.mp4" type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={toggle}
        className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-night/70 text-cream backdrop-blur transition-colors hover:bg-night"
        aria-label={paused ? "Tocar animação" : "Pausar animação"}
      >
        {paused ? (
          <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true"><path d="M6 4l10 6-10 6z" fill="currentColor" /></svg>
        ) : (
          <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true"><path d="M5 4h3v12H5zM12 4h3v12h-3z" fill="currentColor" /></svg>
        )}
      </button>
    </div>
  );
}
