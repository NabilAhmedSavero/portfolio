# Nabil Portfolio Project Handoff

**Prepared: 10 October 2026**\
**Purpose:** Complete handoff of project context, preferences,
decisions, alternatives, technical history, and next steps for
continuing with Gemini or another coding assistant.

## 1. Read first: project goals and working style

Nabil is a Product & Web Designer based in Indonesia, building a
personal portfolio to help secure studio/product-team opportunities,
referrals, and freelance work.

His priorities: 1. **Wow:** distinctive and art-directed. 2. **Easy to
access:** obvious navigation. 3. **Easy to understand:** no instructions
needed to browse. 4. **Easy to explore:** clients should not feel tired
or confused.

These must be balanced. A novel interaction is not automatically good if
it makes the work harder to browse.

### Collaboration preferences

-   Be direct and genuinely critical. Do not agree reflexively.
-   Avoid generic praise, bloated explanations, and unnecessary
    complexity.
-   Never invent decisions, features, facts, implementation status, or
    client relationships.
-   Clearly distinguish confirmed decisions from proposals and
    unresolved choices.
-   If asked for a coding prompt, provide a complete copyable Markdown
    prompt in one fenced block.
-   Avoid vague instructions like "make it cool." Describe layout,
    interaction, motion, and visual details.
-   No random emojis.
-   **Never use em dashes in portfolio copy.** Nabil feels they look
    AI-written.
-   Copy should sound human, simple, specific, and natural, not
    corporate or buzzword-heavy.
-   When comparing screenshots, analyze what is actually visible rather
    than imagining differences.
-   Avoid overengineering. Keep V1 focused.

## 2. Links and technical context

### Websites

-   Current staging: https://nabil-portfolio-staging.vercel.app/work
-   Earlier experimental Framer URL:
    https://magenta-basis-312155.framer.app/
-   Public portfolio URL referenced earlier:
    https://nabilsavero.framer.website/
-   Kumala Sari project: https://kumalasari.framer.website/#hero
-   Smintfy: https://www.smintfy.com/
-   Mateo CV: https://mateo-cv.framer.website/
-   Osha Helawan: https://oshahelawan.framer.website/
-   Alim Joldaspayev: https://alimdesigner.com/
-   Skale portfolio: https://skale.solutions/portfolio
-   Ibelick: https://ibelick.com/

### Codebase

-   Local path: `D:/Portfolio`
-   Next.js App Router, TypeScript, Tailwind CSS, deployed to Vercel.
-   Existing Sanity integration.
-   Routes: `/` (Home), `/work` (Works).
-   The staging code and public Framer site may not be the same
    implementation. Do not assume otherwise.

### Existing backup

The earlier canvas version was backed up: - Branch:
`backup/works-canvas-v1` - Commit:
`85345e27609a4531dbdebf4227a52dcb327f0312` - Backup is **local-only**.
No Git remote was configured. - Backup record:
`D:/Portfolio/docs/works-canvas-v1-backup.md` - The backup was made
before the proposed vertical-gallery pivot. - Do not delete this branch.
Check current Git status/branch before modifying anything.

## 3. Why the portfolio exists

Nabil works across product design, web design, dashboards, complex
workflows, and interface interaction details. He uses Figma and has used
Framer to design and publish websites.

The site should help him: - Get referred to product/design studios. -
Find Product Designer or Web Designer roles. - Find teams building
digital products. - Get freelance projects. - Show product design depth,
not just marketing pages. - Present himself as a real person with clear
taste, not a fake personal-brand persona.

His work with Serving Hours was paused indefinitely because the studio
owner/friend paused studio operations. The friend suggested Nabil pursue
other studio/product-team roles and asked if he could help. The friend
also asked whether Nabil had a personal website, which prompted this
portfolio work.

## 4. References and how to use them

References are inspiration for specific qualities, not templates to
clone.

### Smintfy

https://www.smintfy.com/ - Thin, centered layout. - Human, simple
presentation. - Separate Home and Work pages. - Visual-first work
presentation. - Concise availability/presence section. Use for
structural clarity and human tone, not as an exact copy.

### Mateo CV

https://mateo-cv.framer.website/ - Useful thin, centered CV structure. -
Clear profile and experience. - Not visual enough to be the primary
work-gallery reference.

### Osha Helawan

https://oshahelawan.framer.website/ - Useful for content patterns,
project context, and availability. - Nabil does **not** want the wide
layout.

### Alim Joldaspayev

https://alimdesigner.com/ - Aspirational reference for showing work
boldly and visually. - His gallery uses 3D/horizontal browsing:
scroll/arrows, horizontal drag, click/tap to focus, Escape to return. -
Nabil sees Alim as much more advanced and worries that a free-moving
canvas would look derivative of Alim. - Use for ambition and
presentation quality, not as the interaction blueprint to copy.

### Skale

https://skale.solutions/portfolio - Nabil supplied a screenshot of a
clean white page, a strong central headline, and a row/grid of large
project visuals. - Strong at clarity, scanability, and making projects
the focus. - Use for simplicity and direct browsing, not necessarily as
a literal layout.

### Ibelick

https://ibelick.com/ - Useful for personal copy that feels human and
specific. - Simple sentences and personal preferences beat generic
polished positioning statements. - Avoid buzzword stacks and "designer
brand" language.

## 5. Overall architecture and layout

-   Separate `/` Home and `/work` Works pages.
-   Thin, centered max-width, not a wide layout.
-   Main reading axis is left-aligned.
-   Header and body share the same alignment/max-width.
-   Header likely has `Home` and `Work`/`Works` on the left, with a
    human CTA such as `Let's talk` on the right.
-   Avoid extra navbar links and unnecessary logos if the hero already
    identifies Nabil.
-   Minimal, professional, dense enough to be useful, not empty for the
    sake of whitespace.
-   Work visuals should do most of the selling.
-   Avoid generic AI portfolio styling.

## 6. Home page content

A possible flow: 1. Hero / identity 2. About 3. Currently 4. Experience
5. Education if useful, secondary 6. Contact/footer

`Currently` was intended after About and before Experience, making the
flow: who Nabil is → what he focuses on → what he is open to →
experience supporting it.

### About copy: not final

Earlier baseline: \> I'm Nabil, a Product & Web Designer based in
Indonesia. I design AI products, complex digital tools, and web
experiences, with a focus on making dense workflows feel clear and easy
to use. \> \> I care about thoughtful interactions, clear visual
hierarchy, and interfaces that feel intentional without getting in the
way.

This was considered as three separate rows: 1.
`I’m Nabil, a Product & Web Designer based in Indonesia.` 2.
`I design AI products, complex digital tools, and web experiences, with a focus on making dense workflows feel clear and easy to use.`
3.
`I care about thoughtful interactions, clear visual hierarchy, and interfaces that feel intentional without getting in the way.`

A more human alternative inspired by Ibelick: \> Hi, I'm Nabil, a
Product & Web Designer based in Indonesia. \> \> I like working on
complex products and figuring out how to make them feel simple and easy
to use. \> \> I also design and build websites, and I care a lot about
the small interaction and visual details that make an interface feel
right.

**None of these is locked.** Tune for naturalness and truth. Do not list
projects in About. No em dashes.

### Currently section: baseline, not final

The section name chosen is **Currently**, not `Present`, `Availability`,
`Now`, or `Open to work`.

It must communicate two separate things: 1. Nabil is open to joining
design studios/product teams. 2. Nabil takes freelance projects and
wants to show a starting price.

Current baseline: \> I'm currently open to joining design studios and
product teams, especially those working on interesting digital products.
\> \> I also take on freelance projects, starting at \$1,000 depending
on the scope. \> \> If you think we'd be a good fit, let's talk.

Important: - \$1,000 is a freelance project/engagement starting price,
not a salary or hiring rate. - Do not remove the price reflexively. -
Not an hourly rate. - Keep tone direct and human. - `Let's talk` is the
preferred CTA direction.

### Body text colors

-   Use neutral dark gray for body copy, slightly darker than washed-out
    gray.
-   Headings near-black.
-   Green accent sparingly for links, selected/active states, or small
    details.
-   Do not color whole paragraphs green.
-   Let work visuals carry the attention.

## 7. Work page content and project truthfulness

### Firm rules

-   Call the page `Work` or `Works`, not `Designs`.
-   One unified collection. **Do not split out an `Explorations`
    section.**
-   Real, collaborative, concept, and academic projects can appear
    together.
-   Be truthful: do not present concepts as commissioned client work.
-   If needed, use a small honest qualifier such as `concept` or
    `academic project`, but do not visually demote it into a separate
    section.
-   Large visual + project name + at most one concise explanatory line.
-   Avoid excess metadata (`Product Design`, `Web Design`, `Ongoing`,
    `Collaboration`, dates, tags) unless actually useful.
-   Avoid case-study-heavy descriptions. The image should do most of the
    selling.
-   Do not split two aspects of one project into separate portfolio
    projects when they belong together.

### Project pool

**Plied** - AI investing platform. - Nabil designed substantial product
depth: agents, activity, approvals, journal/history, settings, risk
controls, and interaction states. - Likely flagship because it shows
product design thinking beyond visual marketing. - Suggested descriptor:
`AI investing platform`.

**Faction** - Nabil contributed product design in collaboration with his
friend/Smintfy. - Public positioning: AI operations platform for
manufacturers and distributors. - Areas mentioned: quoting, order entry,
pricing, procurement, product data, AP/AR. - Do not imply Nabil designed
all of Faction if he worked on only part. - Suggested descriptor:
`AI operations platform for manufacturers and distributors`.

**Kumala Sari** - Website: https://kumalasari.framer.website/#hero -
Practical website for a local/family fashion retail store. -
Catalog/collections, ordering guidance, WhatsApp conversion, About,
location/store info, FAQ, contact/support. - Demonstrates design and
implementation/publishing. - Suggested descriptor:
`Retail catalog website for a local fashion store`.

**Evaware** - Academic team project, not client work. - ERP concept:
dashboard, projects/kanban, CRM, HR, operations. - Landing page is part
of Evaware, not a separate project. - Suggested descriptor:
`ERP platform concept for projects, CRM, HR, and operations`.

**AI note-taking app** - Mobile app concept. - Two versions: an older
posted version and a stronger 2025 version that was not posted and was
used as a campus project. - Prefer the 2025 version if visuals are
stronger.

**Scribe landing page concept** - Unofficial concept based on Scribe:
https://get.scribehow.com/lp-1/?via=toolfolio - Landing page with hero,
product visualization, CTA, and social-proof/logo strip. - Nabil
rejected removing dummy/public-proof logos from the design itself
because they are part of a realistic landing-page composition. - The
design may retain those logos, but portfolio copy must not falsely claim
those brands are Nabil's clients/users. - Suggested descriptor:
`Landing page concept for an AI documentation tool`.

**Travel app concept** - Academic startup concept for discovering
tourist places, planning trips/visits, and leaving reviews/guides. -
Optional. Include only if visual quality is competitive.

Avoid: - Old/weak mobile ERP version. - Older note-taking version if
2025 is stronger. - Listing the Evaware landing page as a separate
project.

## 8. Works gallery: options and history

### Option A: free 2D canvas (old implementation)

The first major direction was a full-viewport 2D canvas replacing a 3D
carousel: - Six frames arranged 5 + 1. - Automatic rows, no empty
placeholder slots. - Two-axis drag/wheel panning. - Image inspection. -
Back/Escape. - Previous/Next/Reset dock. - Home animations and Sanity
preserved. - Column limit configurable in `work-canvas.tsx` near line 9
at the time. - Reported: lint/typecheck/build and 12 integration groups
passed; desktop and mobile-sized browser checks passed. - Physical touch
testing was not verified.

Problems Nabil found: - Initial/reset position started at Kumala Sari in
the middle instead of Plied/top-left. - Positioning felt odd and text
was clipped in some views. - Arrow motion felt too fast. - Zoom-in
existed but zoom-out was missing at one point. - Mobile nav/dock felt
awkward. - `+`, `-`, and text `Reset` looked like tool/debug controls. -
Spacing/separators in the dock felt unbalanced. - Selected outline
needed to fit the green palette, not Alim's blue. - Title was too big
and font didn't fit. - Nabil worried it was too similar to Alim and too
much like a tool.

**Verdict:** Keep only as a backed-up fallback, not the default
direction.

### Option B: stacked-card / Polaroid deck

Concept: - Stack of photo prints. - On swipe/scroll, top print moves out
of the stack and next print appears.

Pros: - Memorable, tactile, visually distinct. - Less directly
derivative of Alim.

Risks: - Can become gimmicky. - Can tire users with many projects. -
Mobile browsing can become awkward. - Motion may overpower the actual
work.

Verdict: interesting experiment, but not the safest primary browsing
experience.

### Option C: vertical scroll gallery + photographic prints + focus overlay

**Latest provisional direction, and the user agreed to try it.** Not
necessarily implemented yet.

Concept: - Normal vertical scrolling, not a free-panning canvas. - Each
work appears as a white photographic print / Polaroid-inspired card. -
Image on top, title in the white bottom margin. - Small per-card
rotation for a hand-arranged feel. - Clicking/tapping a card makes it
feel physically lifted from the wall/stack and brought toward the
viewer. - The selected print straightens, scales up, moves toward the
center, and becomes crisp/prominent. - Background dims and blurs
lightly. - Closing returns it smoothly to its original place.

Why: - Memorable but familiar. - Clear for non-designer clients. - Less
directly similar to Alim. - Keeps the tactile print concept without
forcing users to learn canvas navigation.

#### Visual details

-   White print/card.
-   Main image above, white title margin below.
-   Subtle border around `1px solid rgba(35,35,35,0.1)`.
-   Soft realistic diffuse shadow, not harsh black shadow.
-   No fake vintage paper texture.
-   No heavy frame/bezel.
-   Preserve image aspect ratio.
-   White UI screenshots must remain distinguishable against white card
    through spacing/border/image framing.
-   Subtle rotation, roughly `-2.5deg` to `+2.5deg`, varied left/right.
-   Avoid chaos and maintain enough spacing.
-   One clear vertical reading path, not a chaotic masonry wall.

#### Typography

Nabil wants an artistic / photography-inspired title, somewhat
handwritten in spirit but easy to read. Do not use illegible script
fonts. Candidate fonts discussed: - **Cormorant Garamond:**
artistic/editorial and distinctive. - **Newsreader:** refined and
contemporary. - **Instrument Serif:** expressive/editorial. No font is
locked. Compare actual rendered samples and keep titles understated, not
oversized. Avoid unnecessary font-loading dependencies.

#### Focus/open interaction

On click/tap: - The selected card feels picked up from its location. -
It lifts, scales smoothly, moves to a centered viewing position. -
Rotation resolves to `0deg` or nearly straight. - Shadow becomes
stronger but remains soft. - Dark overlay with low opacity plus subtle
backdrop blur. - Selected image stays crisp. - Click outside closes. -
Escape closes. - A minimal close affordance is allowed. - Mobile tap
opens; outside tap or visible close control closes. - Closing returns
the card smoothly to its original state.

Important implementation caution: a shared-element transition from a
scrolled card to a centered overlay can jump or use incorrect
coordinates. Prefer a stable, polished implementation over a flashy one
that breaks after scrolling or on mobile.

#### Scroll behavior

-   Natural, frictionless vertical scroll.
-   Do not keep a focus effect active unless the card is explicitly
    opened.
-   Optional tiny scale/opacity change when a card nears viewport
    center, but it must be very subtle.
-   Do not animate every card dramatically during scrolling.

#### Navigation

-   Remove canvas-specific zoom controls from the main dock.
-   Do not keep `+` and `-` just for backward compatibility.
-   Do not keep Reset if the new interaction doesn't need it.
-   If focus overlay has Previous/Next, make controls balanced and
    quiet, and usable on desktop/mobile.
-   Avoid a crowded bottom dock.
-   Nabil prefers an icon-only reset rather than a text label if a reset
    is truly needed, but likely the vertical gallery does not need reset
    at all.

#### Responsive requirements

-   Desktop, tablet, mobile, and landscape.
-   No clipping/overflow.
-   Cards should be large enough to appreciate but fit the screen.
-   Avoid a dense mobile dock.
-   Focus overlay should fit mobile.
-   Respect `prefers-reduced-motion`.
-   Automated touch tests do not equal physical-device tests.

### Option D: Skale-like simple grid/list with print styling

Fallback if Option C is too gimmicky, slow, or unstable: - Simple
vertical list or restrained two-column desktop grid. - Large project
images, easy to scan. - Subtle print-like white frame. - Minimal
motion. - Mobile becomes a straightforward vertical stack. - Hover/focus
effects can be subtle or omitted.

Pros: - Easiest to understand. - Lowest implementation risk. - Fast
browsing. - Very low risk of being compared to Alim.

Cons: - Less interactive wow. - Needs good art direction to avoid
looking generic.

**Verdict:** Option C is the latest provisional direction. Option D is
the fallback.

## 9. Previous gallery implementation reports and current uncertainty

An intermediate Codex report claimed: - White photographic prints with
bottom Georgia captions. - Subtle placement variations. - Thin green
selection outline. - Still preserved free 2D panning. - 550ms
Previous/Next movement. - Counter. - 35--250% zoom. - Back/Escape
inspection. - Initial load and Reset restore Plied at 100%. -
Desktop/tablet/mobile/landscape layouts checked. - Lint, typecheck,
build, 19 focused checks passed. - Home, Sanity, placeholder images, and
backup branch unchanged. - Touch/pinch handlers passed automated checks;
physical device testing pending.

That report represents an **intermediate implementation**, not
necessarily the final state. It conflicts with the later Option C
proposal to replace free panning with vertical scroll. Codex Plus then
stopped being detected, so it is unclear whether the Option C prompt
actually ran. Do not assume it did.

## 10. Technical history

### Initial foundation

A previous coding-agent report described: - Next.js App Router,
TypeScript, Tailwind. - `/` and `/work`. - Shared nav and thin centered
layout. - Reusable components. - Six-project data collection. -
Placeholder assets. - Responsive styling. - Sanity integration
preserved. - Lint/typecheck/build passed at that time.

Files reported at that stage: - `D:/Portfolio/src/app/page.tsx` -
`D:/Portfolio/src/app/work/page.tsx` -
`D:/Portfolio/src/app/layout.tsx` - `D:/Portfolio/src/app/globals.css` -
Components: `SiteContainer`, `Navbar`, `Section`, `WorkItem`, `Footer` -
Project data: `D:/Portfolio/src/data/projects.ts` - Placeholder image:
`D:/Portfolio/public/images/work-placeholder.svg`

Later canvas code may have changed these files. Inspect before editing.

### Framer vs code workflow

-   Framer was intended as a visual/motion source of truth.
-   Final implementation is likely Next.js + TypeScript + Tailwind +
    Vercel.
-   Framer does not offer a clean export-to-React workflow; code
    recreates the visuals and motion.
-   Screenshots, URLs, recordings, and explicit motion behavior help the
    coding agent.
-   Do not let code invent major design decisions while Framer's visual
    direction is unsettled.
-   Current gallery is already in code/staging, so continue there unless
    Nabil chooses otherwise.

## 11. Safe workflow for Gemini or another coding agent

1.  Inspect `D:/Portfolio`.
2.  Check `git status`, current branch, recent commits.
3.  Inspect `backup/works-canvas-v1` and
    `docs/works-canvas-v1-backup.md`.
4.  Inspect current `/work` implementation and compare with staging.
5.  Identify what is implemented versus only proposed.
6.  Choose the smallest safe change consistent with Option C.
7.  Preserve Home, Sanity, existing data, and backup.
8.  Avoid unnecessary dependencies.
9.  Run lint, typecheck, and production build.
10. Check responsive behavior.
11. Deploy once to existing staging only after checks pass.
12. Report precisely what changed and what was actually tested.

Never claim physical-device testing if only browser emulation or
automated touch-pointer tests were performed.

## 12. Do not do these things

-   Do not blindly copy Alim's 3D/horizontal interaction.
-   Do not build a gallery that feels like a design tool/Figma canvas.
-   Do not add many controls.
-   Do not keep zoom controls in the main dock without a clear need.
-   Do not make title text huge.
-   Do not use illegible script fonts.
-   Do not use harsh, sharp black shadows.
-   Do not rotate cards so much that the gallery becomes messy.
-   Do not animate every scroll movement dramatically.
-   Do not force clients to pan/drag to see projects.
-   Do not create an `Explorations` section.
-   Do not add unnecessary metadata to every project.
-   Do not overclaim client work or Nabil's contribution.
-   Do not break Home, Sanity, or published data.
-   Do not deploy before checks.
-   Do not assume the latest proposed prompt was executed.

## 13. Open decisions

1.  Final Works direction: Option C is the latest direction to try;
    Option D is the fallback.
2.  Rotation amount: ±2.5 degrees is only a starting point, tune after
    rendering.
3.  Focus overlay implementation: prioritize stability and correct
    origin after scrolling.
4.  Font: compare Cormorant Garamond, Newsreader, Instrument Serif. None
    is final.
5.  Previous/Next in overlay: useful but not required if crowded.
6.  Center-focus while scrolling: optional and extremely subtle.
7.  Project order: Plied likely flagship, but order should reflect
    visual strength and relevance.
8.  Project assets: staging may still contain placeholders. Confirm
    actual assets.
9.  Physical-device mobile testing remains needed if possible.
10. Remove canvas controls if Option C is implemented.

## 14. Prompt to give Gemini first

Paste this handoff, then send:

> Read this as the complete project context. Before changing code,
> inspect `D:/Portfolio`, the current Git branch/status, the backup
> branch, and the current Works implementation. Tell me what is actually
> implemented right now versus what is only a proposal. Then recommend
> the smallest safe next step toward Option C, the vertical
> photographic-print gallery with a focused overlay. Preserve Home,
> Sanity, existing data, and the backup. Do not modify or deploy
> anything until you have clearly identified the current state and
> intended change.

This is important because the latest state is uncertain. Do not apply an
outdated prompt blindly.

## 15. Compact summary

Nabil's portfolio is a narrow, centered, human-feeling personal website.
Home and Works are separate. Copy must be natural and contain no em
dashes. The Currently section should show openness to
studio/product-team roles and freelance projects starting at \$1,000,
with the price applying only to freelance work.

Works is one unified visual-first collection of real, collaborative,
concept, and academic work. Do not split out Explorations, overuse
metadata, or create unnecessary case studies. Likely projects: Plied,
Faction, Kumala Sari, Evaware, a newer AI note-taking app, and a Scribe
landing-page concept.

The gallery moved from a free 2D canvas inspired by Alim toward a
photographic-print idea. The latest provisional direction is **a normal
vertical-scroll gallery of subtly rotated photo prints, with readable
artistic titles in the bottom margin. Clicking a print lifts it forward,
straightens and enlarges it, and opens it over a softly blurred/dimmed
background.** The goal is wow without sacrificing clarity. If this
becomes gimmicky or unstable, use the simpler Skale-like grid/list with
the same print styling.

The old canvas is backed up on local branch `backup/works-canvas-v1`,
commit `85345e27609a4531dbdebf4227a52dcb327f0312`. No remote was
configured. Current staging is
`https://nabil-portfolio-staging.vercel.app/work`. Codex Plus stopped
being detected, so the newest redesign may not have been implemented.
**Inspect the repo and staging first.**
