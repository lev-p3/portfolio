import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Левон Петросян | Digital & Creative Services",
  description: "Сайты, автоматизация, документы, презентации и персональный подбор парфюмерии. Левон Петросян, Москва.",
};

export const viewport: Viewport = { themeColor: "#080808", viewportFit: "cover" };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={montserrat.variable}>{children}</body>
    </html>
  );
}
