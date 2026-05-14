# DC Metro OA — site

Static site (plain HTML/CSS/JS) for the Washington DC Metro Area Intergroup of
Overeaters Anonymous. No build step.

## Run locally

Any static server works. Easiest:

```
python3 -m http.server 8000
# then open http://localhost:8000/
```

(`meetings.js` uses `fetch()` to load `data/meetings.json`, so opening
`index.html` directly with `file://` will work but the meetings page won't —
serve over HTTP.)

## Editing meetings

`data/meetings.json` is the single source of truth for the meetings page.
Each entry:

```json
{
  "id": "mon-1200-bethesda",
  "day": "Monday",
  "day_order": 1,           // 0=Sun … 6=Sat, controls sort
  "time": "12:00 PM",
  "duration_min": 60,
  "format": "in-person",    // "in-person" | "virtual" | "phone" | "hybrid"
  "focus": "Open",          // or "Newcomer", "Step Study", "BBSS", etc.
  "location_name": "United Church of Christ",
  "address": "Bethesda, MD",
  "join_link": null,        // Zoom or other URL, or null
  "phone": null,            // phone bridge with PIN, or null
  "notes": ""
}
```

Add an object per meeting. The page filters/sorts client-side; no rebuild
needed.

## Seed data

The four meetings currently in `meetings.json` came from publicly indexed
snippets. The full DC Metro meeting list is maintained at
[`oa-dcmetro.org/ww-pdf/meetings.pdf`](https://www.oa-dcmetro.org/ww-pdf/meetings.pdf).
Copy entries from there to flesh out the list.

## File layout

```
index.html
meetings.html
newcomers.html
events.html
about.html
intergroup.html
contribute.html
contact.html
assets/
  css/styles.css
  js/nav.js
  js/meetings.js
data/
  meetings.json
PLAN.md           # original design plan
```

## Design system

CSS variables in `assets/css/styles.css` `:root`. Tune `--accent`,
`--accent-2`, `--bg`, and the font stack to rebrand.
