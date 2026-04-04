import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CryptoOil Intelligence | AI Oil Price Command Center",
  description:
    "AI-powered oil intelligence command center. Real-time WTI/Brent predictions, geopolitical risk mapping, supply chain monitoring.",
  keywords: ["oil", "WTI", "Brent", "AI", "prediction", "geopolitical", "Hormuz"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistMono.variable} h-full`}>
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}
