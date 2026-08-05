import { getCollection } from "astro:content";

export async function getBlogPostsSortedByPubDate() {
  return (await getCollection('blog')).filter(
    (x) => !x.data.draft,
  ).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
}

export function formatPostDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(date);
}
