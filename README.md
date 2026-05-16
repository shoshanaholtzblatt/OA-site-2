# DC Metro OA — site (Phase 0 prototype)

Static site (plain HTML/CSS/JS) for the Washington DC Metro Area Intergroup
of Overeaters Anonymous. No build step.

Phase 0 is a partner-alignment prototype. Phases 1+ migrate to Astro +
Tailwind with Google Sheets as the content backend (see `PLAN.md`).

## Run locally

```
python3 -m http.server 8000
# open http://localhost:8000/
```

`meetings.js` uses `fetch()` to load `data/meetings.json`, so the site must
be served over HTTP for the meetings page to populate (file:// won't work).

## Pages (6, per IA)

- `index.html` — Home: Who we are · What is a meeting · Do I qualify? ·
  Upcoming events · What is Intergroup?
- `newcomers.html` — 8-question Q&A including the OA 15-question self-test.
- `meetings.html` — Grouped by region (DC in-person, Metro area by day,
  Specialty) plus Meeting Resources block.
- `events.html` — Workshops, Newcomer info meetings, Conventions, over a
  three-month horizon.
- `intergroup.html` — 8 sections: What is intergroup · Goals · Why serve ·
  Service opportunities · Email signup · Business meeting · Board contacts.
- `donate.html` — Brief 7th Tradition blurb + PayPal + check. Same content
  also rendered as a `<dialog>` modal triggered from the nav "Donate"
  button on every page.

## Editing meetings

`data/meetings.json` is the single source of truth. Each entry:

```json
{
  "id": "mon-1200-bethesda",
  "day": "Monday",
  "day_order": 1,
  "time": "12:00 PM",
  "duration_min": 60,
  "format": "in-person",      // "in-person" | "virtual" | "phone" | "hybrid"
  "region": "metro",           // "dc" | "metro" | "specialty"
  "focus": "Open",             // or "Newcomer", "Step Study", "BBSS", etc.
  "location_name": "United Church of Christ",
  "address": "Bethesda, MD",
  "join_link": null,
  "phone": null,
  "size": null,
  "notes": ""
}
```

Add an object per meeting; the page filters and groups client-side. No
rebuild needed.

## Editing events

Events are static HTML cards in `events.html`. To add: copy an
`<article class="event-card">` block under the appropriate `<h2>`
(Newcomer information meetings · Workshops · Conventions). The "month /
day / year" stack at the top of each card is flexible — use any short
label (e.g., "Recurring / 11am / Tuesdays" or "Workshop / ★ / Virtual").

## Design system

CSS variables at the top of `assets/css/styles.css`:

- Tokens: `--ink`, `--paper`, `--paper-warm`, `--brand` (teal),
  `--brand-dark`, `--terracotta`, `--rule`, `--muted`.
- Fonts: Fraunces (display) + DM Sans (body), loaded from Google Fonts.

Donate uses terracotta (`--terracotta` / `--terracotta-dark`); everything
else uses teal.

## Placeholders

Items marked `[PLACEHOLDER]` need real values before launch:

- PayPal donation URL (in `donate.html` and the donate dialog on every
  page)
- Check mailing address (same locations as above)
- Role-based email addresses on `intergroup.html` (only
  `whereandwhen@oa-dcmetro.org` is confirmed; others pending)
- Instagram and TikTok URLs in the footer (only Facebook confirmed)
- Involvement flyer PDF link on `intergroup.html`

## Freshness review

Site content should be reviewed at least quarterly:

- Meeting list — current schedule, locations, contacts
- Events — purge past events, add upcoming workshops
- Board roster — role-based emails up to date
- Footer social links — only platforms with active accounts

## Phase 0 → Phase 1+

Phase 0 ships intentional placeholders, stub forms, and minimal data.
Real forms (Netlify), Google Sheets meeting/event sync, and Astro
migration come in Phases 1–4. See `PLAN.md`.
