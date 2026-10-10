"use client";

import type { IconType } from "react-icons";
import { FaDeezer } from "react-icons/fa";
import {
  SiAmazonmusic,
  SiApplemusic,
  SiBandcamp,
  SiSoundcloud,
  SiSpotify,
  SiTidal,
  SiYoutube,
} from "react-icons/si";
import type { PlatformKey, PlatformLink } from "@/lib/releases";
import { trackReleaseClick } from "@/lib/analytics";

const ICONS: Record<PlatformKey, IconType> = {
  spotify: SiSpotify,
  appleMusic: SiApplemusic,
  soundcloud: SiSoundcloud,
  bandcamp: SiBandcamp,
  youtube: SiYoutube,
  tidal: SiTidal,
  deezer: FaDeezer,
  amazonMusic: SiAmazonmusic,
};

const BUTTON_TEXT: Partial<Record<PlatformKey, string>> = {
  bandcamp: "Buy",
};

interface Props {
  release: string;
  slug: string;
  links: PlatformLink[];
}

export default function ReleaseLinks({ release, slug, links }: Props) {
  // Links open in a new tab, so this page stays open and the pixel and GA
  // events finish sending on their own.
  function handleClick(link: PlatformLink) {
    trackReleaseClick({ release, slug, platform: link.platform });
  }

  if (links.length === 0) {
    return (
      <p className="text-center text-body text-white/60">
        Links coming soon.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {links.map((link) => {
        const Icon = ICONS[link.platform];
        return (
          <li key={link.platform}>
            <a
              href={link.url}
              onClick={() => handleClick(link)}
              onAuxClick={(e) => e.button === 1 && handleClick(link)}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-white backdrop-blur-md transition-all duration-200 hover:border-white/40 hover:bg-white/20 active:scale-[0.98]"
            >
              <Icon className="shrink-0 text-2xl" aria-hidden />
              <span className="flex-1 text-body font-semibold">
                {link.label}
              </span>
              <span className="rounded-full bg-white/15 px-4 py-1.5 text-body-sm font-semibold uppercase tracking-wide text-white transition-colors group-hover:bg-page-primary">
                {BUTTON_TEXT[link.platform] ?? "Play"}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
