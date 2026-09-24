# Coordinated galaxy assets — revision 2

## Deliverables

| Asset | PNG | WebP |
|---|---|---|
| Uncropped native generator output | landscape-native-source-1681x936.png | — |
| Final framed native landscape, exact 9:5 | landscape-native-master-1485x825.png | landscape-native-master-1485x825.webp |
| Final landscape upscale, exact 9:5 | landscape-upscaled-2880x1600.png | landscape-upscaled-2880x1600.webp |
| Transparent starfield, exact 9:5 | starfield-2880x1600.png | starfield-2880x1600.webp |
| Final framed native phone master, exact 2:3 | portrait-native-master-888x1332.png | — |
| Final phone upscale, exact 2:3 | portrait-upscaled-1600x2400.png | portrait-upscaled-1600x2400.webp |
| Open Graph | og-1200x630.png | — |

All WebP exports use quality 94. Starfield WebP retains alpha at quality 100. The PNG files are lossless exports.

## Native resolution and framing

The built-in image generator was asked for the highest native resolution, targeting 2880×1600. The returned landscape was **1681×936**, not native 2880×1600. This interface does not expose a numeric native-resolution selector or a documented cap. Accordingly, 1681×936 is the observed native output of this run, not a claim about every model's maximum resolution.

The uncropped output is included for provenance. Its red point remained too far right and low. A pixel-preserving crop at x191, y74, width1485, height825 establishes an exact 9:5 native master with the intended framing. The separate 2880×1600 export is Lanczos-upscaled from that master. It is not represented as a native high-resolution generation.

The portrait generator returned 1024×1536. Its final framing is a crop at x32, y200, width888, height1332, followed by a smooth exposure reduction in the upper region. The 1600×2400 deliverable is upscaled from that native-sized master. Its composition follows the requested reframed portrait direction; it is not a literal crop of the landscape.

The starfield was generated with real alpha at 1681×936, normalized to a warm monochrome palette to remove colored edge artifacts, and resized to 2880×1600. The Open Graph was generated from the final landscape reference, then resized to exactly 1200×630. The galaxy structure is reference-preserved by generative editing; the new renders are not claimed to be pixel-identical to the earlier asset.

## Verified geometry and contrast

- Landscape PNG red centroid: **(1785.926, 719.983)**, or **62.011% / 44.999%**. The JSON rounds to one decimal place.
- Phone PNG red centroid: **(993.041, 1079.648)**, or **62.065% / 44.985%**.
- White (#fff) contrast over **every pixel in the top 40%** of the final phone PNG: minimum **6.356:1**.
- The same phone WebP check: minimum **5.804:1**.
- Contrast uses relative sRGB luminance and (1.0 + 0.05)/(background luminance + 0.05), at the exported image dimensions. It is a base-image check, not a certification of a complete web page.
- Keep the moving starfield masked out of the phone's top 40% headline area. Adding bright foreground stars there would invalidate the base-image contrast guarantee. A smooth mask may fade in below that protected region.
- Starfield has true RGBA alpha; **94.016%** of pixels are completely transparent. PNG and WebP alpha channels are identical.
- Star-count proxy: **254** connected alpha regions above 2/255 with at least four pixels each at export size. This includes faint stars and excludes tiny fragments; it is an approximate visible-region count, not an astronomical object catalog.
- No saturated red pixels were found in the starfield. The warmth is a small RGB bias, not colored star points.

## Tail geometry

`landscape-anchors.json` uses a 2880×1600 coordinate space. `portrait-anchors.json` uses 1600×2400. Origin is upper left; x increases right and y increases down. Paths have eight cubic Bézier segments each and end at the measured red point. Their joins have continuous tangents before one-decimal coordinate rounding.

These are visual centerline approximations of diffuse tidal streams, checked against the final image. They are appropriate for motion guides and labels, not scientific measurements of galaxy morphology. Label anchors are independently selected visible local knots in each rendered composition. They are not assertions that the generative portrait reproduces an individual astronomical star from the landscape.

The landscape anchors lie approximately 40% and 38% along their respective tail paths. The phone anchors lie approximately 40% and 35% along the paths. Exact sampled fractions are in `trace-metadata.json`. The upper phone knot is intentionally faint in the headline-safe exposure region.

`landscape-paths.svg` and `portrait-paths.svg` contain the same paths and anchor IDs without a raster background. Use a matching SVG viewBox over the image, and apply identical crop/fit transforms to the image and overlay. Avoid independently applying CSS object-fit: cover to one layer without transforming the other.

## Open Graph copy

When the plan changes, everyone who depends on it knows the same day.

The final PNG was visually checked for this exact sentence, punctuation, left-column placement, and absence of other text or logos. Typography is generated grotesk-style lettering rather than an embedded named font.

## Alt text and provenance

`alt-text.json` assigns one line beginning “Illustration:” to every delivered image file, including the SVG overlays. The alt text never calls these assets photographs or Hubble images.

Generated with the built-in image-generation tool. Prompt history is in `generation-prompts.json`. Deterministic crop, exposure, palette normalization, resizing and format exports were used to meet the geometric and compositing requirements. No native-resolution claim is made for an upscale. `verification.json` records final file dimensions, decoding, centroids, alpha and contrast checks.
