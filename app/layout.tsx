import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { site } from "@/content/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CustomCursor } from "@/components/cursor/CustomCursor";
import { Preloader } from "@/components/preloader/Preloader";
import { ScrollReveal } from "@/components/transitions/ScrollReveal";
import { SceneLayer } from "@/components/three/SceneLayer";
import { preloadedHeadScript } from "@/lib/preloader";
import { siteUrl } from "@/lib/siteUrl";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Pages override title/description; OG images come from opengraph-image.tsx files.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: site.name, template: `%s · ${site.name}` },
  description: site.pitch,
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.name,
    description: site.pitch,
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.pitch,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      data-env={process.env.NODE_ENV}
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      // Inline scripts (preloader flag) and providers set attributes on <html>.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: preloadedHeadScript }} />
        <noscript>
          <style>{".preloader{display:none}"}</style>
        </noscript>
      </head>
      <body className="flex min-h-dvh flex-col">
        <Providers>
          <Preloader />
          <SceneLayer />
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-bg"
          >
            Skip to content
          </a>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <CustomCursor />
          <ScrollReveal />
        </Providers>
      </body>
    </html>
  );
}
