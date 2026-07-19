import type { Metadata } from "next";
import { DM_Sans, Lora, Manrope, Outfit } from "next/font/google";
import "./globals.css";
import "./calculator.css";
import "./brand-font.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://eishersolar.com"),
  title: {
    default: "Eisher Industries LLP | Solar Installation in Maharashtra",
    template: "%s | Eisher Industries LLP",
  },
  description:
    "Trusted residential, commercial and industrial solar installation across Raigad, Ratnagiri, Thane, Pune, Satara and Palghar.",
  keywords: [
    "solar installation Raigad",
    "solar installer Maharashtra",
    "residential rooftop solar",
    "PM Surya Ghar subsidy",
    "commercial solar",
    "Eisher Industries",
  ],
  authors: [{ name: "Eisher Industries LLP" }],
  creator: "Eisher Industries LLP",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://eishersolar.com",
    siteName: "Eisher Industries LLP",
    title: "Power Your Home the Nature-Friendly Way",
    description:
      "Reliable solar solutions backed by 24 years of power-sector experience.",
    images: [
      {
        url: "/eisher-industries-logo.png",
        width: 1024,
        height: 768,
        alt: "Eisher Industries LLP — Nature Friend",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eisher Industries LLP — Nature Friend",
    description:
      "Trusted solar installation across Konkan and western Maharashtra.",
    images: ["/eisher-industries-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "renewable energy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${dmSans.variable} ${lora.variable} ${outfit.variable}`}>
        {children}
      </body>
    </html>
  );
}
