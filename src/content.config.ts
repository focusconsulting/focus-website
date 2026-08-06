import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({
    base: "./src/blog",
    pattern: "**/index.mdx",
    generateId: ({ entry }) => entry.replace(/\/index\.mdx$/, ""),
  }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    publishDate: z.coerce.date(),
    author: z.string().min(1),
    tags: z.array(z.string().min(1)),
    published: z.coerce.boolean().default(false),
  }),
});

export const collections = { blog };
