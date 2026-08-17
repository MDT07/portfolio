import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Prata } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import { notFound } from "next/navigation";
import "../globals.css";
import Header from "@/components/layout/Header";
import FooterWrapper from "@/components/layout/FooterWrapper";
import SmoothScroll from "@/components/providers/SmoothScroll";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import { siteConfig } from "@/lib/config";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin", "cyrillic"],
});

const prata = Prata({
  weight: "400",
  variable: "--font-prata",
  subsets: ["latin", "cyrillic"],
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(isLocale(lang) ? lang : "ru");
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: siteConfig.name,
      template: `%s — ${siteConfig.name}`,
    },
    description: dict.hero.subtitle,
    applicationName: siteConfig.name,
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: siteConfig.name,
      description: dict.hero.subtitle,
      locale: lang === "ru" ? "ru_RU" : "en_US",
      images: [
        {
          url: "/images/portfolio-og.png",
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.name,
      description: dict.hero.subtitle,
      images: ["/images/portfolio-og.png"],
    },
    alternates: {
      languages: { ru: "/", en: "/en" },
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <html
      lang={lang}
      data-theme="light"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} ${prata.variable} h-full antialiased`}
    >
      <head>
        <Script id="theme-init" src="/theme-init.js" strategy="beforeInteractive" />
      </head>
      <body className="flex min-h-full flex-col bg-surface-0 text-text-primary">
        <SmoothScroll>
          <Header lang={lang} dict={dict} />
          <main className="flex-1">{children}</main>
          <FooterWrapper lang={lang} dict={dict} />
        </SmoothScroll>
        <Analytics />
      </body>
    </html>
  );
}
