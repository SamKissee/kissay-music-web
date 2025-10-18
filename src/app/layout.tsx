import type { Metadata } from "next";
import { Space_Grotesk, Archivo_Black } from "next/font/google";
import "./globals.css";
import StructuredData from "@/components/StructuredData";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://kissaymusic.com'),
  title: {
    default: "Kissay - Dubstep, Drum & Bass, Electronic Music Producer | Idaho Northwest",
    template: "%s | Kissay Music"
  },
  description: "Official website of Kissay - Electronic music producer, DJ, and festival curator from Idaho. Specializing in dubstep, drum & bass, club, global beats, and wave music. Northwest bass music scene.",
  keywords: [
    "Kissay",
    "Kissay music",
    "electronic music",
    "dubstep",
    "drum and bass",
    "dnb",
    "bass music",
    "club music",
    "global beats",
    "wave music",
    "Idaho DJ",
    "Northwest music",
    "Pacific Northwest",
    "Idaho music producer",
    "Boise electronic music",
    "Konnexion Music Festival",
    "bass music producer",
    "experimental electronic",
    "deconstructed club",
    "broken beats",
    "electronic music Idaho",
    "Northwest bass music",
    "Idaho music scene",
    "Treefort Music Fest",
    "West Coast bass",
  ],
  authors: [{ name: "Kissay" }],
  creator: "Kissay",
  publisher: "Kissay Music",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Kissay Music",
    title: "Kissay - Dubstep, Drum & Bass, Electronic Music Producer | Idaho Northwest",
    description: "Electronic music producer, DJ, and festival curator from Idaho. Specializing in dubstep, drum & bass, club, global beats, and wave music.",
    images: [
      {
        url: "/kissay_social_share.webp",
        width: 1200,
        height: 630,
        alt: "Kissay - Electronic Music Producer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kissay - Dubstep, Drum & Bass, Electronic Music Producer | Idaho Northwest",
    description: "Electronic music producer, DJ, and festival curator from Idaho. Specializing in dubstep, drum & bass, club, global beats, and wave music.",
    images: ["/kissay_social_share.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${archivoBlack.variable} antialiased overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
