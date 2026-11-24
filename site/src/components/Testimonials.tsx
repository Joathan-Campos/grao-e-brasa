"use client";

import { useRef } from "react";
import { useReveal } from "./motion/MotionProvider";
import { useTilt } from "@/lib/useTilt";

/* DEPOIMENTOS PROVISÓRIOS — textos de exemplo para o layout.
   Substituir por avaliações reais de clientes (com autorização) antes de publicar. */
const quotes = [
  {
    text: "Pedi o coado na V60 sem saber o que esperar e saí com um pacote do grão da semana. A moça do balcão explicou cada nota sem pressa.",
    name: "Marina",
    from: "visitante de Curitiba",
  },
  {
    text: "Virou meu escritório das quintas. Tomada em todas as mesas, pão de queijo saindo de hora em hora e ninguém te olha torto por ficar.",
    name: "Rafael",
    from: "mora em Pinheiros",
  },
  {
    text: "O espresso tônica no fim da tarde, na mesinha da calçada, é a melhor coisa da Rua dos Pinheiros.",
    name: "Lúcia",
    from: "visitante de Lisboa",
  },
];

function QuoteCard({ q, i }: { q: (typeof quotes)[number]; i: number }) {
  const tilt = useTilt(4);
  return (
    <li
      data-reveal
      data-reveal-delay={i * 0.1}
      {...tilt}
      className="tilt flex flex-col bg-night-2 p-8 text-cream md:p-10"
    >
      <svg viewBox="0 0 32 24" className="h-6 w-8 text-ember" aria-hidden="true">
        <path
          fill="currentColor"
          d="M0 24V14.4C0 6.1 4.1 1.3 12.2 0l1.3 3.4C9 4.6 6.9 7.3 6.6 11.2H12V24H0Zm18 0V14.4C18 6.1 22.1 1.3 30.2 0l1.3 3.4C27 4.6 24.9 7.3 24.6 11.2H30V24H18Z"
        />
      </svg>
      <blockquote className="font-display mt-6 text-[21px] leading-[1.45] md:text-[23px]">
        <p>{q.text}</p>
      </blockquote>
      <p className="mt-auto pt-8 text-[15px] text-cream/70">
        <span className="font-medium text-cream">{q.name}</span>, <i>{q.from}</i>
      </p>
    </li>
  );
}

export function Testimonials() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  return (
    <section id="depoimentos" ref={root} className="on-night bg-night py-24 text-cream md:py-32" aria-labelledby="depoimentos-titulo">
      <div className="wrap">
        <p data-reveal className="text-[14px] font-medium text-cream/70">
          Depoimentos
        </p>
        <h2
          id="depoimentos-titulo"
          data-reveal
          className="font-display mt-4 max-w-[18ch] text-[clamp(34px,4.6vw,58px)] leading-[1.04] tracking-[-0.03em]"
        >
          O que dizem as mesas.
        </h2>
        <ul className="mt-12 grid gap-4 lg:grid-cols-3 lg:gap-5">
          {quotes.map((q, i) => (
            <QuoteCard key={q.name} q={q} i={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
