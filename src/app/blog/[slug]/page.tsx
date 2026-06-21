import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import BottomNav from "@/components/BottomNav";
import PageHeader from "@/components/PageHeader";
import BackgroundImage from "@/components/BackgroundImage";
import BlogCard from "@/components/BlogCard";
import RichText from "@/components/RichText";
import {
  getBlogPost,
  getBlogPostSlugs,
  getRelatedPosts,
  CATEGORY_LABELS,
  formatPostDate,
  readingTime,
  getCoverImage,
  getAuthorImage,
} from "@/lib/hygraph";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getBlogPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return { title: "Post not found" };
  }

  const title = post.seo?.title ?? post.title;
  const description = post.seo?.description ?? post.excerpt ?? undefined;
  const image =
    post.seo?.image?.url ?? getCoverImage(post) ?? "/kissay_social_share.webp";

  return {
    title,
    description,
    keywords: post.seo?.keywords ?? post.tags,
    alternates: { canonical: `/blog/${post.slug}` },
    robots: post.seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      title,
      description,
      url: `/blog/${post.slug}`,
      publishedTime: post.date ?? undefined,
      authors: post.author?.name ? [post.author.name] : undefined,
      tags: post.tags,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) notFound();

  const related = await getRelatedPosts(post.slug, post.category);
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://kissaymusic.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seo?.description ?? post.excerpt ?? undefined,
    image:
      post.seo?.image?.url ??
      getCoverImage(post) ??
      `${siteUrl}/kissay_social_share.webp`,
    datePublished: post.date ?? undefined,
    author: {
      "@type": "Person",
      name: post.author?.name ?? "Kissay",
    },
    publisher: {
      "@type": "Organization",
      name: "Kissay Music",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/kissaylogo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${post.slug}`,
    },
    keywords: (post.seo?.keywords ?? post.tags).join(", "),
  };

  const cover = getCoverImage(post);
  const authorImage = getAuthorImage(post.author);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundImage />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-black/75 via-black/65 to-black/85" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative z-10">
        <PageHeader title="Blog" />

      <main className="relative mx-auto max-w-5xl px-6 pb-32">
        <div className="mx-auto max-w-3xl">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-2 text-body-sm text-white/60 transition-colors hover:text-white"
        >
          ← All posts
        </Link>

        <article>
          <header className="space-y-5">
            <div className="flex flex-wrap items-center gap-3 text-body-sm">
              {post.category && (
                <span className="rounded-full bg-page-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                  {CATEGORY_LABELS[post.category]}
                </span>
              )}
              <time
                dateTime={post.date ?? undefined}
                className="text-white/50"
              >
                {formatPostDate(post.date)}
              </time>
              <span aria-hidden className="text-white/30">
                ·
              </span>
              <span className="text-white/50">
                {readingTime(post.content.raw)}
              </span>
            </div>

            <h1 className="text-display text-heading-xl text-white">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-body-lg text-white/75">{post.excerpt}</p>
            )}

            {post.author?.name && (
              <div className="flex items-center gap-3 pt-2">
                {authorImage ? (
                  <Image
                    src={authorImage}
                    alt={post.author.name}
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-page-primary/30 text-sm font-bold text-white">
                    {post.author.name.charAt(0)}
                  </div>
                )}
                <div className="leading-tight">
                  <p className="text-body-sm font-semibold text-white">
                    {post.author.name}
                  </p>
                  {post.author.role && (
                    <p className="text-xs text-white/50">{post.author.role}</p>
                  )}
                </div>
              </div>
            )}
          </header>

          {cover && (
            <div className="relative my-10 aspect-[16/9] w-full overflow-hidden rounded-3xl border border-white/10">
              <Image
                src={cover}
                alt={post.coverImage?.alt ?? post.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
          )}

          <div className="mt-10">
            <RichText content={post.content.raw} />
          </div>

          {post.tags.length > 0 && (
            <div className="mt-12 flex flex-wrap gap-2 border-t border-white/10 pt-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-body-sm text-white/70"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>
        </div>

        {related.length > 0 && (
          <section className="mt-20 border-t border-white/10 pt-12">
            <h2 className="text-display text-heading-md mb-8 text-white">
              Keep reading
            </h2>
            <div
              className={`grid gap-8 ${
                related.length === 1
                  ? "max-w-md"
                  : related.length === 2
                    ? "sm:grid-cols-2"
                    : "sm:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {related.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          </section>
        )}
      </main>
      </div>

      <BottomNav />
    </div>
  );
}
