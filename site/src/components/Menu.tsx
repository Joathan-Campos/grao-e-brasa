"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { categories, formatBRL, menu, type CategoryId, type MenuItem } from "@/data/menu";
import { useCart } from "./cart/CartContext";
import { PlusIcon, CheckIcon } from "./Icons";
import { useReducedMotion, useReveal } from "./motion/MotionProvider";
import { useTilt } from "@/lib/useTilt";

type Filter = "todos" | CategoryId;

function Card({ item }: { item: MenuItem }) {
  const { add } = useCart();
  const tilt = useTilt(4);
  const [justAdded, setJustAdded] = useState(false);
  const timer = useRef<number>(0);
  const onAdd = () => {
    add(item.id);
    setJustAdded(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setJustAdded(false), 1400);
  };
  return (
    <li
      {...tilt}
      data-menu-card
      className="tilt group flex flex-col border border-line bg-oat p-6 hover:shadow-[0_24px_40px_-28px_rgba(43,36,30,0.45)]"
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-display text-[22px] leading-tight">{item.name}</h3>
        <p className="shrink-0 pt-1 text-[16px] font-medium tabular-nums">{formatBRL(item.price)}</p>
      </div>
      <p className="mt-2 text-[16px] leading-[1.6] text-ink-soft">{item.description}</p>
      {item.notes && <p className="mt-2 text-[14px] text-ink-soft">Notas: {item.notes}</p>}
      <div className="mt-auto flex items-end justify-between gap-3 pt-5">
        <ul className="flex flex-wrap gap-1.5" aria-label="Selos">
          {item.badges?.map((b) => (
            <li
              key={b}
              className={`rounded-full px-2.5 py-1 text-[13px] font-medium leading-none ${
                b === "da casa" ? "bg-terracotta/10 text-terracotta-dark" : "bg-ink/6 text-ink-soft"
              }`}
            >
              {b}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={onAdd}
          className={`inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full border px-4 text-[15px] font-medium transition-[background-color,color,border-color,transform] duration-300 active:scale-95 ${
            justAdded
              ? "border-terracotta bg-terracotta text-white"
              : "border-ink/25 hover:border-ink hover:bg-ink hover:text-oat"
          }`}
          aria-label={`Adicionar ${item.name} ao pedido`}
        >
          {justAdded ? <CheckIcon className="h-4 w-4" /> : <PlusIcon />}
          {justAdded ? "Adicionado" : "Adicionar"}
        </button>
      </div>
    </li>
  );
}

export function Menu() {
  const root = useRef<HTMLElement>(null);
  const grid = useRef<HTMLUListElement>(null);
  const [filter, setFilter] = useState<Filter>("espressos");
  const reduced = useReducedMotion();
  useReveal(root);

  const items = filter === "todos" ? menu : menu.filter((m) => m.category === filter);
  const tabs: { id: Filter; label: string; count: number }[] = [
    ...categories.map((c) => ({ id: c.id, label: c.label, count: menu.filter((m) => m.category === c.id).length })),
    { id: "todos", label: "Ver tudo", count: menu.length },
  ];

  const choose = (f: Filter) => {
    if (f === filter) return;
    setFilter(f);
    if (!reduced) {
      requestAnimationFrame(() => {
        const cards = grid.current?.querySelectorAll("[data-menu-card]");
        if (cards?.length)
          gsap.fromTo(cards, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.04, ease: "power2.out" });
      });
    }
  };

  return (
    <section id="cardapio" ref={root} className="bg-oat-2/60 py-24 md:py-32" aria-labelledby="cardapio-titulo">
      <div className="wrap">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p data-reveal className="text-[14px] font-medium text-ink-soft">
              Cardápio
            </p>
            <h2
              id="cardapio-titulo"
              data-reveal
              className="font-display mt-4 text-[clamp(34px,4.6vw,58px)] leading-[1.04] tracking-[-0.03em]"
            >
              Do espresso ao bolo de fubá.
            </h2>
          </div>
          <p data-reveal className="max-w-[40ch] text-[17px] leading-[1.6] text-ink-soft">
            Monte seu pedido aqui e retire no balcão no horário que escolher. Preços em reais.
          </p>
        </div>

        <div data-reveal className="mt-10" role="group" aria-label="Filtrar cardápio por categoria">
          <ul className="flex flex-wrap gap-2">
            {tabs.map((t) => {
              const on = filter === t.id;
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => choose(t.id)}
                    className={`inline-flex h-11 items-center gap-2 rounded-full border px-4 text-[15px] font-medium transition-colors duration-300 ${
                      on ? "border-ink bg-ink text-oat" : "border-ink/20 text-ink hover:border-ink"
                    }`}
                  >
                    {t.label}
                    <span className={`text-[13px] tabular-nums ${on ? "text-oat/70" : "text-ink-soft"}`}>{t.count}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="sr-only" aria-live="polite">
          {items.length} itens em {filter === "todos" ? "todas as categorias" : tabs.find((t) => t.id === filter)?.label}
        </p>

        <ul ref={grid} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {items.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
}
