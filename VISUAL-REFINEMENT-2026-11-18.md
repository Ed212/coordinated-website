# Visual refinement review

Baseline: live `https://coordinatedai.ai/` matches the exact `COORDINATED_RELEASE=local` build of main `962edeeaac8daf36da982b1b68f50f825b5e19ab`. Live HTML, release CSS and all four behavior scripts were compared byte-for-byte before editing. Fresh GitHub readback shows PR #4 is already merged; its original checkout remains clean and untouched at `34dd49e`. This work uses `codex/visual-refinement-20261118` in a separate worktree.

The presentation layer introduces a self-hosted Bricolage Grotesque 600 display face and deliberate three-clause headline lines. Inter stays the body face. Meaningful labels use readable sans typography; mono remains for limited metadata. Repeated chapter, walkthrough and journey numbering is visually suppressed while semantic order, stage names, links and one functional location/progress control remain.

Northstar uses one story surface, text-link navigation, phase dividers and spacing instead of nested rectangular frames. Other sections use open hierarchy rather than repeating the same enclosure. Existing copy, fictional/prelaunch qualifications, all link destinations, contact behavior, imagery, film files and playback/scroll controllers remain unchanged. Presentation copy parity and browser state checks are part of the review receipts.

Implementation is append-only CSS plus presentation markup around the existing headline, font delivery, an exact branch-specific preview gate and whitespace-normalized headline assertions. Existing production and media gates remain intact. No source templates or commercial-story copy are changed.

The display font is delivered locally; no visitor font request goes to a font vendor. Original font and license sources: Google Fonts Bricolage Grotesque, SIL Open Font License 1.1, copyright Mathieu Triay/project authors. The unchanged license is included at `assets/fonts/bricolage-OFL.txt`; the original static 600 font is at `assets/fonts/bricolage-grotesque-latin.ttf`.

Local validation passed: 101 Node tests, five injected contact cases without mail delivery, copy/reference checks, release build and browser checks, 320–1920px responsive/focus sweep, and real video pause/skip/replay plus reduced-motion/no-JavaScript/failure states. Mobile Lighthouse scored 91/92 performance and 100/100 accessibility for `/` and `/b.html`, with CLS 0 on both. These scores are a local lab result, not field performance or physical-device certification.

This branch is a draft review preview only. Do not merge, promote production, change DNS, modify unrelated product work or transmit it for external review without new instructions. Physical Safari/iOS remains a separate verification limit. See `design-qa.md` and `preview-review/visual-refinement/` for source match, before/after evidence and test results.
