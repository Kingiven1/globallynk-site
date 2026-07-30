# GlobalLYNK — Public Site (Phase 1)

Public marketing site only — no auth, no Supabase yet. This is the "easiest
first" phase we agreed on: Home, Events, Cohort, Journey, Donate, and a
DJ/Alumni directory shell that's ready to hold real data once the portal exists.

## Stack
Matches getlored.co conventions: React + Vite, React Router v6, inline styles only, no CSS framework.

## Run locally
```
npm install
npm run dev
```

## Deploy
Push to GitHub `main`, connect the repo in Vercel, auto-deploys from there — same as getlored.co.

## File map
```
src/
  styles/tokens.js       — colors, type, spacing (single source of truth for the brand look)
  components/Nav.jsx     — sticky nav, mobile menu
  components/Footer.jsx  — footer, brand copyright line
  components/Waveform.jsx— signature divider element (seeded, deterministic, no deps)
  pages/Home.jsx
  pages/Events.jsx       — pulls from a hardcoded array now, wire to Posh or Supabase later
  pages/Cohort.jsx       — Fall 2026 cohort details, links out to Tally for applications
  pages/Journey.jsx      — nonprofit story, Mexico City cultural exchange
  pages/Donate.jsx       — links out to Givebutter
  pages/AlumniDirectory.jsx — empty state until first cohort graduates (Nov 2026)
App.jsx                  — router, route list
```

## Things to swap before launch
- `APPLY_URL` in `pages/Cohort.jsx` → real Tally form link
- `GIVEBUTTER_URL` in `pages/Donate.jsx` → real Givebutter campaign link
- `poshUrl` values in `pages/Events.jsx` → real Posh event links
- `[ Photo ]` / `[ Mexico City photo ]` placeholders → real photos (drop into `src/assets/` and `import` them, or point at hosted URLs)
- Instagram link in Nav/Footer is already correct: @globallynk

## What's NOT built yet (phase 2)
- Supabase auth + RLS (`is_admin()`, `is_instructor()`, `is_alumni()`)
- `/portal` — student dashboard (class dates, materials, recaps)
- `/portal/instructor` — instructor admin (post updates, message students)
- `/dj/:slug` — public alumni profile pages + contact-form-to-email
- Gig request/claim flow
- Resend email triggers (acceptance letters, pre-class guide, gig notifications)
- Square payment link integration

Route comment for all of this is already left in `App.jsx` so it's easy to
find where these get added.
