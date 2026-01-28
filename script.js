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

  const audio = new Audio("assets/whisper.mp3");
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

// ===== UI BREAK + DEAD PIXELS -> then navigate (Iren only) =====
(() => {
  const link = document.querySelector('a.dossier-tile.cyber-plague');
  if (!link) return;

  // overlay
  const overlay = document.createElement("div");
  overlay.className = "glitch-overlay";

  // dead pixels container
  const dead = document.createElement("div");
  dead.className = "deadpx";
  overlay.appendChild(dead);

  document.body.appendChild(overlay);

  let locked = false;

  function spawnDeadPixels() {
    dead.innerHTML = "";
    const count = 46; // количество квадратов (крути)
    for (let i = 0; i < count; i++) {
      const s = document.createElement("span");

      // размеры (чуть разный “битый” пиксель)
      const size = 6 + Math.floor(Math.random() * 14); // 6..19
      s.style.width = size + "px";
      s.style.height = size + "px";

      // позиция
      s.style.left = Math.floor(Math.random() * 100) + "%";
      s.style.top = Math.floor(Math.random() * 100) + "%";

      // вспышка в разные моменты
      const t = Math.floor(Math.random() * 260); // задержка до 260ms
      const life = 80 + Math.floor(Math.random() * 160); // длительность

      s.style.animation = `deadPxOne ${life}ms ${t}ms steps(1) forwards`;
      dead.appendChild(s);
    }
  }

  // ключевые кадры на каждый пиксель (через JS инлайн, но нужен keyframes в CSS)
  // добавим 1 раз в head, если нет
  if (!document.getElementById("deadPxKF")) {
    const st = document.createElement("style");
    st.id = "deadPxKF";
    st.textContent = `
      @keyframes deadPxOne{
        0%{ opacity: 0; transform: translate(0); }
        20%{ opacity: 1; transform: translate(-1px, 1px); }
        60%{ opacity: .75; transform: translate(1px, -1px); }
        100%{ opacity: 0; transform: translate(0); }
      }
    `;
    document.head.appendChild(st);
  }

    function startGlobalTextGlitch(durationMs) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&@*+-=";
  const everyMs = 80;
  const chance = 0.14;

  // берём только элементы, где реально есть текст и нет вложенных тегов (чтобы не ломать верстку)
  const nodes = Array.from(document.querySelectorAll("body *:not(script):not(style):not(svg)"))
    .filter(el => el.children.length === 0 && el.textContent && el.textContent.trim().length > 0);

  // сохраним исходники
  nodes.forEach(el => {
    if (!el.dataset.baseText) el.dataset.baseText = el.textContent;
  });

  const t0 = Date.now();
  const timer = setInterval(() => {
    for (const el of nodes) {
  const base = el.dataset.baseText;
  if (!base) continue;

  const arr = base.split("");
  let changed = false;

  for (let i = 0; i < arr.length; i++) {
    const ch = arr[i];
    if (ch === " " || ch === "\n" || ch === "\t") continue;

    if (Math.random() < chance) {
      arr[i] = alphabet[(Math.random() * alphabet.length) | 0];
      changed = true;
    }
  }

  if (changed) {
    el.textContent = arr.join("");
    el.classList.add("fx-glitch-red");
  } else {
    el.textContent = base;
    el.classList.remove("fx-glitch-red");
  }
}


    if (Date.now() - t0 >= durationMs) {
      clearInterval(timer);
      // восстановить
      nodes.forEach(el => {
  if (el.dataset.baseText) el.textContent = el.dataset.baseText;
  el.classList.remove("fx-glitch-red");
});
    }
  }, everyMs);
}
  
  link.addEventListener("click", (e) => {
    // --- включить “только первый клик за сессию”:
    // если хочешь, просто раскомментируй 4 строки ниже
    /*
    if (sessionStorage.getItem("iren_ui_break") === "1") {
      return; // обычный переход без эффекта
    }
    sessionStorage.setItem("iren_ui_break", "1");
    */

    if (locked) return;
    locked = true;

    e.preventDefault();

    const DELAY = 1100;
    
    startGlobalTextGlitch(DELAY);
    
    spawnDeadPixels();

    overlay.classList.remove("is-on");
    void overlay.offsetWidth; // reflow
    overlay.classList.add("is-on");

    
    setTimeout(() => {
      window.location.href = link.href;
    }, DELAY);
  });
})();
