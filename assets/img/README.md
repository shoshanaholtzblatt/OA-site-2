# Site images

## Required

- `hero-dc-cherry-blossoms.jpg` — homepage hero background. Watercolor of the US Capitol + Washington Monument framed by cherry blossoms. Source: provided by the client (Lovable export). **Drop this file here before deploying** — the homepage hero falls back to a mint→cream gradient if missing, but the watercolor is the intended look.
- `hero-dc-cherry-blossoms.webp` (optional) — modern-format export of the above for smaller payload. The CSS prefers WebP, falls back to JPG automatically.

## Recommended export settings

- JPEG: ~1920×1080, quality ~82, target file size under 300 KB
- WebP: same dimensions, quality ~80, target file size under 180 KB

Both versions are referenced via `image-set()` in `assets/css/styles.css` under the `.hero` rule.
