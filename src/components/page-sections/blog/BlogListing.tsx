import { useEffect, useMemo, useState, type ChangeEvent, type MouseEvent } from "react";

const POSTS_PER_PAGE = 10;

export interface BlogListingPost {
  slug: string;
  title: string;
  description: string;
  pubDate: string;
  dateLabel: string;
  tags: string[];
  author: {
    id: string;
    name: string;
    githubUrl: string;
  };
}

export interface BlogListingAuthor {
  id: string;
  name: string;
}

interface Props {
  posts: BlogListingPost[];
  tags: string[];
  authors: BlogListingAuthor[];
}

interface FilterState {
  tag: string;
  author: string;
  page: number;
}

function readFilters(tags: string[], authors: BlogListingAuthor[]): FilterState {
  const params = new URLSearchParams(window.location.search);
  const requestedTag = params.get("tag") ?? "";
  const requestedAuthor = params.get("author") ?? "";
  const requestedPage = Number(params.get("page"));

  return {
    tag: tags.includes(requestedTag) ? requestedTag : "",
    author: authors.some(({ id }) => id === requestedAuthor)
      ? requestedAuthor
      : "",
    page:
      Number.isInteger(requestedPage) && requestedPage > 0
        ? requestedPage
        : 1,
  };
}

function filterUrl(tag: string, author: string, page = 1) {
  const params = new URLSearchParams();

  if (tag) params.set("tag", tag);
  if (author) params.set("author", author);
  if (page > 1) params.set("page", String(page));

  const query = params.toString();
  return `/blog/${query ? `?${query}` : ""}`;
}

export default function BlogListing({ posts, tags, authors }: Props) {
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const syncFromUrl = () => {
      const filters = readFilters(tags, authors);
      setSelectedTag(filters.tag);
      setSelectedAuthor(filters.author);
      setPage(filters.page);
    };

    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, [authors, tags]);

  const filteredPosts = useMemo(
    () =>
      posts.filter(
        (post) =>
          (!selectedTag || post.tags.includes(selectedTag)) &&
          (!selectedAuthor || post.author.id === selectedAuthor),
      ),
    [posts, selectedAuthor, selectedTag],
  );

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const visiblePosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  );
  const hasFilters = Boolean(selectedTag || selectedAuthor);

  function updateFilters(tag: string, author: string, nextPage = 1) {
    setSelectedTag(tag);
    setSelectedAuthor(author);
    setPage(nextPage);
    window.history.pushState({}, "", filterUrl(tag, author, nextPage));
  }

  function handleTagChange(event: ChangeEvent<HTMLSelectElement>) {
    updateFilters(event.target.value, selectedAuthor);
  }

  function handleAuthorChange(event: ChangeEvent<HTMLSelectElement>) {
    updateFilters(selectedTag, event.target.value);
  }

  function handleTagClick(event: MouseEvent<HTMLAnchorElement>, tag: string) {
    event.preventDefault();
    updateFilters(tag, selectedAuthor);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function changePage(nextPage: number) {
    updateFilters(selectedTag, selectedAuthor, nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div>
      <div className="flex flex-wrap items-end gap-3 py-4 sm:py-5">
        <label className="grid w-full gap-1 text-[0.7rem] font-semibold uppercase tracking-[0.06em] text-[var(--color-brand-soft)] sm:w-auto">
          Tag
          <select
            className="h-10 w-full min-w-40 rounded-md border border-[var(--color-brand-border)] bg-white px-3 text-[0.9rem] font-normal normal-case tracking-normal text-[var(--color-brand-ink)] sm:w-auto"
            value={selectedTag}
            onChange={handleTagChange}
          >
            <option value="">All tags</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </label>

        <label className="grid w-full gap-1 text-[0.7rem] font-semibold uppercase tracking-[0.06em] text-[var(--color-brand-soft)] sm:w-auto">
          Author
          <select
            className="h-10 w-full min-w-48 rounded-md border border-[var(--color-brand-border)] bg-white px-3 text-[0.9rem] font-normal normal-case tracking-normal text-[var(--color-brand-ink)] sm:w-auto"
            value={selectedAuthor}
            onChange={handleAuthorChange}
          >
            <option value="">All authors</option>
            {authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
        </label>

        <button
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-brand-border)] text-[1.3rem] leading-none text-[var(--color-brand-soft)] transition-colors hover:border-[var(--color-brand-ink)] hover:bg-[var(--color-brand-ink)] hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
          type="button"
          disabled={!hasFilters}
          onClick={() => updateFilters("", "")}
          aria-label="Clear filters"
          title="Clear filters"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>

      <div className="flex items-center justify-between pb-3 pt-1 text-[0.8rem] text-[var(--color-brand-soft)]">
        <p aria-live="polite">
          {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"}
        </p>
        {totalPages > 1 && (
          <p>
            Page {currentPage} of {totalPages}
          </p>
        )}
      </div>

      {visiblePosts.length === 0 ? (
        <div className="py-16">
          <h2 className="section-heading">No posts match those filters.</h2>
          <p className="body-copy mt-3">Try another tag or author.</p>
          <button
            className="mt-6 font-medium text-[var(--color-brand-accent)] underline underline-offset-4"
            type="button"
            onClick={() => updateFilters("", "")}
          >
            Show all posts
          </button>
        </div>
      ) : (
        <ol>
          {visiblePosts.map((post) => (
            <li key={post.slug} className="border-b border-[var(--color-brand-border)]">
              <article className="grid gap-7 py-10 md:grid-cols-[minmax(0,1fr)_13rem] md:items-start md:py-12">
                <div>
                  <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.86rem] text-[var(--color-brand-soft)]">
                    <time dateTime={post.pubDate}>{post.dateLabel}</time>
                    <span aria-hidden="true">•</span>
                    <a
                      className="font-medium text-[var(--color-brand-ink)] underline decoration-[var(--color-brand-border)] underline-offset-4 transition-colors hover:text-[var(--color-brand-accent)]"
                      href={post.author.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {post.author.name}
                    </a>
                  </div>
                  <h2 className="section-heading max-w-[24ch]">
                    <a
                      className="no-underline transition-colors hover:text-[var(--color-brand-accent)]"
                      href={`/blog/${post.slug}/`}
                    >
                      {post.title}
                    </a>
                  </h2>
                  <p className="body-copy mt-4 max-w-[45rem]">{post.description}</p>
                </div>
                <div className="flex flex-wrap gap-2 md:justify-end">
                  {post.tags.map((tag) => (
                    <a
                      key={tag}
                      className="rounded-full bg-[var(--color-brand-surface)] px-3 py-1 text-[0.78rem] font-medium text-[var(--color-brand-soft)] no-underline transition-colors hover:bg-[var(--color-brand-border)] hover:text-[var(--color-brand-ink)]"
                      href={filterUrl(tag, selectedAuthor)}
                      onClick={(event) => handleTagClick(event, tag)}
                    >
                      {tag}
                    </a>
                  ))}
                </div>
              </article>
            </li>
          ))}
        </ol>
      )}

      {totalPages > 1 && (
        <nav className="flex items-center justify-between gap-4 py-8" aria-label="Blog pagination">
          <button
            className="rounded-full border border-[var(--color-brand-border)] px-5 py-2.5 text-[0.9rem] font-medium transition-colors hover:border-[var(--color-brand-ink)] disabled:cursor-not-allowed disabled:opacity-35"
            type="button"
            disabled={currentPage === 1}
            onClick={() => changePage(currentPage - 1)}
          >
            Previous
          </button>
          <span className="text-[0.9rem] text-[var(--color-brand-soft)]">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="rounded-full border border-[var(--color-brand-border)] px-5 py-2.5 text-[0.9rem] font-medium transition-colors hover:border-[var(--color-brand-ink)] disabled:cursor-not-allowed disabled:opacity-35"
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => changePage(currentPage + 1)}
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
}
