"use client";

import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { BagIcon, CloseIcon, MenuIcon } from "./Icons";
import { useCart } from "./cart/CartContext";

const links = [
  { href: "#cardapio", label: "Cardápio" },
  { href: "#historia", label: "História" },
  { href: "#ambiente", label: "Ambiente" },
  { href: "#visita", label: "Visita" },
];

export function Nav() {
  const { count, setOpen } = useCart();
  const [night, setNight] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // o topo acompanha a passagem da noite (hero) para a manhã (resto da página)
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const hero = document.getElementById("inicio");
      const navH = document.querySelector("header")?.offsetHeight ?? 72;
      setNight(window.scrollY < (hero?.offsetHeight ?? 800) - navH);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const tone = night && !menuOpen ? "night" : "day";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 h-[var(--nav-h)] border-b transition-colors duration-500 ${
        tone === "night"
          ? "on-night border-cream/10 bg-night/85 text-cream backdrop-blur-md"
          : "border-line bg-oat/92 text-ink backdrop-blur-md"
      }`}
    >
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <div className="wrap flex h-full items-center justify-between gap-6">
        <a href="#inicio" aria-label="Grão & Brasa, voltar ao início" className="inline-flex min-h-11 shrink-0 items-center">
          <Logo tone={tone === "night" ? "cream" : "ink"} />
        </a>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-8 text-[15px] font-medium">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="link-draw">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={`relative inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-full px-3 transition-colors ${
              tone === "night" ? "hover:bg-cream/10" : "hover:bg-ink/5"
            }`}
            aria-label={`Abrir pedido, ${count} ${count === 1 ? "item" : "itens"}`}
          >
            <BagIcon />
            <span className="hidden text-[15px] font-medium sm:inline">Pedido</span>
            {count > 0 && (
              <span
                className={`absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full px-1 text-[12px] font-medium leading-none sm:static sm:h-6 sm:min-w-6 ${
                  tone === "night" ? "bg-ember text-night" : "bg-terracotta text-white"
                }`}
                aria-hidden="true"
              >
                {count}
              </span>
            )}
          </button>
          <a
            href="#cardapio"
            className={`btn hidden lg:inline-flex ${tone === "night" ? "btn--ember" : "btn--primary"}`}
          >
            Montar pedido
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full md:hidden"
            aria-expanded={menuOpen}
            aria-controls="menu-celular"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          id="menu-celular"
          className="fixed inset-x-0 bottom-0 top-[var(--nav-h)] z-40 flex flex-col bg-oat px-[var(--gut)] pb-10 pt-6 md:hidden"
        >
          <nav aria-label="Menu do celular">
            <ul className="divide-y divide-line border-b border-line">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-display flex h-16 items-center text-[28px] text-ink"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto space-y-1 text-[16px] text-ink-soft">
            <p>Rua dos Pinheiros, Pinheiros · São Paulo</p>
            <p>Terça a sexta, 7h30 às 19h · Sábado e domingo, 8h às 18h</p>
          </div>
        </div>
      )}
    </header>
  );
}
