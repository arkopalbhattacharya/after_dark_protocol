---
name: Obsidian Morning
colors:
  surface: '#f6fafe'
  surface-dim: '#d6dade'
  surface-bright: '#f6fafe'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f4f8'
  surface-container: '#eaeef2'
  surface-container-high: '#e4e9ed'
  surface-container-highest: '#dfe3e7'
  on-surface: '#171c1f'
  on-surface-variant: '#3b494b'
  inverse-surface: '#2c3134'
  inverse-on-surface: '#edf1f5'
  outline: '#6a7a7b'
  outline-variant: '#b9cacb'
  surface-tint: '#006970'
  primary: '#006970'
  on-primary: '#ffffff'
  primary-container: '#00f0ff'
  on-primary-container: '#006970'
  inverse-primary: '#00dbe9'
  secondary: '#7c5800'
  on-secondary: '#ffffff'
  secondary-container: '#feb700'
  on-secondary-container: '#6b4b00'
  tertiary: '#bd0042'
  on-tertiary: '#ffffff'
  tertiary-container: '#ffcdd1'
  on-tertiary-container: '#be0042'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#7df4ff'
  primary-fixed-dim: '#00dbe9'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f54'
  secondary-fixed: '#ffdea8'
  secondary-fixed-dim: '#ffba20'
  on-secondary-fixed: '#271900'
  on-secondary-fixed-variant: '#5e4200'
  tertiary-fixed: '#ffd9dc'
  tertiary-fixed-dim: '#ffb2ba'
  on-tertiary-fixed: '#400011'
  on-tertiary-fixed-variant: '#910031'
  background: '#f6fafe'
  on-background: '#171c1f'
  surface-variant: '#dfe3e7'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-base:
    fontFamily: Space Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  code-label:
    fontFamily: Space Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  code-xs:
    fontFamily: Space Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.2'
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  grid-columns: '12'
  gutter: 20px
---

## Brand & Style
The design system embodies "Morning Cyberpunk"—a high-visibility, technical aesthetic that swaps the typical dark-mode "night city" trope for a crisp, solar-flared laboratory environment. It targets power users, developers, and researchers who require the precision of a terminal with the legibility of a high-contrast daylight interface.

The style is **Retro-Futurist / Technical**, drawing from 80s sci-fi interfaces (think *2001: A Space Odyssey* or *Alien* but in broad daylight). It utilizes a clinical, light-gray base layered with aggressive neon accents, subtle scanline textures, and monospaced data readouts to create a sense of operational urgency and scientific clarity.

## Colors
The palette is built on a foundation of **Solar White (#FFFFFF)** and **Pale Gray (#F0F4F8)** to maintain high-key brightness. 

- **Neon Cyan (#00F0FF):** Used for primary actions, active states, and "system-ready" indicators.
- **High-Contrast Amber (#FFB800):** Reserved for warnings, secondary data streams, and "cautionary" interactive elements.
- **Process Magenta (#FF005C):** Used sparingly for critical errors or "overdrive" states.
- **Text & Strokes:** All typography and borders utilize a deep slate (#1A2026) to ensure maximum contrast against the bright backgrounds.

## Typography
The typography system creates a "flight manual" hierarchy. 

**Space Grotesk** is the primary typeface for all headlines and body copy, providing a geometric, futuristic feel that remains legible in high-brightness environments. 

**Space Mono** is utilized for all "system telemetry"—labels, data points, button text, and technical metadata. This monospaced contrast reinforces the technical, programmed nature of the UI. All labels should be set in uppercase with slight letter-spacing to mimic vintage computer terminals.

## Layout & Spacing
The design system uses a **Rigid Technical Grid**. Layouts should feel engineered rather than organic.

- **Desktop:** 12-column fluid grid with wide 24px margins. Content is often partitioned by visible "technical hair-lines" (0.5px borders).
- **Mobile:** 4-column grid with 16px margins. 
- **Rhythm:** An 8px linear scale drives all padding and margins. Use heavy "safe areas" and internal padding within containers to simulate cockpit displays where information is grouped into discrete diagnostic modules.

## Elevation & Depth
In this design system, depth is achieved through **Tonal Stacking and Overlays** rather than shadows. 

1.  **Level 0 (Base):** The #F0F4F8 background.
2.  **Level 1 (Panels):** Pure white (#FFFFFF) surfaces with 1px solid borders (#D1D9E0).
3.  **Level 2 (Active):** High-contrast Cyan (#00F0FF) thin strokes to indicate focus.
4.  **Overlays:** A subtle, 2px-interval horizontal scanline pattern (opacity 0.03) is applied to the entire viewport to simulate a cathode-ray glass screen. 
5.  **HUD Elements:** Use "Ghost Borders"—semi-transparent outlines—for secondary floating elements, avoiding drop shadows entirely to maintain a flat, technical aesthetic.

## Shapes
The shape language is strictly **Sharp (0px)**. 

To maintain the 80s sci-fi aesthetic, all buttons, input fields, and card containers must have 90-degree corners. For specialized "Data Modules," use a "clipped corner" effect (a 45-degree notch on the top-right or bottom-left) to signify technical components.

## Components

- **Buttons:** Rectangular with no radius. Primary buttons use a solid Cyan background with black text. Secondary buttons are "Ghost" style with a 2px black border and Space Mono uppercase text.
- **Input Fields:** Bottom-border only or full-outline with a subtle "scanning" pulse animation on the cursor. Labels sit above the field in Space Mono XS.
- **Cards:** White backgrounds with a mandatory "Header Bar" (a 24px tall strip of light gray) containing a monospaced ID number or component title.
- **Status Chips:** High-saturation blocks (Cyan for OK, Amber for WAIT, Magenta for FAIL). Text inside chips is always black and uppercase.
- **Scanline Overlay:** A global CSS pseudo-element that adds a fixed-position linear gradient texture over the UI, creating the "Morning Terminal" effect.
- **Data Tables:** Heavy horizontal rules (2px) and no vertical rules. Header cells should have a subtle Cyan tint.