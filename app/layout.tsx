import type { Metadata } from "next";
import "./globals.css";
import ScrollReveal from "@/components/ScrollReveal";
import { CartProvider } from "@/contexts/CartContext";
import { GTMScript, GTMNoScript } from "@/components/analytics/GTM";
import { MetaPixel } from "@/components/analytics/MetaPixel";
import { GoogleAds } from "@/components/analytics/GoogleAds";

export const metadata: Metadata = {
  title: 'Tá Pra Pesca — Kits completos de pesca',
  description: 'Equipamentos de pesca com procedência. Kits montados com produtos compatíveis e frete grátis em todo o Brasil.',
  keywords: [
    "kit pesca",
    "kit pesca água doce",
    "vara molinete kit",
    "kit pesqueiro",
    "kit pesca tilápia",
    "pesca rio",
    "CMIK",
    "Enjoylure",
  ],
  metadataBase: new URL('https://taprapesca.com.br'),
  openGraph: {
    title: 'Tá Pra Pesca — Kits completos de pesca',
    description: 'Equipamentos de pesca com procedência. Kits montados com produtos compatíveis e frete grátis em todo o Brasil.',
    url: 'https://taprapesca.com.br',
    siteName: 'Tá Pra Pesca',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/og-image-v3.png',
        width: 1235,
        height: 1235,
        alt: 'Tá Pra Pesca — Kits completos de pesca',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tá Pra Pesca — Kits completos de pesca',
    description: 'Equipamentos de pesca com procedência. Frete grátis em todo o Brasil.',
    images: ['/og-image-v3.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const adsId = process.env.NEXT_PUBLIC_GA_ADS_ID;

  return (
    <html lang="pt-BR">
      <body>
        {gtmId && <GTMNoScript gtmId={gtmId} />}
        <CartProvider>
          {gtmId && <GTMScript gtmId={gtmId} />}
          {pixelId && <MetaPixel pixelId={pixelId} />}
          {adsId && <GoogleAds adsId={adsId} />}
          {children}
          <ScrollReveal />
        </CartProvider>
      </body>
    </html>
  );
}
