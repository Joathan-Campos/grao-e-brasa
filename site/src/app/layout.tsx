import type { Metadata, Viewport } from "next";
import { Fraunces, Figtree } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  // trocar pelo domínio definitivo quando existir
  metadataBase: new URL("https://graoebrasa.example"),
  title: "Grão & Brasa: café de especialidade em Pinheiros, São Paulo",
  description:
    "Cafeteria com grãos torrados na casa, espressos, coados e pedidos para retirar. De terça a domingo na Rua dos Pinheiros.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Grão & Brasa · Café de especialidade em Pinheiros",
    description: "Espressos, coados e torra própria. Monte seu pedido e retire no balcão.",
    type: "website",
    locale: "pt_BR",
    images: ["/share.jpg"],
  },
  twitter: { card: "summary_large_image" },
  // canonical: adicionar quando o domínio definitivo existir
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#15100c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${figtree.variable} antialiased`}>
      <head>
        {/* Marca o documento antes da pintura para que as entradas animadas não pisquem.
            Sem JS ou com movimento reduzido, nada fica escondido. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('js-motion');setTimeout(function(){if(!window.__motionReady)document.documentElement.classList.remove('js-motion')},4000)}",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
