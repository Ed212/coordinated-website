// The walkthrough is a local simulation. It never sends answers, persists data,
// or implies that a visitor can approve a real company commitment.
(() => {
  "use strict";
  const demo = document.querySelector("[data-demo]");
  const escapeHTML = (value) =>
    String(value).replace(
      /[&<>"']/g,
      (character) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[character],
    );
  if (demo) {
    const state = {
      step: 0,
      reached: 0,
      response: null,
      note: "",
      draftNote: "",
      decision: null,
    };
    const panel = demo.querySelector("[data-demo-panel]");
    const next = demo.querySelector("[data-demo-next]");
    const back = demo.querySelector("[data-demo-back]");
    const labels = [
      "The plan",
      "New information",
      "Sarah’s input",
      "Nadia’s decision",
      "The current plan",
      "The next review",
    ];
    const source = (title, text) =>
      `<details class="source-detail"><summary>${title}</summary><p>${text}</p></details>`;
    const changedDate = () =>
      state.decision === "adopt" ? "Tue Oct 20" : "Thu Oct 15";
    const hasProposal = () => state.response === "proposal";
    const responseText = () =>
      state.response === "pending"
        ? "No response recorded. Sarah has not accepted revised terms."
        : state.response === "talk"
          ? "Sarah asked to discuss the trade-off. No revised date is accepted."
          : "Sarah proposed Tue Oct 20, keeping ten calendar days of preparation.";
    const noteHTML = () =>
      state.note
        ? `<blockquote class="person-quote">“${escapeHTML(state.note)}”<cite>Sarah · Marketing</cite></blockquote>`
        : "";
    const views = [
      () =>
        `<p class="section-number">The agreed plan · v1</p><h3 tabindex="-1">Help enterprise customers adopt Atlas.</h3><p>Hypothesis: a guided rollout and clear launch materials will help customers activate. Shipping alone will not prove that hypothesis.</p><div class="plan-map"><div><span>Company outcome</span><strong>Customer adoption</strong></div><div><span>Initiative</span><strong>Atlas launch</strong></div><div><span>Your contribution · Sarah</span><strong>Explain Atlas clearly</strong></div></div><dl class="term-list"><div><dt>Announcement</dt><dd>Agreed Thu Oct 15 · Sarah</dd></div><div><dt>What Sarah relies on</dt><dd>Staging ready Thu Oct 1 · Maya<br>Ten calendar days to prepare launch materials</dd></div><div><dt>Protected customer term</dt><dd>Acme pilot Thu Oct 15 · Marco</dd></div><div><dt>Assumption to revisit</dt><dd>Legal approval by Mon Oct 12</dd></div></dl>${source("Read the example source", "Atlas launch plan, v1: Sarah owns the Thu Oct 15 announcement and requires ten calendar days after staging. Acme’s separate Thu Oct 15 customer pilot requires staging by Mon Oct 12 and legal approval. The public announcement may move independently of the customer pilot. Review customer activation after rollout; launch completion alone does not establish adoption.")}`,
      () =>
        `<p class="section-number">Mon Oct 5 · New information</p><h3 tabindex="-1">A forecast changes.<br>The agreement has not.</h3><div class="date-change"><span><small>Agreed staging</small>Thu Oct 1</span><b aria-hidden="true">→</b><span class="changed"><small>New forecast</small>Sat Oct 10</span></div><p>Maya reports a delay. Sarah’s announcement would have five days of preparation instead of the agreed ten.</p><div class="impact-list"><article><span class="status-chip">Asked</span><h4>Sarah · Marketing</h4><p>Her preparation window is affected. Reply by Tue Oct 6, 5:00 PM, before campaign spend locks.</p></article><article><span class="status-chip">Informed</span><h4>Marco · Sales</h4><p>The forecast remains before his Mon Oct 12 staging prerequisite. Acme’s separate Thu Oct 15 pilot has not moved.</p></article></div><p class="demo-note">This is a forecast. Your agreed announcement date has not changed. Nadia decides any amendment.</p>${source("Why these people?", "The example launch plan explicitly connects Sarah’s preparation window and Marco’s staging prerequisite to Maya’s delivery. Coordinated is using those recorded relationships, not inferring a connection from their job titles.")}`,
      () =>
        `<p class="section-number">Sarah’s card · Reply by Tue Oct 6, 5:00 PM</p><h3 tabindex="-1">Your input stays<br>with the decision.</h3><p>What you rely on: staging ready · Maya · agreed Thu Oct 1 · forecast Sat Oct 10.</p><p>Choose an example response. Only Nadia can change the agreed date.</p><div class="response-options"><button class="response-choice" type="button" data-demo-response="proposal" aria-pressed="${state.response === "proposal"}"><strong>Propose Tue Oct 20</strong><span>Keep the full ten days to prepare.</span></button><button class="response-choice" type="button" data-demo-response="talk" aria-pressed="${state.response === "talk"}"><strong>Need to talk</strong><span>Explain a constraint before agreeing.</span></button><button class="response-choice" type="button" data-demo-response="pending" aria-pressed="${state.response === "pending"}"><strong>Show no response yet</strong><span>See how an unanswered request stays open.</span></button></div><div data-response-editor ${!state.response || state.response === "pending" ? "hidden" : ""}><label for="demo-concern">The concern to carry forward</label><textarea id="demo-concern" rows="3" maxlength="600">${escapeHTML(state.draftNote)}</textarea><p class="form-help">Edit the fictional response to see it carried into the decision. Do not enter confidential information.</p></div><p class="inline-error" role="alert" data-response-error></p>`,
      () =>
        `<p class="section-number">Nadia’s decision desk · Example</p><h3 tabindex="-1">The concern is visible.<br>The choice has an owner.</h3><p>${responseText()}</p>${noteHTML()}<div class="decision-option"><span class="section-number">${hasProposal() ? "Proposed trade-off" : "Still unresolved"}</span><h4>${hasProposal() ? "Move the announcement to Tue Oct 20." : "Keep the decision open."}</h4><p>${hasProposal() ? "This preserves Sarah’s preparation window and moves the public campaign five days later. Acme’s separate Thu Oct 15 pilot remains unchanged; legal approval is still outstanding." : "The preparation conflict remains. The current announcement date is still Thu Oct 15. Nadia needs to resolve the constraint with Sarah before the campaign spend lock."}</p></div><p class="demo-note">You are exploring Nadia’s next step in a fictional example. Sarah’s response alone does not amend the agreement.</p><div class="decision-actions">${hasProposal() ? '<button type="button" class="button button-dark" data-demo-decision="adopt">Record Nadia’s example decision →</button>' : ""}<button type="button" class="button button-outline" data-demo-decision="open">Leave the decision open →</button></div>`,
      () =>
        `<p class="section-number">Current agreement · ${state.decision === "adopt" ? "v2" : "v1"}</p><h3 tabindex="-1">${state.decision === "adopt" ? "The plan changes.<br>The reasoning stays." : "The plan stays current.<br>The decision stays open."}</h3><dl class="term-list"><div><dt>Announcement</dt><dd>${state.decision === "adopt" ? '<s>Thu Oct 15</s> <strong class="changed">Tue Oct 20</strong>' : "<strong>Thu Oct 15 · unchanged</strong>"}</dd></div><div><dt>Staging forecast</dt><dd>Sat Oct 10 · reported by Maya<br>Forecast remains distinct from delivery evidence</dd></div><div><dt>Acme customer pilot</dt><dd>Thu Oct 15 · unchanged<br>Legal approval still required</dd></div><div><dt>Decision</dt><dd>${state.decision === "adopt" ? "Nadia · recorded Tue Oct 6, 9:05 AM" : "Pending · Nadia · before Tue Oct 6, 5:00 PM"}</dd></div></dl><div class="input-disposition"><span class="status-chip">${state.decision === "adopt" ? "Input adopted" : state.response === "pending" ? "Response pending" : "Input unresolved"}</span><p>${state.decision === "adopt" ? "Sarah proposed Tue Oct 20 to preserve preparation time. Nadia adopted that date; the later public campaign does not change Acme’s separate customer pilot." : responseText()}</p>${noteHTML()}</div><p class="demo-note">${state.decision === "adopt" ? "Sarah sees her condition and Nadia’s reasoning on the updated card. Marco sees that his customer terms remain unchanged." : "An open request remains visible. Nobody is shown as having accepted a new date."}</p>`,
      () =>
        `<p class="section-number">Next review · Thu Oct 8, 9:00 AM</p><h3 tabindex="-1">Start with the current plan.<br>Name what still needs attention.</h3><div class="review-summary"><div><span>Company outcome</span><strong>Help enterprise customers adopt Atlas</strong></div><div><span>Announcement</span><strong>${changedDate()} · ${state.decision === "adopt" ? "Nadia’s decision recorded" : "amendment pending"}</strong></div><div><span>Sarah’s input</span><strong>${state.decision === "adopt" ? "Adopted · full preparation window preserved" : state.response === "pending" ? "Still awaiting a response" : "Recorded · not yet resolved"}</strong></div></div><div class="open-question"><p class="section-number">${state.decision === "adopt" ? "1 open question" : "2 open questions"}</p>${state.decision !== "adopt" ? "<p><strong>Announcement trade-off unresolved.</strong> The Tue Oct 6 spend lock has passed. Nadia needs to confirm the consequence with Sarah; the example cannot assume spend was held.</p>" : ""}<p><strong>Legal approval is not on record.</strong> Nadia must confirm it by Mon Oct 12 before the customer pilot. Missing evidence is not treated as approval.</p></div><p>After rollout, review customer activation against the original hypothesis. Shipping Atlas will not prove the hypothesis.</p><a class="text-link text-link-dark" href="pilot.html">Explore this with your next initiative ↗</a>`,
    ];
    function render(focus = false) {
      panel.innerHTML = views[state.step]();
      demo.querySelector("[data-demo-count]").textContent =
        `0${state.step + 1} / 06`;
      demo.querySelector("[data-demo-announcer]").textContent =
        `Step ${state.step + 1} of 6: ${labels[state.step]}`;
      demo.querySelectorAll("[data-demo-step]").forEach((button) => {
        const index = Number(button.dataset.demoStep);
        button.disabled = index > state.reached;
        if (index === state.step) button.setAttribute("aria-current", "step");
        else button.removeAttribute("aria-current");
      });
      back.disabled = state.step === 0;
      next.hidden = state.step === 3 || state.step === 5;
      next.disabled = state.step === 2 && !state.response;
      next.textContent =
        [
          "See the changed forecast →",
          "Open Sarah’s card →",
          "Carry the response to Nadia →",
          "",
          "Open the next-review brief →",
        ][state.step] || "Next →";
      if (state.step === 2 && state.response === "pending")
        next.textContent = "See the unanswered request →";
      if (focus) panel.querySelector("h3").focus();
    }
    function go(step) {
      state.step = step;
      state.reached = Math.max(state.reached, step);
      render(true);
    }
    demo.querySelector("[data-demo-controls]").hidden = false;
    demo.querySelector("[data-demo-reset]").hidden = false;
    next.addEventListener("click", () => {
      if (state.step === 2) {
        if (!state.response) return;
        if (state.response !== "pending") {
          const field = demo.querySelector("#demo-concern");
          if (!field.value.trim()) {
            demo.querySelector("[data-response-error]").textContent =
              "Add the concern you want Nadia to see.";
            field.setAttribute("aria-invalid", "true");
            field.focus();
            return;
          }
          state.note = field.value.trim();
          state.draftNote = state.note;
        }
      }
      go(Math.min(5, state.step + 1));
    });
    back.addEventListener("click", () => go(Math.max(0, state.step - 1)));
    demo.addEventListener("input", (event) => {
      if (event.target.id !== "demo-concern") return;
      state.draftNote = event.target.value;
      // An edited response makes later example decisions stale. Require a fresh decision.
      state.note = "";
      state.decision = null;
      state.reached = 2;
      demo.querySelectorAll("[data-demo-step]").forEach((button) => {
        button.disabled = Number(button.dataset.demoStep) > 2;
      });
      event.target.removeAttribute("aria-invalid");
      demo.querySelector("[data-response-error]").textContent = "";
    });
    demo.addEventListener("click", (event) => {
      const choice = event.target.closest("[data-demo-response]");
      if (choice) {
        state.response = choice.dataset.demoResponse;
        state.note = "";
        state.decision = null;
        state.reached = 2;
        state.draftNote =
          state.response === "proposal"
            ? "I need the full ten days after staging to prepare the launch materials. I can commit to Tue Oct 20."
            : state.response === "talk"
              ? "I need to discuss the preparation window before I can commit to a revised announcement."
              : "";
        render();
        demo
          .querySelector(`[data-demo-response="${state.response}"]`)
          .focus({ preventScroll: true });
      }
      const decision = event.target.closest("[data-demo-decision]");
      if (decision) {
        state.decision = decision.dataset.demoDecision;
        if (state.decision === "adopt" && !hasProposal()) return;
        go(4);
      }
      const step = event.target.closest("[data-demo-step]");
      if (step && !step.disabled) go(Number(step.dataset.demoStep));
      if (event.target.closest("[data-demo-reset]")) {
        Object.assign(state, {
          step: 0,
          reached: 0,
          response: null,
          note: "",
          draftNote: "",
          decision: null,
        });
        render(true);
      }
    });
    render();
  }

  const form = document.querySelector("[data-pilot-form]");
  if (form) {
    form.querySelector("[type=submit]").disabled = false;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const values = new FormData(form);
      const initiative = String(values.get("initiative") || "").trim();
      const field = form.elements.initiative;
      if (!initiative) {
        field.setCustomValidity("Please describe the initiative briefly.");
        field.reportValidity();
        return;
      }
      const name = String(values.get("name") || "").trim();
      const company = String(values.get("company") || "").trim();
      const review = String(values.get("review") || "").trim();
      const message = [
        "Hi Ed,",
        "",
        "I’d like to discuss a Coordinated pilot.",
        company ? `Company: ${company}` : "",
        "",
        initiative,
        review ? `\nNext review or deadline: ${review}` : "",
        "",
        "Could we discuss the scope, timing, participant effort, and pricing?",
        "",
        name || "",
      ]
        .filter((line, index, array) => line !== "" || array[index - 1] !== "")
        .join("\n");
      document.querySelector("#email-draft").value = message;
      document.querySelector("[data-email-open]").href =
        `mailto:ed@coordinatedai.ai?subject=${encodeURIComponent("Coordinated launch pilot")}&body=${encodeURIComponent(message)}`;
      document.querySelector("[data-email-preview]").hidden = false;
      document.querySelector("[data-email-status]").textContent = "";
      document.querySelector("#email-preview-title").focus();
    });
    form.elements.initiative.addEventListener("input", () =>
      form.elements.initiative.setCustomValidity(""),
    );
    form.addEventListener("input", () => {
      // A visible email draft must never silently lag behind edited form values.
      document.querySelector("[data-email-preview]").hidden = true;
    });
    document
      .querySelector("[data-email-copy]")
      .addEventListener("click", async () => {
        const draft = document.querySelector("#email-draft");
        const status = document.querySelector("[data-email-status]");
        try {
          await navigator.clipboard.writeText(draft.value);
          status.textContent =
            "Draft copied. Paste it into an email to ed@coordinatedai.ai.";
        } catch {
          draft.focus();
          draft.select();
          status.textContent =
            "Select and copy the draft above, then email it to ed@coordinatedai.ai.";
        }
      });
  }
})();
