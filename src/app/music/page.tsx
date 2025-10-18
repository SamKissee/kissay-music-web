import { Metadata } from "next";
import BottomNav from "@/components/BottomNav";
import PageHeader from "@/components/PageHeader";
import BackgroundImage from "@/components/BackgroundImage";
import { LINKS, PLATFORM_NAMES } from "@/constants/links";
import { SOUNDCLOUD, SPOTIFY, YOUTUBE } from "@/constants/embeds";
import {
  FaSpotify,
  FaApple,
  FaSoundcloud,
  FaBandcamp,
  FaYoutube,
} from "react-icons/fa";

export const metadata: Metadata = {
  title: "Music - Dubstep, Drum & Bass, Wave, Global Beats",
  description: "Listen to Kissay's latest dubstep, drum & bass, club, wave, and global beats music. Stream on Spotify, Apple Music, SoundCloud, and Bandcamp. Idaho bass music producer and DJ.",
  openGraph: {
    title: "Music - Kissay | Dubstep, Drum & Bass, Wave, Global Beats",
    description: "Listen to Kissay's latest dubstep, drum & bass, club, wave, and global beats music. Stream on Spotify, Apple Music, SoundCloud, and Bandcamp.",
    images: ["/kissay_social_share.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Music - Kissay | Dubstep, Drum & Bass, Wave, Global Beats",
    description: "Listen to Kissay's latest dubstep, drum & bass, club, wave, and global beats music on all major platforms.",
    images: ["/kissay_social_share.webp"],
  },
};

export default function Music() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundImage />

      <PageHeader title="Music" />

      <main className="relative max-w-4xl mx-auto px-6 pb-32">
        <div className="space-y-8 mb-12">
          <h2 className="text-display text-heading-lg text-white text-center">
            Listen On Your Favorite Platform
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href={LINKS.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-2xl font-semibold border border-white/30 hover:bg-white/30 transition-all duration-200 hover:scale-105 active:scale-95 text-body"
            >
              <FaSpotify className="text-2xl" />
              {PLATFORM_NAMES.spotify}
            </a>
            <a
              href={LINKS.appleMusic}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-2xl font-semibold border border-white/30 hover:bg-white/30 transition-all duration-200 hover:scale-105 active:scale-95 text-body"
            >
              <FaApple className="text-2xl" />
              {PLATFORM_NAMES.appleMusic}
            </a>
            <a
              href={LINKS.soundcloud}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-2xl font-semibold border border-white/30 hover:bg-white/30 transition-all duration-200 hover:scale-105 active:scale-95 text-body"
            >
              <FaSoundcloud className="text-2xl" />
              {PLATFORM_NAMES.soundcloud}
            </a>
            <a
              href={LINKS.bandcamp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-2xl font-semibold border border-white/30 hover:bg-white/30 transition-all duration-200 hover:scale-105 active:scale-95 text-body"
            >
              <FaBandcamp className="text-2xl" />
              {PLATFORM_NAMES.bandcamp}
            </a>
          </div>
        </div>
        <div className="space-y-16">
          {/* Music Players */}
          <div className="space-y-12">
            {/* Spotify Embed */}
            <div className="space-y-6">
              <h2 className="text-display text-heading-md text-white flex items-center gap-4">
                <FaSpotify className="text-3xl" />
                Spotify
              </h2>
              <div
                className="rounded-2xl overflow-hidden"
                dangerouslySetInnerHTML={{ __html: SPOTIFY }}
              />
            </div>

            {/* SoundCloud Embed */}
            <div className="space-y-6">
              <h2 className="text-display text-heading-md text-white flex items-center gap-4">
                <FaSoundcloud className="text-3xl" />
                SoundCloud
              </h2>
              <div
                className="rounded-2xl overflow-hidden"
                dangerouslySetInnerHTML={{ __html: SOUNDCLOUD }}
              />
            </div>

            {/* YouTube Embed */}
            <div className="space-y-6">
              <h2 className="text-display text-heading-md text-white flex items-center gap-4">
                <FaYoutube className="text-3xl" />
                YouTube
              </h2>
              <div
                className="aspect-video rounded-2xl overflow-hidden"
                dangerouslySetInnerHTML={{ __html: YOUTUBE }}
              />
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
