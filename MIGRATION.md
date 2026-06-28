# Site migration notice

**Status: this repo is being replaced.** The new DC Metro OA site is being built in [`shoshanaholtzblatt/metro-web-refresh`](https://github.com/shoshanaholtzblatt/metro-web-refresh). This repo (`oa-site-2`) is the *Phase 0* static-HTML prototype and will be archived once the new site is live at `oa-dcmetro.org`.

## Why we're switching

The Phase 0 build here is plain HTML + CSS + vanilla JS — fast, simple, dead-easy to maintain. Two things pushed us off it:

1. **Visual fidelity to the client-approved Lovable mockup was hard to hit by hand.** Three commit rounds on the hero alone, each shipping a flaw the next inspection caught. The Lovable source already matches; reusing it bypasses the porting loop.
2. **The Phase 1 goal needs a runtime data source.** The plan is to let non-technical volunteers edit the meetings/events list in a Google Sheet, with the site fetching live. Static HTML can only do this via a build-time fetch action (clunky). React on Netlify gets serverless functions natively.

## Where things live now

| Concern | Old (this repo) | New |
|---|---|---|
| **Source code** | `shoshanaholtzblatt/oa-site-2` | `shoshanaholtzblatt/metro-web-refresh` |
| **Stack** | Static HTML / CSS / vanilla JS | React + Vite + TypeScript + Tailwind (Lovable export) |
| **Hosting** | GitHub Pages | Netlify (planned) |
| **Visual editor** | Hand-edit in VS Code / Claude | Lovable's chat-based UI (auto-commits to GitHub) |
| **Code editor** | Claude Code session on `oa-site-2` | Claude Code session on `metro-web-refresh` |
| **Meetings data** | `data/meetings.json` (in-repo, hand-edited) | Google Sheet → Netlify Function (Phase 1) |

Lovable's GitHub integration is bidirectional: edits in Lovable push to GitHub, edits via Claude/VS Code/web UI sync back into Lovable's editor. You can use whichever tool fits the task.

## Phase 1 plan (carried over from the conversation in this repo)

Lives in [`/root/.claude/plans/can-you-see-this-lovely-falcon.md`](#) from the session that produced this doc, but the key steps are:

1. **Make metro-web-refresh public** (or share its `*.lovable.app` preview URL) so any reviewer can audit it
2. **Connect metro-web-refresh to Netlify**: https://app.netlify.com → "Add new site" → "Import from Git" → authorize GitHub → select `metro-web-refresh`. Vite auto-detected, builds and serves `dist/`
3. **Point `oa-dcmetro.org` DNS at Netlify** once the build is green
4. **Audit the Lovable build** in a Claude session scoped to metro-web-refresh:
   - Confirm donate modal, meeting card expand/collapse, filter chips work
   - Confirm SPA prerendering for SEO (if pure Vite SPA with no SSG, add `vite-plugin-ssg` or migrate to Astro/Next.js)
   - Confirm meetings data location (hardcoded vs JSON)
5. **Google Sheets data source (Phase 1 proper):**
   - Create sheet `dc-metro-oa-meetings` with columns matching this repo's [`data/meetings.json`](data/meetings.json) schema: `region`, `day`, `time`, `name`, `status`, `contacts[]`, `address`, `zoom_url`, `phone_access`, `pin`, `password`, `room`, `notes`, `meeting_id`, `frequency`
   - Write a Netlify Function `get-meetings.ts` that fetches the sheet (public CSV or via Sheets API with a service account), parses, returns JSON
   - Change meetings page from a static fetch to `fetch('/.netlify/functions/get-meetings')`
   - Add 5-minute edge-cache so the function only hits Google a few times per hour

## What carries forward from this repo

The work in `oa-site-2` wasn't wasted — these design decisions came out of it and should be preserved in `metro-web-refresh`:

### IA tree (5 nav items)

- Newcomers · Meetings · Events · Intergroup · Donate
- Footer: mailing list signup, order books → OA.org, for medical professionals, follow us, contact form
- Donate is a `<dialog>` modal triggered from the nav on every page, with `/donate` as a no-JS / bookmarkable fallback

### Meetings page data schema

Real DC Metro OA schema (see [`data/meetings.json`](data/meetings.json)):

```json
{
  "region": "District of Columbia | Maryland - Montgomery County | …",
  "day": "Tuesday",
  "time": "1:00 PM",
  "name": "St Stephen's Church",
  "status": "Currently Virtual Only | In Person Weekly | Hybrid | …",
  "meeting_id": "50105",
  "contacts": [{ "name": "Mark A.", "phone": "202-277-2715" }],
  "zoom_url": "https://zoom.us/j/…",
  "phone_access": "301-715-8592",
  "pin": "791 814 193",
  "password": "868633",
  "address": "1623 Connecticut Avenue, NW",
  "room": "EDU 2-3",
  "notes": "Across from Metro in Takoma Park",
  "frequency": "In Person Weekly"
}
```

Region sort order: DC → Maryland (alpha) → Virginia (alpha) → Specialty. Within region, sort by day Sun→Sat, then by parsed time.

### Format derivation

From the `status` string:
- contains "hybrid" → `hybrid`
- contains "virtual" → `virtual`
- contains "phone only" → `phone`
- default → `in-person`

### `[PLACEHOLDER]` markers

Unresolved values to fill before launch (search the repo for `[PLACEHOLDER`):
- PayPal donation URL (`donate.html`, donate-dialog markup in every page)
- Mailing address for checks (donate-dialog + `donate.html`)
- Intergroup board role emails (`intergroup.html`)
- Instagram and TikTok URLs (footer in every page)
- Involvement / "Get involved" flyer

### Hero image asset

[`assets/img/hero-dc-cherry-blossoms.jpg`](assets/img/hero-dc-cherry-blossoms.jpg) — watercolor of the Capitol + Washington Monument framed by cherry blossoms. Same source as Lovable's `dc-hero.jpg`. The Lovable repo should already have its own copy, but this is the canonical reference if you ever need to re-export.

### Phase 0 commit history

Useful as a record of what was decided and why:

```
834b338 Match Lovable hero overlay direction and teal hex values
f04f0e6 Render hero image as element, not CSS background
b26a4fd Fix hero background not loading
a7ff4d6 Adopt Lovable design: cherry-blossom hero + progressive-disclosure meeting cards
baf065e Adopt real DC Metro meeting schema and 5 seed entries
933405a Restructure Phase 0 to match the canonical IA tree
539f89e Build initial DC Metro OA static site
```

## When to archive this repo

After all of these are true:

- [ ] `metro-web-refresh` is deployed to Netlify and reachable at a stable URL
- [ ] `oa-dcmetro.org` DNS points at Netlify (or at the existing host with the new build)
- [ ] All `[PLACEHOLDER]` values from the table above have been filled in the new site
- [ ] At least one full week of uptime on the new build with no rollbacks

Then: Settings → General → Danger Zone → **Archive this repository**.

(Archiving makes the repo read-only but preserves all history. You can always unarchive if you need to recover something.)

## Working on `metro-web-refresh` with Claude

This Claude session's tools are hard-locked to `oa-site-2` — it cannot read or write to `metro-web-refresh`. To use Claude on the new repo:

1. Open https://claude.ai/code (or Claude Code app)
2. Start a new session, point it at `metro-web-refresh` instead of `oa-site-2`
3. That session can freely read, edit, commit, and push to metro-web-refresh
4. Lovable will see those commits and sync them back into its editor

You can have multiple Claude sessions open simultaneously — one per repo. They don't share context but don't conflict either.
