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

const everyMs = 900;   // было 1200
const holdMs = 110;    // было 90
const chance = 0.20;   // было 0.18

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
  if (Math.random() < 0.65) { // было 0.55
    targets.forEach(glitchOnce);
  }
}, everyMs);
})();

// ===== CYBER PLAGUE: hover glitch sound =====
(() => {
  const card = document.querySelector(".dossier-tile.cyber-plague");
  if (!card) return;

  const audio = new Audio("assets/whisper.mp3");
  audio.volume = 0.25;      // тише, очень важно
  audio.preload = "auto";

  let canPlay = true;

  card.addEventListener("mouseenter", () => {
    if (!canPlay) return;

    try {
      audio.currentTime = 0;
      audio.play();
    } catch (e) {}

    // анти-спам, чтобы не трещало
    canPlay = false;
    setTimeout(() => (canPlay = true), 900);
  });
})();
