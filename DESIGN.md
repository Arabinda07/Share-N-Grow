# Design System: ShareNGrow

## 1. Visual Theme & Atmosphere

A warm, human-centric, and highly curated interface that feels like a sunlit artist's studio—approachable, professional, and trustworthy. The aesthetic balances the earthy, cultural roots of Bengal's art scene with the clean precision of modern software. Density is relaxed (Level 4) to give artwork and text room to breathe, variance is deliberate (Level 6) to avoid robotic symmetry, and motion is tactile and grounded (Level 5).

## 2. Color Palette & Roles (Sunlit Atrium)

- **Canvas / Paper (Crisp Morning Canvas)** (`oklch(99% 0.01 100)`) — A bright, airy base that replaces heavy off-whites. Feels fresh and expansive.
- **Paper Dark (Soft Atrium Shadow)** (`oklch(96% 0.01 100)`) — Gentle shading for secondary elements and hover states.
- **Pure Surface (Pure White)** (`oklch(100% 0 0)`) — Contrast elevation for cards.
- **Charcoal Ink (Deep Slate)** (`oklch(25% 0.02 200)`) — Rich, grounding text color tying back to architectural structure rather than flat black.
- **Ink Light (Soft Slate)** (`oklch(50% 0.02 200)`) — Friendly, legible secondary text.
- **Vibrant Leaf Green (Primary Accent / Button)** (`oklch(55% 0.16 142)`) — Legacy class: `terracotta`. Our bold, lush "bright green" for calls to action, standing out vividly against the airy white.
- **Sunlit Yellow / Morning Ray (Secondary Accent)** (`oklch(80% 0.14 70)`) — Class: `secondary`. Used to add warmth and a splash of morning sunlight to complementary details.
- **Whisper Border** (`oklch(25% 0.02 200 / 0.10)`) — Delicate slate borders.

_Note: We utilize the CSS class names `terracotta` purely for backward-compatibility in the component codebase, mapped structurally to our chosen accent color._

### Alternative High-End Color Combinations

1. **The Classic Gallery (Slate & Cobalt)**
   - Minimal crisp cool-white papers. Base Hue: `260`
   - High-contrast rich charcoal typography.
   - Accent: Vibrant Yves Klein Blue / Cobalt `oklch(45% 0.15 260)`.
   - *Vibe:* Modern, premium, very art-forward (Artsy/SuperRare).

2. **Modern Editorial (Warm Cream & Plum)**
   - Warm cream papers. Base Hue: `340`
   - Deep espresso typography. 
   - Accent: Rich Aubergine / Plum `oklch(45% 0.12 340)`.
   - *Vibe:* Sophisticated, highly curated, distinct from tech.

_(Note: The "AI Purple/Neon" aesthetic, oversaturated colors, and cold blues are strictly banned. The palette remains strictly within these warm, earthy, high-contrast bounds)._

## 3. Typography Rules

- **Font Family:** `Raleway` for body text and sans-serif uses, `Playfair Display` for display/headlines to give elegant, warm, structural, and artistic vibes. _(Inter and generic system standard web fonts are banned for display text)._
- **Display/Headlines:** Track-tight (`tracking-tight`), weight-driven hierarchy (Bold 700+). Generous sizing (`text-4xl` to `text-5xl`). Never screaming, just confident.
- **Body:** Relaxed leading (`leading-relaxed`), typically 65-character max-width, strictly colored in Ink Light for reduced fatigue. Minimum size `text-base` (never shrink below 14px/16px).
- **Hierarchy:** Established through scale and color contrast (Headline = Ink, Body = Ink Light), rather than purely making things bolder.

## 4. Component Stylings

- **Cards & Containers:** Ultra-generous border radii (`rounded-[2rem]` or `32px`). Pure white fill with a wide, diffused whisper shadow (`shadow-[0_8px_30px_oklch(25%_0.02_200_/_0.04)]`—tinted shadows aligned to `Ink` color instead of pure black). Internal padding is strictly generous (`p-6` to `p-8`).
- **Buttons:** Pill-like or heavily rounded (`rounded-xl`). Primary buttons use solid Ink fill with white text; active states feature a tactile push `active:scale-[0.98]`. No outer glow. Hover states slightly lift and lighten.
- **Inputs & Textareas:** Large click targets (`min-h-[48px]`), highly rounded (`rounded-xl`), label above in pure Ink, input placeholder in faint Ink Light. Focus rings jump to the Terracotta accent.
- **Loaders:** Skeletal shimmer matching the exact bounding box of the expected layout. No circular generic spinners.
- **Badges/Tags:** Fully rounded (`rounded-full`), uppercase (`uppercase tracking-wider text-[10px] or [11px] font-bold`), used predominantly for Mediums or Statuses.

## 5. Layout Principles

- **Spatial Zones:** Maximum separation. Text must never overlap images or other text.
- **Grid-First:** CSS grid handles all 2-column or 3-column splits. Flexbox is reserved only for 1D alignments (like Navbars or tag rows).
- **Containment:** Content is capped intelligently. Forms max out at `max-w-3xl`; Profiles at `max-w-5xl`; Directories at `max-w-[1400px]`.
- **Asymmetric Sections:** Feature layouts favor 60/40 splits over perfectly symmetric 3-column card walls to maintain an editorial layout.
- **Full-Height:** Pages resolving to bottom boundaries should use `min-h-screen` or `min-h-[100dvh]`.

## 6. Responsive Rules

- **Strict Mobile Collapse (< 768px):** All multi-column grids (like the Artist Profile split or Directory grid) instantly collapse to a single scrolling column `w-full`.
- **Horizontal Scroll Ban:** Elements overflowing the mobile horizontal viewport are a critical failure. Padding adjusts from `px-8` to `px-4`.
- **Touch Targets:** Minimum 44px for icons, buttons, menus. Forms switch to full-width 100% inputs on mobile.

## 7. Motion & Interaction

- **Tactile Feedback:** Hardware-accelerated `transform` scaling on active clicks (e.g., `active:-translate-y-0.5` or `active:scale-[0.98]`).
- **Hover Transitions:** Smooth `transition-all duration-200` on buttons and cards. Cards lift subtly `hover:-translate-y-1` and shadow deepens.
- **No Animations on Geometry:** Transitions happen exclusively on `opacity`, `transform` (scale/translate), and `box-shadow`. Never layout dimensions (`height`/`width`).

## 8. Anti-Patterns (BANNED)

- **NO Emojis** — Use clean geometric vector icons (Lucide) exclusively.
- **NO Pure Black (`#000000`)** — Always zinc/stone tinted (off-black).
- **NO Sharp Corners** — Brutalist `rounded-none` borders are banned unless it's a full-width section break.
- **NO Generic 3x3 Equal Grids** — Avoid the standard SaaS "3 identical feature cards" layout. Use asymmetrical bento grids or rich list views.
- **NO Developer/AI Clichés** — Avoid filler text like "Elevate your art," "Unleash potential," or "Next-Gen platform." Use literal, human phrasing (e.g., "Find a drawing teacher").
- **NO Glowing Elements** — Standard soft shadows only. Neon dropshadows are forbidden.
