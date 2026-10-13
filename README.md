<div align="center">

# ContrastKit

**Good color should read well, too.**

A small, private color contrast checker for accessible interfaces.

[Open ContrastKit](https://ghostnever-lkm.github.io/contrastkit/) · [Latest release](https://github.com/GhosTnever-lkm/contrastkit/releases/latest) · [Report an issue](https://github.com/GhosTnever-lkm/contrastkit/issues)

</div>

---

## Check a color pair

Choose or enter a text color and background color. ContrastKit calculates the WCAG contrast ratio and checks AA and AAA for normal or large text. The live preview updates with your colors. You can also swap the pair and check each swatch in the sample palette against the background.

## Features

- WCAG 2.2 relative-luminance contrast ratio for opaque sRGB colors.
- AA and AAA outcomes for normal and large text.
- Live preview with foreground/background color controls.
- Editable palette with AA/AAA results that follow the selected text size.
- CSS custom property export for the checked pair and palette.
- Light and dark themes, responsive layout, no account and no build step.

## Use it

### Online

Open [ContrastKit](https://ghostnever-lkm.github.io/contrastkit/) and choose colors with the color pickers or enter a hex value such as `#263238` or `#abc`.

### Download

Download `ContrastKit-v1.0.2.zip` from the [latest release](https://github.com/GhosTnever-lkm/contrastkit/releases/latest), extract it, and serve the folder over HTTP. Because the app uses browser modules, opening `index.html` directly as a `file://` URL may be blocked by the browser. With Python installed, run `python -m http.server 8000` in the extracted folder and open `http://localhost:8000`.

### Host your own copy

Fork or download this repository and publish the root folder with GitHub Pages or another static host. No dependencies or server are required.

## WCAG thresholds

| Text | AA | AAA |
|:--|--:|--:|
| Normal text | 4.5:1 | 7:1 |
| Large text | 3:1 | 4.5:1 |

For this tool, large text means at least 24 CSS pixels, or 18.66 CSS pixels when bold. The WCAG formula compares the relative luminance of two opaque sRGB colors.

## Privacy

ContrastKit does not upload color values, use external fonts, or contact an application backend. Theme preference is stored locally in the browser. CSS export and clipboard copy remain on your device.

## Limits

- Hex colors only: three or six hexadecimal digits, with an optional `#`.
- Alpha transparency, gradients, images, and blend modes are not evaluated.
- Contrast is one accessibility check; it does not assess focus, color meaning, typography, or the rest of a complete interface.
- Results are a practical design aid, not formal certification of a page.
- When a color is invalid, its previous contrast result is cleared.

## Project details

- Version: **1.0.2**
- License: [MIT](LICENSE)
- Author: [GhosTnever-lkm](https://github.com/GhosTnever-lkm)

## Development checks

Node.js 20 or newer is required to run the tests:

```sh
npm test
npm run check
```

Create a release archive and SHA-256 checksum by pushing a `v*` tag. GitHub Actions attaches both files to the matching release.

## Support / Pro Version

ContrastKit is free and open source. If you find it useful, support future work on [Buy Me a Coffee](https://buymeacoffee.com/azizazimov8) or [Boosty](https://boosty.to/azizazimov). There is no paid Pro edition for this project at this time.

---

<div align="center"><sub>Color choices, checked with care.</sub></div>
