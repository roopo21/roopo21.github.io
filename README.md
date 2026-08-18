# roopo21.github.io

Personal site — [abhiroopmareedu.com via GitHub Pages](https://roopo21.github.io).

Hand-written HTML, CSS and JavaScript. No framework, no build step, no dependencies:
push to `main` and GitHub Pages serves it.

```
index.html      markup + copy
styles.css      design tokens, layout, components (light + dark)
main.js         canvas waveform, reveals, accordion, command palette (⌘K)
assets/         portrait
```

Notes
- The hero waveform is a `<canvas>`: layered sines with a speech-like amplitude
  envelope, plus a gaussian bump that follows the cursor. It pauses when the hero
  scrolls out of view or the tab is hidden, and never runs under
  `prefers-reduced-motion`.
- Theme follows the system by default and remembers a manual choice in
  `localStorage`.
- `⌘K` (or `/`) opens the command palette.
