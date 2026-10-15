# The five-second test: protocol for the v4 hero

**Date:** Wednesday, October 14, 2026 · **Rule:** PLAN Decision 22(c), from POSITIONING-2026-10-10 §4 · **Runs before the page goes live.**

**What is tested.** The hero only (label, headline, mechanism paragraph, agent line, proof line, the two buttons), shown for five seconds. The question: does a stranger in the segment see the difference from a tracker or an assistant without being told? Variants A ("Give your team its focus back.") and B ("Stop repeating decisions and chasing updates.") differ only in the headline.

## 1. Who, and the recruiting note

Five founders (or the CEO or COO) of product-led B2B software companies of roughly 50 to 300 people that run on Slack, recruited as prospective customers, not as advisors. Nobody from a company that builds policy or rule engines, assistant platforms, work-graph tools, agent frameworks or personal AI assistants, and nobody from a competitor (RULES.md; PLAN §4). Each founder sees one variant, once.

The note Ed can send, one paragraph:

> Hi [name], I am building Coordinated, an AI program manager in Slack for companies your size, and before the site goes live I am testing whether the first screen says what it is. It takes ten minutes on a call: I show you one screen for five seconds, then ask four short questions about what you saw. Nothing to prepare and no pitch; I want your first reading, including the words that confused you. Would [day, time] or [day, time] work? Thank you either way.

## 2. Setup

1. Screen share on a call, or one laptop in person. Desktop width (about 1100 px), light theme. Use `screenshots/v4a-hero.png` or `v4b-hero.png` (the hero cropped above the form), or the live page scrolled to the top with the form below the fold.
2. Say only: "I will show you a screen for five seconds, then ask what you saw. First reading, no right answer."
3. Show the hero, count five seconds on a timer, hide it (stop sharing or switch to a blank tab). Do not show it again until the questions are done.
4. Ask the four questions in order and write the founder's words verbatim. Do not prompt, rephrase or supply a word; to "do you mean X?" answer "whatever you took from it."
5. Then two unscored follow-ups from the positioning memo: "which word confused you?" and "would you click, and on what?" After that you may show the whole page and listen.

## 3. The questions, in order

1. **What is this?**  2. **Who is it for?**  3. **What would you expect it to do on Monday?**  4. **What is it not?**

## 4. The scoring sheet

One row per founder. "Words used unprompted" is the founder's own vocabulary across the four answers, before any follow-up; the two yes/no columns are scored from those words only.

| Founder | Headline seen | Words used unprompted (verbatim) | Said "agreements", "who agreed" or "version" | Said "another assistant" or "another tracker" (or named a tool of either kind) | One quote |
|---|---|---|---|---|---|
| 1 | A | | yes / no | yes / no | |
| 2 | B | | yes / no | yes / no | |
| 3 | A | | yes / no | yes / no | |
| 4 | B | | yes / no | yes / no | |
| 5 | A | | yes / no | yes / no | |

Pass words: "agreed", "agreement", "what we agreed", "who signed off", "who said yes", "one version", "the current version". Fail words: "a Slack bot that summarises", "an assistant", "a chatbot", "a copilot", "a project tracker", "a task tool", "a status tool", any competitor's name. Also record "compliance" or "governance" if said, although neither word is in the hero.

## 5. The pass rule (Decision 22(c))

The hero passes when **four of five** founders use a pass word unprompted **and none** of the five uses a fail word. Both conditions: one "another assistant" fails the round even at five of five on the pass words. A pass publishes the page; the variant that produced more pass words is the one to publish, and with a 3/2 split that preference is a hint, not a result.

## 6. The A/B assignment

Alternate by recruiting order: the first founder to confirm sees A, the second B, then A, B, A (3 A, 2 B). Never choose the variant by founder; no founder sees both. Five founders cannot tell A from B statistically; the split is there so that neither headline goes live untested and so you hear which headline's words get repeated.

## 7. What to change on the page for each failure pattern

| What happened | What it means | Change, then re-run with five new founders |
|---|---|---|
| Fewer than four used a pass word, no fail word | The headline is read, the mechanism paragraph is not | Move "One version, with who agreed to each line, that only people can change" above the pitch sentence as a bold first line (the pitch sentence stays verbatim). If A was shown, try B, whose verbs point at agreement. |
| Anyone said "assistant", "bot", "copilot" | "AI" in the label and "agents" in the agent line read as a chat assistant | Move the agent line below the proof line or down to the architecture section; try the label "A program manager in Slack, backed by the record of what your company agreed". |
| Anyone said "tracker" or a tracker's name | "plan" and "updates" read as tasks | Show A rather than B (B contains "updates"); add "Nothing becomes a commitment until a person answers" under the mechanism. |
| Wrong buyer for "who is it for" (engineers, enterprises, everyone) | The segment is implicit | Add under the label: "For the founder or COO of a 50-to-300-person software company and the person who runs the weekly review." |
| "On Monday" drew a blank or "notifications" | "Monday" needs its object | Add under the agent line: "One Monday post says what is accepted, what is verified and what is unknown. A quiet week says so in one line." |
| "What is it not" drew a blank | The refusals are below the fold | Promote one refusal into the proof line: "It never contacts a customer, never writes to another system, and only people change the record." |
| Anyone said "compliance" or "governance" | An architecture word is inferred, most likely from "guardrails" | The pitch sentence is fixed by Decision 28: record it and raise it with Ed. If two founders say it, test a next line that explains guardrails ("the limits you set, in plain words"). |
| Pass words came only from the headline | The headline works; the rest is not read in five seconds | Nothing for the test; for the page, cut the mechanism's supporting sentence to seven words or fewer. |

Record each round with the date, who ran it and the variant files' hashes (`sha256sum coordinated-landing-v4a.html coordinated-landing-v4b.html`). Every edit to the hero after a failed round is a new round with five new founders.
