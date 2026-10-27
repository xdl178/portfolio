# Five-Screen Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the homepage into five editorial dark-tech screens while preserving its original hero and replacing personal details with explicit placeholders.

**Architecture:** Keep the existing React HashRouter, works data, image assets and detail routes. Introduce shared placeholder-only profile data and focused components for the new intro and closing screens; reshape existing works/practice sections and reduce the footer to a small global footnote. Verify rendered behavior with Playwright against the Vite dev server and build via TypeScript/Vite.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 3, Framer Motion, GSAP/ScrollTrigger, Playwright Core, Vite 7.

**Spec:** `docs/superpowers/specs/2026-10-23-five-screen-portfolio-design.md`

## Global Constraints

- `src/components/Hero.tsx` and `public/images/hero-desk.jpg` stay byte-identical; existing hero appearance and animation remain unchanged.
- Exactly five main homepage sections in this order: hero, `01 关于我`, `02 精选作品`, `03 项目经验`, about/contact.
- All personal identity, education, employment, profile, website and contact data are clearly labelled `待补充` placeholders; no prior real contact, awards, companies or screenshot identities. No fake `mailto:` or form success.
- Existing three works and their authentic images, works archive, detail pages and accessible gallery/lightbox remain available.
- Project experience is anonymous type/method illustration, not a client/city, proof of launch or invented performance claim.
- Only wide-screen/no-reduced-motion scroll pin/scrub; mobile and reduced-motion users access all content without animation obstruction.
- The isolated project has no `.git`; do not initialize or commit without a separate request.

## Review Focus

1. Direct navigation to `/#/works/:id` and `/#/about` still renders correctly and returns to the right homepage anchor.
2. A contact CTA must not open a fake email client: it scrolls to an actual placeholder contact section from every route.
3. At widths 390px and 1440px the navigation, long placeholders and all cards fit without horizontal overflow.
4. `prefers-reduced-motion: reduce` renders every section, including pinned experience cards, without clipping or invisible content.
5. Anonymous case studies do not contain old city names or factual employment claims; all copied work images resolve with HTTP 200.

---

### Task 1: Placeholder model and safe global navigation

**Files:**
- Create: `src/data/profile.ts` — field labels and placeholder-only values
- Modify: `src/components/Navbar.tsx` — section anchors and safe contact CTA
- Modify: `src/components/ContactFooter.tsx` — compact copyright/return navigation, no fake contact data
- Modify: `src/pages/AboutPage.tsx` — concise placeholder-only about route with capabilities and return links
- Test: `profile-regression.mjs` — browser assertions across home/about/works routes

**Interfaces:**
- Produces: `profileFields` data for intro and closing screens, `contactHref = '/#contact'` (or equivalent HashRouter-safe anchor behavior); avoid duplicated identity copy.
- Consumes: existing `AboutCapabilities`, `Link`, `useLocation`, homepage section ids `about-intro`, `work`, `practice`, `contact`.

- [ ] **Step 1: Write failing browser assertions** that `/#/about` and `/#/` contain no prior email, real schools/companies, award names or city claims; all `联系我` links go to homepage contact section rather than `mailto:`; `/#/works/original-ip` still loads.
- [ ] **Step 2: Run `node profile-regression.mjs`** against Vite server on port 5180; expected FAIL from existing real email and employment.
- [ ] **Step 3: Implement placeholder data and update navbar/footer/about.** Use a lightweight route-aware scroll helper where necessary: HashRouter path `/` plus native section hash requires deliberate navigation and `scrollIntoView` after home is mounted; never set a dead `href="#"`.
- [ ] **Step 4: Rerun `node profile-regression.mjs`**; expected all assertions PASS and no browser console errors.

### Task 2: Reference-based intro screen

**Files:**
- Create: `src/components/ProfileIntro.tsx` — full `01 关于我` section
- Modify: `src/pages/HomePage.tsx` — mount intro directly after Hero (temporarily leave later sections)
- Test: `five-screen-regression.mjs` — headings, field placeholders and photo semantics

**Interfaces:**
- Consumes: `profileFields` from Task 1 and `id="about-intro"` for navbar/route links.
- Produces: accessible section title and real text `照片待补充`, no image URL or arbitrary stock asset.

- [ ] **Step 1: Write failing browser assertions** that second main homepage section has `01` and `关于我`, a photo placeholder, basic/education/employment groups with `待补充`, and a two-column desktop / one-column mobile layout without overflow.
- [ ] **Step 2: Run `node five-screen-regression.mjs`**; expected FAIL because intro section is absent.
- [ ] **Step 3: Build the intro using the provided screenshot’s editorial hierarchy.** Make 01 plus translucent ABOUT a restrained layered header, left 4:5/3:4 pale placeholder panel, right structured field grid with thin rules and small blue dots. Data rows are `<dl>` and text is readable, not fake anchors; gentle Framer entrance only when visible.
- [ ] **Step 4: Rerun targeted intro assertions**; expected PASS on 1440px and 390px.

### Task 3: Selected works and anonymous experience

**Files:**
- Modify: `src/components/SelectedWorks.tsx` — heading `02 精选作品`, card focus/hover and incorporated image view/CTA
- Modify: `src/components/Practice.tsx` — heading `03 项目经验`, anonymous project-type copy, responsive narrative layout
- Modify: `src/pages/HomePage.tsx` — remove independent `Explorations` screen and keep hero → intro → works → experience
- Test: `five-screen-regression.mjs` — section sequence and anonymous content

**Interfaces:**
- Consumes: `works` data and existing `/works/:id` routes, section ids `work` and `practice`.
- Produces: exactly three accessible work links, anonymous project-type cards, no named clients/cities; existing full-detail image galleries remain unchanged.

- [ ] **Step 1: Extend failing browser assertions** for exactly ordered section ids/titles, three real work links with images, no sixth gallery section, and no concrete client/city or fabricated result in project cards.
- [ ] **Step 2: Run `node five-screen-regression.mjs`**; expected FAIL from unnumbered old sections and named projects.
- [ ] **Step 3: Rework selected work hierarchy and anonymous experience.** Preserve work covers/routes. For experience, use three type-level scenarios plus design question/process/deliverable; blue micro-grid, numeric wayfinding and subtle hovered accent. Ensure GSAP `matchMedia` pinning is scoped/cleaned and gated by width and reduced-motion; never scrub opacity to invisible on touch.
- [ ] **Step 4: Rerun targeted browser assertions**; expected PASS on desktop/mobile, accessible focus and true work navigation.

### Task 4: Closing screen, links and full regression

**Files:**
- Create: `src/components/ProfileContact.tsx` — closing about summary + contact placeholders
- Modify: `src/pages/HomePage.tsx` — append closing fifth screen
- Modify: `src/index.css` — shared editorial spacing and scroll offset (no Hero-specific selector changes)
- Modify: `src/App.tsx` only if cross-route section-anchor handling needs a route-mount scroll fix
- Modify: `README.md` — five-screen map and placeholder rules
- Test: `five-screen-regression.mjs`, `profile-regression.mjs`, existing `nav-regression.mjs`/`smoke.mjs` as applicable

**Interfaces:**
- Consumes: Task 1 `profileFields`, `id="contact"`; generates no `mailto:` until user provides a real address.
- Produces: fifth section containing placeholder profile summary, capabilities (not invented biography), and visibly inactive contact rows; compact global footer only.

- [ ] **Step 1: Extend failing assertions** that the fifth section shows intro/contact placeholders, navigation from other routes lands at this section, homepage has exactly five sections, and both viewport widths have no horizontal overflow.
- [ ] **Step 2: Run the full browser tests**; expected FAIL because closing section does not yet exist.
- [ ] **Step 3: Implement closing screen, route-aware anchor scroll, and minimal CSS.** Create a strong large-type final composition with contrasting slender strokes and a concise footnote rather than a repeated sixth CTA; link back to works/about routes only where real navigation exists.
- [ ] **Step 4: Run complete browser regression** (`node profile-regression.mjs`, `node five-screen-regression.mjs`, `node nav-regression.mjs` after updating its contact expectations); inspect screenshots at 1440px and 390px, including reduced-motion and desktop motion settings. Expect zero failures and no 404 images or runtime errors.
- [ ] **Step 5: Run `node node_modules/typescript/bin/tsc -b` then `node node_modules/vite/bin/vite.js build --logLevel error`**; both expected exit 0. Verify Hero and background SHA256 match saved pre-work values; update README with run instructions and known placeholder policy.

## Self-review

All spec constraints map to Tasks 1–4; direct route, contact, overflow, reduced-motion, and anonymous copy risks each have explicit browser coverage. Shared profile labels originate only from Task 1. Desktop/mobile visuals receive manual screenshot review after automated tests. No commit step because this is a standalone non-Git directory.
