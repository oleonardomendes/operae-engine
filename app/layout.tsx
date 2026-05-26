import type { Metadata } from "next";
import "./globals.css";
import ScrollReveal from "@/components/ScrollReveal";
import { CartProvider } from "@/contexts/CartContext";
import { StoreProvider } from "@/contexts/StoreContext";
import { GTMScript, GTMNoScript } from "@/components/analytics/GTM";
import { MetaPixel } from "@/components/analytics/MetaPixel";
import { GoogleAds } from "@/components/analytics/GoogleAds";
import { resolveStoreId } from "@/lib/store-id";
import { loadStoreConfig } from "@/lib/store-config";

export async function generateMetadata(): Promise<Metadata> {
  const storeId = await resolveStoreId()
  const config = loadStoreConfig(storeId)

  return {
    title: config.nome,
    metadataBase: new URL(`https://${config.dominio}`),
    openGraph: {
      title: config.nome,
      url: `https://${config.dominio}`,
      siteName: config.nome,
      locale: 'pt_BR',
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: config.nome }],
    },
    twitter: {
      card: 'summary_large_image',
      title: config.nome,
      images: ['/og-image.png'],
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeId = await resolveStoreId()
  const config = loadStoreConfig(storeId)

  const gtmId = config.analytics.gtm_id || undefined
  const pixelId = config.analytics.meta_pixel_id || undefined
  const adsId = config.analytics.google_ads_id || undefined

  return (
    <html lang="pt-BR">
      <body>
        {gtmId && <GTMNoScript gtmId={gtmId} />}
        <StoreProvider config={config}>
          <CartProvider>
            {gtmId && <GTMScript gtmId={gtmId} />}
            {pixelId && <MetaPixel pixelId={pixelId} />}
            {adsId && <GoogleAds adsId={adsId} />}
            {children}
            <ScrollReveal />
          </CartProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
