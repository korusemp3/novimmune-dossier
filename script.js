document.addEventListener("click", (e) => {
  const el = e.target.closest(".redact");
  if (!el) return;

// ===== CYBER PLAGUE: text glitch (character swapping) =====
(() => {
  // глитчим ТОЛЬКО карточку с cyber-plague на index
  const card = document.querySelector(".dossier-tile.cyber-plague");
  if (!card) return;

  const targets = card.querySelectorAll(".glitch-text");
  if (!targets.length) return;

  // сохраним исходный текст
  targets.forEach((el) => (el.dataset.base = el.textContent));

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&@*+-=";

  // настройки (можешь крутить)
  const everyMs = 1200; // как часто попытка глитча
  const holdMs = 90;    // сколько держим искажение
  const chance = 0.18;  // доля символов, которые ломаем

  function glitchOnce(el) {
    const base = el.dataset.base || el.textContent;
    const arr = base.split("");

    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === " ") continue;
      if (Math.random() < chance) {
        arr[i] = alphabet[(Math.random() * alphabet.length) | 0];
      }
    }

    el.textContent = arr.join("");
    setTimeout(() => {
      el.textContent = base;
    }, holdMs);
  }

  setInterval(() => {
    // не всегда, чтобы было “вспышками”
    if (Math.random() < 0.55) {
      targets.forEach(glitchOnce);
    }
  }, everyMs);
})();

  
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
