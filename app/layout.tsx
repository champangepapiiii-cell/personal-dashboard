import type { Metadata } from "next";
import { Carlito } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { StoreProvider } from "@/lib/store-context";
import { TimeframeProvider } from "@/lib/timeframe";

// Carlito = metrics-compatible open clone of Calibri (brand body font).
const carlito = Carlito({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-carlito",
});

export const metadata: Metadata = {
  title: "The System",
  description: "Optimise your money, body, life, and creative output — one system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${carlito.variable} h-full antialiased`}>
      <body className="min-h-full">
        <StoreProvider>
          <TimeframeProvider>{children}</TimeframeProvider>
        </StoreProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
