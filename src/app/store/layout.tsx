import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merch Store - Official Kissay Apparel & Accessories",
  description: "Shop official Kissay merch. High-quality apparel and accessories from the Idaho bass music producer. Support the music and rep the brand.",
  openGraph: {
    title: "Merch Store - Official Kissay Apparel & Accessories",
    description: "Shop official Kissay merch. High-quality apparel and accessories from the Idaho bass music producer.",
    images: ["/kissay_social_share.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Merch Store - Official Kissay Apparel & Accessories",
    description: "Shop official Kissay merch. High-quality apparel and accessories.",
    images: ["/kissay_social_share.webp"],
  },
};

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
