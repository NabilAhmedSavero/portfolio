# Nabil’s portfolio

Next.js App Router, TypeScript, Tailwind CSS, and Sanity CMS. Home follows the rendered [published Framer page](https://nabilsavero.framer.website/) inspected on October 8, 2026. Work remains the existing structural foundation; its final visual design is still pending.

## Run locally

Use Node.js 24 and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. The routes are `/` (Home) and `/work` (Work).

The embedded Sanity editor is at `/studio`. It shows setup instructions until connected. Follow [the CMS setup and publishing guide](docs/sanity-setup.md) for the exact account, environment, CORS, content migration, and Vercel steps. The public website continues to use its local fallbacks without a connected CMS.

## Validation

```sh
npm run lint
npm run typecheck
npm run build
```

For a local production preview, run `npm run start` after building.

Run `npm run sanity:typegen` after changing CMS schemas or queries. Account connection and live publishing require manual verification; dependency/tool notices are recorded in the CMS guide.

## File structure

```text
src/
  app/
    globals.css         Shared foundation and unchanged Work styles
    (site)/
      layout.tsx        Public document layout and skip link
      page.tsx          Framer Home with CMS/local content
      home.css          Scoped Home typography, spacing, and responsive styles
      work/layout.tsx   Existing navigation, container, and footer for Work
      work/page.tsx     Unified visual project collection
    (studio)/
      layout.tsx        Isolated Studio root layout
      studio/[[...tool]]/page.tsx
  components/
    site-container.tsx  Centered width and shared page padding
    navbar.tsx          Home, Work, and Let’s talk
    section.tsx         Semantic section with a linked heading
    work-item.tsx       Image, project name, and short subtitle
    footer.tsx          Home contact/footer and unchanged Work variant
    local-clock.tsx     Live Balikpapan time (Asia/Makassar)
    rich-text.tsx       Editable paragraphs and safe inline links
  data/
    home.ts             Published Framer Home copy and current image fallbacks
    projects.ts         The six supplied project names and placeholder content
  sanity/
    schema-types/       Site singleton, Experience, Project, images, paragraphs
    lib/                Published queries, fetching, Home adapters, images, safe links
    structure.ts        Studio content navigation
    types.ts            Generated document and query types
docs/
  sanity-setup.md        Manual connection, migration, publishing, and handoff
public/
  fonts/                Locally served Inter and Geist Mono with licenses
  images/
    home/               Current Framer profile and Serving Hours assets
    work-placeholder.svg
```

## Design handoff

- Home uses the reference's centered 640px column, centered profile/name/role, left-aligned reading sections, dashed boundaries, Inter/Geist Mono, and responsive copy. Its style tokens live in `src/app/(site)/home.css`; its content stays in Sanity or `src/data/home.ts`.
- Home has no navbar because the published reference has none and the final navbar is pending. Work keeps its original navigation. The current profile asset is provisional and can be replaced in Sanity without changing the layout.
- Work’s temporary column, spacing, typography, and image proportions remain in `src/app/globals.css`. Implement its final Framer design separately.
- Manage connected project images, alt text, and subtitles in Sanity. The original `src/data/projects.ts` remains the local fallback. `WorkItem` uses `next/image`; its conservative `sizes="100vw"` can be refined when the final layout is known. `next.config.ts` permits only the configured Sanity image CDN path.
- Home’s smaller-screen About copy matches the reference. The optional **About on tablet/mobile** CMS field overrides it below 1200px; otherwise an existing CMS About value is used on all screen sizes.
- Home links use the published destinations, with the email corrected to a working `mailto:` link. The hosting badge and Framer scroll reveal effects are omitted. There are no Education, case-study, or selected-work sections on Home.

No animation or icon libraries, forms, or case-study routes were added. Fonts are served locally. Sanity provides the editing infrastructure.

## Vercel

Import this project into Vercel with the **Next.js** framework preset, Node.js 24, and the default install/build/output settings. Without CMS variables it runs with local content. Add the Sanity variables described in the CMS guide when connecting the CMS. Deployment has not been performed.
