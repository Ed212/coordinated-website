# Site v5: focus-led messaging and launch-document conversion

DRAFT: original comparison sources are missing. PR publication is also waiting for confirmation that pushing this branch cannot trigger Vercel previews, as the brief prohibits deployment.

The homepage now explains Coordinated as an AI program manager in Slack, leads with team focus, and gives visitors a real document form. Both headline variants come from one template. The existing visual system, Slack card, six sample moments with provenance and decision rails, trust boundary and reading receipt are preserved.

Removed every placeholder from the public build, the three why cards, the unsourced statistics and the reserved-evidence graphic. Reordered the retained sections, added the six-week pilot and four measurement definitions, and rendered a new 1200x630 share image from og.html. Mail is handled by an in-repo Vercel function using SMTP; no third-party form service or tracking was added.

Validation: all eight Playwright cases passed (A/B, 400/1100px, light/dark), copy checks passed for built and rendered text, four contact-server tests passed, and mobile Lighthouse scored A 90 / B 99. Screenshots and raw logs are committed under docs/site-v5. CHANGES.md records section sources and all removed lines.

Before: [400px](screenshots/before-400.png), [1100px](screenshots/before-1100.png).
After A: [400px](screenshots/a-400-light.png), [1100px](screenshots/a-1100-light.png).
After B: [400px](screenshots/b-400-light.png), [1100px](screenshots/b-1100-light.png).

Release blockers and Ed's decisions:

- Original RULES.md, landing-v4.tpl.html, calc.js and FIVE-SECOND-TEST.md were absent. The attention comparison is not fabricated; its port, original SHA-256 and requested totals remain blocked. CI has an explicit failing release gate until the originals and port are present.
- TODO BOOKING_URL unset; booking action omitted.
- CONTACT_ADDRESS defaults to ed@coordinatedai.ai; confirm recipient.
- PILOT_PRICE unset; “Ask us for the number” shown.
- Vercel has no native static form handling configured here. The SMTP endpoint is ready for review but requires mail credentials and a verified sender before live delivery can be validated.
- Confirm automatic previews are disabled before publication, or explicitly authorize the preview. No deployment, DNS, hosting or environment settings were changed.
- Half/45%/87% statistics were removed rather than retained without exact source links.
