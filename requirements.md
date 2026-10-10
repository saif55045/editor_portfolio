# Editor Portfolio — Requirements & Build Spec

> Working title: **"THE CUT"** — a portfolio that *is* an edit.
> Goal: a visitor lands, and within **one second** feels "this person understands rhythm, light, and motion."

---

## 1. Concept (the unique idea)

**The entire website is a video-editing timeline.** Scrolling is scrubbing. The visitor is the playhead.

Why it works: every other editor's portfolio is a grid of thumbnails. This one lets visitors *experience* editing craft — pacing, cuts, transitions, color, sound — through the site's own behavior. The site itself is the proof of skill.

### Core metaphors

| Editing concept | Website behavior |
|---|---|
| Playhead | A thin glowing vertical line + timecode (`00:00:12:08`) fixed on screen that tracks scroll progress |
| Timeline tracks | Each section is a "track" (V1 Showreel, V2 Work, A1 Sound, FX Color, etc.) |
| Cut / J-cut / L-cut | Section transitions: audio/visual of the next section starts *before* the previous ends |
| Match cut | Shape from one section (circle lens → play button → orb) morphs into the next |
| Color grade | Hovering a project toggles raw log footage → graded footage (live slider) |
| Scrubbing | Dragging over a video thumbnail scrubs its frames |
| Render | Contact form submission shows a "Rendering… 100%" progress animation |

### Signature moments (the "first second" hooks)

1. **Hero**: black screen → a single frame of light leak blooms → a 3D glass film-lens/playhead emerges in WebGL, reacting to the cursor with refraction. Name is revealed with a kinetic text mask while a muted showreel plays *inside* the glass.
2. **Cursor = playhead tool**: custom cursor morphs (razor blade on video, hand on drag, play icon on projects).
3. **Smooth inertial scroll** (Lenis) so everything feels filmic, not webby.

---

## 2. Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | **Next.js 15 (App Router) + TypeScript** | SSR, image/video optimisation, great SEO |
| Styling | **Tailwind CSS v4** + CSS variables | Fast, token-driven design system |
| UI animation | **Framer Motion (`motion`)** | Layout animations, shared-element transitions, scroll-linked values, gestures |
| 3D | **three.js via React Three Fiber (`@react-three/fiber`) + `@react-three/drei`** | Declarative WebGL, glass material (`MeshTransmissionMaterial`) |
| Post-FX | **`@react-three/postprocessing`** | Bloom, chromatic aberration, film grain, vignette |
| Shaders | **GLSL via `three-custom-shader-material`** / `glslify` | Light leaks, film grain, displacement hover on thumbnails |
| Smooth scroll | **Lenis** | Inertial scroll, syncs with Framer Motion |
| Complex timelines | **GSAP + ScrollTrigger** (only where Framer Motion is awkward, e.g. pinned sequence) | Precise scrubbed sequences |
| Text effects | **SplitType** or custom splitter | Per-char/line kinetic type |
| State | **Zustand** | Global cursor state, sound toggle, theme |
| Video | **Self-hosted HLS via Mux** (or Cloudflare Stream) + `<video>` for short loops | Adaptive streaming; heavy files must never block load |
| Audio | **Howler.js** | Subtle UI sounds (opt-in) |
| Forms | **React Hook Form + Zod** → **Resend** email API | Reliable contact flow |
| Analytics | **Vercel Analytics** (or Plausible) | Privacy-friendly |
| Hosting | **Vercel** | Edge, previews, easy domain |
| Tooling | ESLint, Prettier, Husky, Lighthouse CI | Quality gate |

**Fallbacks:** if WebGL is unavailable or the device is low-power → static poster + CSS-only glass + looping video (see §10).

---

## 3. Color Palette

Direction: **"Midnight Studio"** — deep, cinematic near-blacks (like a grading suite), Apple-style neutral text, and one signature **spectral light-leak gradient** that is the brand's creative fingerprint. Color is used sparingly: 90% neutral, 10% glow.

### 3.1 Base (dark theme — default)

| Token | Hex | Use |
|---|---|---|
| `--void` | `#050507` | Page background, hero |
| `--ink` | `#0B0C10` | Section backgrounds |
| `--graphite` | `#14161C` | Cards under glass, footers |
| `--steel` | `#1F222B` | Borders, dividers, timeline tracks |
| `--fog` | `#8E919B` | Tertiary text, captions, timecode |
| `--mist` | `#B9BCC6` | Secondary text |
| `--snow` | `#F5F5F7` | Primary text (Apple's off-white) |

### 3.2 Signature accent — "Light Leak" spectrum

| Token | Hex | Role |
|---|---|---|
| `--iris` | `#7C6CFF` | Primary accent, focus rings, links |
| `--aqua` | `#3DD9F5` | Secondary accent, active states, waveform |
| `--rose` | `#FF5C8A` | Highlight, hover glow, "REC" dot |
| `--amber` | `#FFB340` | **Playhead color**, timecode, warm leak |

```css
--leak: linear-gradient(120deg, #7C6CFF 0%, #3DD9F5 35%, #FF5C8A 70%, #FFB340 100%);
--leak-soft: radial-gradient(60% 60% at 30% 20%, rgba(124,108,255,.35), transparent 70%),
             radial-gradient(50% 50% at 80% 70%, rgba(255,92,138,.25), transparent 70%);
```

### 3.3 Glass tokens (Apple-style)

```css
--glass-bg:        rgba(255,255,255,0.06);
--glass-bg-hover:  rgba(255,255,255,0.10);
--glass-border:    rgba(255,255,255,0.14);
--glass-highlight: inset 0 1px 0 rgba(255,255,255,0.22);   /* top specular edge */
--glass-shadow:    0 20px 60px -20px rgba(0,0,0,0.6);
--glass-blur:      blur(24px) saturate(180%);
```

### 3.4 Semantic

`--success #32D74B` · `--warning #FFD60A` · `--error #FF453A` (Apple system tones)

### 3.5 Optional light theme ("Daylight Suite")

Background `#F5F5F7`, surface `rgba(255,255,255,0.7)`, text `#1D1D1F`, same accent spectrum at 90% saturation. Auto via `prefers-color-scheme` with manual toggle (the toggle is a "lights on / lights off" film-set animation).

### 3.6 Contrast rules
- Body text `snow` on `ink` ≥ 15:1; `fog` only for non-essential text (≥ 4.5:1 with `ink`).
- Never place text directly on a gradient — put it on glass or a dark scrim.

---

## 4. Typography

| Role | Font | Notes |
|---|---|---|
| Display / headlines | **"Instrument Serif"** (italic accents) + **"Inter Display"/"Geist"** | Serif italic for emotional words ("*story*"), sans for structure — an editorial/film-title feel |
| UI / body | **Geist Sans** (or Inter) | Clean, Apple-like |
| Timecode / labels | **Geist Mono** (or JetBrains Mono) | Reinforces the NLE feel |

- Scale (fluid, `clamp`): Hero `clamp(3.5rem, 11vw, 11rem)`, H2 `clamp(2.5rem, 6vw, 6rem)`, body `1.0625rem/1.6`.
- Tight tracking on display (`-0.04em`), generous on mono labels (`+0.08em`, uppercase).
- Self-host fonts via `next/font`; `font-display: swap`; subset Latin.

---

## 5. Design Language

### 5.1 Apple glassmorphism rules
- Glass = translucent fill + `backdrop-filter: blur(24px) saturate(180%)` + **1px hairline border** + **top inner specular highlight** + soft deep shadow.
- Glass sits **over moving content** (video, gradients, WebGL) so the blur is visible — never over flat black.
- Corner radius: **28px** cards, **999px** pills, **40px** hero panels (continuous "squircle" feel; use `corner-shape: squircle` where supported or an SVG mask).
- Layer depth: max 3 glass levels (nav → panel → inner chip), each slightly more opaque.
- Subtle noise overlay (2–3% opacity PNG/shader) on glass to avoid banding.

### 5.2 Minimalism rules
- One idea per viewport. Huge whitespace (negative space = confidence).
- Max 2 type sizes visible per section + mono label.
- No decorative icons, no stock UI. Content = footage.
- 12-column grid, 8px spacing scale, max content width 1440px, outer gutter `clamp(20px, 4vw, 64px)`.

### 5.3 Creative "editor" touches
- Film grain overlay (animated, 4–6% opacity) site-wide.
- Letterbox bars (2.39:1) that open/close on page transitions.
- Frame counters, safe-area guides, and focus-pull blur on section entry.
- Waveform-based dividers instead of horizontal rules.
- Light-leak flashes (WebGL/CSS) between sections like a film burn transition.

---

## 6. Site Structure & Sections

Single-page scroll experience + dedicated case-study pages.

### 6.0 Global UI
- **Floating glass nav pill** (top center): logo mark · Work · Reel · Process · About · Contact · sound toggle. Hides on scroll down, returns on scroll up. Magnetic hover.
- **Playhead + timecode rail** (right edge on desktop, bottom on mobile): shows current section as a clip on a mini timeline; click to jump.
- **Custom cursor** (desktop only).
- **Preloader**: 1.2s max — a countdown leader (3…2…1) with film-grain; loads hero assets in parallel. Skippable; shown once per session.

### 6.1 Hero — "FADE IN"
- Fullscreen WebGL canvas: 3D glass lens/playhead object (`MeshTransmissionMaterial`) refracting a looping showreel texture; subtle mouse-driven rotation + light leaks + bloom.
- Name + role in kinetic type: *"[Name] — I cut stories that move people."*
- Two glass CTAs: **▶ Watch Reel** (opens fullscreen cinema modal) · **View Work ↓**.
- Live timecode ticking at bottom-left; "REC ●" dot pulses rose.
- Scroll cue: a playhead line that gently drops.

### 6.2 Showreel — "V1 · PROGRAM MONITOR"
- Pinned section: a large glass "monitor" frame. As the user scrolls, the reel plays *scrubbed by scroll* (frame-accurate via video `currentTime` or image sequence), then locks into normal playback on click.
- Sound-on button (opt-in) with waveform visualizer reacting to audio (Web Audio `AnalyserNode`).

### 6.3 Selected Work — "V2 · MEDIA BIN"
- Horizontal-scroll gallery of project cards (glass), each: poster loop, title, client, role, year, tags.
- Hover: video preview autoplays, mouse X scrubs the clip, WebGL displacement/ripple on the poster.
- Filter chips (All · Commercial · Music Video · Documentary · Short Film · Social) with Framer Motion `layout` animation.
- Click → **shared-element transition** (`layoutId`) expands the card to the case-study page.

### 6.4 Before / After — "FX · COLOR GRADE"
- Draggable glass slider reveals **raw log footage ↔ final grade**. Includes toggles: Raw · Cut · Graded · Sound (each lights up a layer).
- Shows craft that thumbnails can't: color, VFX cleanup, speed ramps.

### 6.5 Process — "THE WORKFLOW"
- Sticky scroll storytelling in 5 steps: **Ingest → Assembly → Rough Cut → Fine Cut → Color & Sound → Deliver.**
- Each step is a glass card with a small looping animation; the playhead moves across a mini-timeline as steps advance.

### 6.6 Style & Tools — "A1 · TOOLKIT"
- Software (CapCut, Filmora, Higgsfield, Veo, HeyGen, Runway) as glass chips with a skill-level waveform bar.
- Stats counters: projects delivered, hours of footage cut, views, years.

### 6.7 Testimonials — "VOICE OVER"
- Large quote carousel with client logos; drag to navigate; quotes fade like dialogue subtitles (SRT-style captions at bottom).

### 6.8 About — "THE EDITOR"
- Split layout: portrait (parallax, subtle grain + light leak) + short, human story. Mono timeline of career milestones.
- Fun detail: hover portrait → it "re-cuts" through 3–4 alternate shots (jump-cut effect).

### 6.9 Contact — "EXPORT"
- Huge headline: *"Let's make something worth watching."*
- Glass form (name, email, project type, budget range, message, deadline).
- Submit → "Rendering… 0–100%" progress bar → success state with confetti-style light-leak burst.
- Direct links: email (click-to-copy with toast), Instagram, Vimeo, YouTube, LinkedIn, Behance.

### 6.10 Footer — "END CREDITS"
- Credits roll upward (name, tools, thanks), local time, back-to-top (playhead jumps to 00:00).

### 6.11 Case-study template (`/work/[slug]`)
- Fullscreen hero video, project facts (client, role, year, tools, duration), challenge → approach → result narrative, behind-the-scenes breakdown (timeline screenshots, stills), full video with chapter markers, next-project teaser.

### 6.12 Extras
- `/404`: "Clip not found — 00:00:00:00" with glitch effect.
- Easter egg: press **`Space`** to play/pause the global ambient background reel; **`J K L`** to scrub like a real NLE; **`?`** shows shortcut sheet.

---

## 7. Motion Specification

| Aspect | Spec |
|---|---|
| Default ease | `cubic-bezier(0.22, 1, 0.36, 1)` (expo-out feel); spring `{stiffness: 120, damping: 20, mass: 0.8}` for physical UI |
| Durations | Micro 150–250ms · UI 400–600ms · Section reveals 800–1200ms |
| Text reveals | Lines masked & slid up with stagger 0.06s; words in italic serif get a blur→sharp focus pull |
| Scroll-linked | `useScroll` + `useTransform` for parallax, playhead, pinned reel; Lenis `lerp: 0.08` |
| Hover | Magnetic buttons (±12px), glass brightens + specular edge shifts with cursor angle |
| Page transitions | Letterbox bars close → route swap → bars open (`AnimatePresence`) |
| Reduced motion | `prefers-reduced-motion`: disable parallax/WebGL motion, use opacity fades only |

Rules: animate only `transform` and `opacity` where possible; never animate `backdrop-filter` blur radius (expensive) — animate opacity of the glass layer instead.

---

## 8. 3D / WebGL Specification

- **Hero object**: glass lens/playhead (custom GLTF or procedural geometry). `MeshTransmissionMaterial` (thickness 0.6, chromatic aberration 0.06, anisotropy 0.3, roughness 0.05, IOR 1.4).
- **Environment**: custom HDRI-lite (`<Environment preset="city" />` or a baked `.hdr` ≤ 300KB) tinted with the leak palette.
- **Lights**: 1 key (amber), 1 rim (iris), 1 fill (aqua).
- **Post**: Bloom (low threshold, 0.4 intensity), ChromaticAberration (0.0008), Noise/Grain (0.06), Vignette.
- **Interaction**: object eases toward cursor (`lerp 0.05`); scroll rotates it and drives it into the next section as a match cut.
- **Thumbnails**: shader plane with displacement/RGB-split on hover (`uHover`, `uMouse` uniforms).
- **Budget**: ≤ 150 draw calls, ≤ 300k triangles, DPR capped at `[1, 1.75]`, `frameloop="demand"` when offscreen, pause when tab hidden.
- **Single shared `<Canvas>`** (`View`/`tunnel` from drei) to avoid multiple WebGL contexts.
- Lazy-load the canvas **after** first paint; show the poster instantly so the "first second" is never blank.

---

## 9. Content Required From You (the editor)

- [ ] Name, tagline, short bio (≤ 120 words), portrait photos (2–3, high-res)
- [ ] **Showreel** (60–90s, 1080p/4K H.264, with and without audio)
- [ ] 6–10 projects: each with final video, 3–5 stills, role, client, year, tools, short story
- [ ] 2–3 **raw vs. graded** clips for the Before/After section
- [ ] 3–5 testimonials (name, role, company, optional logo)
- [ ] Social links, email, location/timezone, availability status
- [ ] Optional: ambient audio bed, UI sounds (click, whoosh)
- [ ] Logo / monogram (or I design a simple wordmark)

Placeholder content will be used until real assets are supplied.

---

## 10. Performance, Responsive & Accessibility

### Performance targets
- LCP < 2.0s (poster/hero text, not WebGL) · CLS < 0.05 · INP < 200ms · Lighthouse ≥ 90 all categories (desktop), ≥ 85 mobile.
- Initial JS ≤ 180KB gzipped (R3F/three loaded dynamically after first paint).
- Videos: H.264 + WebM/AV1, ≤ 2MB for loop previews, adaptive HLS for long videos, `preload="metadata"`, lazy `IntersectionObserver` playback.
- Images: AVIF/WebP via `next/image`, blur placeholders.
- Detect GPU tier (`detect-gpu`) → low tier gets the **fallback**: static poster + CSS glass + video loop, no post-processing.

### Responsive
- Breakpoints: 360 · 768 · 1024 · 1440 · 1920.
- Mobile: swap custom cursor for touch ripples, horizontal gallery becomes swipe carousel, 3D simplified (no transmission material; use env-map glass fake), nav becomes bottom glass dock.
- Test: iPhone SE → 4K monitor, Safari (backdrop-filter prefix `-webkit-`), Chrome, Firefox, Edge.

### Accessibility
- Semantic landmarks, skip link, visible focus rings (iris, 2px offset).
- All videos have captions/transcript where speech exists; decorative loops `aria-hidden`.
- Full keyboard navigation (including gallery and modal); modal focus trap.
- Respect `prefers-reduced-motion`, `prefers-reduced-transparency`, and `prefers-color-scheme`.
- Autoplay audio never; sound is opt-in and remembered.

---

## 11. SEO & Meta
- Title/description per page, Open Graph image auto-generated per project (Next `ImageResponse`), JSON-LD (`Person`, `VideoObject`), sitemap, robots, canonical URLs.
- Favicon with animated playhead (SVG).

---

## 12. Project Structure

```
editor/
├─ app/
│  ├─ layout.tsx            # fonts, providers, Lenis, cursor, grain
│  ├─ page.tsx              # composes all sections
│  ├─ work/[slug]/page.tsx  # case studies
│  ├─ not-found.tsx
│  └─ api/contact/route.ts  # Resend
├─ components/
│  ├─ canvas/               # Scene, HeroLens, Thumbnails, Effects, shaders/*.glsl
│  ├─ sections/             # Hero, Reel, Work, Grade, Process, Tools, Testimonials, About, Contact, Footer
│  ├─ ui/                   # GlassCard, GlassButton, Pill, MagneticButton, Cursor, Timecode, Playhead
│  └─ motion/               # SplitText, Reveal, Parallax, PageTransition
├─ lib/                     # store (zustand), utils, gpu-tier, audio
├─ content/                 # projects.ts / MDX case studies
├─ public/                  # posters, hdr, models, fonts, lut
├─ styles/                  # globals.css (tokens), glass.css
└─ requirements.md
```

---

## 13. Build Phases

| Phase | Deliverable | Est. |
|---|---|---|
| 1. Foundation | Next.js + Tailwind + tokens, fonts, Lenis, glass components, layout, nav | 1 day |
| 2. Hero | WebGL lens, kinetic type, preloader, showreel modal | 2 days |
| 3. Work | Media bin gallery, hover scrub, filters, shared-element transitions, case-study template | 2–3 days |
| 4. Signature sections | Pinned reel, Before/After grade, Process | 2 days |
| 5. Supporting | Tools, Testimonials, About, Contact (render animation), Footer credits | 1–2 days |
| 6. Polish | Cursor, grain, sound, easter eggs, page transitions, 404 | 1 day |
| 7. QA | Performance pass, fallbacks, a11y, cross-browser, SEO, deploy | 1–2 days |

---

## 14. Success Criteria

- A first-time visitor gets a distinct "wow" in < 1s without waiting for the 3D scene.
- Site feels like a **film edit**, not a template — timeline metaphor visible in every section.
- 60fps on a mid-range laptop, graceful fallback on phones.
- At least one project case study fully built end-to-end.
- Contact form delivers email reliably.

---

## 15. Confirmed Decisions

1. **Name & branding** — **Saif Ullah** (personal brand; monogram "SU").
2. **Niche** — **Social / short-form** (Reels, TikTok, Shorts). Consequences:
   - Hero tagline: *"I cut scroll-stopping stories."* Hook-first, fast-paced tone.
   - Project cards and the media bin use **9:16 vertical** previews (phone-frame glass cards), with a 16:9 option only for the main reel.
   - Case studies show metrics: views, retention, follow growth, platform.
   - Filter chips: All · Reels · TikTok · YouTube Shorts · Ads/UGC · Podcast clips.
   - Process section stresses hook, pacing, captions, sound design and turnaround speed.
3. **Palette** — Midnight Studio + Light Leak spectrum (as in §3).
4. **Light theme** — **No. Dark only.** Remove §3.5 and the light-mode toggle.
5. **Sound** — **Opt-in** UI sounds + ambient bed, off by default, choice remembered.
6. **Hosting/domain** — Vercel + custom domain (assumed, not yet confirmed).
