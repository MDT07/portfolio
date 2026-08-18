---
version: 2.0
name: Signal Blue
description: A technical portfolio built from one cool blue-grey tonal system.
---

# DESIGN.md — Signal Blue

## 1. Concept

The interface is a living product-delivery map: brief, architecture, interface,
intelligence, validation and launch. Motion explains connections between these
stages; it is never decoration by itself.

The visual system is intentionally narrow:

- one cool blue-grey color family;
- Inter for all reading and display typography;
- JetBrains Mono for coordinates, labels and technical metadata;
- thin lines, square geometry and modular grids;
- small WebGL or 3D details only inside explanatory interfaces;
- natural document flow without pinned full-page storytelling.

## 2. Color system

### Light surfaces

| Token | Value | Use |
| --- | --- | --- |
| `surface-0` | `#EAF0F2` | Primary page surface |
| `surface-1` | `#E1E9EB` | Raised modules |
| `surface-2` | `#D4E0E3` | Hover and secondary panels |
| `surface-3` | `#A9BAC0` | Dividers and borders |
| `text-primary` | `#0A1B21` | Headings and body |
| `text-secondary` | `#40565E` | Supporting copy |
| `text-tertiary` | `#64777E` | Large metadata only |

### Dark surfaces

| Token | Value | Use |
| --- | --- | --- |
| `night` | `#07171D` | Technical scenes |
| `night-raised` | `#0C222A` | Technical modules |
| `night-line` | `#294650` | Borders on dark surfaces |
| `night-ink` | `#EDF6F8` | Primary text on dark surfaces |
| `night-soft` | `#AAC0C7` | Supporting text on dark surfaces |

### Signal

| Token | Value | Use |
| --- | --- | --- |
| `accent` | `#176F91` | Links and active states on light surfaces |
| `signal` | `#55B5DA` | Routes and active states on dark surfaces |

No warm beige, pure-white page panels, purple AI gradients, neon rainbow,
glass cards or isolated colors are permitted. Project imagery may keep its own
colors because it is evidence, not interface chrome.

### Contrast contract

- Light primary pair: `#0A1B21` on `#EAF0F2` — 15.31:1.
- Light secondary pair: `#40565E` on `#EAF0F2` — 6.73:1.
- Dark primary pair: `#EDF6F8` on `#07171D` — 16.65:1.
- Dark secondary pair: `#AAC0C7` on `#07171D` — 9.63:1.
- Signal button pair: `#07171D` on `#55B5DA` — 7.84:1.

`text-tertiary` is reserved for compact metadata, not essential body copy.
Each dark section must explicitly set both its background and foreground.

## 3. Typography

| Role | Family | Weight | Rules |
| --- | --- | --- | --- |
| Display | Inter | 580–650 | Tight tracking, balanced wrap, max 96px |
| Heading | Inter | 580–650 | Sentence case, compact line-height |
| Body | Inter | 400–500 | 15–18px, line-height 1.55–1.75 |
| Technical label | JetBrains Mono | 500–600 | 9–11px, uppercase, tracked |

There is no serif display layer. One component may have at most three visible
text levels: heading, body and technical metadata.

Display size guidelines:

- hero desktop: `clamp(50px, 6.5vw, 93px)`;
- section title desktop: `clamp(40px, 5vw, 77px)`;
- hero mobile: `clamp(48px, 15vw, 75px)`;
- section title mobile: `clamp(39px, 12vw, 61px)`.

## 4. Layout

- Maximum content width: 1320px; 1504px on screens wider than 1600px.
- Desktop: 12 columns with 24px conceptual gutters.
- Page gutters: 20px mobile, 32px tablet, 48px desktop.
- Section spacing: `clamp(88px, 10vw, 152px)`.
- Mobile is composed as a deliberate single-column layout.
- Every section owns real height in document flow.
- Sticky and fixed positioning is limited to global navigation and chapter index.
- Cards do not overlap adjacent sections or rely on spacer elements.

## 5. Surface rhythm

The narrative alternates between two temperatures of the same color family:

1. Signal — dark technical field.
2. Identity — light blue-grey dossier.
3. Systems — dark technical field.
4. Work — light blue-grey archive.
5. Intelligence — dark technical field.
6. Protocol — light blue-grey document.
7. Contact — dark technical field.

The alternation is semantic and contrast-safe. It must not introduce unrelated
palette values.

## 6. Interaction language

- Hover movement: 2–4px maximum.
- UI transitions: 150–350ms.
- Section reveals: opacity + short vertical translation.
- Signal routes may animate dash offset continuously only while visible.
- Gallery navigation uses native horizontal scrolling and scroll snap.
- Touch targets are at least 44px.
- Pointer hover always has an equivalent keyboard focus state.
- `prefers-reduced-motion` removes route loops and animated scrolling.

Large decorative 3D objects, cursor takeovers, scroll-jacking, pinned sequences,
infinite parallax and transform accumulation are prohibited.

## 7. Component rules

### Navigation

- 72px fixed header.
- Homepage header stays on the dark technical surface for reliable contrast.
- Other routes use theme tokens.
- Mobile menu is an opaque surface, never transparent above content.

### Buttons and links

- Geometry is square or uses a 2px radius maximum.
- Primary dark-scene CTA: signal background with night text.
- Secondary CTA: one-pixel current-color border.
- Focus: 2px accent outline with 4px offset.

### Cards

- One-pixel border is the primary separation mechanism.
- No soft generic shadows; a restrained deep shadow is allowed only on the hero
  interactive module.
- Hover may shift the card upward by no more than 6px.

### Forms

- Transparent inputs with visible bottom borders in dark modules.
- Labels always remain visible; placeholders do not replace labels.
- Focus, disabled and status states are required.

### Project evidence

- Screenshots keep their original aspect and identity.
- Every concept is labelled as a concept or prototype.
- No invented client, metric, testimonial or result.

## 8. Responsive rules

| Range | Composition |
| --- | --- |
| 320–430px | Single column, stacked scenes, compact technical diagrams |
| 431–767px | Single column with wider media and form fields |
| 768–1023px | Two-column systems where reading order remains clear |
| 1024–1599px | Full 12-column composition |
| 1600px+ | Wider container; type is capped rather than scaled endlessly |

No component may create horizontal page overflow. Horizontal movement is allowed
only inside labelled galleries, tab rows and project indexes.

## 9. Accessibility and performance

- WCAG 2.2 AA contrast for all meaningful text and controls.
- Semantic headings and landmarks.
- Visible focus for every interactive element.
- Native controls before custom ARIA.
- Responsive `next/image` assets with reserved dimensions.
- WebGL is a small optional micro-layer with a CSS fallback.
- Canvas rendering pauses outside the viewport and when the document is hidden.
- No new animation dependency without a measurable need.

## 10. Definition of visual done

A change is ready only when:

- light and dark text pairs are explicit and pass contrast checks;
- typography follows the Inter/JetBrains Mono hierarchy;
- desktop, tablet and 320–430px layouts keep intentional composition;
- no legacy `premium-*`, poster or Prata layer remains;
- reduced motion works;
- build, lint, typecheck and production route QA pass;
- real-browser visual review is completed when a browser session is available.
