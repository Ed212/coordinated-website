const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

document.querySelectorAll("[data-card-answer]").forEach((button) => {
  button.setAttribute("aria-pressed", "false");
  button.addEventListener("click", () => {
    const group = button.closest(".card-actions");
    group.querySelectorAll("[data-card-answer]").forEach((item) => {
      item.setAttribute("aria-pressed", String(item === button));
    });
  });
});

const narrativeSteps = [...document.querySelectorAll("[data-narrative-step]")];
const narrativeFrames = [...document.querySelectorAll("[data-narrative-frame]")];
const narrativeProgress = document.querySelector("[data-narrative-progress]");
const narrativeVisual = document.querySelector(".narrative-visual");
const narrativeCaptions = [
  "Source sentences remain attached to every proposed term.",
  "Two named owners receive one card each; the changed date is the only red fact.",
  "Answers return to the record. Terms move to v2 and the review opens current."
];

function setNarrativeStep(index) {
  narrativeSteps.forEach((step, stepIndex) => step.classList.toggle("is-active", stepIndex === index));
  narrativeFrames.forEach((frame, frameIndex) => frame.classList.toggle("is-active", frameIndex === index));

  if (narrativeProgress) {
    narrativeProgress.textContent = `0${index + 1} / 03`;
  }

  if (narrativeVisual) {
    narrativeVisual.style.setProperty("--narrative-progress", `${((index + 1) / 3) * 100}%`);
    const caption = narrativeVisual.querySelector("[data-narrative-caption]");
    if (caption) caption.textContent = narrativeCaptions[index];
  }
}

if (narrativeSteps.length && !reduceMotion.matches) {
  let narrativeTicking = false;
  let narrativeSettleTimer;
  const updateNarrativeFromScroll = () => {
    const viewportCenter = window.innerHeight / 2;
    const closest = narrativeSteps
      .map((step) => ({
        step,
        distance: Math.abs((step.getBoundingClientRect().top + (step.offsetHeight / 2)) - viewportCenter)
      }))
      .sort((a, b) => a.distance - b.distance)[0];

    setNarrativeStep(Number(closest.step.dataset.narrativeStep));
    narrativeTicking = false;
  };

  const queueNarrativeUpdate = () => {
    if (narrativeTicking) return;
    narrativeTicking = true;
    requestAnimationFrame(updateNarrativeFromScroll);
    clearTimeout(narrativeSettleTimer);
    narrativeSettleTimer = setTimeout(updateNarrativeFromScroll, 180);
  };

  window.addEventListener("scroll", queueNarrativeUpdate, { passive: true });
  window.addEventListener("resize", queueNarrativeUpdate, { passive: true });

  updateNarrativeFromScroll();
}

const momentRows = [...document.querySelectorAll("[data-moment-row]")];
const momentLinks = [...document.querySelectorAll("[data-moment-link]")];

if (momentRows.length && "IntersectionObserver" in window) {
  const momentObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    momentLinks.forEach((link) => link.classList.toggle("is-active", link.dataset.momentLink === visible.target.id));
  }, { rootMargin: "-32% 0px -48%", threshold: [0.12, 0.35, 0.65] });

  momentRows.forEach((row) => momentObserver.observe(row));
}

const receiptItems = document.querySelector("#receipt-items");
const receiptCount = document.querySelector("#receipt-count");
const receiptTime = document.querySelector("#receipt-time");
const receiptSections = [...document.querySelectorAll("[data-receipt-label]")];
const recordedSections = new Set(["Homepage opened"]);

function formatReceiptTime() {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date());
}

function renderReceipt() {
  if (!receiptItems || !receiptCount || !receiptTime) return;
  receiptItems.replaceChildren(...[...recordedSections].map((label) => {
    const item = document.createElement("li");
    item.textContent = label;
    return item;
  }));
  const count = recordedSections.size;
  receiptCount.textContent = `${count} ${count === 1 ? "section" : "sections"} recorded`;
  receiptTime.textContent = formatReceiptTime();
}

if (receiptItems) {
  renderReceipt();

  if ("IntersectionObserver" in window) {
    const receiptObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        recordedSections.add(entry.target.dataset.receiptLabel);
        renderReceipt();
        receiptObserver.unobserve(entry.target);
      });
    }, { threshold: 0.28 });

    receiptSections.forEach((section) => receiptObserver.observe(section));
  }
}

if (reduceMotion.matches) setNarrativeStep(2);
