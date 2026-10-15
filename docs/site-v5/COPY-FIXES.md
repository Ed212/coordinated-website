# Copy fixes for site v5 (from the Oct 15 review of the page)

For the `codex/site-v5` thread. Apply to `templates/home.html` and the pages it generates; rerun the copy grep and the eight browser checks after. Keep the pitch sentence verbatim everywhere ("a shared record of your decisions, guardrails and plan, so people and agents work from what has been agreed, without you having to repeat every decision or chase every update").

## 1. Three labels, so simulator results, built capability and intended architecture never blur

Add a short mono label at the top of each section, one of exactly three:
- "Measured on the simulator fixture" on the attention comparison and any count (33 cards, 9 notes, seven weeks, nine people; minutes are estimates).
- "In the pilot today" on the six-week pilot section and the moments: formation by interview, one card per commitment per person, the Monday picture, the Thursday brief, settlement notes; delivery is by hand in the first pilots and the page says so (Decision 16).
- "What we are building" on the architecture section (the three agents, guardrails as code, the read contract for agents). Nothing in that section is described in the present tense as available.

## 2. Remove the absolutes that outrun measured behavior or approved rules

| Current text | Replace with |
|---|---|
| "Every message says why it was sent and what it cost you. Most weeks, nothing." | "Every message says why it was sent and what it cost you." Optional measured line under the comparison: "On the seven-week fixture, 55 of 72 person-weeks had no card at all; every week had one Monday post." |
| "No nudges, no 'just checking in', no reminder of any kind. A second ask about the same thing is refused unless the record changed." | "No nudges and no 'just checking in'. A second ask about the same thing goes out only when the record changed, or when a follow-up policy you approved says so." |
| any "never stores content" / "never holds content" / "holds pointers, never content" | "The record holds pointers to your documents, with the version and the person who decides each, and keeps the evidence you hand it under your retention policy." |

## 3. Acceptance is not truth

| Current text (verifier paragraph) | Replace with |
|---|---|
| "…it attaches, to every claim, the acceptance that made it true, the evidence that supports it with the period it covers, and the right that authorizes it." | "…it marks every claim as one of three things: accepted by a named person, supported by current evidence with the period it covers, or unknown. Nothing on the page or in a message is presented as true because someone accepted it." |

The same three words (accepted, supported, unknown) go on the Monday picture's quiet line wherever it is shown.

## 4. The examples must agree with one fixture

Rule: every moment on the page uses one example world, with dates inside its window, and carries one label: "From the simulator fixture (Lantern, Sep 28 to Nov 16)" or "Fictional example". No moment may contradict another moment's dates or due items.
- The owner-leave moment (Ivy on leave, Fri Nov 20 to Fri Nov 27) is outside the fixture window, which ends Mon Nov 16. Remove it, or rewrite it inside the window and label it fictional. Five moments are fine.
- The review moment ("Decisions due: none. Evidence due: none") must be checked against every other moment on the same page: if any owner's answer or evidence is due on the review date, the brief must list it. On the fixture, Thu Oct 22 has nothing due and no card to Marco (steps s10.1 to s10.3); if the page uses the Atlas example instead, re-derive the review line from that example's dates.

## 5. The ask

- Primary action: "Discuss a six-week pilot" linking to BOOKING_URL. Secondary: "See a sample record" (anchor to the moments). The launch-document request moves into the pilot section with the line "Once we agree the scope, send one document with a real date; the first card goes out from it." The form stays, below that line, and remains optional.
- Replace the unfinished address everywhere with the verified route: ed@coordinatedai.ai shown as text with a copy button, plus the booking link. No placeholder may remain in the built site; the existing placeholder grep covers it.

## 6. Outreach

The messages reuse only the pitch sentence and the three-state line; none of the removed absolutes appear in any draft.
