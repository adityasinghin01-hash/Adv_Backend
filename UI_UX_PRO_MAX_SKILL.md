# 🎨 UI/UX PRO MAX — Complete Skill Reference

### By NextLevelBuilder | v2.5.0 | 32.1k ⭐ GitHub

### Source: github.com/nextlevelbuilder/ui-ux-pro-max-skill

> **AI-powered design intelligence** — 67 UI styles, 161 color palettes, 57 font pairings,  
> 99 UX guidelines, 25 chart types, across 15+ tech stacks.

---

## ⚡ QUICK INSTALL

```bash
# For Antigravity
git clone https://github.com/nextlevelbuilder/ui-ux-pro-max-skill .agent/skills/ui-ux-pro-max

# OR using CLI
npx uipro-cli init --ai antigravity
npx uipro-cli init --ai claude
npx uipro-cli init --ai cursor
npx uipro-cli init --ai gemini
```

**Supported Platforms:** Claude · Cursor · Windsurf · Copilot · Kiro · RooCode · Kilocode · Codex · Gemini · Antigravity · Warp · Augment · Continue · OpenCode · Trae

---

## 🧠 HOW TO USE THIS SKILL

| Scenario                | Trigger Examples                            | Start From                         |
| ----------------------- | ------------------------------------------- | ---------------------------------- |
| New project / page      | "Build a landing page", "Build a dashboard" | Step 1 → Step 2                    |
| New component           | "Create a pricing card", "Add a modal"      | Step 3 (domain search)             |
| Choose style/color/font | "What style fits a fintech app?"            | Step 2 (design system)             |
| Review existing UI      | "Review this page for UX issues"            | Quick Reference checklist          |
| Fix a UI bug            | "Button hover is broken"                    | Quick Reference → relevant section |
| Improve / optimize      | "Make this faster", "Improve mobile"        | Step 3 (domain: ux, react)         |
| Dark mode               | "Add dark mode support"                     | Step 3 (domain: style "dark mode") |
| Charts / data viz       | "Add an analytics dashboard chart"          | Step 3 (domain: chart)             |
| Stack best practices    | "React performance tips"                    | Step 4 (stack search)              |

---

## 📋 WORKFLOW — 4 STEPS

### Step 1: Analyze Requirements

Extract from user request:

- **Product type**: Entertainment / Tool / Productivity / SaaS / E-commerce
- **Target audience**: Consumer vs. B2B, age group, usage context
- **Style keywords**: playful, vibrant, minimal, dark mode, content-first, immersive
- **Tech stack**: Next.js / React / Flutter / React Native / SvelteKit / etc.

---

### Step 2: Generate Design System (ALWAYS DO FIRST)

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "<product_type> <industry> <keywords>" --design-system [-p "Project Name"]
```

Returns:

1. UI Style recommendation (from 67 styles)
2. Color palette (from 161 palettes)
3. Typography pairing (from 57 pairings)
4. Visual effects & spacing
5. Anti-patterns to avoid

**Example:**

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "saas auth productivity dark" --design-system -p "Spinx"
```

**With persistent design system (saves across sessions):**

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name"
# Creates: design-system/MASTER.md (global rules)
# Creates: design-system/pages/<page>.md (page overrides)
```

---

### Step 3: Domain Search (Detailed)

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "<keyword>" --domain <domain> [-n <max_results>]
```

| Domain              | Use When                             |
| ------------------- | ------------------------------------ |
| `style`             | Need specific visual style details   |
| `color`             | Need exact color palette with tokens |
| `typography`        | Need font pairings with CSS imports  |
| `ux`                | Need UX guidelines and rules         |
| `landing`           | Building landing/marketing pages     |
| `app-interface`     | Building app screens/components      |
| `chart`             | Building data visualizations         |
| `react-performance` | React optimization tips              |
| `icons`             | Icon system guidance                 |
| `design`            | General design patterns              |

**Examples:**

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "glassmorphism dark" --domain style
python3 skills/ui-ux-pro-max/scripts/search.py "saas blue trust" --domain color
python3 skills/ui-ux-pro-max/scripts/search.py "tech startup modern" --domain typography
python3 skills/ui-ux-pro-max/scripts/search.py "modal form accessibility" --domain ux
python3 skills/ui-ux-pro-max/scripts/search.py "hero section conversion" --domain landing
```

---

### Step 4: Stack-Specific Best Practices

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "<keyword>" --stack <stack>
```

| Stack Tag         | Framework          |
| ----------------- | ------------------ |
| `nextjs`          | Next.js App Router |
| `react`           | React 18/19        |
| `react-native`    | React Native       |
| `flutter`         | Flutter / Dart     |
| `swiftui`         | SwiftUI (iOS)      |
| `jetpack-compose` | Android Compose    |
| `vue`             | Vue 3              |
| `nuxtjs`          | Nuxt 3             |
| `svelte`          | SvelteKit          |
| `angular`         | Angular            |
| `astro`           | Astro              |
| `laravel`         | Laravel Blade      |
| `shadcn`          | shadcn/ui          |
| `threejs`         | Three.js           |
| `html-tailwind`   | HTML + Tailwind    |

---

## 🎨 UI STYLES REFERENCE (67 Styles)

### Most Used Styles

| #   | Style                   | Best For                               | Key Characteristics                                   |
| --- | ----------------------- | -------------------------------------- | ----------------------------------------------------- |
| 1   | **Minimalist**          | SaaS, productivity, tools              | White space, max 2 colors, clean typography           |
| 2   | **Dark Mode**           | Dev tools, dashboards, media           | Dark bg #0a0a0a, high contrast, subtle glows          |
| 3   | **Glassmorphism**       | Modern SaaS, dashboards, overlays      | `backdrop-filter: blur(15px)`, rgba(255,255,255,0.15) |
| 4   | **Brutalism**           | Portfolios, counter-culture, editorial | 0px border-radius, no transitions, bold typography    |
| 5   | **Neumorphism**         | Wellness, subtle premium apps          | Soft shadows both sides, monochromatic                |
| 6   | **Gradient**            | Consumer apps, entertainment           | Multi-stop gradients, vibrant color transitions       |
| 7   | **Bento Grid**          | Dashboards, feature showcases          | Mixed-size grid cards, masonry layout                 |
| 8   | **Aurora**              | AI products, fintech, premium SaaS     | Animated gradient blobs, dark background              |
| 9   | **Material Design 3**   | Android apps, cross-platform           | Dynamic color, rounded 28dp corners                   |
| 10  | **Flat Design**         | General apps, accessibility-first      | No shadows, solid colors, simple icons                |
| 11  | **Skeuomorphic**        | Legacy apps, iOS retro, games          | Texture, depth, real-world metaphors                  |
| 12  | **Cyberpunk**           | Gaming, NFT, Web3, night clubs         | Neon colors, glitch effects, dark bg                  |
| 13  | **Memphis**             | Gen-Z, youth brands, playful           | Geometric shapes, primary colors, patterns            |
| 14  | **Claymorphism**        | Mobile apps, children's apps           | Puffy 3D shapes, pastel colors, soft shadows          |
| 15  | **Swiss International** | B2B, enterprise, news                  | Grid system, Helvetica, minimal color                 |

### Glassmorphism — Deep Dive (Most Popular)

```css
/* Core CSS */
backdrop-filter: blur(15px);
-webkit-backdrop-filter: blur(15px);
background: rgba(255, 255, 255, 0.15);
border: 1px solid rgba(255, 255, 255, 0.2);
border-radius: 16px;

/* Variables */
--blur-amount: 15px;
--glass-opacity: 0.15;
--border-color: rgba(255, 255, 255, 0.2);
```

### Dark Mode — Deep Dive

```css
/* Background scale */
--bg-base: #0a0a0a;
--bg-surface: #141414;
--bg-elevated: #1c1c1c;

/* Text scale */
--text-primary: #ffffff;
--text-secondary: #a1a1aa;
--text-muted: #52525b;
```

---

## 🎨 COLOR PALETTES REFERENCE (161 Palettes)

### By Product Type

| Product               | Primary   | Secondary | Accent    | Background | Notes                   |
| --------------------- | --------- | --------- | --------- | ---------- | ----------------------- |
| **SaaS General**      | `#2563EB` | `#3B82F6` | `#EA580C` | `#F8FAFC`  | Trust blue + orange CTA |
| **Micro SaaS**        | `#6366F1` | `#818CF8` | `#059669` | `#F5F3FF`  | Indigo + emerald        |
| **E-commerce**        | `#059669` | `#10B981` | `#EA580C` | `#ECFDF5`  | Success green + urgency |
| **E-commerce Luxury** | `#1C1917` | `#44403C` | `#A16207` | `#FAFAF9`  | Dark + gold             |
| **Fintech**           | `#0F172A` | `#1E3A5F` | `#10B981` | `#F0F4F8`  | Navy + success green    |
| **Healthcare**        | `#0EA5E9` | `#38BDF8` | `#10B981` | `#F0F9FF`  | Trust + healing         |
| **EdTech**            | `#7C3AED` | `#8B5CF6` | `#F59E0B` | `#FAF5FF`  | Purple + energy         |
| **Gaming**            | `#DC2626` | `#EF4444` | `#FBBF24` | `#0F0F0F`  | Action red + gold       |
| **AI Product**        | `#6366F1` | `#4F46E5` | `#06B6D4` | `#020617`  | Tech purple + cyan      |
| **Developer Tool**    | `#1D4ED8` | `#2563EB` | `#16A34A` | `#0F172A`  | Code blue dark          |

### Spinx Project Colors (Galaxy Dark)

```css
--color-primary: #7c3aed; /* Purple */
--color-secondary: #06b6d4; /* Cyan */
--color-bg: #0a0a0f; /* Galaxy dark */
--color-surface: #12121a; /* Card bg */
--color-text: #f1f5f9; /* Primary text */
--color-muted: #64748b; /* Muted text */
--color-border: rgba(124, 58, 237, 0.2); /* Purple border */
```

---

## 🔤 TYPOGRAPHY REFERENCE (57 Pairings)

### Top Font Pairings

| #   | Name                | Heading            | Body              | Best For                     | CSS Import                                                                                     |
| --- | ------------------- | ------------------ | ----------------- | ---------------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------- |
| 1   | Classic Elegant     | Playfair Display   | Inter             | Luxury, fashion, editorial   | [Link](https://fonts.google.com/share?selection.family=Inter:wght@300;400;500;600;700          | Playfair+Display:wght@400;500;600;700) |
| 2   | Modern Professional | Poppins            | Open Sans         | SaaS, corporate, startups    | [Link](https://fonts.google.com/share?selection.family=Open+Sans:wght@300;400;500;600;700      | Poppins:wght@400;500;600;700)          |
| 3   | Tech Startup        | Space Grotesk      | DM Sans           | Tech, AI, developer tools    | [Link](https://fonts.google.com/share?selection.family=DM+Sans:wght@400;500;700                | Space+Grotesk:wght@400;500;600;700)    |
| 4   | Editorial Classic   | Cormorant Garamond | Libre Baskerville | Publishing, blogs, magazines | [Link](https://fonts.google.com/share?selection.family=Cormorant+Garamond:wght@400;500;600;700 | Libre+Baskerville:wght@400;700)        |
| 5   | Clean Modern        | Inter              | Inter             | Apps, dashboards, tools      | Single font                                                                                    |
| 6   | Bold Impact         | Bebas Neue         | Lato              | Landing pages, hero sections | —                                                                                              |
| 7   | Friendly App        | Nunito             | Nunito Sans       | Consumer apps, onboarding    | —                                                                                              |
| 8   | Dark Tech           | JetBrains Mono     | Inter             | Dev tools, terminals, code   | —                                                                                              |

### Font Size Scale (Tailwind)

```css
/* Recommended scale */
--text-xs: 0.75rem; /* 12px - labels */
--text-sm: 0.875rem; /* 14px - secondary text */
--text-base: 1rem; /* 16px - body */
--text-lg: 1.125rem; /* 18px - large body */
--text-xl: 1.25rem; /* 20px - subheadings */
--text-2xl: 1.5rem; /* 24px - h3 */
--text-3xl: 1.875rem; /* 30px - h2 */
--text-4xl: 2.25rem; /* 36px - h1 */
--text-5xl: 3rem; /* 48px - hero */
--text-6xl: 3.75rem; /* 60px - display */
```

---

## 📐 SPACING & LAYOUT SYSTEM

```css
/* 4/8pt grid system */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;

/* Border radius scale */
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-2xl: 24px;
--radius-full: 9999px;
```

---

## ✅ UX GUIDELINES (99 Rules)

### 1. Navigation (HIGH)

- ✅ Use `scroll-behavior: smooth` on html element
- ✅ Add `padding-top` to body equal to sticky nav height
- ✅ Bottom nav max 5 items; always show icon + label
- ✅ iOS: bottom Tab Bar for top-level; Android: Top App Bar
- ✅ Back navigation must be predictable — preserve scroll/state
- ✅ Support iOS swipe-back and Android predictive back
- ❌ Never mix Tab + Sidebar + Bottom Nav at same hierarchy level
- ❌ Never use modals for primary navigation flows

### 2. Forms (HIGH)

- ✅ Show inline errors immediately on blur (not just on submit)
- ✅ Error messages: state cause + how to fix (not just "Invalid input")
- ✅ Auto-focus the first invalid field after submit error
- ✅ Mobile input height ≥ 44px
- ✅ Long forms: auto-save drafts
- ✅ Confirm before dismissing modal with unsaved changes
- ❌ Never clear form data on validation error

### 3. Performance (HIGH)

- ✅ LCP < 2.5s, FID < 100ms, CLS < 0.1
- ✅ Lazy load images below fold
- ✅ Use `font-display: swap`
- ✅ Preload critical fonts and hero images
- ✅ Skeleton screens over spinners for layout content
- ❌ Never block main thread > 50ms

### 4. Accessibility (WCAG 2.2 AA)

- ✅ Text contrast ≥ 4.5:1 (body), ≥ 3:1 (large text/icons)
- ✅ Touch targets ≥ 44×44pt (iOS), ≥ 48×48dp (Android)
- ✅ Focus order matches visual order
- ✅ Never use color alone as the only indicator
- ✅ All interactive elements keyboard navigable
- ✅ `aria-live="polite"` for dynamic content
- ✅ Support `prefers-reduced-motion`

### 5. Loading States (MEDIUM)

- ✅ Show skeleton/shimmer for content placeholders (not blank space)
- ✅ Spinner only for short waits (< 3s)
- ✅ Progress bar for file uploads and multi-step operations
- ✅ Disable submit button immediately on click (prevent double submit)
- ❌ Never show empty chart frame while loading — use shimmer

### 6. Empty States (MEDIUM)

- ✅ Every empty state needs: illustration/icon + explanation + CTA
- ✅ First-time empty states: onboarding-focused CTA
- ✅ Search empty: show what was searched + suggestions
- ❌ Never show blank white space as an empty state

### 7. Errors (HIGH)

- ✅ Always provide a recovery path: retry, edit, help link
- ✅ Timeout errors: show message + retry button
- ✅ Network errors: distinguish offline vs. server error
- ✅ Form errors: `role="alert"` for screen readers

### 8. Icons (MEDIUM)

- ✅ Use SVG icons (never PNG for icons — blur on retina)
- ✅ Consistent icon family and stroke width throughout
- ✅ Minimum 44×44pt tap area (use hitSlop if smaller)
- ✅ Icon contrast ≥ 3:1 against background
- ❌ Never use emojis as functional icons
- ❌ Never mix filled and outline styles at the same hierarchy

### 9. Light/Dark Mode (HIGH)

- ✅ Use semantic color tokens, never hardcoded hex per-component
- ✅ Primary text contrast ≥ 4.5:1 in BOTH modes
- ✅ Test both themes before delivery
- ✅ Modal scrim: 40–60% black opacity
- ❌ Never define interaction states for one theme only

### 10. Charts & Data Viz (MEDIUM)

- ✅ Match chart type to data: trend → line, comparison → bar, proportion → donut
- ✅ Provide data table alternative for screen readers
- ✅ Tooltip on hover (web) / tap (mobile) with exact values
- ✅ Axis labels with units; legend always visible
- ✅ Show empty state when no data — not a blank chart
- ✅ Respect `prefers-reduced-motion` for chart animations
- ❌ Never use pie/donut for > 5 categories — switch to bar

---

## 🏗️ COMPONENT RULES

### Buttons

```
Primary: brand color, white text, 4:5:1+ contrast
Secondary: outlined or muted, same border-radius as primary
Danger: semantic red (#DC2626), separate from primary actions
Disabled: reduced opacity (0.5), cursor: not-allowed, no click
Loading: spinner inside button, disable immediately on click
Min height: 44px (mobile) / 36px (desktop)
```

### Cards

```
Elevation levels: flat → subtle shadow → elevated → floating
Border radius: consistent with design system (12-16px typical)
Hover: slight elevation increase (transform: translateY(-2px))
Interactive cards: cursor: pointer, keyboard focusable
```

### Modals & Sheets

```
Backdrop: rgba(0,0,0,0.5) — strong enough to isolate content
Animation: slide-up (mobile), fade+scale (desktop), 200-300ms
Close: X button top-right, click backdrop, Esc key — all must work
Scroll: lock body scroll when modal open
Focus: trap focus inside modal while open
```

### Input Fields

```
Height: 44px mobile, 40px desktop minimum
States: default → focus (brand border) → error (red) → success (green)
Error: show below field, icon + text, aria-describedby linked
Placeholder: NOT a label — always use visible label above
```

---

## 📱 MOBILE-SPECIFIC RULES

| Rule                 | Spec                                          |
| -------------------- | --------------------------------------------- |
| Touch target minimum | 44×44pt (iOS), 48×48dp (Android)              |
| Safe area top        | Respect notch/Dynamic Island                  |
| Safe area bottom     | Respect home indicator (34px)                 |
| Bottom nav clearance | Add `padding-bottom` = nav height + safe area |
| Gesture support      | iOS swipe-back, Android predictive back       |
| Font minimum         | 16px body (prevents iOS zoom on focus)        |
| Tap feedback         | 80–150ms response, ripple/opacity/elevation   |
| Micro-animations     | 150–300ms, platform-native easing             |
| Scroll content       | Must not be hidden behind fixed bars          |
| 8dp spacing grid     | 4/8/16/24/32/48dp rhythm throughout           |

---

## ✅ PRE-DELIVERY CHECKLIST

### Visual Quality

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent family and stroke style
- [ ] Pressed states don't shift layout bounds
- [ ] Semantic theme tokens used (no hardcoded hex per-component)
- [ ] Brand colors match spec exactly

### Interaction

- [ ] All tappable elements have pressed feedback
- [ ] Touch targets ≥ 44×44pt
- [ ] Micro-interaction timing: 150–300ms range
- [ ] Disabled states: visually clear, non-interactive
- [ ] Screen reader focus order matches visual order

### Light/Dark Mode

- [ ] Primary text contrast ≥ 4.5:1 in both modes
- [ ] Secondary text contrast ≥ 3:1 in both modes
- [ ] Dividers visible in both modes
- [ ] Modal scrim strong enough (40–60% black)
- [ ] Both themes tested before delivery

### Layout

- [ ] Safe areas respected (header, tab bar, bottom CTA)
- [ ] Scroll content not hidden behind fixed bars
- [ ] Verified: small phone, large phone, tablet (portrait + landscape)
- [ ] 4/8dp spacing rhythm maintained
- [ ] Long-form text readable on large screens

### Accessibility

- [ ] All images/icons have accessibility labels
- [ ] Form fields have labels, hints, clear error messages
- [ ] Color is NOT the only indicator
- [ ] Supports reduced motion and dynamic text size
- [ ] Interactive elements keyboard navigable

---

## ⚡ POWER PROMPTS — Copy-Paste Ready

### 1. Design System Setup for Spinx

```
@ui-ux-pro-max
Set up the design system for Spinx (SaaS auth backend dashboard).
Style: Glassmorphism + Dark Mode
Colors: Purple #7c3aed primary, Cyan #06b6d4 accent, Galaxy dark #0a0a0f background
Font: Space Grotesk (headings) + Inter (body)
Stack: Next.js 15 + Tailwind CSS v4
Generate: color tokens, spacing scale, component styles, CSS variables.
```

### 2. Landing Page

```
@ui-ux-pro-max
Build a SaaS landing page for Spinx.
Style: Aurora + Glassmorphism, galaxy dark theme
Colors: #7c3aed, #06b6d4, #0a0a0f
Sections: Hero (headline + CTA), Features (3-col), Pricing (3 tiers), CTA banner
Stack: Next.js 15 + Tailwind v4
Check all UX rules: navigation, loading states, accessibility.
```

### 3. Dashboard UI

```
@ui-ux-pro-max
Build a user dashboard for Spinx.
Layout: Sidebar nav + main content area + top header
Components: Stats cards (bento grid), Recent activity feed, API usage chart
Style: Dark mode glassmorphism
Stack: Next.js 15 + Tailwind v4
Accessibility: WCAG 2.2 AA compliant.
```

### 4. Mobile Auth Screens

```
@ui-ux-pro-max
Build login + signup screens for Spinx Flutter mobile app.
Style: Dark mode, glass cards, purple #7c3aed accent
Include: email/password fields, Google OAuth button, validation states
Platform rules: iOS safe areas, 44px touch targets, smooth animations
Stack: Flutter + Material 3
```

### 5. UI Audit

```
@ui-ux-pro-max
Audit this component/page for UX issues:
[paste code or describe component]
Check against: WCAG 2.2 AA, Apple HIG, Material Design 3
Report: Critical → High → Medium → Low issues
Include: exact fixes with code examples.
```

---

## 📁 REPO STRUCTURE

```
ui-ux-pro-max-skill/
├── skill.json                          # Skill metadata
├── src/ui-ux-pro-max/
│   ├── data/
│   │   ├── styles.csv                  # 67 UI styles with full specs
│   │   ├── colors.csv                  # 161 color palettes
│   │   ├── typography.csv              # 57 font pairings
│   │   ├── ux-guidelines.csv           # 99 UX rules
│   │   ├── icons.csv                   # Icon system rules
│   │   ├── charts.csv                  # 25 chart types
│   │   ├── design.csv                  # General design patterns
│   │   ├── landing.csv                 # Landing page patterns
│   │   ├── app-interface.csv           # App component patterns
│   │   ├── react-performance.csv       # React optimization
│   │   ├── ui-reasoning.csv            # AI reasoning rules
│   │   ├── google-fonts.csv            # Google Fonts database
│   │   ├── draft.csv                   # Draft/WIP patterns
│   │   └── stacks/
│   │       ├── nextjs.csv              # Next.js patterns
│   │       ├── react.csv               # React patterns
│   │       ├── react-native.csv        # React Native
│   │       ├── flutter.csv             # Flutter
│   │       ├── swiftui.csv             # SwiftUI
│   │       ├── jetpack-compose.csv     # Android Compose
│   │       ├── vue.csv                 # Vue 3
│   │       ├── nuxtjs.csv / nuxt-ui.csv
│   │       ├── svelte.csv              # SvelteKit
│   │       ├── angular.csv             # Angular
│   │       ├── astro.csv               # Astro
│   │       ├── laravel.csv             # Laravel
│   │       ├── shadcn.csv              # shadcn/ui
│   │       ├── threejs.csv             # Three.js
│   │       └── html-tailwind.csv       # HTML + Tailwind
│   ├── scripts/
│   │   ├── search.py                   # Main search CLI
│   │   ├── design_system.py            # Design system generator
│   │   └── core.py                     # Core utilities
│   └── templates/
│       ├── base/
│       │   ├── skill-content.md        # Full skill instruction template
│       │   └── quick-reference.md      # Quick reference template
│       └── platforms/
│           ├── antigravity.json        # Antigravity config
│           ├── claude.json             # Claude config
│           ├── cursor.json             # Cursor config
│           ├── gemini.json             # Gemini config
│           └── ...                     # 15+ platform configs
└── cli/                                # NPM CLI tool (uipro-cli)
```

---

## 🔧 CLI COMMANDS REFERENCE

```bash
# Install for a specific platform
npx uipro-cli init --ai <platform>

# Update to latest version
npx uipro-cli update

# Uninstall
npx uipro-cli uninstall

# Check installed versions
npx uipro-cli versions

# Design system search
python3 skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system -p "Project"

# Domain search
python3 skills/ui-ux-pro-max/scripts/search.py "<query>" --domain <domain>

# Stack search
python3 skills/ui-ux-pro-max/scripts/search.py "<query>" --stack <stack>

# Persist design system
python3 skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project" --page "dashboard"
```

---

## 📊 SKILL STATS

| Category         | Count   |
| ---------------- | ------- |
| UI Styles        | 67      |
| Color Palettes   | 161     |
| Font Pairings    | 57      |
| UX Guidelines    | 99      |
| Chart Types      | 25      |
| Tech Stacks      | 15+     |
| Platform Configs | 18      |
| GitHub Stars     | 32,100+ |

---

_Source: github.com/nextlevelbuilder/ui-ux-pro-max-skill_
_Version: 2.5.0 | License: MIT | Author: NextLevelBuilder_
_Compiled for Spinx Project by Aditya Singh — April 2026_
