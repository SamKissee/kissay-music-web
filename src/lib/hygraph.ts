import { GraphQLClient } from "graphql-request";
import type { RichTextContent } from "@graphcms/rich-text-types";

const endpoint = process.env.HYGRAPH_ENDPOINT;

if (!endpoint) {
  // Surfaced at request time rather than build time so the rest of the site
  // keeps working even before the blog is configured.
  console.warn(
    "[hygraph] HYGRAPH_ENDPOINT is not set. Blog content will be empty until it is configured in your environment.",
  );
}

const client = endpoint
  ? new GraphQLClient(endpoint, {
      headers: process.env.HYGRAPH_TOKEN
        ? { Authorization: `Bearer ${process.env.HYGRAPH_TOKEN}` }
        : undefined,
    })
  : null;

async function hygraphRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T | null> {
  if (!client) return null;
  try {
    return await client.request<T>(query, variables);
  } catch (error) {
    console.error("[hygraph] request failed:", error);
    return null;
  }
}

export type BlogCategory =
  | "NEWS"
  | "RELEASES"
  | "TUTORIALS"
  | "EVENTS"
  | "BEHIND_THE_SCENES"
  | "GEAR";

export interface HygraphAsset {
  url: string;
  width?: number | null;
  height?: number | null;
  alt?: string | null;
}

export interface Author {
  name: string;
  role?: string | null;
  bio?: string | null;
  picture?: HygraphAsset | null;
  pictureUrl?: string | null;
}

export interface Seo {
  title?: string | null;
  description?: string | null;
  keywords?: string[] | null;
  noIndex?: boolean | null;
  image?: HygraphAsset | null;
}

export interface BlogPostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  date?: string | null;
  featured?: boolean | null;
  category?: BlogCategory | null;
  tags: string[];
  coverImage?: HygraphAsset | null;
  coverImageUrl?: string | null;
  author?: Author | null;
}

export interface BlogPost extends BlogPostSummary {
  content: { raw: RichTextContent };
  seo?: Seo | null;
}

const ASSET_FRAGMENT = `
  url
  width
  height
  alt: fileName
`;

const POST_SUMMARY_FIELDS = `
  id
  title
  slug
  excerpt
  date
  featured
  category
  tags
  coverImage { ${ASSET_FRAGMENT} }
  coverImageUrl
  author { name role picture { ${ASSET_FRAGMENT} } pictureUrl }
`;

export async function getBlogPosts(): Promise<BlogPostSummary[]> {
  const data = await hygraphRequest<{ blogPosts: BlogPostSummary[] }>(
    `query BlogPosts {
      blogPosts(orderBy: date_DESC, stage: PUBLISHED) {
        ${POST_SUMMARY_FIELDS}
      }
    }`,
  );
  return data?.blogPosts ?? [];
}

export async function getBlogPostSlugs(): Promise<string[]> {
  const data = await hygraphRequest<{ blogPosts: { slug: string }[] }>(
    `query BlogPostSlugs {
      blogPosts(stage: PUBLISHED, first: 1000) { slug }
    }`,
  );
  return data?.blogPosts.map((p) => p.slug) ?? [];
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const data = await hygraphRequest<{ blogPost: BlogPost | null }>(
    `query BlogPost($slug: String!) {
      blogPost(where: { slug: $slug }, stage: PUBLISHED) {
        ${POST_SUMMARY_FIELDS}
        content { raw }
        seo {
          title
          description
          keywords
          noIndex
          image { ${ASSET_FRAGMENT} }
        }
      }
    }`,
    { slug },
  );
  return data?.blogPost ?? null;
}

export async function getRelatedPosts(
  slug: string,
  category?: BlogCategory | null,
  limit = 3,
): Promise<BlogPostSummary[]> {
  const data = await hygraphRequest<{ blogPosts: BlogPostSummary[] }>(
    `query RelatedPosts($slug: String!, $category: BlogCategory) {
      blogPosts(
        where: { slug_not: $slug, category: $category }
        orderBy: date_DESC
        stage: PUBLISHED
        first: ${limit}
      ) {
        ${POST_SUMMARY_FIELDS}
      }
    }`,
    { slug, category: category ?? null },
  );
  if (data?.blogPosts?.length) return data.blogPosts;

  // Fall back to most recent posts if there are no category matches.
  const recent = await getBlogPosts();
  return recent.filter((p) => p.slug !== slug).slice(0, limit);
}

export const CATEGORY_LABELS: Record<BlogCategory, string> = {
  NEWS: "News",
  RELEASES: "Releases",
  TUTORIALS: "Tutorials",
  EVENTS: "Events",
  BEHIND_THE_SCENES: "Behind the Scenes",
  GEAR: "Gear",
};

/** Uploaded asset wins; otherwise fall back to a pasted external URL. */
export function getCoverImage(
  post: Pick<BlogPostSummary, "coverImage" | "coverImageUrl">,
): string | null {
  return post.coverImage?.url ?? post.coverImageUrl ?? null;
}

export function getAuthorImage(author?: Author | null): string | null {
  return author?.picture?.url ?? author?.pictureUrl ?? null;
}

export function formatPostDate(date?: string | null): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function readingTime(raw?: RichTextContent): string {
  if (!raw) return "";
  const text = JSON.stringify(raw)
    .replace(/[^a-zA-Z\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  const minutes = Math.max(1, Math.round(text.length / 200));
  return `${minutes} min read`;
}
