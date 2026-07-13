import {
  getCollection,
  type CollectionEntry,
} from "astro:content";

export type BlogPost = CollectionEntry<"blog">;
export type BlogAuthor = CollectionEntry<"authors">;

export interface BlogPostWithAuthor {
  post: BlogPost;
  author: BlogAuthor;
}

export function isPublished(post: BlogPost, now = new Date()) {
  return !post.data.draft && post.data.pubDate <= now;
}

export function formatPostDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(date);
}

export async function getBlogPostsWithAuthors(): Promise<BlogPostWithAuthor[]> {
  const [posts, authors] = await Promise.all([
    getCollection("blog"),
    getCollection("authors"),
  ]);
  const authorsById = new Map(authors.map((author) => [author.id, author]));

  const resolved = posts.map((post) => {
    const id = post.data.author.id;
    const author = authorsById.get(id);

    if (!author) {
      throw new Error(
        `Blog post "${post.id}" references unknown author "${id}". Add src/content/authors/${id}.json before publishing.`,
      );
    }

    return { post, author };
  });

  return resolved.sort(
    (a, b) => b.post.data.pubDate.valueOf() - a.post.data.pubDate.valueOf(),
  );
}

export function postsForBuild(posts: BlogPostWithAuthor[]) {
  return import.meta.env.PROD
    ? posts.filter(({ post }) => isPublished(post))
    : posts;
}
