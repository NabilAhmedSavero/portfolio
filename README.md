# Nabil’s portfolio

Next.js App Router, TypeScript, Tailwind CSS, and Sanity CMS. Home follows the rendered [published Framer page](https://nabilsavero.framer.website/) inspected on October 8, 2026. Work remains the existing structural foundation; its final visual design is still pending.

## Run locally

Use Node.js 24 and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. The routes are `/` (Home) and `/work` (Work).

The embedded Sanity editor is at `/studio` and uses Sanity authentication. The existing project `8vz5kyiz` / `production` is configured through ignored local environment variables and Vercel settings. Home and the two Experience items are published with the exact reference copy and original images. Work remains on its local placeholders. Follow [the CMS setup and publishing guide](docs/sanity-setup.md) for editing and publishing. Local content remains available when the CMS is unconfigured or unavailable.

## Validation

```sh
npm run lint
npm run typecheck
npm run build
```

For a local production preview, run `npm run start` after building.

Run `npm run sanity:typegen` after changing CMS schemas or queries. Initial publication and the staging site's automatic revalidation have been verified; dependency/tool notices are recorded in the CMS guide.

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

The existing staging deployment is [nabil-portfolio-staging.vercel.app](https://nabil-portfolio-staging.vercel.app), using the **Next.js** preset and Node.js 24. The local directory is linked to `saverovkn-7205s-projects/nabil-portfolio-staging`. No custom domain or GitHub repository has been created. Git tracks the source locally; deployment uses the authenticated Vercel CLI.

The two public Sanity identifiers are configured for this staging project's Production, Preview, and Development environments. The staging site uses Vercel's Production target on its temporary `vercel.app` domain; this is separate from a future final-domain website. Updating `NEXT_PUBLIC_` identifiers requires redeployment; content publishing uses the existing 60-second revalidation and does not require source edits or a deployment. The initial Home/Experience publish was verified on staging without another deployment. `.env.local` and `.vercel` are ignored by Git and excluded from CLI uploads.
