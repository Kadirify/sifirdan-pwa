import type { Metadata, Viewport } from "next";
import "./globals.css";
import SwKayit from "@/components/SwKayit";

export const metadata: Metadata = {
  title: "Alışveriş Listesi",
  description: "Çevrimdışı da çalışan basit bir alışveriş listesi. Next.js ile PWA denemesi.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Liste",
    statusBarStyle: "default",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#2f6f4e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr">
      <body>
        {children}
        <SwKayit />
      </body>
    </html>
  );
}
