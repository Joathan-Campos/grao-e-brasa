"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Photo, photos } from "./Photo";
import { useReducedMotion, useReveal } from "./motion/MotionProvider";
import { canUse3D, useInView, useMediaQuery } from "@/lib/device";

const MiniBean = dynamic(() => import("./three/MiniBean"), { ssr: false });

const facts = [
  { title: "Torra às terças", text: "Lotes pequenos, de 5 kg, para o café nunca ficar parado na prateleira." },
  { title: "Grãos de quem planta", text: "Compramos de sítios da Mantiqueira e do Cerrado Mineiro, com nome e safra." },
  { title: "Moído na hora", text: "Cada xícara é moída na hora do preparo, do espresso à Chemex." },
];

export function Story() {
  const root = useRef<HTMLElement>(null);
  const beanBox = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const desktop = useMediaQuery("(min-width: 1024px)");
  const beanVisible = useInView(beanBox);
  const [gl, setGl] = useState(false);
  useEffect(() => setGl(canUse3D()), []);
  useReveal(root);

  // da noite para a manhã: o fundo clareia conforme a seção entra
  useGSAP(
    () => {
      if (reduced) return;
      // passa por tons quentes (brasa → aurora) em vez de um cinza neutro
      gsap.set(root.current, { backgroundColor: "#15100c", color: "#f3e9d8" });
      gsap.to(root.current, {
          keyframes: {
            backgroundColor: ["#15100c", "#3b2316", "#a8673f", "#e9cfae", "#f6f1e7"],
            color: ["#f3e9d8", "#f3e9d8", "#2b241e", "#2b241e", "#2b241e"],
          },
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 95%", end: "top 45%", scrub: true },
        },
      );
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <section id="historia" ref={root} className="relative bg-oat py-24 text-ink md:py-36" aria-labelledby="historia-titulo">
      <div className="wrap">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-5">
            <p data-reveal className="text-[14px] font-medium opacity-70">
              Nossa história
            </p>
            <h2
              id="historia-titulo"
              data-reveal
              className="font-display mt-4 text-[clamp(34px,4.6vw,58px)] leading-[1.04] tracking-[-0.03em]"
            >
              A torra acontece no fundo da loja.
            </h2>
            <p data-reveal className="mt-6 max-w-[46ch] text-[17px] leading-[1.7] opacity-85">
              A Grão &amp; Brasa nasceu de um torrador de 5 kg e de uma mesa comprida. Torramos devagar, provamos
              tudo no balcão e só servimos o que a gente beberia em casa. Se tiver o cheiro de torra no ar quando
              você chegar, é terça.
            </p>

            <ul className="mt-10 grid gap-6 sm:grid-cols-3 lg:grid-cols-1">
              {facts.map((f, i) => (
                <li key={f.title} data-reveal data-reveal-delay={i * 0.08} className="border-t border-current/15 pt-4">
                  <h3 className="font-display text-[21px] leading-tight">{f.title}</h3>
                  <p className="mt-1.5 text-[16px] leading-[1.6] opacity-75">{f.text}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative lg:col-span-6 lg:col-start-7">
            <div data-reveal className="photo-frame aspect-[4/5] w-full">
              <Photo photo={photos.roast} sizes="(min-width: 1024px) 588px, 100vw" />
            </div>
            <div
              data-reveal
              data-reveal-delay="0.15"
              className="photo-frame absolute -bottom-10 -left-6 hidden aspect-square w-[42%] border-[6px] border-oat shadow-[0_24px_48px_-24px_rgba(43,36,30,0.45)] sm:block lg:-left-20"
            >
              <Photo photo={photos.green} sizes="260px" />
            </div>
            {/* grão 3D sutil flutuando junto da foto */}
            <div ref={beanBox} aria-hidden="true" className="absolute -right-4 -top-12 h-36 w-36 md:h-44 md:w-44">
              {desktop && gl && <MiniBean active={beanVisible} still={reduced} />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
