import type { MetadataRoute } from "next";

// Next bunu /manifest.webmanifest olarak sunuyor, ayrı json dosyasına gerek yok.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Alışveriş Listesi",
    short_name: "Liste",
    description: "Çevrimdışı da çalışan basit bir alışveriş listesi.",
    lang: "tr",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f6f6f4",
    theme_color: "#2f6f4e",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
