---
name: Obsidian Twilight
colors:
  surface: '#1a0b2e'
  surface-dim: '#1a0b2e'
  surface-bright: '#413257'
  surface-container-lowest: '#150629'
  surface-container-low: '#231437'
  surface-container: '#27183b'
  surface-container-high: '#322346'
  surface-container-highest: '#3d2e52'
  on-surface: '#eddcff'
  on-surface-variant: '#dcbed4'
  inverse-surface: '#eddcff'
  inverse-on-surface: '#38294d'
  outline: '#a4899d'
  outline-variant: '#564052'
  surface-tint: '#ffabf3'
  primary: '#ffabf3'
  on-primary: '#5b005b'
  primary-container: '#ff00ff'
  on-primary-container: '#510051'
  inverse-primary: '#a900a9'
  secondary: '#d3fbff'
  on-secondary: '#00363a'
  secondary-container: '#00eefc'
  on-secondary-container: '#00686f'
  tertiary: '#d1bcff'
  on-tertiary: '#3c0090'
  tertiary-container: '#a179ff'
  on-tertiary-container: '#350081'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffd7f5'
  primary-fixed-dim: '#ffabf3'
  on-primary-fixed: '#380038'
  on-primary-fixed-variant: '#810081'
  secondary-fixed: '#7df4ff'
  secondary-fixed-dim: '#00dbe9'
  on-secondary-fixed: '#002022'
  on-secondary-fixed-variant: '#004f54'
  tertiary-fixed: '#e9ddff'
  tertiary-fixed-dim: '#d1bcff'
  on-tertiary-fixed: '#23005b'
  on-tertiary-fixed-variant: '#5700c9'
  background: '#1a0b2e'
  on-background: '#eddcff'
  surface-variant: '#3d2e52'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-md:
    fontFamily: Space Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  code-sm:
    fontFamily: Space Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Space Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  container-max: 1440px
---

## Brand & Style
The design system embodies a high-vibrancy nocturnal aesthetic, capturing the electric energy of a cyberpunk city just before midnight. The personality is bold, technical, and unapologetically digital. It targets a tech-literate audience that values efficiency, precision, and immersive environments.

The style is a fusion of **Neon-Cyberpunk** and **High-Contrast Minimalism**. It utilizes deep indigo voids as a canvas for high-intensity magenta and pink light. Visual motifs include glowing edges, monospaced data readouts, and glassmorphic overlays that simulate the look of a terminal HUD (Heads-Up Display) projected against a dark urban skyline.

## Colors
The palette is centered on a "dark-to-electric" contrast ratio to ensure maximum vibrancy.

- **Primary (Neon Pink):** Used for critical actions, active states, and primary branding. It should appear to "emit light."
- **Secondary (Electric Cyan):** A high-contrast utility color for secondary data points and success states.
- **Tertiary (Deep Indigo):** Used for elevated surfaces and subtle structural highlights.
- **Neutral (Midnight Void):** The #1a0b2e base serves as the "black" for all backgrounds, ensuring that pink and magenta accents pop without causing visual fatigue.

Use alpha-blending for neon glows: a 20% opacity primary color shadow creates the signature "neon bleed" effect on surfaces.

## Typography
The typography strategy prioritizes a "terminal" feel while maintaining modern legibility. 

**Space Grotesk** is the workhorse for headlines and body copy, providing a geometric, technical vibe that feels futuristic yet readable. **Space Mono** is reserved for metadata, labels, and technical readouts to reinforce the hacker-terminal aesthetic. 

All labels should utilize uppercase with increased letter spacing to mimic hardware engravings. For large displays, use a slight "text-shadow" of the primary color to simulate a cathode-ray tube (CRT) glow.

## Layout & Spacing
The layout follows a **Fixed Grid** system inspired by modular circuitry. 

- **Desktop:** 12-column grid with 24px gutters. Content is strictly contained within a 1440px max-width wrapper.
- **Mobile:** 4-column fluid grid with 16px margins.

Spacing follows a strict 4px base unit. Components should feel "locked" into the grid. Use heavy horizontal rules (1px or 2px) to separate sections rather than relying solely on whitespace, creating a structured, partitioned UI reminiscent of a technical schematic.

## Elevation & Depth
Depth is created through **Tonal Layers** and **Backdrop Blurs**, avoiding traditional shadows in favor of light-based depth.

1.  **Base:** #1a0b2e (The deepest layer).
2.  **Surface:** A slightly lighter indigo tint with 1px inner borders of 10% white to define edges.
3.  **Overlays:** Semi-transparent magenta or indigo glass (20% opacity) with a 12px backdrop blur.

Instead of drop shadows, use **Outer Glows**. An elevated element should have a soft `box-shadow` using the primary color at low opacity (e.g., `0 0 15px rgba(255, 0, 255, 0.3)`), making the element appear as if it is hovering and emitting light onto the surface below.

## Shapes
This design system utilizes **Sharp** geometry. To maintain the aggressive, technical nature of a cyberpunk terminal, rounded corners are prohibited. 

All buttons, cards, and input fields must have 0px border-radii. For a distinctive "tech" flourish, use "clipped corners" (45-degree chamfers) on primary containers and buttons to evoke a militarized or industrial hardware aesthetic.

## Components
- **Buttons:** Sharp-edged with a 2px solid border. The primary button is #ff00ff with black text; the secondary button is a "Ghost" style with a primary color border and a subtle hover glow.
- **Inputs:** Dark backgrounds with a bottom-only border (2px). On focus, the border and label glow in primary magenta. Use Space Mono for placeholder text.
- **Chips/Tags:** Small, rectangular boxes with high-contrast backgrounds. Use secondary colors (Cyan) to differentiate status.
- **Cards:** Defined by a 1px border of Tertiary Indigo. No fill, or a very dark indigo fill (#1f0f35). Headlines within cards should be set in Space Grotesk Bold.
- **Progress Bars:** Use a "segmented" look where the bar is made of small vertical rectangles rather than a solid line, emphasizing the digital/quantized nature of the data.
- **Data Tables:** High-density, sharp rows with `label-caps` for headers. Use thin magenta vertical dividers to separate columns.