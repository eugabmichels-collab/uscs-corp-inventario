import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistema de Inventário - USCS",
  description:
    "Sistema de Inventário e Gestão de Laboratórios Acadêmicos - Universidade Municipal de São Caetano do Sul",
  generator: "USCS",
  icons: {
    icon: [
      {
        url: "/icon-uscs-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-uscs-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon-uscs.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/uscs-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
