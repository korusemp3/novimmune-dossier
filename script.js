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

// ===== CYBER PLAGUE: hover glitch sound (fade in/out + stop on leave) =====
(() => {
  const card = document.querySelector(".dossier-tile.cyber-plague");
  if (!card) return;

  const audio = new Audio("assets/sfx/glitch.mp3");
  audio.preload = "auto";
  audio.loop = true;          // чтобы держало помеху, пока держишь курсор
  audio.volume = 0;           // старт с нуля

  const MAX_VOL = 0.22;       // финальная громкость
  const FADE_MS = 220;        // скорость фейда
  const STEP_MS = 16;         // ~60fps

  let fadeTimer = null;
  let startedOnce = false;

  function clearFade() {
    if (fadeTimer) {
      clearInterval(fadeTimer);
      fadeTimer = null;
    }
  }

  function fadeTo(targetVol, onDone) {
    clearFade();
    const startVol = audio.volume;
    const steps = Math.max(1, Math.round(FADE_MS / STEP_MS));
    let i = 0;

    fadeTimer = setInterval(() => {
      i++;
      const t = i / steps;
      const v = startVol + (targetVol - startVol) * t;
      audio.volume = Math.max(0, Math.min(1, v));

      if (i >= steps) {
        clearFade();
        audio.volume = targetVol;
        if (onDone) onDone();
      }
    }, STEP_MS);
  }

  card.addEventListener("mouseenter", async () => {
    // автоплей-политики: иногда без первого клика play() может быть заблокирован
    try {
      if (!startedOnce) {
        audio.currentTime = 0;
        await audio.play();
        startedOnce = true;
      } else if (audio.paused) {
        await audio.play();
      }
      fadeTo(MAX_VOL);
    } catch (e) {
      // если браузер заблокировал — просто не играем
    }
  });

  card.addEventListener("mouseleave", () => {
    // плавно в ноль, потом стоп, чтобы не жрало ресурс
    fadeTo(0, () => {
      audio.pause();
      audio.currentTime = 0;
    });
  });
})();
