"use client";

import { useEffect, useRef, useState } from "react";
import { Photo, photos, type PhotoInfo } from "./Photo";
import { ArrowRight, CloseIcon } from "./Icons";
import { setScrollLocked, useReveal } from "./motion/MotionProvider";
import { useTilt } from "@/lib/useTilt";

const items: { photo: PhotoInfo; place: string; sizes: string }[] = [
  { photo: photos.espresso, place: "col-span-2 lg:col-[1/8] lg:row-[1/3] aspect-[16/10] lg:aspect-auto", sizes: "(min-width:1024px) 690px, 100vw" },
  { photo: photos.pitcher, place: "lg:col-[8/13] lg:row-[1/4] aspect-[3/4] lg:aspect-auto", sizes: "(min-width:1024px) 490px, 50vw" },
  { photo: photos.latte, place: "lg:col-[1/5] lg:row-[3/5] aspect-[3/4] lg:aspect-auto", sizes: "(min-width:1024px) 390px, 50vw" },
  { photo: photos.pour, place: "lg:col-[5/8] lg:row-[3/5] aspect-[3/4] lg:aspect-auto", sizes: "(min-width:1024px) 290px, 50vw" },
  { photo: photos.tray, place: "lg:col-[8/13] lg:row-[4/6] aspect-[3/4] lg:aspect-auto", sizes: "(min-width:1024px) 490px, 50vw" },
  { photo: photos.cooling, place: "col-span-2 lg:col-[1/8] lg:row-[5/6] aspect-[16/9] lg:aspect-auto", sizes: "(min-width:1024px) 690px, 100vw" },
];

function Tile({ item, index, onOpen }: { item: (typeof items)[number]; index: number; onOpen: (i: number) => void }) {
  const tilt = useTilt(3);
  return (
    <li data-reveal data-reveal-delay={(index % 3) * 0.08} className={`${item.place} min-h-0`}>
      <button
        type="button"
        {...tilt}
        onClick={() => onOpen(index)}
        className="tilt photo-frame group block h-full w-full cursor-zoom-in"
        aria-label={`Ampliar foto: ${item.photo.alt}`}
      >
        <Photo photo={item.photo} sizes={item.sizes} />
      </button>
    </li>
  );
}

export function Gallery() {
  const root = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [current, setCurrent] = useState<number | null>(null);
  useReveal(root);

  const open = (i: number) => {
    opener.current = document.activeElement as HTMLElement;
    setCurrent(i);
    setScrollLocked(true);
    dialog.current?.showModal();
  };
  const close = () => dialog.current?.close();
  const step = (d: number) => setCurrent((c) => (c === null ? c : (c + d + items.length) % items.length));

  useEffect(() => {
    const dlg = dialog.current;
    if (!dlg) return;
    const onClose = () => {
      setScrollLocked(false);
      setCurrent(null);
      opener.current?.focus();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    dlg.addEventListener("close", onClose);
    dlg.addEventListener("keydown", onKey);
    return () => {
      dlg.removeEventListener("close", onClose);
      dlg.removeEventListener("keydown", onKey);
    };
  }, []);

  const shown = current !== null ? items[current].photo : null;

  return (
    <section id="ambiente" ref={root} className="bg-oat py-24 md:py-32" aria-labelledby="ambiente-titulo">
      <div className="wrap">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p data-reveal className="text-[14px] font-medium text-ink-soft">
              Ambiente
            </p>
            <h2
              id="ambiente-titulo"
              data-reveal
              className="font-display mt-4 text-[clamp(34px,4.6vw,58px)] leading-[1.04] tracking-[-0.03em]"
            >
              O balcão, de perto.
            </h2>
          </div>
          <p data-reveal className="max-w-[40ch] text-[17px] leading-[1.6] text-ink-soft">
            Uma mesa comprida, oito lugares no balcão e a calçada para quando o dia está bonito.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-12 lg:auto-rows-[176px]">
          {items.map((it, i) => (
            <Tile key={it.photo.id} item={it} index={i} onOpen={open} />
          ))}
        </ul>
      </div>

      <dialog
        ref={dialog}
        aria-label="Foto ampliada"
        className="m-auto max-h-[92svh] w-[min(1100px,94vw)] bg-transparent p-0 backdrop:bg-night/85 backdrop:backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
      >
        {shown && (
          <div className="relative">
            <img
              src={`/img/photo-${shown.id}${shown.widths[shown.widths.length - 1] > 960 ? "" : "-" + shown.widths[shown.widths.length - 1]}.webp`}
              alt={shown.alt}
              className="max-h-[82svh] w-full object-contain"
            />
            <div className="mt-3 flex items-center justify-between gap-3 text-cream">
              <p className="text-[15px] text-cream/80" aria-live="polite">
                {current! + 1} de {items.length}
              </p>
              <div className="flex gap-2">
                <button type="button" onClick={() => step(-1)} className="grid h-11 w-11 place-items-center rounded-full border border-cream/30 hover:border-cream" aria-label="Foto anterior">
                  <ArrowRight className="h-4 w-4 rotate-180" />
                </button>
                <button type="button" onClick={() => step(1)} className="grid h-11 w-11 place-items-center rounded-full border border-cream/30 hover:border-cream" aria-label="Próxima foto">
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button type="button" onClick={close} className="grid h-11 w-11 place-items-center rounded-full bg-cream text-night" aria-label="Fechar foto" autoFocus>
                  <CloseIcon />
                </button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
