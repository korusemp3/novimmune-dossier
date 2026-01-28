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
  const card = document.querySelector(".dossier-tile.cyber-plague") || document.querySelector("body.cyber-plague");
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
  const card = 
  document.querySelector(".dossier-tile.cyber-plague");
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

// ===== DYNAMIC REDACT: animated █-mask (for is-dynamic) =====
(() => {
  const els = document.querySelectorAll(".redact.is-dynamic");
  if (!els.length) return;

  const alphabet = "█▓▒░#@!$%&*0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const minLen = 6, maxLen = 10;

  function mask() {
    const len = (Math.random() * (maxLen - minLen + 1) + minLen) | 0;
    let s = "";
    for (let i = 0; i < len; i++) s += alphabet[(Math.random() * alphabet.length) | 0];
    return s;
  }

  setInterval(() => {
    els.forEach(el => el.textContent = mask());
  }, 850);
})();

// ===== Daniel: false data flicker under card =====
(() => {
  // найди именно карточку Даниэля по href (самый надежный якорь)
  const danielTile = document.querySelector('a.dossier-tile[href*="daniel"]');
  if (!danielTile) return;

  const line = danielTile.querySelector(".ghostline");
  if (!line) return;

  const real = line.getAttribute("data-real") || line.textContent.trim();
  const fake = line.getAttribute("data-fake") || "ACCESS: OVERRIDE";

  let hover = false;
  danielTile.addEventListener("mouseenter", () => (hover = true));
  danielTile.addEventListener("mouseleave", () => (hover = false));

  function flashFake() {
    line.classList.add("is-fake");
    line.textContent = fake;

    // короткая вспышка
    const hold = 120 + Math.floor(Math.random() * 220);
    setTimeout(() => {
      line.classList.remove("is-fake");
      line.textContent = real;
    }, hold);
  }

  // редкие “вбросы”, чаще при наведении
  setInterval(() => {
    const p = hover ? 0.35 : 0.12; // вероятность
    if (Math.random() < p) flashFake();
  }, 850);
})();

// ===== Local tile error state (sometimes blocks, next click passes) =====
(() => {
  // применяем ко всем карточкам на экране выбора
  const tiles = document.querySelectorAll("a.dossier-tile");
  if (!tiles.length) return;

  // шанс “ошибки” (крути)
  const ERROR_CHANCE = 0.30; // 30%

  // какие НЕ трогаем (у Ирен своя магия)
  const skip = (tile) => tile.classList.contains("cyber-plague");

  // запоминаем “следующий клик пропустить”
  const passKey = (href) => `tile_pass_${href}`;

  function showError(tile, msg) {
    tile.classList.add("is-error");

    // ищем meta-блок, куда воткнуть строку
    const meta = tile.querySelector(".meta") || tile.querySelector(".card") || tile;

    // не дублируем
    let line = meta.querySelector(".tile-errorline");
    if (!line) {
      line = document.createElement("div");
      line.className = "tile-errorline mono";
      meta.appendChild(line);
    }
    line.textContent = msg;

    // убрать через чуть-чуть
    setTimeout(() => {
      tile.classList.remove("is-error");
      if (line) line.remove();
    }, 2000);
  }

  tiles.forEach((tile) => {
    if (skip(tile)) return;

    tile.addEventListener("click", (e) => {
      const href = tile.getAttribute("href") || "";
      const key = passKey(href);

      // если уже “пробило” — пускаем
      if (sessionStorage.getItem(key) === "1") {
        sessionStorage.removeItem(key);
        return;
      }

      // иногда блокируем
      if (Math.random() < ERROR_CHANCE) {
        e.preventDefault();

        // следующий клик — пропустить
        sessionStorage.setItem(key, "1");

const ERROR_MESSAGES = [
  "CONNECTION UNSTABLE // RETRY",
  "PACKET LOSS // CHANNEL DEGRADED",
  "AUTH TIMEOUT // SESSION INVALID",
  "TRACE DETECTED // ROUTE COMPROMISED",
  "SYNC ERROR // DATA DESYNC",
  "UPLINK FAILURE // SIGNAL LOST"
];

function pick(arr){
  return arr[Math.floor(Math.random() * arr.length)];
}

        
        showError(tile, pick(ERROR_MESSAGES));

      }
    });
  });
})();
