import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import { getTenantConfig } from "@/lib/tenant-config";
import { getLocale } from "@/lib/i18n/locale";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BLS",
  description: "Legal & governance platform",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [locale, tenant] = await Promise.all([getLocale(), getTenantConfig()]);

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex h-full flex-col">
        <Providers locale={locale} tenant={{ name: tenant?.name ?? null, currency: tenant?.currency ?? null }}>{children}</Providers>
      </body>
    </html>
  );
}
