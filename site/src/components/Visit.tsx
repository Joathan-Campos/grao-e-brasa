"use client";

import { useEffect, useRef, useState } from "react";
import { Photo, photos } from "./Photo";
import { ArrowRight } from "./Icons";
import { useReveal } from "./motion/MotionProvider";

/* Endereço e horários provisórios (fictícios) — trocar pelos reais. */
export const MAP_URL = "https://www.openstreetmap.org/search?query=Rua%20dos%20Pinheiros%2C%20Pinheiros%2C%20S%C3%A3o%20Paulo";

export const hours = [
  { label: "Segunda", days: [1], time: "Fechado" },
  { label: "Terça a sexta", days: [2, 3, 4, 5], time: "7h30 às 19h" },
  { label: "Sábado e domingo", days: [6, 0], time: "8h às 18h" },
];

function useTodaySP() {
  const [day, setDay] = useState<number | null>(null);
  useEffect(() => {
    const wd = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "America/Sao_Paulo" }).format(new Date());
    setDay(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(wd));
  }, []);
  return day;
}

export function Visit() {
  const root = useRef<HTMLElement>(null);
  const today = useTodaySP();
  useReveal(root);

  return (
    <section id="visita" ref={root} className="bg-oat py-24 md:py-32" aria-labelledby="visita-titulo">
      <div className="wrap">
        <p data-reveal className="text-[14px] font-medium text-ink-soft">
          Visita
        </p>
        <h2 id="visita-titulo" data-reveal className="font-display mt-4 text-[clamp(28px,3vw,36px)] leading-tight">
          Endereço e horários
        </h2>
        <p data-reveal className="font-display mt-6 text-[clamp(44px,8vw,112px)] leading-[0.98] tracking-[-0.04em]">
          <a href={MAP_URL} target="_blank" rel="noopener noreferrer" className="link-draw [background-size:0%_3px] hover:[background-size:100%_3px]">
            Rua dos Pinheiros,
            <br />
            <span className="text-terracotta">Pinheiros</span>
          </a>
        </p>

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-6">
          <div data-reveal className="bg-oat-2 p-8 md:p-12 lg:col-span-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-1 lg:gap-8">
              <div>
                <h3 className="text-[14px] font-medium text-ink-soft">Onde fica</h3>
                <p className="mt-3 text-[19px] leading-[1.5]">
                  Rua dos Pinheiros
                  <br />
                  Pinheiros, São Paulo
                </p>
                <p className="mt-3 text-[16px] leading-[1.6] text-ink-soft">
                  Perto da estação Fradique Coutinho (linha 4-amarela). Bicicletário na calçada.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-medium text-ink-soft">Horários</h3>
                <dl className="mt-3 divide-y divide-line text-[16px]">
                  {hours.map((h) => {
                    const isToday = today !== null && h.days.includes(today);
                    return (
                      <div key={h.label} className={`flex justify-between gap-4 py-2.5 ${isToday ? "font-medium" : ""}`}>
                        <dt>
                          {h.label}
                          {isToday && <span className="ml-2 text-[13px] text-terracotta">hoje</span>}
                        </dt>
                        <dd className="whitespace-nowrap tabular-nums text-right">{h.time}</dd>
                      </div>
                    );
                  })}
                </dl>
              </div>
            </div>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a href={MAP_URL} target="_blank" rel="noopener noreferrer" className="btn btn--primary">
                Abrir no mapa <ArrowRight />
              </a>
              <a href="mailto:ola@graoebrasa.example?subject=Contato%20pelo%20site" className="btn btn--secondary">
                Enviar e-mail
              </a>
            </div>
          </div>
          <div data-reveal data-reveal-delay="0.1" className="photo-frame aspect-[4/3] lg:col-span-6 lg:aspect-auto">
            <Photo photo={photos.terrace} sizes="(min-width:1024px) 588px, 100vw" />
          </div>
        </div>
      </div>
    </section>
  );
}
