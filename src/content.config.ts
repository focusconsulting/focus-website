import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const authors = defineCollection({
  loader: glob({
    base: "./src/content/authors",
    pattern: "**/*.json",
  }),
  schema: z.object({
    name: z.string().min(1),
    avatar: z.string().url(),
    bio: z.string().min(1),
  }),
});

const blog = defineCollection({
  loader: glob({
    base: "./src/content/blog",
    pattern: "**/index.mdx",
    generateId: ({ entry }) => entry.replace(/\/index\.mdx$/, ""),
  }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    pubDate: z.coerce.date(),
    author: reference("authors"),
    tags: z.array(z.string().min(1)),
    draft: z.boolean().default(false),
  }),
});

export const collections = { authors, blog };
