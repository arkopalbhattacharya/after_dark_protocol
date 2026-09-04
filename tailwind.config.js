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
              "outline": "var(--color-outline, #859494)",
              "on-error": "var(--color-on-error, #690005)",
              "on-surface-variant": "var(--text-on-surface-variant, #bac9c9)",
              "on-secondary-container": "var(--color-on-secondary, #694600)",
              "primary-fixed": "var(--color-primary, #52f9fc)",
              "surface": "var(--bg-surface, #10141a)",
              "surface-container": "var(--bg-container, #1c2026)",
              "surface-dim": "var(--bg-container-low, #10141a)",
              "obsidian-surface": "var(--bg-surface, #1a1f26)",
              "error": "var(--color-error, #ffb4ab)",
              "on-primary": "var(--color-on-primary, #003738)",
              "on-tertiary-container": "#aa0017",
              "on-primary-fixed": "#002021",
              "background": "var(--bg-app, #10141a)",
              "neon-cyan": "var(--color-primary, #1edce0)",
              "on-tertiary-fixed": "#410004",
              "on-background": "var(--text-on-surface, #dfe2eb)",
              "inverse-on-surface": "#2d3137",
              "on-error-container": "#ffdad6",
              "terminal-green": "#33ff00",
              "tertiary-fixed": "#ffdad7",
              "on-surface": "var(--text-on-surface, #dfe2eb)",
              "tertiary-fixed-dim": "#ffb3ad",
              "primary-fixed-dim": "var(--color-primary, #1ddce0)",
              "surface-variant": "var(--bg-container-high, #31353c)",
              "on-tertiary": "#68000a",
              "primary": "var(--color-primary, #52f9fd)",
              "surface-container-lowest": "var(--bg-base, #0a0e14)",
              "inverse-primary": "#00696b",
              "amber-warn": "var(--color-secondary, #fdaf00)",
              "obsidian-elevated": "var(--bg-panel, #12171f)",
              "tertiary-container": "#ffb4ae",
              "surface-container-high": "var(--bg-container-high, #262a31)",
              "error-container": "#93000a",
              "outline-variant": "var(--color-outline-variant, #3b494a)",
              "secondary-fixed": "var(--color-secondary, #ffddaf)",
              "on-tertiary-fixed-variant": "#930013",
              "primary-container": "var(--color-primary-container, #1edce0)",
              "secondary-container": "var(--color-secondary-container, #fdaf00)",
              "tertiary": "#ffdbd7",
              "surface-container-low": "var(--bg-container-low, #181c22)",
              "on-secondary-fixed-variant": "#614000",
              "obsidian-base": "var(--bg-base, #0a0e14)",
              "on-primary-fixed-variant": "#004f51",
              "on-secondary": "var(--color-on-secondary, #432c00)",
              "on-primary-container": "#005c5e",
              "on-secondary-fixed": "#281800",
              "surface-tint": "var(--color-primary, #1ddce0)",
              "inverse-surface": "var(--text-on-surface, #dfe2eb)",
              "surface-container-highest": "var(--bg-container-highest, #31353c)",
              "surface-bright": "var(--bg-container-high, #353940)",
              "secondary-fixed-dim": "var(--color-secondary, #ffba41)",
              "secondary": "var(--color-secondary, #ffd392)"
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
