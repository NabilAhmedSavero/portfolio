# Nabil’s portfolio

Next.js App Router, TypeScript, Tailwind CSS, and Sanity CMS. Live production deployment at [nabilsavero.vercel.app](https://nabilsavero.vercel.app), featuring a minimal editorial Home layout and a unified visual project index.

## Run locally

Use Node.js 24 and npm.

~~~sh
npm ci
npm run dev
~~~

Open http://localhost:3000. The public routes are `/` (Home) and `/work` (Work).

The embedded Sanity editor is located at `/studio` and uses Sanity authentication. The project (`8vz5kyiz` / `production`) is configured through ignored local environment variables and Vercel environment settings. Home, Experience items, and Work entries are managed via Sanity CMS with deterministic local fallback data in `src/data/` so the application remains fully renderable when the CMS is unconfigured or offline. Follow [the CMS setup and publishing guide](docs/sanity-setup.md) for schema management and publishing workflows.

## Validation

~~~sh
npm run lint
npm run typecheck
npm run build
~~~

For a local production preview, run `npm run start` after building.

Run `npm run sanity:typegen` after modifying CMS schemas or GROQ queries. Content publication and automatic ISR revalidation on production are verified; dependency and tooling notes are documented in the CMS guide.

## File structure

~~~text
src/
  app/
    globals.css         Shared design foundation and Work layout styles
    (site)/
      layout.tsx        Public document layout and accessibility skip link
      page.tsx          Home view with Sanity CMS and local fallback data
      home.css          Scoped Home typography, spacing, and responsive tokens
      work/layout.tsx   Dedicated navigation, container, and footer for Work
      work/page.tsx     Unified visual project collection
    (studio)/
      layout.tsx        Isolated Studio root layout
      studio/[[...tool]]/page.tsx
  components/
    site-container.tsx  Centered width and shared page padding
    navbar.tsx          Home, Work, and Let’s talk navigation
    section.tsx         Semantic section with linked heading
    work-item.tsx       Project card with image, title, and subtitle
    footer.tsx          Home contact footer and Work layout variant
    local-clock.tsx     Live Balikpapan time (Asia/Makassar)
    rich-text.tsx       Editable paragraphs and validated inline links
  data/
    home.ts             Default Home copy and local image fallbacks
    projects.ts         Default project catalog and local fallback metadata
  sanity/
    schema-types/       Site singleton, Experience, Project, images, paragraphs
    lib/                GROQ queries, data fetching, Home adapters, images, safe links
    structure.ts        Studio content navigation
    types.ts            Generated TypeScript document and query types
docs/
  sanity-setup.md       Configuration, migration, publishing, and handoff guide
public/
  fonts/                Locally served Inter and Geist Mono with licenses
  images/
    home/               Profile and collaboration visual assets
    work-placeholder.svg
~~~

## Design & layout architecture

- Home uses a centered 640px editorial column, centered profile header, left-aligned reading sections, dashed structural boundaries, locally served Inter and Geist Mono fonts, and responsive typography tokens scoped in `src/app/(site)/home.css`.
- Home intentionally omits a top navigation bar for a distraction-free reading flow, while `/work` retains dedicated top navigation. Profile and collaboration assets are managed dynamically in Sanity without altering layout geometry.
- Work’s column grid, spacing, typography, and image proportions are isolated in `src/app/globals.css` to keep route styles decoupled.
- Project images, alt text, and subtitles are managed in Sanity with `src/data/projects.ts` acting as a type-safe local fallback. `WorkItem` uses `next/image` with responsive `sizes="100vw"`, and `next.config.ts` strictly whitelists the configured Sanity image CDN path.
- Responsive About copy adapts across breakpoints via the optional **About on tablet/mobile** CMS field below 1200px, falling back to the primary About content across all viewports when unset.
- External collaboration links and a direct `mailto:` contact handler are validated for safety. Heavy third-party animation or icon libraries are intentionally omitted to maintain zero layout shift and fast initial page loads.

## Vercel deployment

The production deployment is live at [nabilsavero.vercel.app](https://nabilsavero.vercel.app), running on the **Next.js** preset and Node.js 24. The repository is version-controlled on GitHub and deployed via Vercel with continuous integration and authenticated Vercel CLI support.

Public Sanity identifiers are configured across Production, Preview, and Development environments. Updating `NEXT_PUBLIC_` environment variables requires a build redeployment, whereas CMS content updates propagate automatically via 60-second ISR revalidation without requiring source code changes or manual redeployment. Local `.env*` and `.vercel` directories are strictly excluded via `.gitignore` and `.vercelignore`.
