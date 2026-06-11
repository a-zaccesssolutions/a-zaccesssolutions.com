const menuButton = document.querySelector(".menu-button");
const mobileMenu = document.querySelector(".mobile-menu");

if (menuButton && mobileMenu) {
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!open));
    mobileMenu.classList.toggle("open", !open);
    document.body.classList.toggle("menu-open", !open);
  });

  mobileMenu.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      menuButton.setAttribute("aria-expanded", "false");
      mobileMenu.classList.remove("open");
      document.body.classList.remove("menu-open");
    }
  });
}

function valueFrom(group, selector) {
  const control = group.querySelector(selector);
  return control ? control.value.trim() : "";
}

function collectFormFields(container) {
  return [...container.querySelectorAll(".form-group")]
    .map((group) => {
      if (group.closest("[hidden]")) return "";

      const label = group.querySelector(".form-label")?.textContent?.replace("*", "").trim();
      const checked = [...group.querySelectorAll("input[type='checkbox']:checked")]
        .map((field) => field.value.trim())
        .filter(Boolean);

      if (label && checked.length) return `${label}: ${checked.join(", ")}`;

      const field = group.querySelector("input:not([type='checkbox']), select, textarea");
      const value = field ? field.value.trim() : "";
      return label && value ? `${label}: ${value}` : "";
    })
    .filter(Boolean);
}

document.querySelectorAll("[data-other-toggle]").forEach((checkbox) => {
  const target = document.getElementById(checkbox.dataset.otherToggle);
  const input = target?.querySelector("input, textarea");
  if (!target) return;

  const updateOtherField = () => {
    target.hidden = !checkbox.checked;
    if (!checkbox.checked && input) input.value = "";
  };

  checkbox.addEventListener("change", updateOtherField);
  updateOtherField();
});

function wireEmailForm(selector, subjectPrefix) {
  const container = document.querySelector(selector);
  if (!container) return;

  const button = container.querySelector("button, .btn-primary");
  if (!button) return;

  button.addEventListener("click", (event) => {
    event.preventDefault();
    const name = [
      valueFrom(container, "input[placeholder='Jane']"),
      valueFrom(container, "input[placeholder='Smith']")
    ].filter(Boolean).join(" ");
    const subject = encodeURIComponent(`${subjectPrefix}${name ? ` - ${name}` : ""}`);
    const body = encodeURIComponent(collectFormFields(container).join("\n"));
    window.location.href = `mailto:info@azaccesssolutions.com?subject=${subject}&body=${body}`;
  });
}

wireEmailForm(".enquiry-form", "Website enquiry");
wireEmailForm(".apply-form", "Work with us enquiry");
