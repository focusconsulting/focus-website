import rss from "@astrojs/rss";
import { getBlogPostsSortedByPubDate, getPostHref } from "../lib/blog";

// Mirrors the Newsroom page: blog posts, announcements, and external coverage.
export async function GET(context: { site: URL }) {
  const posts = await getBlogPostsSortedByPubDate();

  return rss({
    title: "Focus newsroom",
    description:
      "Ideas and field notes from Focus about public digital services, delivery, and building systems that endure.",
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      link: getPostHref(post),
      author: post.data.author,
      categories: [post.data.category],
    })),
  });
}
