# GROOVE ARCHIVES

A static, data-driven personnel / event archive for **GROOVE**, an SDMC Student Media Project centred on Dance & Choreography at Mahindra University.

**Motto:** LEARN. CREATE. PERFORM.

This site uses plain HTML, CSS and vanilla JavaScript. There is no backend, framework, build step or database server, so it can be hosted directly on GitHub Pages.

---

## Folder structure

```text
groove-archives/
├── index.html
├── team.html
├── profile.html
├── events.html
├── gallery.html
├── about.html
├── README.md
└── assets/
    ├── css/
    │   └── style.css
    ├── js/
    │   ├── members.js
    │   ├── app.js
    │   └── profile.js
    └── images/
        ├── members/
        │   └── .gitkeep
        └── events/
            └── .gitkeep
```

---

## 1) Add or edit member profiles

Open **`assets/js/members.js`**.

Look for this comment:

```js
// ======================================
// ADD / EDIT GROOVE MEMBER PROFILES HERE
// ======================================
```

Each member is one JavaScript object. Fill only information actually supplied by the member / paired profile writer.

Example:

```js
{
  id: "ihita",
  fileNumber: "001",
  name: "Ihita Pillutla",
  alias: "",
  birthday: "",
  role: "Founder & President",
  vertical: "Leadership",

  color: {
    name: "",
    hex: ""
  },

  image: "",
  imageAlt: "Portrait of Ihita Pillutla",

  personality: "",
  likes: [],
  dislikes: [],
  quote: "",

  author: {
    id: "",
    name: "",
    friendship: "",
    opinion: ""
  },

  debut: "Founding Era",
  status: "Active",
  extras: {}
}
```

### Important
- Do **not** fill blank personal information with guesses.
- Blank aliases show as `ALIAS // UNFILED`.
- Blank personality / writer fields show intentional archive placeholders.
- Empty infobox fields such as birthdays are hidden.
- Optional fields live inside `extras` and only appear when filled.

---

## 2) Add a new member

Copy one complete member object inside `window.GROOVE_MEMBERS = [ ... ]` and change:

- `id` — unique, URL-safe, lowercase (example: `ananya-shah`)
- `fileNumber` — display index of your choice
- `name`
- `role`
- `vertical`
- any personal data that has actually been supplied

The team page automatically creates the new card.

Their profile URL becomes:

```text
profile.html?id=ananya-shah
```

No new HTML file is needed.

---

## 3) Add a profile picture

1. Put the approved image in:

```text
assets/images/members/
```

For example:

```text
assets/images/members/ihita.jpg
```

2. In `assets/js/members.js`, change:

```js
image: "",
```

to:

```js
image: "assets/images/members/ihita.jpg",
```

3. Update `imageAlt` with a useful description.

The portrait placeholder automatically disappears and the real image fills the same frame.

Recommended portrait crop: roughly **4:5**.

---

## 4) Add a member colour

Only add a colour once it has actually been selected / supplied.

```js
color: {
  name: "Electric Blue",
  hex: "#2d74ff"
}
```

The profile uses the hex value as a restrained page accent. The overall black / purple / pink / chrome GROOVE visual system remains intact.

For accessibility, use a normal 6-digit hex value and avoid extremely dark colours that disappear against the background.

---

## 5) Link profile writers to each other

If the writer also has a GROOVE profile, set their `id`:

```js
author: {
  id: "kaushik",
  name: "Kaushik",
  friendship: "We've known each other...",
  opinion: "I think..."
}
```

The profile automatically adds:

```text
VIEW KAUSHIK'S FILE →
```

If the writer does not have a profile, leave `id` blank and keep the name / text.

---

## 6) Optional profile fields

Supported extras include:

```js
extras: {
  pronouns: "",
  year: "",
  programme: "",
  danceStyle: "",
  favouriteArtist: "",
  favouriteSong: "",
  unofficialTitle: "",
  chaosLevel: "",
  trivia: [],
  groundZeroMemory: ""
}
```

They do not render when blank.

---

## 7) Ground Zero media

The Ground Zero and gallery pages currently contain intentional image placeholders.

Real event images can be added to:

```text
assets/images/events/
```

Then replace individual gallery placeholder `<div>` blocks in `events.html` or `gallery.html` with normal `<figure>` / `<img>` markup.

No stock people or generated portraits are included.

---

## 8) Run locally

Because the site is plain static files, you can open `index.html` directly. For the most reliable test, run a tiny local server from the project folder:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

---

## 9) Deploy to GitHub Pages

### Option A — repository root

1. Create a GitHub repository (for example `groove-archives`).
2. Upload **the contents of this folder** to the repository root.
3. Commit and push.
4. In GitHub, open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select your main branch (usually `main`) and the folder **`/ (root)`**.
7. Save.

GitHub will publish the site at a URL similar to:

```text
https://YOUR-USERNAME.github.io/groove-archives/
```

### Option B — `username.github.io` repository

If the repository itself is named exactly `YOUR-USERNAME.github.io`, GitHub Pages publishes it at:

```text
https://YOUR-USERNAME.github.io/
```

---

## Accessibility / responsive notes

The site includes:
- semantic headings and navigation
- a keyboard-accessible mobile menu
- visible focus states
- contrast-conscious neon usage
- portrait alt-text support
- responsive profile stacking
- wrapping tags / filters
- `prefers-reduced-motion` support
- no required hover-only information

---

## Public-site privacy rule

The initial data intentionally contains **no invented aliases, birthdays, personality traits, likes, dislikes, quotes, colours, friendship histories, profile writers or private team history**. Only publish information that GROOVE members have actually supplied and agreed to make public.
