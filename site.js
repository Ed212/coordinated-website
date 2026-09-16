const replayButton = document.querySelector("#propagation-replay");
const heroCard = document.querySelector("#hero-change-card");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

replayButton.addEventListener("click", () => {
  const bounds = heroCard.getBoundingClientRect();
  const cardIsVisible = bounds.top >= 0 && bounds.bottom <= window.innerHeight;

  if (!cardIsVisible) {
    heroCard.scrollIntoView({
      behavior: reduceMotion.matches ? "auto" : "smooth",
      block: "center"
    });
  }

  if (!reduceMotion.matches) {
    heroCard.classList.remove("is-propagating");
    void heroCard.offsetWidth;
    heroCard.classList.add("is-propagating");
  }
});

const form = document.querySelector("#replay-form");
const fileInput = document.querySelector("#document");
const linkInput = document.querySelector("#link");
const dropZone = document.querySelector("#drop-zone");
const dropZoneText = document.querySelector("#drop-zone-text");
const status = document.querySelector("#form-status");
const maxFileSize = 10 * 1024 * 1024;

const formFields = {
  name: {
    input: document.querySelector("#name"),
    error: document.querySelector("#name-error"),
    message: "Enter your name."
  },
  email: {
    input: document.querySelector("#email"),
    error: document.querySelector("#email-error"),
    message: "Enter a valid work email."
  },
  company: {
    input: document.querySelector("#company"),
    error: document.querySelector("#company-error"),
    message: "Enter your company."
  },
  link: {
    input: linkInput,
    error: document.querySelector("#link-error"),
    message: "Enter a complete link."
  },
  document: {
    input: fileInput,
    error: document.querySelector("#document-error"),
    message: "Choose a file no larger than 10MB."
  },
  authorized: {
    input: document.querySelector("#authorized"),
    error: document.querySelector("#authorized-error"),
    message: "Confirm that you're authorized to share this document."
  }
};

const shareError = document.querySelector("#share-error");

function showError(field, message) {
  field.input.setAttribute("aria-invalid", "true");
  field.error.textContent = message || field.message;
  field.error.hidden = false;
}

function clearError(field) {
  field.input.removeAttribute("aria-invalid");
  field.error.hidden = true;
}

function validateForm() {
  let valid = true;

  [formFields.name, formFields.company].forEach((field) => {
    if (!field.input.value.trim()) {
      showError(field);
      valid = false;
    } else {
      clearError(field);
    }
  });

  const emailValue = formFields.email.input.value.trim();
  if (!emailValue || formFields.email.input.validity.typeMismatch) {
    showError(formFields.email);
    valid = false;
  } else {
    clearError(formFields.email);
  }

  const selectedFile = fileInput.files[0];
  const linkValue = linkInput.value.trim();
  const linkIsInvalid = linkValue && linkInput.validity.typeMismatch;
  const fileIsInvalid = selectedFile && selectedFile.size > maxFileSize;

  if (linkIsInvalid) {
    showError(formFields.link);
    valid = false;
  } else {
    clearError(formFields.link);
  }

  if (fileIsInvalid) {
    showError(formFields.document);
    valid = false;
  } else {
    clearError(formFields.document);
  }

  if (!selectedFile && !linkValue) {
    shareError.hidden = false;
    valid = false;
  } else {
    shareError.hidden = true;
  }

  if (!formFields.authorized.input.checked) {
    showError(formFields.authorized);
    valid = false;
  } else {
    clearError(formFields.authorized);
  }

  return valid;
}

function updateFileLabel() {
  const selectedFile = fileInput.files[0];
  dropZoneText.textContent = selectedFile ? selectedFile.name : "Drop a file here or choose one";
  shareError.hidden = Boolean(selectedFile || linkInput.value.trim());
  if (!selectedFile || selectedFile.size <= maxFileSize) {
    clearError(formFields.document);
  }
}

[formFields.name, formFields.email, formFields.company].forEach((field) => {
  field.input.addEventListener("input", () => clearError(field));
});

linkInput.addEventListener("input", () => {
  clearError(formFields.link);
  shareError.hidden = Boolean(fileInput.files[0] || linkInput.value.trim());
});

fileInput.addEventListener("change", updateFileLabel);
formFields.authorized.input.addEventListener("change", () => clearError(formFields.authorized));

["dragenter", "dragover"].forEach((eventName) => {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.add("is-dragging");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.remove("is-dragging");
  });
});

dropZone.addEventListener("drop", (event) => {
  if (event.dataTransfer.files.length) {
    fileInput.files = event.dataTransfer.files;
    updateFileLabel();
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateForm()) {
    const firstInvalid = form.querySelector('[aria-invalid="true"]');
    (firstInvalid || fileInput).focus();
    return;
  }

  const data = new FormData(form);
  const selectedFile = fileInput.files[0];
  const subject = `Launch doc from ${data.get("company")}`;
  const body = [
    `Name: ${data.get("name")}`,
    `Work email: ${data.get("email")}`,
    `Company: ${data.get("company")}`,
    data.get("link") ? `Link: ${data.get("link")}` : "",
    selectedFile ? `File selected: ${selectedFile.name} (attach it to the email before sending)` : "",
    "Authorized to share: yes"
  ].filter(Boolean).join("\n");

  const mailto = `mailto:ed@coordinatedai.ai?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  form.dataset.submitted = "true";
  form.dataset.mailto = mailto;
  status.hidden = false;
  window.location.assign(mailto);
});

const overlay = document.querySelector("#artifact-overlay");
const overlayContent = document.querySelector("#artifact-overlay-content");
const overlayClose = overlay.querySelector(".overlay-close");
let lastOverlayTrigger = null;

function openOverlay(trigger) {
  lastOverlayTrigger = trigger;
  overlayContent.replaceChildren();

  if (trigger.dataset.overlaySrc) {
    const preview = document.createElement("img");
    preview.src = trigger.dataset.overlaySrc;
    preview.alt = trigger.dataset.overlayAlt || "";
    overlayContent.append(preview);
  } else if (trigger.dataset.overlayCard) {
    const card = document.querySelector(trigger.dataset.overlayCard).cloneNode(true);
    card.removeAttribute("id");
    overlayContent.append(card);
  }

  overlay.hidden = false;
  document.body.classList.add("overlay-open");
  overlayClose.focus();
}

function closeOverlay() {
  overlay.hidden = true;
  document.body.classList.remove("overlay-open");
  overlayContent.replaceChildren();
  lastOverlayTrigger?.focus();
}

document.querySelectorAll(".open-full-size").forEach((trigger) => {
  trigger.addEventListener("click", () => openOverlay(trigger));
});

overlay.querySelectorAll("[data-overlay-close]").forEach((control) => {
  control.addEventListener("click", closeOverlay);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !overlay.hidden) {
    closeOverlay();
  }
});
