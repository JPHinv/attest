import type { Metadata, Viewport } from "next";
import { siteConfig } from "@/site.config";
import { metadataBase } from "@/lib/seo";
import "./globals.css";

/**
 * Site-brede metadata-defaults (golf 1).
 *
 * - title-template zodat golf-2-pagina's alleen hun eigen titel hoeven te
 *   leveren; het merk-suffix wordt automatisch toegevoegd.
 * - default description + OpenGraph uit de config (geen hardcoding).
 * - metadataBase zodat relatieve canonical/OG-URL's correct absoluut worden.
 */
export const metadata: Metadata = {
  metadataBase: metadataBase(),
  title: {
    default: siteConfig.brandName,
    template: `%s — ${siteConfig.brandName}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.brandName,
  openGraph: {
    type: "website",
    siteName: siteConfig.brandName,
    title: siteConfig.brandName,
    description: siteConfig.description,
    locale: siteConfig.locale,
    url: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/** Mobielvriendelijke viewport. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Themakleuren uit de config als CSS-variabelen — niets hardgecodeerd.
  const themeStyle = {
    "--color-primary": siteConfig.theme.primaryColor,
    "--color-on-primary": siteConfig.theme.onPrimaryColor,
    "--color-accent": siteConfig.theme.accentColor,
  } as React.CSSProperties;

  return (
    <html lang={siteConfig.locale} style={themeStyle}>
      <body>{children}</body>
    </html>
  );
}
