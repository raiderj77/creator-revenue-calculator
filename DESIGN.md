# DESIGN.md: Creator Revenue Calculator visual system

Written 2026-11-07 from the site's own code (assets/css/style.css :root and components), so future design work stays on brand instead of drifting. If this file and the CSS disagree, the CSS is the truth and this file gets fixed.

## Palette (from :root)

- Primary purple: #7C3AED. Primary dark: #6D28D9. These carry buttons, links, and brand moments.
- Secondary green: #10b981, used sparingly for positive or money-positive signals.
- Dark text: #1f2937. Light background: #f9fafb. Body gray: #6b7280. Border gray: #e5e7eb. Dark gray: #374151.
- Accent indigo: #4338ca (borders and answer capsules). Light violet for text on dark surfaces: #c4b5fd, and #ddd6fe for dark-mode link hovers. Text on dark is never the raw primary purple; it fails contrast there (2.6 to 1). Use the light violets above.
- Hero and CTA gradients run primary to primary-dark. Gradient text is banned (detector finding, fixed Nov 7, 2026): headings on dark use solid #c4b5fd.

## Type

- Headings: Poppins. Body: Inter. Mono accents: Courier New.
- Scale follows the existing sections: hero title largest, section titles next, then card titles. Flat hierarchy is the fleet's top recurring debt; every new section must have a clear size step between its heading, subhead, and body.

## Shape and spacing

- Spacing scale: 0.5, 1, 1.5, 2, 3, 4 rem (the --spacing tokens). Radii: 0.375 to 1 rem (the --radius tokens).
- Accent borders: full 1px borders with even rounding. Thick one-sided accent bars (the side-tab pattern) are banned; that was the top code-level finding in the Nov 7 audit and it was removed from the homepage answer capsules.

## Dark mode (both paths must be updated together)

- The site supports automatic dark mode (prefers-color-scheme) AND a manual toggle ([data-theme="dark"]). The two blocks in style.css mirror each other; any dark fix goes in both.
- Dark surfaces: page #0f172a, cards #1e293b, borders #334155. Dark body text #f1f5f9, muted #94a3b8 and #cbd5e1.
- Known good pairs: stat numbers #c4b5fd on #1e293b (7.9 to 1), section labels #ddd6fe on a translucent primary wash.

## Logo and brand mark

- The live mark is a purple calculator glyph (see the Nov 4, 2026 logo audit under workspace/branding). Do not replace it with initials or a letter mark.

## Rules for any design pass

1. Style and layout only. No copy, price, claim, form, checkout, or tracking changes ride along in a design change.
2. Visible text must test identical before and after.
3. Run the Impeccable detector on the changed pages before and after; a pass that raises the count fails.
4. The repo build (npm run build) must pass on the changed copy.
5. New colors must be checked against their real background with WCAG math, 4.5 to 1 for body text, 3 to 1 for large text, before they ship.
