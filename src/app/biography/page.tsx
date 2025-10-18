"use client";

import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import PageHeader from "@/components/PageHeader";
import BackgroundImage from "@/components/BackgroundImage";
import { LINKS } from "@/constants/links";

// Bio content constants - update here to change all instances
const BIO_CONTENT = {
  tagline: "all-star artistry meets an experimental edge",

  paragraphs: [
    "Music may sometimes speak for itself, but why not ask for more? It is exactly this craving for more that causes Kissay to flex a multimedia machine gun of talents. Not many up-and-comers from the Northwest already have experience in stage design, label management, talent buying, festival organizing, fashion, web development, graphic design, music production and premier DJ-ing. Without a doubt, Kissay has stepped up to the electronic music scene with a vision, ready to contribute.",

    "Musically, it is difficult for genre classifications to contain him. Sure, he often plays with broken beats and heavy low-end textures, teasing between bass subgenres like a world-class selectah but Kissay also has deep roots in both house and techno. The stylistic constant seems to be that of innovation, experimentation, and emotional exploration. Kissay regularly flirts with deconstructed melodic minimalism to evoke an intimate yet alien emotiveness. Using lush snaps, crackles, and pops, his rhythms are a pleasant textural experience.",

    "It would be easy to classify him as left-field, but he's also right-field, first-baseman, pitcher... He is clearly inspired by Liquid Ritual, Cosmic Bridge, and TerroRhythm at the very core, but seems to find his truest inspiration from those underground labels you've never heard of – from those who are fashioning a new niche within global culture. Trendsetting saturates his bloodstream.",

    "Never expect his releases to replicate. They will constantly be a reflection of his forward-leaning perspectives. The Kissay of today will look nothing like the Kissay of next year, but you will recognize him in his passion for experimentation, for connecting the dots between the disparate genres and artistic mediums that for too long have remained ostracized from each other.",

    "Kissay's musical vision is refreshing. Few artists are able to achieve such a venerated status within a community while constantly challenging its comfort-zone. As an individual, his personality immediately impresses with kindness, integrity, and professionalism. So, when Kissay says that his artistry is only a means to amplify his personality, we know we're in for a truly valuable experience.",
  ],

  // Generated from constants
  get full() {
    return `${
      this.tagline.charAt(0).toUpperCase() + this.tagline.slice(1)
    }. ${this.paragraphs.join("\n\n")}`;
  },

  get short() {
    return `${
      this.tagline.charAt(0).toUpperCase() + this.tagline.slice(1)
    }. Kissay is a multimedia artist from the Northwest with experience in stage design, label management, festival organizing, fashion, web development, graphic design, music production and premier DJ-ing. Musically fluid, he navigates broken beats, heavy low-end textures, house, and techno with equal prowess. His stylistic constant is innovation, experimentation, and emotional exploration through deconstructed melodic minimalism. Few artists achieve such venerated status while constantly challenging their community's comfort-zone.`;
  },
};

export default function Biography() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundImage />

      <PageHeader title="Biography" />

      <main className="relative max-w-4xl mx-auto px-6 pb-32">
        <div className="space-y-12">
          {/* Bio Content - No Card Background */}
          <div className="space-y-6 text-white">
            {/* Tagline */}
            <p className="text-xl font-light italic text-white/80 lowercase">
              {BIO_CONTENT.tagline}
            </p>

            {/* Bio Paragraphs */}
            {BIO_CONTENT.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-lg leading-relaxed text-white/90">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Copy Bio Section - Minimal Design */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">
              Press Kit
            </h2>
            <p className="text-lg text-white/80">
              Need bio text for your website or press release? Copy the formatted version below.
            </p>

            <div className="space-y-4">
              {/* Copy Bio Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => copyToClipboard(BIO_CONTENT.full)}
                  className="flex-1 px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-2xl font-semibold border border-white/30 hover:bg-white/30 transition-all duration-200 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                    />
                  </svg>
                  {copied ? "Copied!" : "Copy Full Bio"}
                </button>

                <button
                  onClick={() => copyToClipboard(BIO_CONTENT.short)}
                  className="flex-1 px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-2xl font-semibold border border-white/30 hover:bg-white/30 transition-all duration-200 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                    />
                  </svg>
                  Copy Short Bio
                </button>
              </div>

              {/* Success Message */}
              {copied && (
                <div className="p-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-white text-center font-medium">
                  Bio copied to clipboard!
                </div>
              )}

              {/* Full Press Kit Button */}
              <a
                href={LINKS.pressKit}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-8 py-4 bg-white text-black rounded-2xl font-semibold hover:bg-white/90 transition-all duration-200 hover:scale-[1.02] active:scale-95 text-center"
              >
                View Full Press Kit
              </a>
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
