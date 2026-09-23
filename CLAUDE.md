# CLAUDE.md — Broken English Website

Claude Code reads this file automatically at the start of every session. It is the source of truth for how to work on this repo. Read it fully before touching anything.

---

## WHAT THIS REPO IS

The public marketing website for **Broken English** — a premium spoken-English institute (Kochi · Edappal · Online). Founder: Sreekanth K.G.

- **One self-contained file:** `index.html` (~1.5MB). All CSS, JS, images, icons, and a 3D model are embedded inline as base64. No build step, no framework, no dependencies to install.
- **Live at:** https://brokenenglish.in (and www.brokenenglish.in)
- **Hosted on:** GitHub Pages, this repo, `main` branch, served from root.
- **Repo:** `amailtosreekanth-cpu/brokenenglish-website`

### Files in the repo root
| File | Purpose |
|---|---|
| `index.html` | The entire website. This is what you edit. |
| `favicon.ico` | Browser/Google tab icon (gradient K). Real file — Google needs it at root. |
| `favicon-32.png` | PNG favicon fallback. |
| `apple-touch-icon.png` | Home-screen icon when saved to phone. |
| `CNAME` | Contains `brokenenglish.in`. **Never delete or change** — it binds the domain. |
| `CLAUDE.md` | This file. |

---

## DEPLOYMENT — HOW CHANGES GO LIVE

You have GitHub write access, so you deploy by committing to `main`. GitHub Pages auto-builds.

**Standard deploy loop:**
1. Edit `index.html` in the repo.
2. Verify (see Verification below).
3. Commit to `main` with a clear message.
4. GitHub Pages rebuilds automatically (~90s). Sreekanth hard-refreshes (Cmd+Shift+R) to see it.

**Rules:**
- **Always keep `index.html` as the filename.** GitHub Pages serves it as the site root.
- **Never touch `CNAME`.**
- Don't commit rapid successive changes — Pages cancels overlapping builds. One commit, wait for the build to finish, then the next.
- DNS is already fully configured on Namecheap (A records + www CNAME + Zoho email records). Nothing DNS-side needs changing.

---

## HOW SREEKANTH WANTS WORK DELIVERED

- **`/caveman` mode:** he uses this often. When active → ultra-terse. Bullets, commands, checkmarks. No preamble, no recap of what you did, no filler.
- **"Don't change anything else" is a hard constraint.** When he asks for specific changes, change ONLY those. Prove it with a diff, not intention (see Verification).
- **Map options before big technical calls.** For any non-trivial technical decision, lay out 2–3 approaches with tradeoffs, then recommend one. Don't silently commit to the first idea. (For tiny edits, just do it.)
- **He has no coding background.** Any step he must do himself = spell it out click-by-click. But with Claude Code connected, you now do the GitHub work directly — so there's far less for him to do manually.
- **Screenshot-driven.** He'll often send a screenshot of a bug rather than describe it. Read the image carefully.
- **Verify before saying "done."** State the specific check you ran. "Built, not verified" is honest; a false "done" is not.

---

## BRAND — LOCKED, DO NOT DRIFT

- **Gradient:** `#FF2D78 → #FF4B2B → #FF8C00` (CSS var `--grad`). Brand reds `#ed1f51`, `#f05825`. Background near-black `#050505`.
- **Fonts:** Montserrat (headings), Barlow (uppercase micro-labels, letterspaced), Inter (body). **Syne is permanently banned.**
- **Tagline:** "it ends here."
- **Core concept:** ELP — English Language Persona (an English alter ego; Kobe/Black Mamba inspired).
- **Never** invent metrics, testimonials, or numbers. Real content only.

### Contact details currently in the file
- WhatsApp: **+91 88918 12970** (`wa.me/918891812970`) — appears 5× (nav CTA, hero CTA, social icon, final CTA, footer).
- Instagram (personal): `instagram.com/voice_of_sreek`
- YouTube: `youtube.com/@voiceofsreek`
- Email: info@brokenenglish.in

---

## ARCHITECTURE OF index.html

**Desktop (capable machines):** a Z-axis 3D "world." The page is a very tall invisible scroll track (`#depth-track`, 1250vh) that drives a camera dollying through 3D space. Nine "stations" (sections) sit at different X and Z coordinates; the camera follows a winding path and yaws toward the next station. Depth-of-field blur on upcoming stations. Giant outlined "monument" words pass at the sides like buildings.

**Mobile / slow machines / reduced-motion:** a plain vertical scrolling page — no 3D, no camera, no blur. This is intentional and must stay.

### Device capability tiers (JS, near top of `<script>`)
```
isMobile = innerWidth<=680 || pointer:coarse
lowPower = navigator.hardwareConcurrency<=4 || navigator.deviceMemory<=4
FLAT     = reduced-motion || isMobile || lowPower   → body.flat  (plain scroll)
LOWFX    = FLAT || lowPower                          → body.lowfx (drop heavy layers)
```
- `body.flat` CSS neutralises the 3D: static positioning, `overflow:visible`, one scrollbar.
- `LOWFX` disables the aurora WebGL shader, the 3D "K" GLB model, film grain, glitch pulses, and the boot text-scramble.
- **On a fast desktop, neither class is added — full experience, unchanged.**

### Stations (9) — id, label, (X, Z)
- s0 Hero (0, 0)
- s1 Problem (430, −1600)
- s2 Two Roads (−620, −3140)
- s3 Method / ELP (260, −4310)
- s4 The Switch (−540, −5960)
- s5 Founder (640, −7180)
- s6 Programs (−300, −8840)
- s7 Journey (480, −9990)
- s8 Final CTA (0, −11400)

### Monuments (7)
FEAR · 12 YEARS · IDENTITY · THE SWITCH · BECOME · FLUENT · TRANSFORMATION

---

## HARD-WON BUG RULES — DO NOT REPEAT THESE

These each cost multiple wasted rounds. Read before editing layout or the 3D engine.

1. **Never `grep` the raw file blindly** — the embedded base64 (photos + GLB model) floods output and burns context. Use targeted Python string checks, or grep with tight anchors.
2. **Never set `position:relative` on a `.station`** — it drops it out of the absolutely-positioned 3D layout, half a screen down. This exact bug survived three wrong fixes.
3. **Never add `display:flex` to `.station`** — it stretches child buttons to full width (broke the final CTA).
4. **Don't tilt hero text with `rotateY`** — it foreshortens and shrinks the word (BROKEN looked smaller than ENGLISH). The hero's scroll-lean comes from the *camera yaw*, not a static CSS transform.
5. **Two scroll containers = unusable on mobile.** The depth-track plus any `overflow-y:auto` station fight for the same swipe. This is why mobile uses flat mode.
6. **Text under 3D transforms pixelates.** Fix pattern: render at ~2.7× then `scale()` down — BUT the shrink and any tilt must be in the *same* `transform` declaration, or a later rule silently overwrites the scale.
7. **Never touch the Zoho email DNS records** (they're on Namecheap, not here, but if asked): TXT ×2 + `zmail._domainkey`.

---

## VERIFICATION — RUN BEFORE EVERY COMMIT

1. **JS syntax:** extract the `<script>` block and run
   `node -e "new Function(require('fs').readFileSync('FILE','utf8'))"` — must print no error.
2. **Structure:** `<div` count == `</div>` count.
3. **Scope proof:** diff the file against the previous committed version with base64 blobs collapsed to a placeholder, and confirm ONLY the intended lines changed. If Sreekanth said "don't change anything else," this diff is the proof — show him the changed-line count.
4. **Assets untouched:** hash the embedded base64 blobs before/after; for edits that shouldn't touch images, the hashes must match.
5. State the check you ran when reporting done.

---

## SEPARATE PROJECTS — DO NOT CONFUSE WITH THIS REPO

- **Command Center** (`be-command-center` repo): Founder OS, `academics.html`, `admin.html` — Supabase + Google Sheets dashboards. Different codebase.
- **Assessment tool** (`broken-english-assessment.onrender.com`): has its own Apps Script automation. **Never touch its sheet automation.**

If a request is about those, flag that it's a different repo before acting.

---

## OPEN / BACKLOG (not started unless Sreekanth says so)

- **OG share image:** `og-image.jpg` (1200×630) needs to be created and committed to root so WhatsApp/social link previews aren't blank. OG meta tags are already in `index.html`.
- **Google favicon:** real files are in the repo now; Google will swap the fallback "S" for the K on its own recrawl (days–weeks). Can be nudged via Google Search Console → URL Inspection → Request Indexing.
- **More courses + course-detail pages:** currently 4 hardcoded (Foundation, Upgrade, Elite, IELTS). Adding more by hand = editing HTML each time.
- **Admin panel (Phase 2):** needs a real backend (DB + auth) so Sreekanth edits content/photos/courses and adds sections without code. Would also enable blog, student reviews, contact/maps page, student logins, and a `dashboard.brokenenglish.in` subdomain.
- **Razorpay payments:** account is live. Simplest now = Payment Links/Pages wired to a button (no backend). Full embedded checkout needs Phase 2. Razorpay requires T&C, Privacy, and Refund Policy pages before full approval.

---

## VERSION NOTE

The last version built outside Claude Code was **v21** (favicon files + real-file `<link>` tags added; identical to v20 otherwise). The `index.html` currently in this repo IS that version. From here, version history lives in git commits — no more `_v22.html` filenames. Just commit `index.html`.
