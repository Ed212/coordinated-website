const form = document.querySelector("#replay-form");
const fileInput = document.querySelector("#document");
const linkInput = document.querySelector("#link");
const status = document.querySelector("#form-status");

const maxFileSize = 10 * 1024 * 1024;

function validateDocument() {
  const file = fileInput.files[0];
  const link = linkInput.value.trim();

  fileInput.setCustomValidity("");
  linkInput.setCustomValidity("");

  if (!file && !link) {
    linkInput.setCustomValidity("Add a file or link.");
    return false;
  }

  if (file && file.size > maxFileSize) {
    fileInput.setCustomValidity("Choose a file no larger than 10MB.");
    return false;
  }

  return true;
}

fileInput.addEventListener("change", validateDocument);
linkInput.addEventListener("input", validateDocument);

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateDocument() || !form.checkValidity()) {
    form.reportValidity();
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
