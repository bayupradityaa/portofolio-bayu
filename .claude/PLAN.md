# Bayu Praditya — Premium Developer Portfolio

## Design Read
Developer portfolio for SE recruiters, founders, and fellow devs. Linear/Vercel-style
premium-minimal **dark** language. Signature moment: a scroll-scrubbed canvas portrait
sequence in the hero. Everything else stays disciplined and quiet so the hero lands.

**Dials:** VARIANCE 6 · MOTION 6 (hero canvas ~8) · DENSITY 3 (lots of whitespace).

## Design System (locked)
- **Theme:** dark only, locked page-wide. No section inverts.
- **Palette:** bg `#09090B`, surface `#111113`, card `#18181B`, border `#27272A`,
  text `#FAFAFA`, secondary `#A1A1AA`, muted `#71717A`, accent `#22C55E`, hover `#4ADE80`.
  Single accent, locked across every section (Color Consistency Lock).
- **Type:** Geist (display + body) via `next/font`, Geist Mono for code/terminal/numbers.
  Large editorial headings, tight-ish tracking, body max-width ~65ch.
- **Shape:** one radius scale — cards/inputs `rounded-xl` (12px), buttons pill-ish `rounded-lg`.
- **Icons:** Lucide (per brief), one family, strokeWidth 1.5 global.
- No glassmorphism, no heavy gradients, no neon glow, no em-dashes anywhere.

## Stack
Next.js 15 App Router + TypeScript, Tailwind v4 (`@tailwindcss/postcss`), shadcn/ui
(customized, never default), GSAP + ScrollTrigger, Lenis, Motion (`motion/react`) for
light reveals only, React Hook Form + Zod, Sonner, Lucide, Supabase client (scaffolded).

## Architecture
- Motion isolated in `'use client'` leaf components; page shells stay Server Components.
- `useMotionValue`/GSAP for continuous scroll values — never `useState` per frame.
- `lib/data/*.ts` typed placeholder content (projects, experience, certificates, techstack,
  bio+stats) clearly marked as placeholder for easy swap.
- `lib/github.ts` reads public GitHub API by username (contributions via a public endpoint),
  cached; graceful fallback to placeholder if rate-limited.
- Contact: RHF + Zod client, `app/api/contact/route.ts` stubbed for Supabase insert
  (reads env keys; no secrets committed). Sonner toasts for success/error.
- `prefers-reduced-motion` collapses all motion incl. canvas to a static frame.
- Reserve space for images/canvas (CLS), lazy-load below-fold, `next/font`, metadata + OG.

## Sections (each a distinct layout family — no repetition)
1. **Loading screen** — logo/monogram reveal, then hands off to Lenis (client leaf).
2. **Hero** — asymmetric: static portrait canvas + name/intro/2 CTAs. Canvas `ImageSequence`
   scrubbed by ScrollTrigger (35°→camera). Frames load from `public/sequence/` with a
   defined path + static poster fallback until you add frames.
3. **About** — bio (≤65ch) + animated counters (count-up on inView, reduced-motion safe).
4. **Tech stack** — real Bento grid, exact cell count, varied cell backgrounds, not all text.
5. **Featured projects** — large case-study cards, GitHub + Live Demo links, alternating but
   capped (no 3+ zigzag). Real screenshots via placeholder slots / picsum seeds.
6. **GitHub activity** — contribution graph, counters, latest repos, building-in-public.
7. **Experience / journey** — vertical timeline (ordered, so numbering is meaningful).
8. **Certificates** — responsive grid.
9. **Contact** — form (labels above inputs, inline errors) + social links.
10. **Footer** — minimal, one contact intent, no version/locale/scroll-cue tells.

Nav: single-line desktop, ≤72px, active-link accent; mobile sheet.

## Build order
1. Scaffold Next 15 + TS + Tailwind v4; install deps; init shadcn; wire fonts, tokens, metadata.
2. Global providers: Lenis smooth-scroll, reduced-motion, Sonner, theme lock.
3. Data files + types.
4. Loading screen + nav + footer shell.
5. Hero + canvas ImageSequence + ScrollTrigger (the signature).
6. About, Tech Bento, Projects, GitHub, Timeline, Certificates, Contact.
7. Contact API stub + Supabase client + GitHub lib.
8. Responsive + a11y + reduced-motion pass.
9. Verify: `next build` + `next lint`; self-run Pre-Flight + Web Interface Guidelines audit.

## Verification
- `npm run build` and `npm run lint` must pass before I call it done.
- Run the design-taste Pre-Flight checklist + Vercel Web Interface Guidelines review on the
  built components; fix findings.
- Note: real image-sequence frames and Supabase/GitHub env keys are yours to add; I'll
  document exactly where.
