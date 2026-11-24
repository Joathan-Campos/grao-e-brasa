"use client";

import { useRef } from "react";
import credits from "../../public/img/credits.json";
import { Logo } from "./Logo";
import { photos } from "./Photo";
import { LoopVideo } from "./LoopVideo";

// créditos só das fotos que aparecem na página
const usedIds = new Set(Object.values(photos).map((p) => p.id));
usedIds.delete(photos.drip.id);
const usedCredits = credits.photos.filter((c) => usedIds.has(c.id));
import { ArrowRight } from "./Icons";
import { hours, MAP_URL } from "./Visit";
import { useReveal } from "./motion/MotionProvider";

export function Footer() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  const year = new Date().getFullYear();

  return (
    <footer ref={root} className="on-night bg-night text-cream">
      <div className="wrap grid gap-10 py-20 md:py-28 lg:grid-cols-12 lg:items-center lg:gap-6">
        <div className="lg:col-span-6">
          <h2 data-reveal className="font-display text-[clamp(36px,5vw,64px)] leading-[1.02] tracking-[-0.03em]">
            O próximo café sai em três minutos.
          </h2>
          <p data-reveal className="mt-5 max-w-[42ch] text-[17px] leading-[1.6] text-cream/75">
            Escolha no cardápio, diga a hora e retire no balcão sem fila. De terça a domingo, a partir das 7h30.
          </p>
          <div data-reveal className="mt-8">
            <a href="#cardapio" className="btn btn--ember">
              Montar pedido <ArrowRight />
            </a>
          </div>
        </div>
        <div data-reveal className="lg:col-span-6 lg:col-start-7">
          <LoopVideo className="aspect-video w-full" />
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="wrap grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo tone="cream" />
            <p className="mt-4 max-w-[34ch] text-[15px] leading-[1.6] text-cream/65">
              Café de especialidade com torra própria em Pinheiros, São Paulo.
            </p>
          </div>
          <div className="lg:col-span-2">
            <h3 className="text-[14px] font-medium text-cream/60">Navegue</h3>
            <ul className="mt-2 text-[15px]">
              {[
                ["#cardapio", "Cardápio"],
                ["#historia", "História"],
                ["#ambiente", "Ambiente"],
                ["#visita", "Visita"],
              ].map(([h, l]) => (
                <li key={h}>
                  <a href={h} className="inline-flex min-h-11 items-center">
                    <span className="link-draw">{l}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-3">
            <h3 className="text-[14px] font-medium text-cream/60">Endereço</h3>
            <p className="mt-3 text-[15px] leading-[1.6]">
              <a href={MAP_URL} target="_blank" rel="noopener noreferrer" className="link-draw">
                Rua dos Pinheiros, Pinheiros
                <br />
                São Paulo
              </a>
            </p>
          </div>
          <div className="lg:col-span-3">
            <h3 className="text-[14px] font-medium text-cream/60">Horários</h3>
            <dl className="mt-3 space-y-1 text-[15px]">
              {hours.map((h) => (
                <div key={h.label} className="flex justify-between gap-4">
                  <dt className="text-cream/75">{h.label}</dt>
                  <dd className="tabular-nums">{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="wrap flex flex-col gap-3 py-6 text-[13px] text-cream/60 md:flex-row md:items-start md:justify-between">
          <p>© {year} Grão &amp; Brasa</p>
          <details className="md:max-w-[60%] md:text-right">
            <summary className="inline-flex min-h-11 cursor-pointer list-none items-center hover:text-cream">Fotos via Wikimedia Commons e Unsplash · grão 3D via Sketchfab · créditos</summary>
            <ul className="mt-3 space-y-1 text-left">
              {usedCredits.map((c) => (
                <li key={c.id}>
                  <a href={c.page} target="_blank" rel="noopener noreferrer" className="link-draw">
                    {c.by}
                  </a>
                  , {c.licence}
                </li>
              ))}
              <li>
                Grão 3D:{" "}
                <a
                  href="https://sketchfab.com/3d-models/coffee-beans-8146e99925fb4b49839e4fa7ace83f0f"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-draw"
                >
                  &ldquo;Coffee beans&rdquo; por kouitimizuno
                </a>
                , CC BY 4.0
              </li>
            </ul>
          </details>
        </div>
      </div>
    </footer>
  );
}
