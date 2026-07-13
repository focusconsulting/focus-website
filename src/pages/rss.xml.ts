import rss from "@astrojs/rss";
import {
  getBlogPostsWithAuthors,
  postsForBuild,
} from "../lib/blog";

export async function GET(context: { site: URL }) {
  const posts = postsForBuild(await getBlogPostsWithAuthors());

  return rss({
    title: "Focus blog",
    description:
      "Ideas and field notes from Focus about public digital services, delivery, and building systems that endure.",
    site: context.site,
    items: posts.map(({ post, author }) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
      author: author.data.display_name,
    })),
  });
}
