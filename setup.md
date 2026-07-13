# Blog and deployment setup

## Publishing blog posts

Blog posts live at `src/content/blog/<slug>/index.mdx`. Put images used by a
post in the same folder, import them into the MDX file, and render them with
Astro's `Image` component so the build can optimize them.

Authors live in `src/content/authors/<github-username>.json`. The `author`
frontmatter value must match that filename. The build validates all required
frontmatter and fails when an author cannot be resolved.

A post is included in production only when `draft` is `false` and `pubDate` is
not in the future. Publishing is therefore a normal pull request: add or edit
the content, get it reviewed, and merge it to `main`. A daily GitHub Pages build
publishes future-dated posts after their date arrives.

## Cloudflare Pages for pull request previews only

GitHub Pages remains the only production host. Cloudflare Pages should be
connected only to create disposable preview URLs:

1. In Cloudflare, open **Workers & Pages**, choose **Create application**,
   select **Pages**, and then **Connect to Git**.
2. Authorize the GitHub integration for `focusconsulting/focus-website` and
   select this repository.
3. Use the Astro framework preset, or set the build command to `pnpm build` and
   the output directory to `dist`. Leave the root directory at the repository
   root. Set `NODE_VERSION` to `22` if the project does not inherit Node 22 or
   newer from Cloudflare's current build image.
4. Complete the first deployment, then open the Pages project and go to
   **Settings → Builds & deployments → Configure Production deployments**.
   Turn off **Enable automatic production branch deployments** and save.
5. Under **Preview branch**, select **All non-Production branches**. Cloudflare
   will add a preview URL and check to pull requests whose branches are in this
   repository. Pull requests from forks do not receive preview URLs.
6. Do not attach `focusconsulting.io` or any other production custom domain to
   this Pages project. The `*.pages.dev` hostname is only a preview surface.

Cloudflare's Git integration does not require repository secrets. No
Cloudflare workflow is included because the repository currently has no
Cloudflare credentials configured. If the team later chooses an API- or
Wrangler-driven preview workflow, add the three names in `.env.example` as
GitHub Actions secrets/variables and grant the API token only the Cloudflare
Pages permissions it needs.

References: [Cloudflare Pages Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/),
[branch deployment controls](https://developers.cloudflare.com/pages/configuration/branch-build-controls/),
and [Astro build settings](https://developers.cloudflare.com/pages/configuration/build-configuration/).

## Protect `main`

After `.github/CODEOWNERS` contains the confirmed blog owner handle:

1. Open the GitHub repository's **Settings → Branches** and add a branch
   protection rule for `main`.
2. Enable **Require a pull request before merging**.
3. Require at least one approving review and enable **Require review from Code
   Owners**.
4. Enable **Require status checks to pass before merging**, then select the
   `build` check from the **Build pull request** workflow after it has run once.
5. Recommended: enable dismissal of stale approvals, require conversation
   resolution, block force pushes and deletions, and apply the rules to
   administrators as well.

See GitHub's [branch protection documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule).
