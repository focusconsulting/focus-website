import { getCollection, type CollectionEntry } from "astro:content";

export type BlogPost = CollectionEntry<'blog'>;

// Every published entry, local posts and external links alike, newest first.
export async function getBlogPostsSortedByPubDate() {
  return (await getCollection('blog')).filter(
    (x) => !!x.data.published,
  ).sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf(),
  );
}

// Only the posts that have a page on this site.
export async function getLocalBlogPosts() {
  return (await getBlogPostsSortedByPubDate()).filter((post) => !isExternalPost(post));
}

export function isExternalPost(post: BlogPost) {
  return !!post.data.href;
}

export function getPostHref(post: BlogPost) {
  return post.data.href ?? `/blog/${post.id}/`;
}

export function getPostLinkLabel(post: BlogPost) {
  return post.data.linkLabel ?? "Read post";
}

export function formatPostDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(date);
}

// External posts only carry a placeholder day, so they show the month and year.
export function formatPostDateLabel(post: BlogPost) {
  if (!isExternalPost(post)) return formatPostDate(post.data.publishDate);

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(post.data.publishDate);
}

// Value for <time datetime>, matching the precision of formatPostDateLabel.
export function getPostDatetime(post: BlogPost) {
  const iso = post.data.publishDate.toISOString();
  return isExternalPost(post) ? iso.slice(0, 7) : iso;
}

// Full class strings so Tailwind picks them up; unknown categories fall back to neutral.
const CATEGORY_BADGE_CLASSES: Record<string, string> = {
  blog: "bg-emerald-50",
  "in the news": "bg-blue-50",
  announcement: "bg-amber-50",
};

export function getCategoryBadgeClass(category: string) {
  return CATEGORY_BADGE_CLASSES[category.toLowerCase()] ?? "bg-stone-100";
}
