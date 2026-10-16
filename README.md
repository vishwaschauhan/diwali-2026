# A Decade of Lights · Diwali Celebration 2026

The invitation microsite for our 10th annual Diwali celebration in Pearland, Texas.
React + Vite + Tailwind CSS + Framer Motion, one scrolling page.

```bash
npm install
npm run dev        # local preview at http://localhost:5173
npm run build      # production build in dist/
```

---

## Before you send the invitation: checklist

Everything below is in **`src/config/event.js`**. Nothing else needs editing.

| What | Field | Status now |
|---|---|---|
| Party date | `date: '2026-11-07'` | `null` → shows "Date to be announced", calendar buttons hidden |
| Start time | `startTime: '18:30'` + `startTimeConfirmed: true` | 6:30 PM, labelled "tentative" |
| Venue address | `venue.address` or `venue.encryptedAddress` | blank |
| RSVP | `rsvp.mode` + `rsvp.googleForm` | `'demo'` (form works, sends nothing, clearly labelled) |
| RSVP deadline | `rsvp.deadline: '2026-10-30'` | `null` → hidden |
| Public URL | `siteUrl` | blank (needed for share links and the WhatsApp preview) |
| Contact numbers | `contacts[].phone` / `whatsapp` | blank on purpose |

The schedule is stored as **minutes after the start time**, so changing `startTime`
moves the whole evening. The 2025 site said 7:00 PM on one page and 6:30 PM on another;
that can't happen here.

The festival date (Nov 8, 2026) is stored separately as `festivalDate` and is only shown
as context. Calendar files always use the party `date` + `startTime` in
`America/Chicago`, with daylight saving handled automatically (CST in November).

---

## Photos

Each year in **The Journey of a Thousand Diyas** reads photos from `src/photos/<year>/`.
Drop JPG, PNG or WebP files in and they appear on the next build, sorted by filename
(prefix `01-`, `02-` … to control order). Vite fingerprints and caches them.

**The 59 photos from the 2025 Google Site (2017–2024)** are listed in
`scripts/legacy-photo-urls.json` (captured from the old Gallery page, but not yet
verified: the build environment couldn't reach Google Sites). Until they're downloaded,
the site tries to load them straight from Google Sites; any that fail show a tasteful
"photo coming soon" tile instead of a broken image. Download them once so the site owns
its memories:

```bash
npm run photos:import      # saves into src/photos/<year>/legacy-NN.jpg
```

If some fail, open the old Gallery page and save those images manually into the right
year folder.

**2025 photos:** put them in `src/photos/2025/`. Until then the year shows a friendly
"album is on its way" card. Large phone photos are fine, but resizing them to
about 1600px wide first keeps the site fast on mobile data.

Captions and per-year notes live in `chapters` in the config. Only add notes that are true.

---

## RSVP

### Option A: Google Form, submitted from the on-page form (recommended)

1. Create a Google Form with these questions (short answer unless noted):
   Name · Attending (multiple choice with options exactly `Yes` and `No`) · Adults ·
   Children · Dietary · Notes. Link it to a Sheet to see responses.
2. In the form, open **⋮ → Get pre-filled link**, type something in every field,
   and click **Get link**. The link contains `entry.123456=...` for each question.
3. Fill in the config:
   ```js
   rsvp: {
     mode: 'google-form',
     googleForm: {
       formId: '1FAIpQL...',            // from .../forms/d/e/<formId>/viewform
       fields: { name: 'entry.111', attending: 'entry.222', adults: 'entry.333',
                 children: 'entry.444', dietary: 'entry.555', notes: 'entry.666' },
     },
   }
   ```
4. Submit a test RSVP and confirm it lands in the Sheet.

Google doesn't let a website read the response to a form post, so the site shows the
confirmation once the request is sent and shows an error if the network fails.
Always run step 4.

### Option B: any other service

`mode: 'link'` and `externalUrl: 'https://...'`. The RSVP section becomes a button that
opens that page.

---

## Venue address privacy

Because the party is at home, `venue.addressMode` has three settings:

- **`'passcode'`** (default): guests type a passcode from the WhatsApp message to reveal
  the address and directions. The address is stored **encrypted** (AES-GCM, key derived
  from the passcode), so it can't be read from the page source without the passcode.
  ```bash
  npm run encrypt-address -- "123 Example Ln, Pearland, TX 77584" "sparkle"
  ```
  Paste the printed `encryptedAddress: {...}` into the config and leave `venue.address` blank.
  Passcodes are case-insensitive. Pick something not easy to guess.
- **`'public'`**: set `venue.address`; everyone with the link sees it.
- **`'private'`**: never shown; guests are told it arrives after they RSVP.

Calendar invites include the full address only once the guest has unlocked it;
otherwise they say "Pearland, TX".

---

## Sharing preview (WhatsApp, iMessage)

`public/og-image.jpg` (1200×630) is the preview card. WhatsApp needs **absolute** URLs, so
once you know the domain, edit `index.html`:

```html
<meta property="og:url" content="https://your-domain/" />
<meta property="og:image" content="https://your-domain/og-image.jpg" />
<meta name="twitter:image" content="https://your-domain/og-image.jpg" />
```

and set `siteUrl` in the config. WhatsApp caches previews, so test with a fresh link
(add `?v=2`) if you change the image.

---

## Deploying

`npm run build` produces a static `dist/` folder that works from any path.

- **Netlify:** drag `dist/` onto app.netlify.com/drop, or connect the repo
  (build `npm run build`, publish `dist`).
- **Vercel / Cloudflare Pages:** framework "Vite", output `dist`.
- **GitHub Pages:** push `dist/` to a `gh-pages` branch, or use the official Pages action.

`npm run build:single` makes one self-contained `dist-single/index.html` (fonts and
code inlined). That's what the private preview link uses; the photos still load from
their own URLs.

---

## What's where

```
src/config/event.js          ← all event data (start here)
src/photos/<year>/           ← photos per year
src/sections/                ← one file per section, in page order (see App.jsx)
src/components/              ← diya, ornaments, lightbox, nav, sticky RSVP, share/calendar
src/lib/                     ← time zones, calendar links + .ics, RSVP, venue/passcode
scripts/                     ← photo import, address encryption, legacy photo list
public/og-image.jpg          ← WhatsApp preview card
```

## Accessibility and motion

Semantic landmarks, a skip link, keyboard-operable year tabs (arrow keys, Home/End),
a lightbox with Esc/arrow keys and focus return, labelled form errors, and 44px+ touch
targets. With "reduce motion" switched on, everything is shown immediately: no
particles, flicker or slide-ins, and the site still looks complete.
