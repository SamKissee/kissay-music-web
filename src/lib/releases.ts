import { hygraphRequest, type HygraphAsset } from "@/lib/hygraph";

/**
 * Releases (smart links) come from the Hygraph `SmartLink` model.
 * Links typed into Hygraph always win; empty Apple Music and Deezer links are
 * filled in automatically (see resolvePlatformLinks), cached for a day.
 */

export type PlatformKey =
  | "spotify"
  | "appleMusic"
  | "soundcloud"
  | "bandcamp"
  | "youtube"
  | "tidal"
  | "deezer"
  | "amazonMusic";

export interface Release {
  id: string;
  title: string;
  slug: string;
  releaseDate?: string | null;
  description?: string | null;
  isrc?: string | null;
  coverImage?: HygraphAsset | null;
  spotifyUrl?: string | null;
  soundcloudUrl?: string | null;
  bandcampUrl?: string | null;
  appleMusicUrl?: string | null;
  youtubeUrl?: string | null;
  tidalUrl?: string | null;
  amazonUrl?: string | null;
  deezerUrl?: string | null;
}

export interface PlatformLink {
  platform: PlatformKey;
  label: string;
  url: string;
}

/** Display order on the release page. */
export const PLATFORMS: { key: PlatformKey; label: string }[] = [
  { key: "spotify", label: "Spotify" },
  { key: "appleMusic", label: "Apple Music" },
  { key: "soundcloud", label: "SoundCloud" },
  { key: "bandcamp", label: "Bandcamp" },
  { key: "youtube", label: "YouTube" },
  { key: "tidal", label: "Tidal" },
  { key: "deezer", label: "Deezer" },
  { key: "amazonMusic", label: "Amazon Music" },
];

const RELEASE_FIELDS = `
  id
  title
  slug
  releaseDate
  description
  isrc
  coverImage { url width height alt: fileName }
  spotifyUrl
  soundcloudUrl
  bandcampUrl
  appleMusicUrl
  youtubeUrl
  tidalUrl
  amazonUrl
  deezerUrl
`;

export async function getReleases(): Promise<Release[]> {
  const data = await hygraphRequest<{ smartLinks: Release[] }>(
    `query Releases {
      smartLinks(orderBy: releaseDate_DESC, stage: PUBLISHED, first: 500) {
        ${RELEASE_FIELDS}
      }
    }`,
  );
  return data?.smartLinks ?? [];
}

export async function getReleaseSlugs(): Promise<string[]> {
  const data = await hygraphRequest<{ smartLinks: { slug: string }[] }>(
    `query ReleaseSlugs {
      smartLinks(stage: PUBLISHED, first: 1000) { slug }
    }`,
  );
  return data?.smartLinks.map((r) => r.slug).filter(Boolean) ?? [];
}

export async function getRelease(slug: string): Promise<Release | null> {
  const data = await hygraphRequest<{ smartLink: Release | null }>(
    `query Release($slug: String!) {
      smartLink(where: { slug: $slug }, stage: PUBLISHED) {
        ${RELEASE_FIELDS}
      }
    }`,
    { slug },
  );
  return data?.smartLink ?? null;
}

const DAY = 60 * 60 * 24;
const ARTIST = "Kissay";

/** Lowercase, drop punctuation and common suffixes so titles compare cleanly. */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/\((original mix|extended mix|radio edit)\)/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** "Kissay - Unanchored" → "Unanchored" */
function bareTitle(title: string): string {
  return title.replace(new RegExp(`^${ARTIST}\\s*[-–—:]\\s*`, "i"), "");
}

/**
 * Apple Music via the free iTunes Search API (no key). It can't search by
 * ISRC, so match on artist + title: single tracks first, then albums/EPs.
 */
async function lookupAppleMusic(title: string): Promise<string | null> {
  const wanted = normalize(bareTitle(title));
  if (!wanted) return null;

  for (const entity of ["song", "album"] as const) {
    try {
      const term = encodeURIComponent(`${ARTIST} ${bareTitle(title)}`);
      const res = await fetch(
        `https://itunes.apple.com/search?term=${term}&entity=${entity}&country=US&limit=25`,
        { next: { revalidate: DAY } },
      );
      if (!res.ok) continue;
      const json = (await res.json()) as {
        results?: {
          artistName?: string;
          trackName?: string;
          collectionName?: string;
          trackViewUrl?: string;
          collectionViewUrl?: string;
        }[];
      };
      const match = json.results?.find((r) => {
        if (!r.artistName || !normalize(r.artistName).includes(normalize(ARTIST)))
          return false;
        const name = entity === "song" ? r.trackName : r.collectionName;
        if (!name) return false;
        const got = normalize(name);
        // Allow "Unanchored - EP" / "Unanchored - Single" suffixes.
        return got === wanted || got.startsWith(`${wanted} `);
      });
      const url =
        entity === "song" ? match?.trackViewUrl : match?.collectionViewUrl;
      if (url) return url.replace(/[?&]uo=\d+/, "");
    } catch (error) {
      console.error("[releases] iTunes lookup failed:", error);
    }
  }
  return null;
}

/** Deezer by ISRC (free, no key). */
async function lookupDeezerByIsrc(isrc: string): Promise<string | null> {
  try {
    const clean = isrc.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    if (!clean) return null;
    const res = await fetch(`https://api.deezer.com/track/isrc:${clean}`, {
      next: { revalidate: DAY },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { link?: string; error?: unknown };
    return json.error ? null : (json.link ?? null);
  } catch (error) {
    console.error("[releases] Deezer lookup failed:", error);
    return null;
  }
}

/**
 * Links typed in Hygraph always win. Empty Apple Music and Deezer slots are
 * filled automatically (iTunes Search by title, Deezer by ISRC); every other
 * platform shows only when it's entered in Hygraph.
 */
export async function resolvePlatformLinks(
  release: Release,
): Promise<PlatformLink[]> {
  const merged: Partial<Record<PlatformKey, string | null | undefined>> = {
    spotify: release.spotifyUrl,
    appleMusic: release.appleMusicUrl,
    soundcloud: release.soundcloudUrl,
    bandcamp: release.bandcampUrl,
    youtube: release.youtubeUrl,
    tidal: release.tidalUrl,
    deezer: release.deezerUrl,
    amazonMusic: release.amazonUrl,
  };

  // Only look for streaming copies of releases that are on streaming services;
  // a SoundCloud/Bandcamp-only remix skips the lookups.
  const onStreaming = Boolean(release.spotifyUrl || release.isrc);

  const [apple, deezer] = await Promise.all([
    onStreaming && !merged.appleMusic?.trim()
      ? lookupAppleMusic(release.title)
      : Promise.resolve(null),
    release.isrc && !merged.deezer?.trim()
      ? lookupDeezerByIsrc(release.isrc)
      : Promise.resolve(null),
  ]);
  if (apple) merged.appleMusic = apple;
  if (deezer) merged.deezer = deezer;

  return PLATFORMS.flatMap(({ key, label }) => {
    const url = merged[key]?.trim();
    return url ? [{ platform: key, label, url }] : [];
  });
}

export function formatReleaseDate(date?: string | null): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
