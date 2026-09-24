const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const desktopMotion = window.matchMedia("(min-width: 768px)");
const clamp = (value, minimum = 0, maximum = 1) => Math.min(maximum, Math.max(minimum, value));

const hero = document.querySelector("[data-hero]");
const heroGalaxy = document.querySelector(".hero-galaxy");
const heroStarfield = document.querySelector(".hero-starfield");
const heroConnector = document.querySelector(".hero-connector");
const heroConnectorPath = document.querySelector("[data-hero-connector]");
const heroCardTitle = document.querySelector("[data-hero-card-title]");
const landscapeHeroAlt = "Illustration: Two interacting spiral galaxies with pale tidal tails converging on a bright shared core marked by a tiny red point, against deep black space.";
const portraitHeroAlt = "Illustration: Two merging galaxies with a tiny red shared core and pale tails sweeping from the left, beneath a dark, open upper field.";

function updateHero() {
  if (!hero || !heroGalaxy || !heroStarfield) return;
  heroGalaxy.alt = desktopMotion.matches ? landscapeHeroAlt : portraitHeroAlt;

  if (reduceMotion.matches || !desktopMotion.matches) {
    heroGalaxy.style.transform = "none";
    heroStarfield.style.transform = "none";
  } else {
    const heroRect = hero.getBoundingClientRect();
    const progress = clamp(-heroRect.top / Math.max(window.innerHeight, 1));
    heroGalaxy.style.transform = `scale(${1 + (progress * 0.05)}) rotate(${progress * 2.5}deg)`;
    heroStarfield.style.transform = `scale(${1 + (progress * 0.08)}) rotate(${progress * 4}deg) translate3d(0, ${progress * -10}px, 0)`;
  }

  if (!heroConnector || !heroConnectorPath || !heroCardTitle || !desktopMotion.matches) return;
  const heroRect = hero.getBoundingClientRect();
  const titleRect = heroCardTitle.getBoundingClientRect();
  const startX = heroRect.width * 0.62011;
  const startY = heroRect.height * 0.45;
  const endX = titleRect.left - heroRect.left;
  const endY = titleRect.top - heroRect.top + Math.min(titleRect.height / 2, 14);
  const bend = Math.max(36, (endX - startX) * 0.45);

  heroConnector.setAttribute("viewBox", `0 0 ${heroRect.width} ${heroRect.height}`);
  heroConnectorPath.setAttribute("d", `M ${startX} ${startY} C ${startX + bend} ${startY}, ${endX - 34} ${endY}, ${endX} ${endY}`);
}

let pageTicking = false;
function queuePageMotion() {
  if (pageTicking) return;
  pageTicking = true;
  requestAnimationFrame(() => {
    updateHero();
    updateNarrativeFlow();
    pageTicking = false;
  });
}

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
const narrativeProgress = document.querySelector("[data-narrative-progress]");
const narrativeVisual = document.querySelector(".narrative-visual");
const narrativeGalaxy = document.querySelector("[data-narrative-galaxy]");
const narrativeFlows = [...document.querySelectorAll(".tail-flow")];
const narrativeCardTitle = document.querySelector("[data-narrative-card-title]");
const narrativeVersion = document.querySelector("[data-narrative-version]");
const narrativeCaptions = [
  "Source sentences remain attached to every proposed term.",
  "Two named owners receive one card each; the changed date is the only red fact.",
  "Answers return to the record. Terms move to v2 and the review opens current."
];

function setNarrativeStep(index) {
  narrativeSteps.forEach((step, stepIndex) => step.classList.toggle("is-active", stepIndex === index));
  if (narrativeGalaxy) narrativeGalaxy.dataset.narrativeState = String(index);
  if (narrativeCardTitle) narrativeCardTitle.textContent = index === 2 ? "Decided Tue Oct 6, 9:05 AM" : "Staging may slip";
  if (narrativeVersion) narrativeVersion.textContent = index === 2 ? "v2" : "v1";

  if (narrativeProgress) {
    narrativeProgress.textContent = `0${index + 1} / 03`;
  }

  if (narrativeVisual) {
    narrativeVisual.style.setProperty("--narrative-progress", `${((index + 1) / 3) * 100}%`);
    const caption = narrativeVisual.querySelector("[data-narrative-caption]");
    if (caption) caption.textContent = narrativeCaptions[index];
  }
}

function updateNarrativeFlow() {
  if (!narrativeSteps.length || !narrativeFlows.length || reduceMotion.matches || !desktopMotion.matches) return;
  const firstStepRect = narrativeSteps[0].getBoundingClientRect();
  const flow = clamp(((window.innerHeight * 0.82) - firstStepRect.top) / (window.innerHeight * 0.6));
  narrativeFlows.forEach((path) => {
    path.style.strokeDashoffset = String(1 - flow);
  });
}

if (narrativeSteps.length) {
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
    updateNarrativeFlow();
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

if (narrativeGalaxy && !reduceMotion.matches && desktopMotion.matches && "IntersectionObserver" in window) {
  const galaxyObserver = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    narrativeGalaxy.classList.add("has-entered");
    galaxyObserver.disconnect();
  }, { threshold: 0.3 });
  galaxyObserver.observe(narrativeGalaxy);
}

window.addEventListener("scroll", queuePageMotion, { passive: true });
window.addEventListener("resize", queuePageMotion, { passive: true });
updateHero();
updateNarrativeFlow();

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
