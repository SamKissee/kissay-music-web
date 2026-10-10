import type { Metadata } from "next";
import BottomNav from "@/components/BottomNav";
import PageHeader from "@/components/PageHeader";
import BackgroundImage from "@/components/BackgroundImage";
import ReleaseCard from "@/components/ReleaseCard";
import { getReleases } from "@/lib/releases";

export const metadata: Metadata = {
  title: "Releases",
  description:
    "Every Kissay release - dubstep, drum & bass, club and wave - with links to stream or buy on Spotify, Apple Music, SoundCloud, Bandcamp and more.",
  alternates: { canonical: "/releases" },
  openGraph: {
    title: "Releases - Kissay",
    description:
      "Every Kissay release, with links to stream or buy on every platform.",
    url: "/releases",
    images: ["/kissay_social_share.webp"],
  },
};

export const revalidate = 60;

export default async function ReleasesPage() {
  const releases = await getReleases();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundImage />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />

      <div className="relative z-10">
        <PageHeader title="Releases" />

        <main className="relative mx-auto max-w-6xl px-6 pb-32">
          {releases.length === 0 ? (
            <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-md">
              <h2 className="text-heading-md text-display text-white">
                No releases yet
              </h2>
              <p className="mt-4 text-body text-white/70">
                New music is on the way. Check back soon.
              </p>
            </div>
          ) : (
            <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {releases.map((release, i) => (
                <li key={release.id}>
                  <ReleaseCard release={release} priority={i < 4} />
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
