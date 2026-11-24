/* Fotos provisórias (Wikimedia Commons / Unsplash). Trocar pelas fotos reais da cafeteria.
   Créditos completos em public/img/credits.json e no rodapé. */

export interface PhotoInfo {
  id: string;
  alt: string;
  w: number;
  h: number;
  widths: number[]; // larguras disponíveis (a maior não tem sufixo)
  focus?: string;
}

export const photos = {
  espresso: { id: "m61713028", alt: "Espresso escorrendo do porta-filtro para a xícara", w: 1280, h: 853, widths: [500, 960, 1280], focus: "60% 50%" },
  latte: { id: "m61713362", alt: "Leite sendo despejado num latte, formando desenho na espuma", w: 1280, h: 853, widths: [500, 960, 1280], focus: "50% 55%" },
  pitcher: { id: "m201752739", alt: "Mão segurando a leiteira vermelha ao lado da máquina de espresso", w: 960, h: 1438, widths: [500, 960], focus: "40% 55%" },
  pour: { id: "m61714648", alt: "Espresso servido de uma pequena jarra sobre o balcão de madeira", w: 500, h: 750, widths: [500], focus: "60% 70%" },
  drip: { id: "m61713103", alt: "Café coado pingando na jarra de vidro sobre a balança, chaleiras ao fundo", w: 1280, h: 853, widths: [500, 960, 1280], focus: "58% 45%" },
  tray: { id: "m189498721", alt: "Bandeja com quatro cafés levada ao longo do balcão", w: 1280, h: 853, widths: [500, 960, 1280], focus: "45% 60%" },
  cooling: { id: "m61712989", alt: "Grãos recém-torrados girando no resfriador do torrador", w: 1280, h: 853, widths: [500, 960, 1280], focus: "30% 50%" },
  green: { id: "m62054123", alt: "Mão escolhendo grãos de café verde num cesto", w: 960, h: 640, widths: [500, 960], focus: "25% 35%" },
  terrace: { id: "m61715560", alt: "Xícara de café preto numa mesa de madeira na calçada", w: 1280, h: 848, widths: [500, 960, 1280], focus: "70% 60%" },
  roast: { id: "m147143963", alt: "Grãos torrados caindo do tambor no resfriador, com vapor subindo", w: 1280, h: 903, widths: [500, 960, 1280], focus: "40% 50%" },
} satisfies Record<string, PhotoInfo>;

function file(p: PhotoInfo, width: number, ext: "webp" | "jpg") {
  const max = p.widths[p.widths.length - 1];
  const suffix = width === max && max > 960 ? "" : `-${width}`;
  return `/img/photo-${p.id}${suffix}.${ext}`;
}

export function Photo({
  photo,
  sizes,
  className = "",
  priority = false,
}: {
  photo: PhotoInfo;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  const srcset = (ext: "webp" | "jpg") => photo.widths.map((w) => `${file(photo, w, ext)} ${w}w`).join(", ");
  const fallback = file(photo, photo.widths[Math.min(1, photo.widths.length - 1)], "jpg");
  return (
    <picture>
      <source type="image/webp" srcSet={srcset("webp")} sizes={sizes} />
      <img
        src={fallback}
        srcSet={srcset("jpg")}
        sizes={sizes}
        width={photo.w}
        height={photo.h}
        alt={photo.alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={`h-full w-full object-cover ${className}`}
        style={{ objectPosition: photo.focus }}
      />
    </picture>
  );
}
