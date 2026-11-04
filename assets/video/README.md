# Hero motion assets and local preview

The exact galaxy artwork now has a real supplied living-photo clip, separate from the replaceable cinematic launch. `hero-film-assets.js` is the single source of delivery filenames, hashes, dimensions, durations and provisional status. The build verifies byte counts and SHA-256 before copying media; no placeholder URLs are used.

## Living galaxy (verified)

`galaxy-living-photo.mp4`: H.264 video only, 1920×1080, 10.041667 seconds, 3,031,532 bytes. Library `libfile_1f90c4fd02cc8191bab8cb594cd51a2c`, version 0; original identity retained in the private local QA incoming directory. SHA-256 `588c3572cc957743052af91149f6bfd44020bcd51cab002d4b18559cf658af2c`.

Actual frames and playback preserve the two spiral arms, dark left space and red shared core, with very restrained shimmer/depth. Strong parallax is not established. The first/last frames are close but not identical. One video element repeats over the original still, with a 220ms still-image dissolve at the end/start seam; it rewinds the same loaded source, without a second video download for each cycle. This softens the seam and does not assert a perfect seamless loop.

## Cinematic launch (corrected source)

`rocket-galaxies-v5-transition-fixed.mp4`: supplied H.264, 1920×1080, 21.25 seconds, no audio track, 17,263,807 bytes. Library `libfile_10a9eb4205bc8191957ed2d0a6f28f3e`, version 0; original identity preserved locally. SHA-256 `8aa6f30239a3eb3935638f9451bba1ad48b87ba554737078bf431cb6cfc91efc`.

Actual boundary frames confirm the previous 2.04s liftoff-to-cloud teleport is removed: the rocket remains beside the tower across that point, then ascends and tilts through the added bridge. A smaller framing step remains between 6.950s and 6.975s, so the join is not called seamless. Player transitions do not repair intrinsic footage. The launch is replaceable independently from the verified galaxy source; its 600ms handoff crossfades the held launch frame into the actual living galaxy. Users never have to wait 21.25 seconds to use the hero or CTA, and can skip directly to galaxies or the still.

## Interaction and scope

Hero copy and CTA are visible immediately, beside media on desktop and before it on mobile. A reserved 9:5 box uses contain-fit for both 1080p clips, preserving the full frames. Motion is opt-in. Users can play the launch, skip directly to the living galaxy, pause/resume, or choose the exact still. Reduced motion immediately shows the still and prevents motion; returning to normal preferences does not restart it. Hidden tabs pause. No new account, form submission or external message is part of these controls.

Exact still: `assets/galaxy/landscape-upscaled-2880x1600.webp`, 2880×1600, SHA-256 `80772c332bd4fb72a6dea3b5a946f707b023515e3f4b12bf0a85ac07210b6055`; unchanged from the verified existing website asset. No CSS parallax or particle substitute is presented as generated video.

Build locally with `HERO_FILM_PREVIEW=local npm run build`, run `PORT=4188 npm run preview`, then open http://127.0.0.1:4188/hero-film.html. Ordinary/default/production builds omit the experiment and media. Separate draft preview publication is authorized on codex/hero-film-preview and the existing Netlify site. Production deployment and merge are excluded. Verify the exact deployed commit, both asset hashes and anonymous preview behavior after publication.
