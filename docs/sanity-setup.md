# Sanity CMS connection and publishing

The portfolio uses the official `next-sanity` integration, Sanity Studio, Sanity TypeGen, Portable Text, and `@sanity/image-url`. No Sanity project has been created or connected, and no content has been uploaded by this implementation.

## What is ready

- `/` follows the published Framer Home with local reference copy/assets when Sanity is unconfigured. `/work` retains its foundation layout, navigation, and six placeholder projects. Home's styles are scoped so the Work layout is preserved.
- `/studio` mounts the official Sanity editing interface after configuration. Without configuration, it displays connection instructions and makes no CMS requests. Studio has a separate root layout so public CSS and navigation do not affect the editor.
- Home / Site Content is registered as a native Sanity singleton with document ID `siteContent`. Experiences and Projects are regular documents. Studio organizes these into three entries.
- Queries and document types are generated from the real schemas using Sanity TypeGen. `src/sanity/types.ts` is generated source; regenerate it rather than editing it. It is excluded from ESLint because the generator emits a compatibility interface that triggers an ESLint rule; TypeScript still checks it.
- The server client always uses `perspective: "published"`. Collection queries also exclude draft/release IDs and require `isVisible == true`. A draft edit never replaces the published version on the public website.
- Image URLs use Sanity’s official builder. Next.js allows images only from the configured project/dataset on `cdn.sanity.io`.
- The existing six local project records remain in `src/data/projects.ts`. Nothing was automatically imported or attributed.

## Connect your account manually

1. Sign in to [Sanity Manage](https://www.sanity.io/manage) with your own Sanity account and create a project. Use a plan suitable for a single editor; no paid plugin is required here. Do not run a scaffolding initializer over this existing project.
2. Create a dataset named `production`, or choose an existing dataset and use its exact name. A **public** dataset allows the website to read published content without an API token. Public reads and private editing are separate: editing still requires Sanity authentication and project permissions. Keep only your intended account as a project member, including any organization-level access.
3. Copy the Project ID from the project settings. In `D:/Portfolio`, copy `.env.example` to `.env.local`, then set these two values locally:

   ```dotenv
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_actual_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   ```

   Project ID and dataset are public identifiers. Leave `SANITY_API_READ_TOKEN` empty for a public dataset. `.env.local` is ignored by git.

4. If you deliberately choose a **private** dataset on a plan that supports it, create a read-only **Viewer** token in Sanity Manage → API → Tokens and set it as `SANITY_API_READ_TOKEN` in `.env.local`. Private datasets currently require the Growth plan; they are not needed for authenticated Studio editing. Use the same server-only variable in Vercel later. Never give this variable a `NEXT_PUBLIC_` prefix, and never use an Editor/write token for public reads. The token is accessed only in a `server-only` module; it is not passed to Studio or browser code. Sanity media asset URLs are served by its image CDN; dataset privacy does not make image URLs secret.
5. In Sanity Manage → API → CORS origins, add `http://localhost:3000` with **Allow credentials** enabled so Studio can use authenticated browser requests. If you use `127.0.0.1` or a different port, add that exact origin too. When a Vercel website exists, add its exact HTTPS origin with credentials enabled. Add preview origins individually when you need to edit there. CORS is not an authentication system.
6. Run `npm run dev`, open `http://localhost:3000/studio`, and sign in using Sanity’s built-in login. Only accounts permitted by your Sanity project can edit. No application password, admin API, or separate login is needed.

Account creation, project membership, real dataset access, CORS, login, image uploads, and publishing cannot be verified until you complete these steps. Do not put account passwords or tokens in source files.

## Enter and migrate content

Open **Home / Site Content** to edit the fixed site document. Blank optional fields keep local reference content where relevant. About supports multiple paragraphs and inline links. **About on tablet/mobile** is an optional override below 1200px, matching the reference's different smaller-screen copy; leave it empty to use the main CMS About everywhere. The freelance price field stores the complete display paragraph, including the price. **Currently contact introduction** and its CTA fields form the last Currently paragraph. Social links have a label (such as X/Twitter) and an optional displayed link text (such as Saverovkn).

Create **Experience** documents with the supplied position, company, period, and description. Periods are free-form text and are rendered as entered. The optional image has its own alt text. Set **Display order** to an integer; smaller numbers appear first. Turn on **Visible on website**, then **Publish**. Changing a draft field alone has no public effect. Publish visibility/order changes, unpublish an item, or delete it through Studio to change the public collection.

The two reference Experience items are local fallbacks for missing configuration or failed requests. Once connected, a successful empty CMS Experience collection is respected, including when you intentionally unpublish/delete every item. Add and publish the intended Experience documents when connecting the project.

Create **Work / Projects** documents using the existing names—Plied, Faction, Kumala Sari, Evaware, AI note-taking app, and Scribe—only where you intend to include them. Supply your own short subtitles, covers, and alt text. Additional images and an external URL are optional. There are no categories, tags, dates, or case-study pages. Visibility and order work the same way as Experience.

After checking the project documents and uploaded assets in Studio, enable **Use CMS project collection** under Home / Site Content → Publishing and publish the singleton. This is the migration cutover:

- Off or absent: the Work page uses the untouched local collection.
- On: the Work page uses only published, visible CMS projects. Zero visible projects produces an empty collection; it does not resurrect placeholders when you intentionally hide, unpublish, or delete every project.
- An unavailable CMS request uses the local fallback and emits a generic server warning. After an outage, cached content can remain visible until a successful revalidation.

Confirm the Work page after publishing. Turning the switch off and publishing restores the local collection. No seed/import script has been run; migration remains a manual, reviewable account-side step.

## Fields connected to the public pages

Home renders hero display name/role/profile image/alt text, the location label, About, Currently paragraphs, the freelance display paragraph, contact introduction/CTA, Experience text/images, contact email/social links/display text, and footer text. The live clock uses `Asia/Makassar`. Published CMS values override the Framer fallback data through `src/sanity/lib/home.ts`; presentation components do not contain portfolio copy.

Work uses the enabled CMS project collection, including cover image/alt text, project name, subtitle, and optional external URL. Additional project images remain modeled and queried for future presentation; no gallery or case-study feature has been added. Experience and Project schemas remain unchanged. Three optional Site fields were added for the visible Home composition: smaller-screen About, Currently contact introduction, and social-link display text. Existing documents remain compatible.

## How publishing updates Vercel

For the initial connection, add the same environment variables to the intended Vercel environments, then build/deploy the code when you choose to do so. Public `NEXT_PUBLIC_` configuration and the Studio bundle are fixed during build, so changing project/dataset variables requires another deployment. This implementation has not deployed or pushed anything.

After connection, **content publishing does not need a redeploy**. All CMS reads use Next.js’s server data cache with a **60-second revalidation interval** and `useCdn: false` to avoid a second cached response layer. This includes shared footer data on both pages. Revalidation is request-driven: the first request after the interval may receive the old page while Next.js refreshes it in the background; subsequent requests see the updated content after successful regeneration. A page already open in a browser needs a refresh/navigation to see the change. This is not live preview or a guarantee that every visitor sees a change at exactly 60 seconds.

Publishing visibility/order changes, unpublishing, and deleting documents all flow through this same cache strategy. No webhook secret, API route, paid service, or draft-preview token is required. If fetches fail, check environment variables, dataset access, and Vercel logs. Private datasets can return an empty HTTP 200 response without a usable read token; if Studio has published documents but the site still shows fallbacks, check the server token before assuming documents are missing. The client deliberately logs no tokens or request details.

Schemas/configuration and presentation code are deployed code; changes to those still require a build/deployment. Future Framer visuals can use the same queries without changing the content model or adding an admin system.

## Development checks

```sh
npm run sanity:typegen
npm run lint
npm run typecheck
npm run build
```

Schema extraction/type generation work without account credentials. The extraction script overwrites only its generated `sanity-schema.json`, so repeated runs work. The extracted file is ignored; generated `src/sanity/types.ts` should stay with source. Regenerate after changing schemas or queries. Only Sanity’s built-in Structure tool is enabled—no paid plugin or Visual Editing/draft mode was added.

Verified locally: schema extraction/TypeGen, lint (zero warnings), TypeScript checks, and the production build all passed without CMS variables. Fixture checks exercised the actual GROQ queries and content helpers for draft/release exclusion, visibility, ordering, free-form periods, URL handling, published fetch/cache options, and unconfigured/outage/empty collection behavior. Production HTTP checks passed for `/`, `/work`, `/studio`, a nested Studio URL, and the placeholder asset. These checks do not establish that a real account login, upload, migration, or live publish has succeeded.

## Official references

- [Embedding Studio in Next.js](https://www.sanity.io/docs/nextjs/embedding-sanity-studio-in-nextjs)
- [Caching and revalidation](https://www.sanity.io/docs/nextjs/caching-and-revalidation-in-nextjs)
- [Sanity TypeGen](https://www.sanity.io/docs/apis-and-sdks/sanity-typegen)
- [Native singleton structure](https://www.sanity.io/docs/studio/structure-builder-cheat-sheet)
- [CORS configuration](https://www.sanity.io/docs/content-lake/cors)
- [Public and private datasets](https://www.sanity.io/docs/content-lake/datasets)

## Technical readiness audit — October 8, 2026

Home, Experience, and Projects were checked against the extracted schemas, generated query types, content helpers, and actual presentation components. Fixture checks cover published singleton selection, draft/release exclusion, visibility, display order, free-form periods, inline links, empty documents, missing images, missing configuration, and request failures. The installed SDK was also checked under its React Server export condition: it forwards `perspective: "published"` and `next.revalidate: 60` to native fetch. This verifies the configured cache mechanism, not a real publish-to-Vercel cycle.

The `/studio` route uses the official `NextStudio` component with the standard Sanity `Studio` authentication boundary. No custom authentication store, bypass flag, write token, mutation endpoint, or application login was introduced. The installed authentication boundary sends signed-out users to login and authenticated accounts with no project roles to an unauthorized/access-request screen. Content Lake independently requires authenticated project permissions for writes; see [Authentication and tokens](https://www.sanity.io/docs/content-lake/http-auth) and [Roles](https://www.sanity.io/docs/user-guides/roles). The Studio shell can be loaded publicly; loading that shell does not grant editing access. Account-specific authorization still needs the manual check below.

### Dependency findings and fixes

The initial full audit reported **20 affected package entries: 11 high and 9 moderate**, derived from **11 direct advisories**. npm also flags parent packages through dependency chains; these are not 20 independent application vulnerabilities.

Scoped overrides under `@vercel/frameworks` now use **`js-yaml` 3.15.2** and **`smol-toml` 1.9.0**. Both remain within the existing major versions. This removes five direct YAML advisories and three direct TOML advisories. The actual framework configuration reader was checked against YAML/TOML fixtures; its `safeLoad`/`parse` calls and configuration fields remain compatible. TOML now uses safer null-prototype records, and this reader's consumers use field access. Direct Next.js, Sanity, and React versions were preserved. No forced audit fix or breaking upgrade was used.

The final full audit reports **19 affected entries: 9 high and 10 moderate**. `npm audit --omit=dev` still reports **17: 7 high and 10 moderate**, because Sanity ships its CLI in its production dependency graph. Production dependency classification alone does not prove that vulnerable code runs on public requests.

All 20 original entries were classified by actual use:

- **Lint and schema/code-generation tooling:** `braces`, `micromatch`, `fast-glob`, `globby`, `chokidar`, `@sanity/codegen`, `@next/eslint-plugin-next`, and `eslint-config-next`. The remaining [braces advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) concerns deeply nested glob patterns. These tools process repository paths/configuration, not portfolio content or public request input. There is no patched braces release in the current major.
- **CLI framework/configuration parsing:** `@vercel/frameworks`, `js-yaml`, `smol-toml`, `argparse`, and `sprintf-js`. The parser advisories are patched. `js-yaml` remains flagged through `argparse` → `sprintf-js`; the remaining [sprintf advisory](https://github.com/advisories/GHSA-hp3w-g68c-fv3c) concerns attacker-controlled precision format strings. This is a CLI argument/help-formatting chain, not a public-page formatter. No patched sprintf release is available.
- **CLI identifier generation:** `typeid-js` and its nested `uuid` 10. The [uuid advisory](https://github.com/advisories/GHSA-w5hq-g745-h8pq) affects v3/v5/v6 with a caller-provided buffer. The installed TypeID implementation uses v7 with a fixed 16-byte buffer and `stringify`, not the affected functions. Its current release still requires uuid 10; forcing uuid 11 would cross its supported major range.
- **Parent-package propagation:** `@sanity/cli`, `@sanity/cli-build`, `@sanity/runtime-cli`, `sanity`, and `next-sanity` are flagged through the above chains, not separate direct advisories in the Studio editor or public content client. The Studio's library imports the CLI only through the unused `sanity/cli` entry point.

No exposed production exploit path was identified in the current code. The vulnerable leaf packages are absent from the production route file traces and their package paths were not found in emitted application chunks; the flagged `sanity`/`next-sanity` parents themselves are necessarily bundled. Remaining findings are real upstream/tooling concerns, not a clean security audit. Keep lint/CLI inputs trusted and recheck upstream patches before future upgrades; do not force major replacements merely to reduce the reported count. The ESLint support notice and Sanity CLI telemetry initialization notice are non-blocking tool notices.

### Remaining account-side verification

No real project configuration is present, so live login, permissions, uploads, and publishing remain untested. After following the connection steps above:

1. Check Sanity project and inherited organization membership; only your intended account should have editing permissions.
2. Open `/studio` in a signed-out/incognito browser and confirm login is required. A Sanity account without project access should be denied editor access; signing in alone must not grant project permissions.
3. Enter your actual content and publish. For Projects, enable and publish the existing **Use CMS project collection** switch after verifying the migration.
4. Confirm a draft-only change stays off the public site. Publish that change, request the website after the 60-second interval, and refresh again after regeneration to confirm it appears. Verify the same on Vercel after your initial deployment, including its environment variables and credential-enabled CORS origin.

The existing public page/component/style files and local six-project collection were preserved during this technical audit. Home was subsequently implemented from the published Framer reference; Work's page, project data, navigation component, WorkItem, Experience/Project schemas, and published client configuration remain intact. Future visual changes can use the current typed queries without CMS restructuring.
