"use client";

import { useEffect, useState } from "react";
import { formatBRL } from "@/data/menu";
import { BagIcon } from "../Icons";
import { useCart } from "./CartContext";

/** Barra fixa no celular quando há itens no pedido */
export function CartFab() {
  const { count, total, setOpen, open } = useCart();
  // só aparece depois do hero, para não cobrir os botões do topo
  const [pastHero, setPastHero] = useState(false);
  useEffect(() => {
    const check = () => {
      const h = document.getElementById("inicio")?.offsetHeight ?? 800;
      setPastHero(window.scrollY > h * 0.6);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);
  if (count === 0 || open || !pastHero) return null;
  return (
    <>
    {/* espaço no fim da página para a barra não cobrir o rodapé */}
    <div aria-hidden="true" className="h-20 bg-night md:hidden" />
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-oat/95 px-[var(--gut)] pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur md:hidden">
      <button type="button" onClick={() => setOpen(true)} className="btn btn--primary w-full justify-between">
        <span className="inline-flex items-center gap-2">
          <BagIcon /> Ver pedido · {count} {count === 1 ? "item" : "itens"}
        </span>
        <span className="tabular-nums">{formatBRL(total)}</span>
      </button>
    </div>
    </>
  );
}
