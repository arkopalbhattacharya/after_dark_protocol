import forms from '@tailwindcss/forms';
import containerQueries from '@tailwindcss/container-queries';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      "colors": {
              "outline": "#859494",
              "on-error": "#690005",
              "on-surface-variant": "#bac9c9",
              "on-secondary-container": "#694600",
              "primary-fixed": "#52f9fc",
              "surface": "#10141a",
              "surface-container": "#1c2026",
              "surface-dim": "#10141a",
              "obsidian-surface": "#1a1f26",
              "error": "#ffb4ab",
              "on-primary": "#003738",
              "on-tertiary-container": "#aa0017",
              "on-primary-fixed": "#002021",
              "background": "#10141a",
              "neon-cyan": "#1edce0",
              "on-tertiary-fixed": "#410004",
              "on-background": "#dfe2eb",
              "inverse-on-surface": "#2d3137",
              "on-error-container": "#ffdad6",
              "terminal-green": "#33ff00",
              "tertiary-fixed": "#ffdad7",
              "on-surface": "#dfe2eb",
              "tertiary-fixed-dim": "#ffb3ad",
              "primary-fixed-dim": "#1ddce0",
              "surface-variant": "#31353c",
              "on-tertiary": "#68000a",
              "primary": "#52f9fd",
              "surface-container-lowest": "#0a0e14",
              "inverse-primary": "#00696b",
              "amber-warn": "#fdaf00",
              "obsidian-elevated": "#12171f",
              "tertiary-container": "#ffb4ae",
              "surface-container-high": "#262a31",
              "error-container": "#93000a",
              "outline-variant": "#3b494a",
              "secondary-fixed": "#ffddaf",
              "on-tertiary-fixed-variant": "#930013",
              "primary-container": "#1edce0",
              "secondary-container": "#fdaf00",
              "tertiary": "#ffdbd7",
              "surface-container-low": "#181c22",
              "on-secondary-fixed-variant": "#614000",
              "obsidian-base": "#0a0e14",
              "on-primary-fixed-variant": "#004f51",
              "on-secondary": "#432c00",
              "on-primary-container": "#005c5e",
              "on-secondary-fixed": "#281800",
              "surface-tint": "#1ddce0",
              "inverse-surface": "#dfe2eb",
              "surface-container-highest": "#31353c",
              "surface-bright": "#353940",
              "secondary-fixed-dim": "#ffba41",
              "secondary": "#ffd392"
      },
      "borderRadius": {
              "DEFAULT": "0.25rem",
              "lg": "0.5rem",
              "xl": "0.75rem",
              "full": "9999px"
      },
      "spacing": {
              "panel-padding": "20px",
              "unit": "4px",
              "stack-sm": "8px",
              "margin": "24px",
              "gutter": "16px",
              "stack-md": "16px"
      },
      "fontFamily": {
              "headline-lg": ["Space Grotesk", "sans-serif"],
              "headline-md": ["Space Grotesk", "sans-serif"],
              "label-lg": ["Space Mono", "monospace"],
              "label-sm": ["Space Mono", "monospace"],
              "body-lg": ["Space Mono", "monospace"],
              "headline-sm": ["Space Grotesk", "sans-serif"],
              "body-md": ["Space Mono", "monospace"]
      },
      "fontSize": {
              "headline-lg": ["42px", { "lineHeight": "1.1", "letterSpacing": "-0.04em", "fontWeight": "700" }],
              "headline-md": ["28px", { "lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "700" }],
              "label-lg": ["12px", { "lineHeight": "1", "letterSpacing": "0.15em", "fontWeight": "700" }],
              "label-sm": ["10px", { "lineHeight": "1", "letterSpacing": "0.05em", "fontWeight": "400" }],
              "body-lg": ["16px", { "lineHeight": "1.6", "fontWeight": "400" }],
              "headline-sm": ["20px", { "lineHeight": "1.2", "fontWeight": "600" }],
              "body-md": ["14px", { "lineHeight": "1.5", "fontWeight": "400" }]
      }
    }
  },
  plugins: [
    forms,
    containerQueries,
  ],
}
