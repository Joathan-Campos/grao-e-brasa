"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { menu, type MenuItem } from "@/data/menu";

type Lines = Record<string, number>;

interface CartValue {
  lines: { item: MenuItem; qty: number }[];
  count: number;
  total: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  lastAdded: { id: string; at: number } | null;
}

const CartCtx = createContext<CartValue | null>(null);
const KEY = "grao-brasa:carrinho";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [raw, setRaw] = useState<Lines>({});
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [lastAdded, setLastAdded] = useState<CartValue["lastAdded"]>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Lines;
        const valid: Lines = {};
        for (const [id, q] of Object.entries(parsed)) {
          if (menu.some((m) => m.id === id) && Number.isInteger(q) && q > 0) valid[id] = Math.min(q, 20);
        }
        setRaw(valid);
      }
    } catch {
      /* armazenamento indisponível: segue com carrinho vazio */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(raw));
    } catch {
      /* ignora */
    }
  }, [raw, hydrated]);

  const add = useCallback((id: string) => {
    setRaw((r) => ({ ...r, [id]: Math.min((r[id] ?? 0) + 1, 20) }));
    setLastAdded({ id, at: Date.now() });
  }, []);
  const setQty = useCallback((id: string, qty: number) => {
    setRaw((r) => {
      const next = { ...r };
      if (qty <= 0) delete next[id];
      else next[id] = Math.min(qty, 20);
      return next;
    });
  }, []);
  const remove = useCallback((id: string) => setQty(id, 0), [setQty]);
  const clear = useCallback(() => setRaw({}), []);

  const value = useMemo<CartValue>(() => {
    const lines = Object.entries(raw)
      .map(([id, qty]) => ({ item: menu.find((m) => m.id === id)!, qty }))
      .filter((l) => l.item);
    return {
      lines,
      count: lines.reduce((s, l) => s + l.qty, 0),
      total: lines.reduce((s, l) => s + l.qty * l.item.price, 0),
      open,
      setOpen,
      add,
      setQty,
      remove,
      clear,
      lastAdded,
    };
  }, [raw, open, add, setQty, remove, clear, lastAdded]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const v = useContext(CartCtx);
  if (!v) throw new Error("useCart fora do CartProvider");
  return v;
}
