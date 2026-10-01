import rss from "@astrojs/rss";
import { getLocalBlogPosts } from "../lib/blog";

export async function GET(context: { site: URL }) {
  const posts = await getLocalBlogPosts();

  return rss({
    title: "Focus blog",
    description:
      "Ideas and field notes from Focus about public digital services, delivery, and building systems that endure.",
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      publishDate: post.data.publishDate,
      link: `/blog/${post.id}/`,
      author: post.data.author,
    })),
  });
}
