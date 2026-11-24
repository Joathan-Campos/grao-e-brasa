"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { formatBRL } from "@/data/menu";
import { useCart } from "./CartContext";
import { CheckIcon, CloseIcon, MinusIcon, PlusIcon } from "../Icons";
import { scrollToTarget, setScrollLocked, useReducedMotion } from "../motion/MotionProvider";

type Errors = { name?: string; time?: string };
interface Receipt {
  code: string;
  name: string;
  time: string;
  total: number;
  lines: { name: string; qty: number }[];
}

function slots() {
  const out: string[] = [];
  for (let m = 8 * 60; m <= 18 * 60 + 30; m += 15) {
    out.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
  }
  return out;
}

export function CartDrawer() {
  const { lines, count, total, open, setOpen, setQty, remove, clear } = useCart();
  const reduced = useReducedMotion();
  const dlg = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLSelectElement>(null);
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState("");
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const times = useMemo(() => slots(), []);

  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    setScrollLocked(open);
    if (open && !d.open) {
      d.showModal();
      if (!reduced && panel.current)
        gsap.fromTo(panel.current, { xPercent: 100 }, { xPercent: 0, duration: 0.55, ease: "power3.out" });
    } else if (!open && d.open) {
      d.close();
    }
  }, [open, reduced]);

  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    const onClose = () => setOpen(false);
    d.addEventListener("close", onClose);
    return () => d.removeEventListener("close", onClose);
  }, [setOpen]);

  const close = () => {
    if (!reduced && panel.current) {
      gsap.to(panel.current, { xPercent: 100, duration: 0.35, ease: "power2.in", onComplete: () => setOpen(false) });
    } else setOpen(false);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Errors = {};
    if (name.trim().length < 2) errs.name = "Escreva seu nome para chamarmos no balcão.";
    if (!times.includes(time)) errs.time = "Escolha o horário em que vai retirar o pedido.";
    setErrors(errs);
    const n = Object.keys(errs).length;
    if (n) {
      setStatus(n === 1 ? "1 campo precisa de atenção." : `${n} campos precisam de atenção.`);
      (errs.name ? nameRef : timeRef).current?.focus();
      return;
    }
    setStatus("");
    const code = "GB-" + Math.floor(1000 + Math.random() * 9000);
    setReceipt({
      code,
      name: name.trim(),
      time,
      total,
      lines: lines.map((l) => ({ name: l.item.name, qty: l.qty })),
    });
    clear();
    setName("");
    setTime("");
    setNote("");
  };

  const backToMenu = () => {
    setReceipt(null);
    setOpen(false);
    setTimeout(() => scrollToTarget("#cardapio"), 50);
  };

  return (
    <dialog
      ref={dlg}
      aria-labelledby="pedido-titulo"
      className="m-0 ml-auto h-[100dvh] max-h-none w-full max-w-[460px] overflow-hidden bg-transparent p-0 backdrop:bg-night/55 backdrop:backdrop-blur-[2px]"
      onClick={(e) => {
        if (e.target === dlg.current) close();
      }}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
    >
      <div ref={panel} className="flex h-full flex-col bg-oat text-ink shadow-2xl">
        <div className="flex h-[var(--nav-h)] shrink-0 items-center justify-between border-b border-line px-6">
          <h2 id="pedido-titulo" className="font-display text-[24px]">
            {receipt ? "Pedido recebido!" : "Seu pedido"}
          </h2>
          <button type="button" onClick={close} className="grid h-11 w-11 place-items-center rounded-full hover:bg-ink/5" aria-label="Fechar pedido">
            <CloseIcon />
          </button>
        </div>

        {receipt ? (
          <div className="thin-scroll flex-1 overflow-y-auto px-6 py-8" role="status">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-terracotta text-white">
              <CheckIcon />
            </div>
            <p className="font-display mt-6 text-[28px] leading-tight">
              Obrigado, {receipt.name}. Seu pedido {receipt.code} fica pronto às {receipt.time}.
            </p>
            <p className="mt-3 text-[16px] text-ink-soft">Pagamento no balcão, na retirada.</p>
            <ul className="mt-8 divide-y divide-line border-y border-line text-[16px]">
              {receipt.lines.map((l) => (
                <li key={l.name} className="flex justify-between py-3">
                  <span>{l.name}</span>
                  <span className="tabular-nums text-ink-soft">× {l.qty}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 flex justify-between text-[17px] font-medium">
              <span>Total</span>
              <span className="tabular-nums">{formatBRL(receipt.total)}</span>
            </p>
            <p className="mt-8 rounded-sm bg-oat-2 p-4 text-[14px] leading-[1.6] text-ink-soft">
              Versão de demonstração: nenhum pedido foi enviado à cafeteria.
            </p>
            <button type="button" onClick={backToMenu} className="btn btn--secondary mt-8 w-full">
              Voltar ao cardápio
            </button>
          </div>
        ) : count === 0 ? (
          <div className="flex flex-1 flex-col items-start justify-center px-6">
            <p className="font-display text-[26px] leading-tight">Seu pedido está vazio.</p>
            <p className="mt-2 text-[16px] text-ink-soft">Escolha um café ou algo para comer no cardápio.</p>
            <button type="button" onClick={backToMenu} className="btn btn--primary mt-6">
              Ver o cardápio
            </button>
          </div>
        ) : (
          <form noValidate onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
            <div className="thin-scroll flex-1 overflow-y-auto px-6 py-6">
              <ul className="divide-y divide-line">
                {lines.map(({ item, qty }) => (
                  <li key={item.id} className="flex items-center gap-4 py-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-[14px] tabular-nums text-ink-soft">{formatBRL(item.price)} cada</p>
                      <button type="button" onClick={() => remove(item.id)} className="link-draw mt-1 text-[14px] text-terracotta">
                        Remover
                      </button>
                    </div>
                    <div className="flex items-center rounded-full border border-line">
                      <button type="button" onClick={() => setQty(item.id, qty - 1)} className="grid h-11 w-11 place-items-center rounded-full hover:bg-ink/5" aria-label={`Diminuir ${item.name}`}>
                        <MinusIcon />
                      </button>
                      <span className="w-6 text-center tabular-nums" aria-live="polite" aria-label={`${qty} unidades`}>
                        {qty}
                      </span>
                      <button type="button" onClick={() => setQty(item.id, qty + 1)} className="grid h-11 w-11 place-items-center rounded-full hover:bg-ink/5" aria-label={`Aumentar ${item.name}`}>
                        <PlusIcon />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <fieldset className="mt-6 space-y-5 border-t border-line pt-6">
                <legend className="sr-only">Dados para retirada</legend>
                <div>
                  <label htmlFor="pedido-nome" className="text-[14px] font-medium">
                    Nome para chamar no balcão
                  </label>
                  <input
                    ref={nameRef}
                    id="pedido-nome"
                    autoComplete="given-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "erro-nome" : undefined}
                    className="mt-1.5 h-12 w-full border border-ink/25 bg-white/60 px-3 text-[16px] outline-none focus:border-ink aria-[invalid=true]:border-terracotta"
                  />
                  {errors.name && (
                    <p id="erro-nome" className="mt-1.5 text-[14px] text-terracotta-dark">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="pedido-hora" className="text-[14px] font-medium">
                    Horário de retirada (hoje)
                  </label>
                  <select
                    ref={timeRef}
                    id="pedido-hora"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    aria-invalid={!!errors.time}
                    aria-describedby={errors.time ? "erro-hora" : undefined}
                    className="mt-1.5 h-12 w-full border border-ink/25 bg-white/60 px-3 text-[16px] outline-none focus:border-ink aria-[invalid=true]:border-terracotta"
                  >
                    <option value="">Escolha um horário</option>
                    {times.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  {errors.time && (
                    <p id="erro-hora" className="mt-1.5 text-[14px] text-terracotta-dark">
                      {errors.time}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="pedido-obs" className="text-[14px] font-medium">
                    Observação (opcional)
                  </label>
                  <textarea
                    id="pedido-obs"
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="mt-1.5 w-full border border-ink/25 bg-white/60 px-3 py-2.5 text-[16px] outline-none focus:border-ink"
                  />
                </div>
              </fieldset>
            </div>

            <div className="shrink-0 border-t border-line bg-oat px-6 py-5 pb-[max(20px,env(safe-area-inset-bottom))]">
              <p className="flex justify-between text-[17px] font-medium">
                <span>Total</span>
                <span className="tabular-nums" data-testid="total">
                  {formatBRL(total)}
                </span>
              </p>
              <button type="submit" className="btn btn--primary mt-4 w-full">
                Enviar pedido
              </button>
              <p role="status" className="mt-2 min-h-5 text-[14px] text-terracotta-dark">
                {status}
              </p>
              <p className="text-[13px] text-ink-soft">Pagamento na retirada. Versão de demonstração.</p>
            </div>
          </form>
        )}
      </div>
    </dialog>
  );
}
