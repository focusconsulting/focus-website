import { getCollection } from "astro:content";

export async function getBlogPostsSortedByPubDate() {
  return (await getCollection('blog')).filter(
    (x) => !!x.data.published,
  ).sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf(),
  );
}

export function formatPostDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(date);
}
