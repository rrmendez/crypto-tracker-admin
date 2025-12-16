import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CONFIG } from "@/config/global";
import { fallbackLng } from "@/locales";
import { detectLanguage } from "@/locales/server";
import { Providers } from "./providers";
import localFont from "next/font/local";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const michromaRegular = localFont({
  src: "../public/fonts/michroma-regular.ttf",
  variable: "--font-michroma-regular",
  display: "swap",
});

export const metadata: Metadata = {
  title: CONFIG.site.name,
  description: `${CONFIG.site.name} - Plataforma de pagamento de criptomoedas`,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = CONFIG.isStaticExport ? fallbackLng : await detectLanguage();
  return (
    <html lang={lang} suppressHydrationWarning className={michromaRegular.variable}>
      <body className={`antialiased ${geistSans.variable} ${geistMono.variable}`}>
        <Providers lang={lang}>{children}</Providers>
      </body>
    </html>
  );
}
