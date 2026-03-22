---
name: combo-unsa-design
description: Design system rules, color tokens, and component guidelines for the Combo UNSA frontend dashboard. Use this skill when building or styling UI components for this project.
---

# Combo UNSA Design System

This document outlines the core design language for the frontend application, inspired by the "Nocturnal Academia" dashboard mockups.

## Color Palette

### Base Theme
- **Neutral (Backgrounds):**
  - App Background: `#0D1117` (Very dark grey/blue, effectively the canvas).
  - Surface/Cards/Sidebar Background: `#161B22` or `#1E2532` (Slightly lighter than neutral to create elevation).
  - Borders: `#30363D` (Subtle borders to separate components).

### Brand Colors
- **Primary:** `#D4A017` (Gold/Yellow). Used for primary buttons, active states, important highlights, icons.
- **Secondary:** `#1A3A5C` (Dark Blue). Used for interactive elements or secondary surfaces.
- **Tertiary:** `#3B82F6` (Bright Blue). Used for links, secondary actions, and progress indicators.

### Semantic Status Colors
Used mainly for tags, badges, and progress bars.
- **Success / Biology:** `#10B981` (Green)
- **Info / Math / Physics:** `#3B82F6` (Blue)
- **Warning / Civics:** `#D4A017` (Gold/Yellow)
- **Error / History:** `#EF4444` (Red/Red-Pink)

### Text Colors
- **Headings & Primary Text:** `#E0E6ED` or `white` (High contrast text).
- **Secondary Text (Subtitles, labels):** `#8B949E` or `#9CA3AF` (Muted gray tones).
- **Accent Text:** Primary color `#D4A017` is used for highlighting text (e.g., Active sidebar link, Dashboard title).

## Components Guidelines

### Typography
- **Font Family:** Use a clean, modern Sans-Serif font (e.g., `Inter`, `Roboto`, or standard Tailwind sans).
- **Headings:** Bold and crisp. The main "Hola, Juan" header uses a large font size (`text-3xl` or `text-4xl`) and `font-bold`.

### Buttons
- **Primary Button:** `bg-[#D4A017]` with dark/black text (`text-[#0D1117]`). `hover:bg-yellow-600` for interactivity. Rounded corners `rounded-lg` or `rounded-md`. Padding typically `px-4 py-2`.
- **Secondary Button:** `bg-[#1A3A5C]` with white text.
- **Outlined Button:** Transparent background with border, e.g., `border border-[#30363D] text-[#8B949E] hover:text-white`.

### Cards & Surfaces
- **General Architecture:** Panels and cards use `bg-[#161B22]` with `rounded-xl` or `rounded-2xl`. No heavy box shadows, instead relying on border differences or slight background lightening (`border border-white/5` or `border-[#30363D]`).
- **Accent Strips:** Flashcards have a visual 4px colored strip on the left edge denoting the subject (Green for Biología, Blue for Física, Red for Historia).

### Navigation Sidebar
- Takes up about 250px on desktop.
- Header logo text "Combo UNSA" with "Combo" in white and "UNSA" in Primary Gold.
- Links are vertically stacked. Unselected are muted text. The selected state has Primary Gold text, `bg-[#D4A017]/10` (slight yellow tint), and a left border indicator in Gold.

### Progress Elements
- **Linear Progress Bars:** Thin track `h-2` with `bg-gray-800` and filled portion using semantic colors.
- **Circular Progress:** An SVG donut chart with a Gold track indicating score out of total (e.g., 14/20).

## Tips for Implementation
- Ensure you configure these colors inside `tailwind.config.ts`.
- Use flexbox and CSS Grid (`grid-cols-3` or `grid-cols-4`) for arranging the dashboard stat cards.
- Add micro-interactions: slight transform scale-up on buttons, and smooth transition colors (`transition-colors duration-200`).
