import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({
    base: "./src/blog",
    pattern: "**/index.mdx",
    generateId: ({ entry }) => entry.replace(/\/index\.mdx$/, ""),
  }),
  // A post with `href` is an external link (news coverage, announcements): it has no page of its
  // own, so it needs a `linkLabel` instead of an `author`. Local announcements (category
  // "Announcement", no `href`) get a page under /announcements/ and don't need an author.
  schema: z
    .object({
      title: z.string().min(1),
      description: z.string().min(1),
      publishDate: z.coerce.date(),
      author: z.string().min(1).optional(),
      published: z.coerce.boolean().default(false),
      category: z.string().min(1),
      href: z.url().optional(),
      linkLabel: z.string().min(1).optional(),
    })
    .superRefine((data, ctx) => {
      if (data.href && !data.linkLabel) {
        ctx.addIssue({ code: "custom", path: ["linkLabel"], message: "External posts need a linkLabel." });
      }
      if (!data.href && !data.author && data.category.toLowerCase() !== "announcement") {
        ctx.addIssue({ code: "custom", path: ["author"], message: "Blog posts need an author." });
      }
    }),
});

export const collections = { blog };
