---
name: Obsidian Protocol
colors:
  surface: '#10141a'
  surface-dim: '#10141a'
  surface-bright: '#353940'
  surface-container-lowest: '#0a0e14'
  surface-container-low: '#181c22'
  surface-container: '#1c2026'
  surface-container-high: '#262a31'
  surface-container-highest: '#31353c'
  on-surface: '#dfe2eb'
  on-surface-variant: '#bac9c9'
  inverse-surface: '#dfe2eb'
  inverse-on-surface: '#2d3137'
  outline: '#859494'
  outline-variant: '#3b494a'
  surface-tint: '#1ddce0'
  primary: '#52f9fd'
  on-primary: '#003738'
  primary-container: '#1edce0'
  on-primary-container: '#005c5e'
  inverse-primary: '#00696b'
  secondary: '#ffd392'
  on-secondary: '#432c00'
  secondary-container: '#fdaf00'
  on-secondary-container: '#694600'
  tertiary: '#ffdbd7'
  on-tertiary: '#68000a'
  tertiary-container: '#ffb4ae'
  on-tertiary-container: '#aa0017'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#52f9fc'
  primary-fixed-dim: '#1ddce0'
  on-primary-fixed: '#002021'
  on-primary-fixed-variant: '#004f51'
  secondary-fixed: '#ffddaf'
  secondary-fixed-dim: '#ffba41'
  on-secondary-fixed: '#281800'
  on-secondary-fixed-variant: '#614000'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3ad'
  on-tertiary-fixed: '#410004'
  on-tertiary-fixed-variant: '#930013'
  background: '#10141a'
  on-background: '#dfe2eb'
  surface-variant: '#31353c'
  obsidian-base: '#0a0e14'
  obsidian-elevated: '#12171f'
  obsidian-surface: '#1a1f26'
  neon-cyan: '#1edce0'
  amber-warn: '#fdaf00'
  terminal-green: '#33ff00'
typography:
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 42px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Space Mono
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Space Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-lg:
    fontFamily: Space Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.15em
  label-sm:
    fontFamily: Space Mono
    fontSize: 10px
    fontWeight: '400'
    lineHeight: '1'
    letterSpacing: 0.05em
spacing:
  unit: 4px
  gutter: 16px
  margin: 24px
  panel-padding: 20px
  stack-sm: 8px
  stack-md: 16px
---

## Brand & Style

This design system is an evolution of technical narrative interfaces, pushing the aesthetic into a high-fidelity **Cyberpunk Dark Mode**. It is designed for power users, developers, and data analysts who operate within a "Terminal Narrative" environment. The emotional response is one of deep focus, clandestine operations, and high-tech immersion.

The visual style is **Cyber-Brutalism mixed with Retro-Futurism**. It prioritizes high-contrast luminosity against an "ultra-black" void. The interface should feel like a physical emissive display—a hardware console where light is the only indicator of presence.

**Key Aesthetic Pillars:**
- **Obsidian Depth:** Utilizing the deepest possible black levels to create an infinite canvas.
- **Emissive UI:** Elements do not reflect light; they emit it. Borders and text act as neon filaments.
- **Retro-Digital Artifacts:** Intentional inclusion of scanlines, flickering cursors, and chromatic aberration to simulate a legacy CRT hardware stack.
- **Functional Density:** Information is packed tightly, separated by thin light-borders rather than white space.

## Colors

The palette is anchored by **Obsidian Base (#0a0e14)**, a desaturated ultra-black designed to eliminate panel-glare and maximize the contrast of neon elements. 

- **Primary (Neon Cyan):** The "System Normal" color. Used for interactive elements, primary data streams, and active state glows.
- **Secondary (Amber):** The "Warning/Legacy" color. Used for secondary logs, sub-headers, and non-critical alerts.
- **Tertiary (Cyber Orange):** The "Critical" color. Reserved for hardware failure alerts and destructive terminal commands.
- **Neutral (Obsidian Tiers):** Depth is created through three tiers of black. Surfaces do not use shadows; they use incrementally lighter shades of obsidian to denote elevation.

**Retro LCD Effects:**
Apply a `0.1` opacity glow to all Primary and Secondary colored text. Borders should utilize a low-opacity version of the Primary color (20-30%) with a subtle outer glow (4px-8px blur).

## Typography

The system utilizes a strictly technical font pairing. **Space Grotesk** provides a geometric, futuristic feel for high-level identification, while **Space Mono** ensures every character in the data stream is distinct and aligned.

**Stylistic Treatments:**
- **Chromatic Aberration:** Apply a subtle `text-shadow` (1px red/cyan offset) to `headline-lg` to simulate RGB misalignment on a CRT.
- **Case:** All labels, buttons, and headers must be `uppercase`. Body text remains sentence case for legibility.
- **Terminal Cursor:** All active input areas must feature a flickering block cursor (`█`) using a 1Hz opacity animation.
- **LCD Flicker:** Headings should feature a very subtle high-frequency opacity animation (98% to 100%) to simulate power fluctuations.

## Layout & Spacing

The layout philosophy follows a **Fixed Modular Grid** system. The screen is treated as a single viewport "cockpit" rather than a scrolling webpage.

**Layout Rules:**
- **Scanline Overlay:** A persistent global overlay of horizontal 2px lines (5% opacity) must be rendered over the entire UI.
- **Fixed Viewport:** Avoid long scrolling pages. Use internal scrolling within "Panels" or "Blades."
- **Grid Alignment:** All modules must snap to a 4px baseline.
- **Breakpoints:**
  - **Desktop (1440px+):** 4-column panel layout.
  - **Tablet (768px-1439px):** 2-column panel layout with collapsible sidebar.
  - **Mobile:** Single column with navigation moved to a bottom-docked terminal bar.

## Elevation & Depth

Depth is achieved through **Luminance and Tonal Layering** instead of physical shadows.

- **Tonal Stepping:** The background is `#0a0e14`. Nested containers use `#12171f`. Active or "popped" elements use `#1a1f26`.
- **Neon Borders:** Depth is defined by light. Higher elevation elements have higher opacity neon borders (e.g., 40% vs 10%).
- **Backdrop Blur:** Modals or overlays must use a `backdrop-filter: blur(10px)` combined with a 20% opacity primary color tint to simulate frosted glass within the terminal.
- **Glow Hierarchy:** Only the most important actionable elements (Primary Buttons, Active Tabs) receive an external neon glow effect.

## Shapes

The shape language is **Strictly Linear and Industrial**. 

- **Hard Edges:** All UI elements have a 0px border-radius.
- **Angled Geometry:** Use `clip-path` for 45-degree chamfered corners on primary buttons and container headers to reinforce the sci-fi aesthetic.
- **Technical Framing:** Use CSS `::before` and `::after` elements to add "corner brackets" to active panels.

## Components

### Buttons
- **Primary:** Neon Cyan background, Black text (#0a0e14). On hover, add a 15px cyan glow and a "glitch" shift (translate 2px).
- **Secondary/Ghost:** 1px Cyan border (30% opacity), Cyan text. On hover, background becomes 10% Cyan.

### Terminal Inputs
- **Visuals:** Single bottom-border or full 1px box in Obsidian Surface. Prefix with `[SYS_CMD_IN]>`.
- **Cursor:** Every focused input must display the `█` blinking block cursor.

### Modular Panels (Cards)
- **Header:** Darker than the body, containing technical metadata like `PID: 4402` or `COORD: 40.7/74.0`.
- **Border:** 1px wide, Primary color at 20% opacity.
- **Footer:** A 12px "Status Bar" showing system time or a fake "bitrate" monitor.

### Checkboxes & Radios
- **Style:** Square (0px radius). Checked state is a solid block of Cyan. Unchecked is a 1px Cyan outline.

### Progress Bars
- **Style:** Segmented blocks. Each 10% increment is a separate vertical rectangle.
- **Animation:** Blocks should "pulse" forward when data is transferring.

### Data Lists
- **Style:** Zebra-striping using `#12171f` against the base. No dividers; use tonal shifts only.