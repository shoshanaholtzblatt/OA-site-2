# DC Metro OA Website Rebuild — Plan

Recreate the **content** of [oa-dcmetro.org](https://oa-dcmetro.org/) in the
**style and structure** of [metrowestoa.org](https://www.metrowestoa.org/) and
[oasf.org](https://www.oasf.org/), as a hand-coded static site (plain
HTML/CSS/JS, no build step).

---

## 1. Goals

1. Preserve everything a DC Metro OA visitor needs: find a meeting, get help as
   a newcomer, learn about OA, see events, contribute, contact intergroup.
2. Lift the layout/IA conventions from MWI and SF Intergroup: a small,
   clearly-labeled top nav; a welcoming hero; meeting-finder front and center;
   events as the rolling content feed; calm visual design.
3. Keep maintenance trivial — flat folder of HTML pages, one shared stylesheet,
   one small JS file. No CMS, no build pipeline, no JS framework.
4. Hit accessibility (WCAG AA), mobile-first, fast on slow connections.

## 2. Source-site survey

Confirmed from search results (live HTML was blocked by both sites' CDNs).

### oa-dcmetro.org (content source)
Top-level routes observed: `/`, `/meetings/`, `/newcomers/`, `/tools/`,
`/stories/`, `/local/`, `/intergroup/`, `/seventh/`, `/oa-links/`, `/events/*`,
plus a `Together We Can` newsletter PDF archive and a service/public-outreach
PDF library. Phone/text line: (202) 681-4056. Contributions via Venmo.

### metrowestoa.org (style ref 1)
Routes: `/`, `/meetings/`, `/newcomers/`, `/special-focus/`,
`/metrowest-intergroup/`, `/calendar/`, `/bulletin-board/`, `/donate/`,
`/make-a-contribution/`. Contact: info@metrowestoa.org, (508) 875-0001.
WordPress-based; clean, restrained, text-forward.

### oasf.org (style ref 2)
Routes: `/`, `/meetings`, `/newcomers`, `/events`, `/intergroup`,
`/contribute`, `/start-a-meeting`, `/relapse`, `/medical-professionals`.
Contact: 415-236-0126, role-based emails (chair@, newcomer@, etc.).
Squarespace-based; richer event detail pages, modern card layout.

**Gap:** exact colors, type, and imagery from MWI/SF need a visual pass once
we can render the live sites (the sandbox here blocked their HTML). §6
proposes a starting design system the user can tune against screenshots.

## 3. Information architecture

Single nav, 7 items — matches both reference sites' depth:

```
Home  |  Meetings  |  Newcomers  |  Events  |  About OA  |  Intergroup  |  Contribute
```

Footer adds: Contact · Tools of Recovery · Stories · Links · Newsletter archive
· Privacy/Anonymity note.

### Page-by-page

| Page                | Source on DC Metro          | Template / pattern from refs                                                                                              |
| ------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `index.html`        | `/` (Home)                  | SF-style hero + 3-up "I'm new / Find a meeting / Need help now"; MWI-style welcome paragraph; upcoming events strip.      |
| `meetings.html`     | `/meetings/`                | Filterable table: day, time, format (in-person/phone/virtual), focus, location. Mirrors MWI list + SF filters.            |
| `newcomers.html`    | `/newcomers/`               | Long-form welcome page like SF `/newcomers`: what to expect, newcomer pamphlet PDF, special newcomer meeting CTA, phone.  |
| `events.html`       | `/events/*` index           | SF-style card grid, newest first. Each event = standalone page under `events/<slug>.html`.                                |
| `about.html`        | DC `/tools/` + general OA   | What OA is, the 12 Steps, the Tools, anonymity note. MWI text-forward layout.                                             |
| `intergroup.html`   | `/intergroup/` + `/local/`  | Business meeting schedule, service positions, minutes archive, contact roles. Mirrors SF `/intergroup`.                   |
| `contribute.html`   | `/seventh/`                 | 7th Tradition explainer, Venmo link, check mailing address, role of contributions. Mirrors SF `/contribute`.              |
| `contact.html`      | (scattered on DC site)      | Single page: phone (202) 681-4056, role emails, intergroup mailing address, "press / public info" contact.                |
| `tools.html`        | `/tools/`                   | OA's 9 Tools of Recovery, plain text-forward page.                                                                        |
| `stories.html`      | `/stories/`                 | Member stories — list with read-more pages or accordions.                                                                 |
| `links.html`        | `/oa-links/`                | OA.org, Region, Virtual Region, sister intergroups.                                                                       |
| `newsletter.html`   | `/newsletter-archives/`     | "Together We Can" — latest issue prominent, archive grid below.                                                           |
| `start-a-meeting.html` *(new, from SF)* | —                | Helpful add: how to start a face-to-face or virtual meeting locally.                                                      |
| `relapse.html` *(optional, from SF)* | —                   | If desired; SF has this and it's a strong addition.                                                                       |

## 4. Page templates (HTML structure)

Three templates only:

1. **`base`** — `<header>` with logo + nav, `<main>`, `<footer>`. Every page
   includes this skeleton inline (no SSI/build); a small `nav.js` highlights
   the current page.
2. **`landing`** — `index.html` only. Adds hero + 3 quick-action cards +
   upcoming-events strip.
3. **`content`** — everything else. Title, optional sub-nav, body with sections.

Skip layout abstraction. Inline the header/footer HTML in each page and edit
all of them when something changes — there are only ~13 pages.

### Reusable content blocks (CSS classes, not components)

- `.hero` — full-width intro band
- `.card-grid` — 2/3-column responsive cards (events, quick actions)
- `.meeting-table` — sortable/filterable table
- `.callout` — "Newcomer? Start here" highlight
- `.event` — event detail block (date, location, summary, organizer)
- `.contact-block` — phone + email + Venmo together

## 5. Visual design system (starting point)

Both reference sites read as **calm, warm, low-saturation, text-forward**.
MWI is more text-driven; SF leans modern card layouts and stronger photography.
Proposed defaults (tune from screenshots):

| Token        | Value                                                         |
| ------------ | ------------------------------------------------------------- |
| `--bg`       | `#fbf9f4` (warm off-white)                                    |
| `--surface`  | `#ffffff`                                                     |
| `--text`     | `#23303a` (deep slate)                                        |
| `--muted`    | `#5b6b78`                                                     |
| `--accent`   | `#3a6b8a` (calm blue, OA-ish)                                 |
| `--accent-2` | `#b87f4a` (warm clay, for highlights)                         |
| `--border`   | `#e6e1d6`                                                     |
| Headings     | `Source Serif 4` or `Lora` (warm serif)                       |
| Body         | `Inter` or system-ui                                          |
| Scale        | 1.125 type ratio; 16px base; 1.6 line-height                  |
| Radius       | 8px on cards; 4px on buttons                                  |
| Spacing      | 4px base unit; section padding 64px desktop / 32px mobile     |
| Max width    | 1100px container                                              |

Buttons: solid `--accent` primary, outline secondary, large tap targets.
Imagery: a handful of warm, anonymous lifestyle photos (no faces) — coffee
mugs, sunrise walks, hands. Free from Unsplash with attribution noted.

## 6. Tech stack

Per request: **plain HTML, CSS, JS**. No build, no framework.

```
/
├── index.html
├── meetings.html
├── newcomers.html
├── events.html
├── about.html
├── intergroup.html
├── contribute.html
├── contact.html
├── tools.html
├── stories.html
├── links.html
├── newsletter.html
├── start-a-meeting.html
├── events/
│   ├── special-newcomer-meeting.html
│   ├── finding-self-love-through-your-higher-power.html
│   └── ...
├── assets/
│   ├── css/styles.css         # one stylesheet, CSS variables for the design tokens
│   ├── js/
│   │   ├── nav.js             # current-page highlight, mobile menu toggle
│   │   └── meetings.js        # filter/sort meetings table client-side
│   ├── img/
│   └── pdf/                   # newsletter + pamphlet PDFs
├── data/
│   └── meetings.json          # source of truth for the meetings table
└── README.md
```

Hosting: any static host (Netlify, Cloudflare Pages, GitHub Pages). No DB,
no server. Domain stays the same (`oa-dcmetro.org`).

## 7. Meetings data

The meeting list is the most-used and most-edited part. Keep it as
**`data/meetings.json`** — a flat array of objects (day, time_local,
duration_min, format, focus, address_or_url, contact, notes). `meetings.js`
renders the table and runs simple filter chips (Day, Format, Focus). Editing
the JSON file is the maintenance interface — a step up from MWI's PDF list,
matched to SF's filter UX, with zero build complexity.

Optionally publish a `meetings.ics` calendar from the same JSON in a later
phase.

## 8. Events

Two parts: `events.html` (card grid, current + upcoming, sorted by date) and
one HTML file per event under `events/`. Each event page is a static
hand-edited file modeled on SF's event detail layout (date, location, host,
description, RSVP/contact). Past events stay live for archive value but get
visually de-emphasized via a "Past events" section.

## 9. Accessibility, SEO, performance

- Semantic HTML (`<header><nav><main><article><footer>`), skip-link, visible
  focus states, AA color contrast on every token combination.
- All images have `alt`; decorative ones get `alt=""`.
- One `<h1>` per page; logical heading order.
- Each page: `<title>`, meta description, Open Graph image, canonical URL.
- `sitemap.xml` + `robots.txt` hand-maintained.
- No web fonts blocking render — `font-display: swap` and a system-font
  fallback stack.
- Total page weight target: <150 KB on the home page (CSS + JS + above-the-fold
  image).

## 10. Phased delivery

1. **Phase 1 — skeleton (1 commit per page).** All pages stubbed with real DC
   Metro copy lifted from the existing site; nav + footer wired everywhere.
2. **Phase 2 — design system.** `styles.css` with tokens above; refine after
   the user reviews against MWI/SF screenshots.
3. **Phase 3 — meetings.** `data/meetings.json` populated from current DC
   Metro meeting list; `meetings.js` filter/sort.
4. **Phase 4 — events.** Migrate 6–10 recent/upcoming DC events into
   `events/*.html` + index card grid.
5. **Phase 5 — polish.** Imagery, SEO meta, sitemap, accessibility audit,
   Lighthouse pass.
6. **Phase 6 — cutover.** Point `oa-dcmetro.org` DNS at the new static host.
   Keep PDF archive paths stable so existing inbound links don't break.

## 11. Open questions for the user

1. **Visual fidelity** — should I match MWI's restraint or SF's richer card
   layout more closely? (Default: SF for the homepage and events; MWI for
   long-form content pages.)
2. **Domain & hosting** — stay on `oa-dcmetro.org`, and which host? (Netlify
   and Cloudflare Pages are both free for this scale.)
3. **Meetings data** — do you have a current CSV/spreadsheet I should import,
   or should I scrape the existing DC Metro meetings page as the seed?
4. **Brand assets** — is there a DC Metro OA logo file? If not, I'll typeset a
   wordmark in the chosen heading font.
5. **Content scope** — keep the "Stories", "Local", "Tools" pages as-is, or
   trim/merge any? (My default: keep all, reorganize Local content into
   `intergroup.html`.)
6. **Pages to add from SF** — `start-a-meeting`, `relapse`,
   `medical-professionals` are useful additions. Want all three, none, or a
   subset?
