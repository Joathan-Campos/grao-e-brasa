# Grão & Brasa: site

Next.js (export estático) + Tailwind 4 + React Three Fiber + GSAP/ScrollTrigger + Lenis.

## Rodar

```bash
npm install
npm run dev          # desenvolvimento em http://localhost:3000
npm run build        # gera a pasta out/ (site estático)
npx serve out -l 4173  # pré-visualiza o build em http://localhost:4173
```

Para publicar, envie a pasta `out/` para qualquer hospedagem estática (Vercel, Netlify, Cloudflare Pages).

## Onde mudar o conteúdo

| O quê | Arquivo |
|---|---|
| Cardápio e preços | `src/data/menu.ts` |
| Endereço, horários, mapa, e-mail | `src/components/Visit.tsx` (e o rodapé em `Footer.tsx`) |
| Depoimentos (provisórios) | `src/components/Testimonials.tsx` |
| Fotos (provisórias) | `public/img/` + lista em `src/components/Photo.tsx` (`node scripts/towebp.mjs` gera os .webp) |
| Vídeo do fechamento | `public/video/` (projeto HyperFrames em `../video/hero-loop`) |
| Domínio / SEO | `src/app/layout.tsx` (`metadataBase`, título, descrição) |

## Notas

- O grão 3D cai para uma versão estática (SVG) sem WebGL, em aparelhos fracos, com economia de dados
  ou abaixo de ~24 fps sustentados.
- Com "reduzir movimento" ativo, não há rolagem suave, entradas animadas nem vídeo tocando.
- O pedido para retirada é uma **demonstração**: nada é enviado. Para pedidos reais, integrar WhatsApp
  ou um meio de pagamento em `src/components/cart/CartDrawer.tsx` (função `submit`).
