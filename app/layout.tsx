import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function publicAssetPath(path: string) {
  return `${basePath}${path}`;
}

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
        url: publicAssetPath("/icon-uscs-32x32.png"),
        media: "(prefers-color-scheme: light)",
      },
      {
        url: publicAssetPath("/icon-uscs-32x32.png"),
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: publicAssetPath("/icon-uscs.svg"),
        type: "image/svg+xml",
      },
    ],
    apple: publicAssetPath("/uscs-icon.png"),
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
