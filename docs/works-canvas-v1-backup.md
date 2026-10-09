# Works canvas v1 backup

Backup recorded on October 10, 2026 (Asia/Makassar), before any Photography Gallery redesign.

## Git snapshot

- Backup branch: `backup/works-canvas-v1`.
- Development branch at capture: `main`.
- Scope: the complete working portfolio source, including the refined 2D Works canvas, existing Home, floating navigation, page/entrance animations, Sanity integration, and local fallbacks.
- No Git remote was configured at capture; this snapshot is local-only.
- Local environment files, credentials, dependencies, caches, logs, and generated build artifacts are excluded from the backup commit.

Resolve the exact snapshot commit with `git rev-parse backup/works-canvas-v1`. Keep this branch unchanged when developing a replacement gallery.

## Deployed version reference

- Public staging alias: https://nabil-portfolio-staging.vercel.app/work
- Deployment-specific URL: https://nabil-portfolio-staging-hlln2y8du-saverovkn-7205s-projects.vercel.app/work
- Deployment ID: `dpl_9kj2CnZ4X7tUKyGzVnPGmurnUrEn`.
- Vercel project: `saverovkn-7205s-projects/nabil-portfolio-staging`.
- Deployment details: https://vercel.com/saverovkn-7205s-projects/nabil-portfolio-staging/9kj2CnZ4X7tUKyGzVnPGmurnUrEn
- Verified status at deployment: `READY`; the public staging alias was accessible without login. The deployment-specific URL may require existing Vercel authentication.

The staging alias can change with future deployments. Use the deployment-specific URL and ID to identify this canvas version.

## Preserved canvas behavior

- Independent images in a freely pannable 2D canvas, configurable maximum of five columns, and automatic rows.
- Six current fallback frames, with Plied first; additional Sanity images remain independent entries.
- Approximately 780px maximum desktop frame width, original image proportions, uncropped screenshots, and Home body typography for labels.
- Initial load and Reset center the first frame, select `1 / 6`, and restore 100% zoom.
- Previous/Next use a 550ms `cubic-bezier(0.22, 1, 0.36, 1)` pan; direct drag/wheel panning remains immediate.
- Canvas zoom range: 35–250%, with buttons, Control/Command wheel focal zoom, and touch pinch handling.
- Selected label and 2px outline: `#2D806F`; the counter follows selection with stable nearest-frame behavior during manual panning.
- Click-to-inspect, Back/Escape, reduced-motion support, and responsive dock controls.

Lint, typecheck, production build, 18 focused interaction check groups, and staging browser checks passed before capture. Physical-device pinch testing remains pending; its production handlers were tested automatically.

Primary canvas files: `src/components/work-canvas.tsx` and `src/app/(site)/work/work.css`. Image ordering and proportions are supported by `src/data/projects.ts`, `src/sanity/lib/content.ts`, and `src/sanity/lib/images.ts`.
