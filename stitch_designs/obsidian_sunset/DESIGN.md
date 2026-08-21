---
name: Obsidian Sunset
colors:
  surface: '#1e100a'
  surface-dim: '#1e100a'
  surface-bright: '#47352e'
  surface-container-lowest: '#180b06'
  surface-container-low: '#271812'
  surface-container: '#2b1c16'
  surface-container-high: '#372620'
  surface-container-highest: '#42312a'
  on-surface: '#f9ddd2'
  on-surface-variant: '#d6c4ac'
  inverse-surface: '#f9ddd2'
  inverse-on-surface: '#3d2d26'
  outline: '#9f8e78'
  outline-variant: '#524533'
  surface-tint: '#ffba41'
  primary: '#ffd392'
  on-primary: '#432c00'
  primary-container: '#fdaf00'
  on-primary-container: '#694600'
  inverse-primary: '#7f5600'
  secondary: '#ffb693'
  on-secondary: '#562000'
  secondary-container: '#ea6b1e'
  on-secondary-container: '#4b1b00'
  tertiary: '#ffcce4'
  on-tertiary: '#472638'
  tertiary-container: '#e1b1c8'
  on-tertiary-container: '#674255'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffddaf'
  primary-fixed-dim: '#ffba41'
  on-primary-fixed: '#281800'
  on-primary-fixed-variant: '#614000'
  secondary-fixed: '#ffdbcc'
  secondary-fixed-dim: '#ffb693'
  on-secondary-fixed: '#351000'
  on-secondary-fixed-variant: '#7a3000'
  tertiary-fixed: '#ffd8e9'
  tertiary-fixed-dim: '#eab9d0'
  on-tertiary-fixed: '#2f1122'
  on-tertiary-fixed-variant: '#603c4f'
  background: '#1e100a'
  on-background: '#f9ddd2'
  surface-variant: '#42312a'
typography:
  headline-xl:
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
    letterSpacing: -0.01em
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
  label-mono:
    fontFamily: Space Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.05em
  button-text:
    fontFamily: Space Mono
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 48px
  container-max: 1280px
---

## Brand & Style
This design system interprets a "washed-down golden hour cyberpunk" aesthetic. It moves away from the cold neons of traditional cyberpunk, favoring a sweltering, hazy atmosphere that evokes a terminal screen viewed through a heat haze. The brand personality is technical yet organic, utilizing high-tech typography paired with the tactile warmth of a desert dusk. 

The visual style leans into **Minimalism** with **Retro/Vaporwave** undertones. It features high-contrast accents against dark, earthy backgrounds, simulating the "glow" of aging hardware. Interfaces should feel like a high-end, proprietary OS running on futuristic, copper-cooled hardware.

## Colors
The palette is built on the tension between deep, grounded shadows and a piercing, solar accent.
- **Primary (Golden Amber):** Used for critical interactions, data highlights, and the primary "glow" effect.
- **Secondary (Burnt Orange):** Used for secondary actions and warning states, providing a bridge between the amber and the dark backgrounds.
- **Tertiary (Dusk Purple):** A muted, deep purple used for structural elements, inactive states, and low-priority backgrounds to add depth without increasing heat.
- **Surface (#2a1b15):** The base color for containers and cards, providing a rich, organic dark tone that feels more atmospheric than pure black.
- **Text:** Primarily off-white with an amber tint to maintain the hazy, low-eye-strain reading experience.

## Typography
The typography system uses a dual-mono approach to reinforce the "terminal" aesthetic. 
- **Space Grotesk** is used for headings and body copy to ensure high legibility while maintaining a technical, geometric edge. 
- **Space Mono** is reserved for labels, metadata, and button text, providing the "hacker-chic" utility necessary for the cyberpunk theme. 
- All headlines should exhibit a subtle "glow" (text-shadow) using the primary amber color at low opacity to simulate light bleed on a screen.

## Layout & Spacing
The system utilizes a **Fluid Grid** with a strictly enforced 4px baseline rhythm. 
- **Desktop:** 12-column grid with 24px gutters.
- **Tablet:** 8-column grid with 16px gutters.
- **Mobile:** 4-column grid with 16px margins.

Layouts should feel dense and information-rich, but organized. Use heavy horizontal rules (1px or 2px) in Dusk Purple to separate sections rather than relying solely on whitespace. This creates a "schematic" feel common in technical interfaces.

## Elevation & Depth
In this design system, depth is achieved through **Tonal Layers** and **Ambient Glows** rather than realistic shadows.
- **Level 0 (Background):** Deepest brown-black (#1a100d).
- **Level 1 (Surface):** The primary container color (#2a1b15).
- **Level 2 (Raised):** Lighter tint of the surface color with a 1px solid border in Dusk Purple (#5e3a4d).
- **Overlays:** Instead of shadows, use a 1px solid amber border and a subtle outer glow (box-shadow: 0 0 15px rgba(253, 175, 0, 0.2)) to indicate the highest level of hierarchy, such as modals or active dropdowns.

## Shapes
The shape language is strictly **Sharp (0px)**. To evoke a technical, industrial feel, all buttons, cards, and input fields must have square corners. 

Occasional "chamfered" corners (45-degree cuts) can be used on decorative elements or primary action buttons to enhance the futuristic hardware aesthetic. Use 1px borders exclusively; thick borders should be avoided to maintain a sophisticated, precise look.

## Components
- **Buttons:** Rectangular with no radius. Primary buttons are solid Golden Amber with black text. Secondary buttons are ghost-style with a Burnt Orange border and Space Mono text.
- **Inputs:** Underlined or fully boxed with a 1px Dusk Purple border. Upon focus, the border transitions to Golden Amber with a subtle inner glow.
- **Chips/Tags:** Small, sharp blocks using Space Mono. Use Dusk Purple backgrounds with light amber text for a "read-only" data look.
- **Cards:** No shadows. Use a 1px border in a slightly lighter shade of the surface color. Card headers should be separated by a 1px horizontal rule.
- **Progress Bars:** Solid blocks of color (no gradients). Use a "segmented" look for loaders to mimic old data processing displays.
- **Terminal Output:** A specialized component for log data or system messages using Space Mono, housed in a slightly recessed container with a subtle scanline overlay (linear-gradient).