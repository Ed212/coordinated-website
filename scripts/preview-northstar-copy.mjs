import { createHash } from 'node:crypto';

// Copy-only amendments for the current draft root and its detailed example.
// The published /galaxy-study story is the source of truth. Do not apply these
// to source templates, production output, or the solar/comparison studies.
const replacements = {
  "home": [
    [
      "A fictional example awaiting owner acceptance",
      "A fictional launch and learning example"
    ],
    [
      "<span>Draft</span>",
      "<span>Illustrative next decision</span>"
    ],
    [
      "datetime=\"2026-11-09T09:14\">Mon Nov 9, 9:14 AM",
      "datetime=\"2026-11-24T09:14\">Tue Nov 24, 9:14 AM"
    ],
    [
      "Who will deliver what, by when?",
      "The launch is out. What comes next?"
    ],
    [
      "Growth bet: guided activation helps new teams reach their first shared report. Turn the goal into work people can accept.",
      "Northstar spent $1,200 of its $3,000 budget. Three of five prospects misunderstood the offer. Dana chooses a message test before more spend."
    ],
    [
      "<dt>Proposed</dt><dd>Maya: first-run flow by Fri Nov 13",
      "<dt>Accepted</dt><dd>Leo: revised message and demo by Fri Nov 27"
    ],
    [
      "<dt>Missing</dt><dd>Leo’s acceptance and a launch-gate owner",
      "<dt>Held steady</dt><dd>$49 per team/month; no extra budget"
    ],
    [
      "<dt>Check-in</dt><dd>Ask the owners with open answers",
      "<dt>Next check</dt><dd>Tue Dec 1: understanding and first use"
    ],
    [
      "Illustrative draft: an owner must accept the exact commitment and date.",
      "Fictional observations, not customer results. The next test’s outcome is open."
    ],
    [
      "Northstar wants to test whether guided activation makes that first step clearer. The hypothesis needs dated commitments, launch gates and a review of what people actually experience.",
      "Dana names Product, GTM, Support, Security, Pricing and Finance. Version 1 plans guided activation and export together for Mon Nov 23, with first-report positioning, a $49 per team/month offer and a $3,000 campaign budget."
    ],
    [
      "Form the commitments",
      "Choose the launch scope"
    ],
    [
      "A goal becomes work people accept.",
      "Security needs another week. Choose the scope."
    ],
    [
      "Name the outcome and assumptions.</strong> Product and GTM agree the audience, the growth bet and what evidence would challenge it.",
      "Keep the choice explicit.</strong> With export’s Security review delayed, Dana can move the whole launch to Mon Nov 30 or launch core on Mon Nov 23 after its own gates pass."
    ],
    [
      "Propose the work and dates.</strong> Maya owns the first-run flow by Fri Nov 13. Leo owns the message and demo by Thu Nov 12. Priya owns support guidance by Fri Nov 13.",
      "Choose the smaller launch.</strong> Product and GTM choose guided activation without export. Pricing and Finance keep the offer and budget unchanged. Export remains blocked pending Security approval."
    ],
    [
      "Get exact acceptance.</strong> Each owner confirms the deliverable and date. Missing gate owners and dependencies stay open until the responsible people answer.",
      "Propose version 2.</strong> The core-only revision needs each affected owner’s acceptance of the exact deliverable and date. Dana’s decision alone does not assign their work."
    ],
    [
      "Check the answers that matter.</strong> Targeted owner check-ins cover open commitments, readiness evidence and dependencies. Silence is not acceptance.",
      "Confirm each commitment.</strong> Maya accepts core readiness by Thu Nov 19; Leo accepts the page and demo without export claims by Fri Nov 20; Priya accepts matching support guidance by Fri Nov 20."
    ],
    [
      "Launch through the required gates.</strong> Product approves scope. Pricing approves commercial terms and claims. Specialists keep their gates; the release owner makes the go/no-go call.",
      "Launch through the required gates.</strong> The owners deliver, required core checks pass and Dana gives the go-ahead for Mon Nov 23. The page, demo and support guidance describe guided activation only."
    ],
    [
      "Review market evidence.</strong> On Tue Nov 24, named owners bring dated interview notes and updates to compare with the original assumptions. Missing coverage and competing explanations stay visible. People decide what to test next.",
      "Review market evidence.</strong> On Tue Nov 24, named owners review launch-day sales notes, first-use records and actual spend. Small samples and competing explanations stay visible. People choose the next test."
    ],
    [
      "Confirm the first-run flow by Fri Nov 13, the intended experience and the review question. Product owns scope and product judgment.",
      "Maya accepts core readiness by Thu Nov 19 and owns first-use evidence. Product approves scope; required core checks must pass before release."
    ],
    [
      "Accept the message and demo by Thu Nov 12. Final claims depend on Product’s approved behavior and the authorized Pricing owner’s approval of commercial terms.",
      "Leo accepts the page and demo without export claims by Fri Nov 20. Final claims depend on approved scope and commercial terms."
    ],
    [
      "<span class=\"dependency-tag\">Acceptance required</span>",
      "<span class=\"dependency-tag\">Acceptance is specific</span>"
    ],
    [
      "Confirm guidance by Fri Nov 13. Capture questions about the first shared report and distinguish observations from explanations.",
      "Priya accepts matching support guidance by Fri Nov 20, based on the same approved scope and claims. Capture first-report questions without treating observations as explanations."
    ],
    [
      "If export clearance is delayed, export stays held. Coordinate affected claims, scope and dates with their owners; the security gate is not waived.",
      "Export’s review is delayed, so export stays held. Security clears the core release separately. Changed claims, scope and dates still need approval and owner acceptance."
    ],
    [
      "<span>Original bet</span><p>Guided activation helps new teams reach their first shared report.",
      "<span>Launch · Mon Nov 23</span><p>Version 2 records the approved core-only launch and each owner’s accepted changes. Export stays out."
    ],
    [
      "<span>Evidence to examine</span><p>Leo supplies notes updated Mon Nov 23 for Tue Nov 17 to Mon Nov 23. The first step still seems unclear; coverage is incomplete.",
      "<span>Read the evidence · Tue Nov 24</span><p>Launch-day sales notes: three of five prospects misunderstood the offer. First-use records: two of six teams shared a report. Finance records $1,200 spent. The samples are small."
    ],
    [
      "<span>Human judgment</span><p>Product and GTM choose to test a clearer prompt while keeping the positioning steady.",
      "<span>Choose the next move</span><p>Dana and GTM choose a clearer first-report message. Price and budget stay unchanged. Leo accepts revised copy and a demo by Fri Nov 27; Product and GTM review claims before publication."
    ],
    [
      "<span>Next work to confirm</span><p>Product and GTM approve the prompt direction. Maya, Leo and Priya must accept the changed work and dates; Finance’s budget decision is still open.",
      "<span>Check again · Tue Dec 1</span><p>Version 3 records the message test and Leo’s accepted task. Leo and Maya accept the review of understanding, first use and actual spend, keeping before/after observations separate. The outcome is open."
    ],
    [
      "Fictional Northstar check-in",
      "Fictional Northstar next step"
    ],
    [
      "A targeted question for Leo",
      "An accepted task for Leo"
    ],
    [
      "Can you accept this work and date?",
      "An accepted test needs an evidence check."
    ],
    [
      "Version 2 proposes your updated walkthrough for Fri Nov 27. Finance’s test-budget decision is still open.",
      "Version 3 records Leo’s accepted revised message and demo for Fri Nov 27. Product and GTM review claims before publication."
    ],
    [
      "<dt>Current</dt><dd>Version 1 message and demo still apply",
      "<dt>Current</dt><dd>Version 3: clearer first-report message"
    ],
    [
      "<dt>Proposed</dt><dd>Updated walkthrough for the prompt test",
      "<dt>Held steady</dt><dd>$49 per team/month; $3,000 budget"
    ],
    [
      "<dt>Need an answer</dt><dd>Leo’s exact acceptance and Finance’s decision",
      "<dt>Accepted review</dt><dd>Leo and Maya: Tue Dec 1 evidence check"
    ],
    [
      "A missing answer remains open. Neither this question nor the draft plan authorizes action.",
      "The test’s outcome remains open. An accepted task does not itself authorize publication or prove growth."
    ],
    [
      "Fictional Northstar · Both consult approved version 1",
      "Fictional Northstar · Both consult current version 3"
    ],
    [
      "Scope source: Product approval, Tue Nov 17. Guided activation is approved; export remains held for Security.",
      "Scope source: version 2’s approved core-only launch. Version 3 records the Tue Nov 24 message decision; export remains held for Security."
    ],
    [
      "Use version 1’s approved activation message and demo. Bring dated customer observations to the Tue Nov 24 review. The proposed prompt test does not yet change this work.",
      "Use version 3’s clearer first-report message for the accepted Fri Nov 27 copy and demo. Product and GTM review claims; Leo and Maya accept the Tue Dec 1 evidence review."
    ],
    [
      "A permitted agent drafting launch copy would consult the same version 1 source: describe guided activation and keep export out of approved claims. It would flag missing answers.",
      "A permitted agent drafting copy would consult the same version 3 source: describe guided activation and keep export out of approved claims. It would flag missing answers, not infer a successful test."
    ],
    [
      "Fictional amendment · Northstar",
      "Fictional Northstar · One shared plan, three versions"
    ],
    [
      "<dt>Approved now</dt><dd>Version 1 contains the approved activation plan, positioning, pricing, budget and launch gates.",
      "<dt>Original plan</dt><dd>Version 1 planned guided activation and export together. Planning did not clear either release gate or accept anyone’s work."
    ],
    [
      "<dt>Proposed next</dt><dd>Version 2 proposes the detailed prompt test. It does not yet change the approved plan or anyone’s accepted work.",
      "<dt>Approved launch</dt><dd>Version 2 records the approved core-only launch and Maya’s, Leo’s and Priya’s separately accepted changes. Export remains held."
    ],
    [
      "<dt>Human decision</dt><dd>Product and GTM have approved the prompt direction. Finance’s decision on the proposed budget is still open; Pricing retains authority over commercial changes.",
      "<dt>Next decision</dt><dd>Version 3 records Dana and GTM’s message test, Leo’s accepted task and the Tue Dec 1 review accepted by Leo and Maya. Pricing and Finance keep the offer and budget unchanged."
    ],
    [
      "<dt>Still open</dt><dd>Maya, Leo and Priya must accept their affected work and dates. A decision approval is not their delivery acceptance.",
      "<dt>Separate acceptance</dt><dd>Each owner accepts the exact work and date. A decision approval is not delivery acceptance. New changes still need the affected owners’ answers."
    ],
    [
      "When the amendment takes effect, the earlier prompt decision is labeled superseded for that scope. Unchanged pricing, budget and gates still apply. Work awaiting acceptance stays open.",
      "When an amendment takes effect, earlier decisions are marked superseded only for that scope. Unchanged pricing, budget and gates still apply. Any work awaiting acceptance stays open."
    ],
    [
      "Leo’s earlier notes keep their source and observation window. Stale notes or missing new responses are not proof that the new prompt worked.",
      "Launch-day notes keep their source and observation window. Before/after observations remain separate. Stale notes or missing responses are not proof that the message test worked."
    ]
  ],
  "useCases": [
    [
      "The proposed program manager helps make the assumptions, evidence questions and review date explicit.",
      "The intended workflow helps make the assumptions, evidence questions and review date explicit."
    ],
    [
      "Follow a proposed activation launch from a growth bet to the next agreed move.",
      "Follow a fictional guided-activation launch from the original plan to the next agreed move."
    ],
    [
      "Northstar plans a guided activation flow for team workspaces, with clearer messaging and a customer walkthrough. The team hopes more new teams will reach a useful first report.",
      "Dana wants Northstar’s new teams to reach their first shared report. She names Product, GTM, Support, Security, Pricing and Finance to shape the launch plan."
    ],
    [
      "Product scope, positioning, pricing, budget and launch gates set the agreed boundaries. The first-run flow, customer invitations and support guidance need owners, dates and explicit dependencies.",
      "The plan covers guided activation on Mon Nov 23, first-report positioning, a $49 per team/month offer and a $3,000 campaign budget. Owners, dependencies and launch gates must be clear."
    ],
    [
      "Bet: clearer first-run messaging and a guided walkthrough help new teams reach a first shared report.",
      "Version 1 plans guided activation and export together for Mon Nov 23. The bet: clearer first-report messaging helps new teams understand the offer and reach a useful report."
    ],
    [
      "Leo would gather selected customer observations for a review on Tue Nov 24. The team still needs to agree what evidence would support or challenge the bet.",
      "The Tue Nov 24 review will examine launch-day sales notes, first-use records and actual spend. Planning alone does not clear a gate or accept anyone’s work."
    ],
    [
      "02 · Form dated owner commitments",
      "02 · Choose the revised scope"
    ],
    [
      "Who will deliver what, and by when?",
      "Security needs another week. What can launch?"
    ],
    [
      "Turn the goal into concrete work with a named owner, a date and a clear completion check. Ask each owner to confirm the proposed commitment and its dependencies.",
      "Export’s Security review is delayed. Dana can move the whole launch to Mon Nov 30 or launch guided activation on Mon Nov 23 without export, once its own gates pass."
    ],
    [
      "Three proposed commitments need answers",
      "Version 2 proposes the smaller launch"
    ],
    [
      "Maya, Product: first-run flow and readiness evidence by Fri Nov 13. Leo, GTM: launch message and demo by Thu Nov 12.",
      "Product and GTM choose the core-only launch. Pricing and Finance keep the $49 per team/month offer and $3,000 budget unchanged. Export stays blocked pending Security approval."
    ],
    [
      "Priya, Support: a guide by Fri Nov 13, after approved scope and messaging. Leo’s exact acceptance and the launch-gate owner are still open.",
      "The revised work needs Maya’s, Leo’s and Priya’s separate acceptance. Dana’s decision alone does not assign their deliverables or dates."
    ],
    [
      "03 · Run targeted check-ins",
      "03 · Accept the revised commitments"
    ],
    [
      "Ask about the gap that affects the next step.",
      "Each owner accepts the exact work and date."
    ],
    [
      "Check with the responsible person when a missing answer, dependency or readiness check affects the plan. Keep the question specific and carry the response into the agreed work.",
      "Ask each affected owner about the revised deliverable, date and dependencies. Record their specific acceptance; missing answers remain open rather than becoming assumed commitments."
    ],
    [
      "Leo: can you accept this exact work and date?",
      "Maya, Leo and Priya accept their revised work"
    ],
    [
      "The message and demo are proposed for Thu Nov 12, against the approved activation scope. Priya’s guide depends on the approved message.",
      "Maya accepts core readiness by Thu Nov 19. Leo accepts the page and demo without export claims by Fri Nov 20. Priya accepts matching support guidance by Fri Nov 20."
    ],
    [
      "Can you accept that work and date? Who owns the launch-readiness gate? Both unanswered questions stay visible.",
      "Leo’s page and demo depend on approved scope and claims. Priya’s guidance depends on the same version. Each owner’s acceptance is separate from the scope decision."
    ],
    [
      "If export’s security review slips, people can assess a narrower scope while draft work continues. Export still waits for clearance, and changed claims wait for approval.",
      "A changed decision is not delivery acceptance. Required core checks still apply; export remains held pending Security approval. A further scope change needs fresh owner acceptance."
    ],
    [
      "Version 1: the approved launch plan",
      "Version 2: the approved core-only launch"
    ],
    [
      "The activation scope, positioning, pricing and budget are approved. Maya, Leo and Priya have accepted their exact work and dates. Dana owns the launch-readiness gate.",
      "Version 2 records the approved core-only launch and Maya’s, Leo’s and Priya’s accepted changes. The owners deliver and required core checks pass; the offer and budget stay unchanged."
    ],
    [
      "Dana checks that the required gates passed and approves the core launch for Tue Nov 17. Export remains outside the approved scope, held for Security clearance.",
      "Dana gives the go-ahead for Mon Nov 23. The page, demo and support guidance describe guided activation only. Export remains outside the release, held for Security clearance."
    ],
    [
      "Tue Nov 24: the evidence is incomplete",
      "Tue Nov 24: review the launch-day evidence"
    ],
    [
      "Leo’s notes, updated Mon Nov 23, cover Tue Nov 17 to Mon Nov 23. They suggest the next-step prompt may be confusing. Some customer responses and Product observations are missing; the guided walkthrough itself may explain the positive responses.",
      "Sales notes from five launch-day calls show three prospects mistook the offer for another dashboard. First-use records show two of six new teams shared a report. Finance records $1,200 spent."
    ],
    [
      "These notes do not establish growth. Question for the team: test a clearer prompt, change positioning, or gather more evidence first?",
      "These fictional observations are small and inconclusive, not customer results or evidence of growth. The team must decide what to test next; missing coverage and competing explanations stay visible."
    ],
    [
      "On Tue Nov 24, Product and GTM approve testing a clearer next-step prompt. Their decision weighs incomplete evidence alongside product judgment; it does not approve budget or accept delivery work.",
      "On Tue Nov 24, Dana and GTM choose a clearer first-report message. Pricing stays at $49 per team/month; Finance holds extra spend within the unchanged $3,000 budget. The decision does not itself accept delivery work."
    ],
    [
      "Prompt decision approved. Test plan still open.",
      "Version 3: an accepted test, an open outcome"
    ],
    [
      "Version 2 proposes Maya’s prompt test, Leo’s updated walkthrough and Priya’s support note for Fri Nov 27. Each exact work and date still needs acceptance. Finance’s test-budget decision is open.",
      "Leo accepts revised copy and a demo by Fri Nov 27, with Product and GTM reviewing claims before publication. Leo and Maya accept the Tue Dec 1 review of message understanding, first use and actual spend."
    ],
    [
      "Version 1 applies until the prompt amendment takes effect. Then only the earlier prompt decision is superseded; unchanged positioning, pricing, budget and gates still apply. Unaccepted work stays open.",
      "Version 3 records the message test, Leo’s accepted task and the review accepted by Leo and Maya. Earlier decisions are superseded only where changed; the price, budget and export gate stay intact. Before/after observations remain separate."
    ],
    [
      "Illustrative ending: a human decision and targeted questions for follow-through. The growth hypothesis remains open; approval and delivery acceptance remain separate.",
      "Illustrative ending: accepted work and a dated next check, not a successful test result. The next decision waits for evidence; approval, delivery acceptance and permission to publish remain separate."
    ]
  ]
};

const sourceHashes = {
  home: '019f769f9f7e4145e80955e5a6f50ede58c13cb6c45356b9e5c3aef3d3fffada',
  useCases: 'a8eaeb4cfb393590b25602e701653f41ddea67040487839922833ce007bda0ee'
};

export function alignNorthstarCopy(page, kind) {
  if (!Object.hasOwn(sourceHashes, kind)) throw Error(`Unknown Northstar page: ${kind}`);
  if (createHash('sha256').update(page).digest('hex') !== sourceHashes[kind]) {
    throw Error(`Northstar source changed; review required: ${kind}`);
  }
  for (const [before, after] of replacements[kind]) {
    if (page.split(before).length !== 2) throw Error(`Expected one Northstar copy target: ${before}`);
    page = page.replace(before, () => after);
  }
  return page;
}
