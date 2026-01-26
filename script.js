document.addEventListener("click", (e) => {
  const el = e.target.closest(".redact");
  if (!el) return;

  // статичные редактированные фрагменты не раскрываются
  if (el.classList.contains("is-static")) return;

  if (el.classList.contains("is-revealed")) {
    el.classList.remove("is-revealed");
    el.textContent = "███████████";
    return;
  }

  const reveal = el.getAttribute("data-reveal");
  if (!reveal) return;

  el.classList.add("is-revealed");
  el.textContent = reveal;
});
