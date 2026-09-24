/* Illustrative experiences only. No analytics, requests, storage, or authority implied. */
(() => {
  "use strict";
  const map = document.querySelector("[data-company-plan]");
  if (map) {
    let selected = "atlas";
    let changed = false;
    const panel = map.querySelector("[data-initiative-panel]");
    const row = (team, title, detail, status, affected = false) =>
      `<div class="commitment-row${affected ? " is-affected" : ""}"><span class="function-label">${team}</span><div><strong>${title}</strong><small>${detail}</small></div><span>${status}</span></div>`;
    const initiatives = {
      atlas: () => ({
        title: "A launch is more than an engineering date.",
        label: "Atlas launch · commitments",
        rows:
          row(
            "Engineering",
            changed
              ? "Staging forecast moves to Sat Oct 10"
              : "Staging ready · Thu Oct 1",
            "Maya · The agreed date remains Thu Oct 1",
            changed ? "New forecast" : "Agreed",
            changed,
          ) +
          row(
            "Marketing",
            "Announcement · Thu Oct 15",
            changed
              ? "Sarah · Five preparation days remain; ten are required"
              : "Sarah · Needs ten calendar days after staging",
            changed ? "Ask Sarah" : "Agreed",
            changed,
          ) +
          row(
            "Sales",
            "Acme customer pilot · Thu Oct 15",
            "Marco · Staging required by Mon Oct 12; legal approval open",
            changed ? "Terms hold" : "Conditional",
          ) +
          row(
            "Finance",
            "Campaign spend lock · Tue Oct 6",
            "Nadia · Announcement decision needed before spend locks",
            changed ? "Decision due" : "Dependency",
            changed,
          ),
        assumption:
          "A guided rollout and clear launch materials will improve customer activation. Shipping alone will not prove this.",
        review: "Thu Oct 8 · Launch review",
        evidence: "Customer activation after rollout. No outcome evidence yet.",
        actions: `<div class="plan-action-bar"><button class="button ${changed ? "button-outline" : "button-dark"}" type="button" data-plan-change>${changed ? "Reset the example ↺" : "Introduce a staging delay →"}</button>${changed ? '<a class="text-link" href="#how" data-open-walkthrough>See how they decide →</a>' : ""}</div>`,
        alert: changed
          ? '<p class="plan-alert"><strong>Mon Oct 5 / New information.</strong> Ask Sarah about her preparation window. Inform Marco: his staging condition still holds. Nadia owns the trade-off.<br>This is a forecast. Your agreed announcement date has not changed.</p>'
          : "",
      }),
      onboarding: () => ({
        title: "The sale is the start of the customer outcome.",
        label: "Customer onboarding · commitments",
        rows:
          row(
            "Success",
            "Guided onboarding · Mon Oct 19",
            "Leila · New enterprise cohort; five participating accounts",
            "Agreed",
          ) +
          row(
            "Product",
            "Activation evidence · Fri Oct 16",
            "Jon · Define the first-value event before onboarding starts",
            "Required",
          ) +
          row(
            "Sales",
            "Customer handoff · Thu Oct 15",
            "Marco · Confirm the customer’s intended outcome and sponsor",
            "Agreed",
          ),
        assumption:
          "A guided first week will reduce time to first value. Account setup alone is not evidence of customer value.",
        review: "Thu Oct 29 · Customer review",
        evidence:
          "Time to first value and customer feedback. Baseline still needs confirming.",
        actions:
          '<p class="plan-alert"><strong>A useful gap.</strong> The activation baseline is not on record. Ask Jon to confirm it before comparing outcomes.</p>',
        alert: "",
      }),
      capacity: () => ({
        title: "A hiring plan is also a delivery dependency.",
        label: "Delivery capacity · commitments",
        rows:
          row(
            "People",
            "Implementation lead starts · Mon Nov 2",
            "Ava · Start date depends on an accepted offer",
            "Forecast",
          ) +
          row(
            "Finance",
            "Role funded · Q4",
            "Noor · One approved role within the existing budget",
            "Agreed",
          ) +
          row(
            "Engineering",
            "Onboarding support · Mon Nov 2",
            "Maya · Reserve capacity only once the start date is confirmed",
            "Conditional",
          ),
        assumption:
          "Dedicated implementation capacity will support the enterprise rollout without displacing product delivery.",
        review: "Thu Oct 22 · Capacity review",
        evidence:
          "Accepted offer and capacity allocation. Neither is inferred from an open requisition.",
        actions:
          '<p class="plan-alert"><strong>Keep the condition visible.</strong> A funded role is not an accepted offer. Delivery capacity remains conditional.</p>',
        alert: "",
      }),
    };
    function render(announce = false) {
      const data = initiatives[selected]();
      panel.innerHTML = `<div class="initiative-main"><span class="micro-label">${data.label}</span><h3>${data.title}</h3>${data.rows}${data.alert}${data.actions}</div><aside class="initiative-context"><span class="micro-label">The assumption behind the work</span><p>${data.assumption}</p><dl><dt>Next review</dt><dd>${data.review}</dd><dt>Evidence to revisit</dt><dd>${data.evidence}</dd></dl></aside>`;
      map
        .querySelectorAll("[data-initiative]")
        .forEach((button) =>
          button.setAttribute(
            "aria-pressed",
            String(button.dataset.initiative === selected),
          ),
        );
      if (announce)
        map.querySelector("[data-plan-status]").textContent =
          `${data.label}. ${selected === "atlas" && changed ? "New staging forecast. Marketing needs an answer. The agreement has not changed." : data.title}`;
    }
    map.addEventListener("click", (event) => {
      const button = event.target.closest("[data-initiative]");
      if (button) {
        selected = button.dataset.initiative;
        render(true);
      }
      if (event.target.closest("[data-plan-change]")) {
        changed = !changed;
        render(true);
        panel
          .querySelector("[data-plan-change]")
          .focus({ preventScroll: true });
      }
    });
    render();
  }

  // Keep the detailed simulation available on demand and directly addressable.
  function openWalkthrough() {
    const walkthrough = document.querySelector("#how");
    if (walkthrough && walkthrough.tagName === "DETAILS")
      walkthrough.open = true;
  }
  document.addEventListener("click", (event) => {
    const link = event.target.closest(
      'a[href="#how"], [data-open-walkthrough]',
    );
    if (link) openWalkthrough();
  });
  if (location.hash === "#how") openWalkthrough();
  window.addEventListener("hashchange", () => {
    if (location.hash === "#how") openWalkthrough();
  });

  const roles = document.querySelector("[data-role-experience]");
  if (roles) {
    const content = {
      operator: {
        label: "Chief of Staff · BizOps · Program leads",
        title: "Get out of the<br>update relay.",
        text: "Bring the next review a current agreement, the important changes, and the decisions that need attention. Spend your time resolving the issue, not reconstructing it.",
        cta: "Test it on your next initiative ↗",
        href: "pilot.html",
        artifact: "Your next-review brief",
        artifactTitle: "Atlas launch",
        rows: [
          ["Changed", "Staging forecast · Sat Oct 10"],
          ["Needs a decision", "Marketing’s preparation window"],
          ["Still open", "Legal approval for Acme’s pilot"],
        ],
        foot: "Start from what needs judgment.",
      },
      human: {
        label: "Every person doing the work",
        title: "Know why it matters.<br>Know where you stand.",
        text: "See how your work contributes, what you depend on, and what changed. Raise a concern or a condition—and see how it was addressed, with the audience made clear.",
        cta: "See how Sarah’s input stays with the decision →",
        href: "#how",
        artifact: "Sarah’s contribution · After the example decision",
        artifactTitle: "Help customers adopt Atlas",
        rows: [
          ["Your part", "Prepare clear launch materials"],
          ["Your condition", "Ten days after staging"],
          ["Decision", "Nadia adopted Tue Oct 20"],
        ],
        foot: "Your concern stays attached. Your input is not silently turned into consent.",
      },
      leader: {
        label: "Founders · CEOs · Functional leaders",
        title: "Keep the direction.<br>See the real trade-off.",
        text: "See how commitments support the company’s priorities and where an assumption no longer holds. Make the consequential calls with the affected people’s constraints in view.",
        cta: "Explore the decision loop →",
        href: "#how",
        artifact: "Nadia’s decision desk · Illustrative",
        artifactTitle: "Protect preparation or protect the date?",
        rows: [
          ["Option", "Move the public announcement five days"],
          ["Consequence", "Keep Sarah’s preparation window intact"],
          ["Protected", "Acme’s separate pilot terms stay in place"],
        ],
        foot: "An internal compromise cannot amend an external customer commitment.",
      },
      agent: {
        label: "Agent direction · Optional integration experiment",
        title: "Give the agent<br>the current agreement.",
        text: "The same plan can give an agent its relevant goal, approved guidance, constraints, and version. Scope one compatible workflow in the pilot to test whether changed direction reaches execution.",
        cta: "Discuss an agent experiment ↗",
        href: "pilot.html#contact",
        artifact: "Proposed agent context · Illustrative",
        artifactTitle: "Launch copy agent",
        rows: [
          ["Use", "Announcement · Tue Oct 20 · v2"],
          ["Preserve", "Acme pilot · Thu Oct 15"],
          ["Escalate", "Missing approval or conflicting guidance"],
        ],
        foot: "Available ≠ fetched ≠ followed. Enforcement needs a verified gate before the action.",
      },
    };
    const tabs = [...roles.querySelectorAll("[data-role]")];
    const panel = roles.querySelector("#role-panel");
    function select(tab, focus = false) {
      const data = content[tab.dataset.role];
      tabs.forEach((button) => {
        const active = button === tab;
        button.setAttribute("aria-selected", String(active));
        button.tabIndex = active ? 0 : -1;
      });
      panel.setAttribute("aria-labelledby", tab.id);
      panel.innerHTML = `<div class="role-copy"><span class="micro-label">${data.label}</span><h3>${data.title}</h3><p>${data.text}</p><a class="text-link" href="${data.href}">${data.cta}</a></div><div class="role-artifact"><span class="micro-label">${data.artifact}</span><h4>${data.artifactTitle}</h4><dl>${data.rows.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join("")}</dl><p>${data.foot}</p></div>`;
      if (focus) tab.focus();
    }
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => select(tab));
      tab.addEventListener("keydown", (event) => {
        const index = tabs.indexOf(tab);
        let next;
        if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
        if (event.key === "ArrowLeft")
          next = (index + tabs.length - 1) % tabs.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = tabs.length - 1;
        if (next !== undefined) {
          event.preventDefault();
          select(tabs[next], true);
        }
      });
    });
  }

  const prompts = {
    launch:
      "We have a launch coming up that needs engineering, sales, and marketing to stay aligned. The coordination challenge is…",
    customer:
      "We have a customer commitment that depends on more than one team. The coordination challenge is…",
    capacity:
      "Our delivery plan depends on a hiring or capacity assumption. The coordination challenge is…",
  };
  document.querySelectorAll("[data-intake-prompt]").forEach((button) =>
    button.addEventListener("click", () => {
      const field = document.querySelector("#pilot-initiative");
      if (!field) return;
      // Never discard an introduction the visitor already wrote.
      if (!field.value.trim() || Object.values(prompts).includes(field.value))
        field.value = prompts[button.dataset.intakePrompt];
      field.dispatchEvent(new Event("input", { bubbles: true }));
      field.focus();
    }),
  );
})();
