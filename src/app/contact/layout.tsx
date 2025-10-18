import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - Book Kissay for Shows & Collaborations",
  description: "Contact Kissay for booking inquiries, collaborations, or music festival consultations. Based in Idaho, performing across the Pacific Northwest. Available for dubstep, drum & bass, and bass music events.",
  openGraph: {
    title: "Contact - Kissay | Book for Shows & Collaborations",
    description: "Contact Kissay for booking inquiries, collaborations, or music festival consultations. Idaho-based DJ and producer available for Northwest events.",
    images: ["/kissay_social_share.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact - Kissay | Book for Shows & Collaborations",
    description: "Contact Kissay for booking inquiries, collaborations, or music festival consultations.",
    images: ["/kissay_social_share.webp"],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
