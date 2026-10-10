import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaSpotify } from "react-icons/fa";
import ReleaseLinks from "@/components/ReleaseLinks";
import { LINKS } from "@/constants/links";
import {
  formatReleaseDate,
  getRelease,
  getReleaseSlugs,
  resolvePlatformLinks,
} from "@/lib/releases";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getReleaseSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const release = await getRelease(slug);
  if (!release) return { title: "Release not found" };

  const title = release.title;
  const description =
    release.description ??
    `Listen to ${release.title} by Kissay on Spotify, Apple Music, SoundCloud, Bandcamp and more.`;
  const image = release.coverImage?.url ?? "/kissay_social_share.webp";

  return {
    title,
    description,
    alternates: { canonical: `/releases/${release.slug}` },
    openGraph: {
      type: "music.song",
      title,
      description,
      url: `/releases/${release.slug}`,
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

const SOCIALS = [
  { href: LINKS.instagram, label: "Instagram", Icon: FaInstagram },
  { href: LINKS.facebook, label: "Facebook", Icon: FaFacebook },
  { href: LINKS.spotify, label: "Spotify artist page", Icon: FaSpotify },
];

export default async function ReleasePage({ params }: PageProps) {
  const { slug } = await params;
  const release = await getRelease(slug);
  if (!release) notFound();

  const links = await resolvePlatformLinks(release);
  const cover = release.coverImage?.url ?? null;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    name: release.title,
    byArtist: { "@type": "MusicGroup", name: "Kissay" },
    ...(release.releaseDate && { datePublished: release.releaseDate }),
    ...(release.isrc && { isrcCode: release.isrc }),
    ...(cover && { image: cover }),
    ...(release.description && { description: release.description }),
    sameAs: links.map((l) => l.url),
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      {/* Blurred cover art as the backdrop */}
      <div className="fixed inset-0 z-0">
        {/* It's blurred anyway, so a tiny image stretched up looks the same
            and loads in a fraction of the time. */}
        <Image
          src={cover ?? "/kissay_bg.jpg"}
          alt=""
          fill
          sizes="64px"
          quality={40}
          className="scale-125 object-cover opacity-70 blur-2xl"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/85" />
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen max-w-md flex-col px-5 py-10">
        <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/15">
          {cover ? (
            <Image
              src={cover}
              alt={`${release.title} cover art`}
              fill
              priority
              sizes="(max-width: 448px) 100vw, 384px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-page-primary/30 via-page-bg to-black">
              <span className="text-display text-5xl text-white/20">
                KISSAY
              </span>
            </div>
          )}
        </div>

        <header className="mt-6 mb-6 text-center">
          <p className="text-body-sm uppercase tracking-[0.2em] text-white/60">
            Kissay
          </p>
          <h1 className="text-display text-heading-lg mt-1 text-white">
            {release.title}
          </h1>
          {release.releaseDate && (
            <time
              dateTime={release.releaseDate}
              className="mt-2 block text-body-sm text-white/50"
            >
              {formatReleaseDate(release.releaseDate)}
            </time>
          )}
          {release.description && (
            <p className="mt-3 text-body text-white/75">
              {release.description}
            </p>
          )}
        </header>

        <ReleaseLinks
          release={release.title}
          slug={release.slug}
          links={links}
        />

        <footer className="mt-auto pt-10 text-center">
          <div className="flex justify-center gap-5">
            {SOCIALS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-white/60 transition-colors hover:text-white"
              >
                <Icon className="text-xl" />
              </a>
            ))}
          </div>
          <Link
            href="/releases"
            className="mt-4 inline-block text-body-sm text-white/40 transition-colors hover:text-white/80"
          >
            More releases at kissaymusic.com
          </Link>
        </footer>
      </main>
    </div>
  );
}
