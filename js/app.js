/* likeher — app logic: state, Workout / Exercises / Stats screens. */
(function () {
  'use strict';

  // ───────────────────────── helpers ─────────────────────────
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (n) => Math.round(n).toLocaleString();
  const uid = () => Math.random().toString(36).slice(2, 9);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const pad = (n) => String(n).padStart(2, '0');
  const keyOf = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const dateOf = (k) => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
  const addDays = (k, n) => { const d = dateOf(k); d.setDate(d.getDate() + n); return keyOf(d); };
  const todayKey = () => keyOf(new Date());
  const diffDays = (a, b) => Math.round((dateOf(b) - dateOf(a)) / 86400000);
  const dowOf = (k) => dateOf(k).getDay();
  const monthsBetween = (a, b) => {
    const A = dateOf(a), B = dateOf(b);
    let m = (B.getFullYear() - A.getFullYear()) * 12 + B.getMonth() - A.getMonth();
    if (B.getDate() < A.getDate()) m--;
    return m;
  };
  const DOW = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const fmtShort = (k) => dateOf(k).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  const fmtMonthDay = (k) => dateOf(k).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  const UNIT = { reps: 'reps', secs: 'sec', min: 'min' };
  const STEP = { reps: 1, secs: 5, min: 1 };
  const fmtAmount = (n, unit) => `${fmt(n)} ${UNIT[unit] || unit}`;
  function fmtTime(sec) {
    if (sec < 60) return `${fmt(sec)}s`;
    const h = Math.floor(sec / 3600), m = Math.round((sec % 3600) / 60);
    return h ? `${h}h ${m}m` : `${m} min`;
  }

  const ICON = {
    x: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    pencil: '<svg viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="M13.5 6.5l4 4"/></svg>',
    left: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
    right: '<svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>',
    lock: '<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
    up: '<svg viewBox="0 0 24 24"><path d="M5 17l6-6 4 4 5-6"/><path d="M15 9h5v5"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/></svg>',
    gear: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2.5 12h3M18.5 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>',
    close: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    flame: '<svg viewBox="0 0 24 24"><path d="M12 21c-4 0-7-2.7-7-6.5 0-3.4 2.6-5.3 3.6-8.5 2.3 1.4 2.9 3.6 2.9 3.6S13.5 7 13 3c4 2.4 6 6.8 6 11.2 0 3.9-3 6.8-7 6.8z"/></svg>',
    trophy: '<svg viewBox="0 0 24 24"><path d="M8 4h8v5a4 4 0 0 1-8 0V4z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8.5 20h7M10 17h4"/></svg>',
    sparkle: '<svg viewBox="0 0 24 24"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></svg>',
  };

  // ───────────────────────── state ─────────────────────────
  const STORE_KEY = 'likeher.v1';
  const defaults = () => ({
    v: 1, plan: [], dayNames: {}, log: {}, custom: [], gifs: {},
    settings: { weekStart: 1, sound: true, haptics: true, theme: 'auto', body: 'female' },
  });
  let S = load();

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const s = JSON.parse(raw), d = defaults();
        return { ...d, ...s, settings: { ...d.settings, ...(s.settings || {}) } };
      }
    } catch (e) { /* storage blocked or corrupt — start fresh */ }
    return defaults();
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); }
    catch (e) { toast('Couldn’t save. Storage may be full or blocked.'); }
  }

  const UI = { tab: 'workout', date: todayKey(), lib: 'all', gear: 'any', q: '', exView: 'library', range: 'all' };

  // ───────────────────────── exercises & plan ─────────────────────────
  const exById = (id) => window.EXERCISES.find((e) => e.id === id) || S.custom.find((e) => e.id === id);
  const library = () => [...window.EXERCISES, ...S.custom.filter((c) => !c.deleted)];
  const groupText = (ex) => window.groupsOf(ex).map((g) => window.GROUPS[g][0]).join(' · ');
  const gearText = (ex) => window.gearOf(ex).filter((g) => g !== 'mat' || (ex.gear || []).length === 1).map((g) => window.EQUIPMENT[g]).join(' · ');
  const regionText = (ex, n = 3) => Object.entries(ex.regions || {}).sort((a, b) => b[1] - a[1]).slice(0, n).map(([r]) => window.REGIONS[r]).join(' · ');

  const isActive = (item, k) => item.from <= k && (!item.removed || k < item.removed);
  const activeItem = (exId) => S.plan.find((i) => i.ex === exId && !i.removed);
  const scheduled = (k) => S.plan.filter((i) => isActive(i, k) && i.days.includes(dowOf(k)) && exById(i.ex));

  function target(item, k) {
    const p = item.prog;
    if (!p || !p.on) return item.reps;
    const start = item.progFrom || item.from;
    const dd = diffDays(start, k);
    if (dd <= 0) return item.reps;
    const n = p.every === 'day' ? dd : p.every === 'week' ? Math.floor(dd / 7) : Math.max(0, monthsBetween(start, k));
    let v = item.reps + p.amt * n;
    if (p.max) v = Math.min(v, Math.max(p.max, item.reps));
    return v;
  }

  function rowsFor(k) {
    const logged = S.log[k] || {};
    const rows = scheduled(k).map((i) => ({ id: i.id, item: i, ex: exById(i.ex), sets: i.sets, reps: target(i, k), unit: i.unit, done: logged[i.id] }));
    for (const [id, e] of Object.entries(logged)) {
      if (rows.some((r) => r.id === id)) continue;
      rows.push({ id, item: null, ex: exById(e.ex) || { id: e.ex, name: e.name, regions: {} }, done: e });
    }
    for (const r of rows) if (r.done) { r.sets = r.done.sets; r.reps = r.done.reps; r.unit = r.done.unit; }
    return rows;
  }
  const dayName = (k) => S.dayNames[dowOf(k)] || DOW[dowOf(k)];
  const progLabel = (p, unit) => `+${p.amt}${unit === 'reps' ? '' : unit === 'secs' ? 's' : 'm'} / ${p.every}`;

  // ───────────────────────── feedback: sound, haptics, particles ─────────────────────────
  let actx;
  function chime(big) {
    if (!S.settings.sound) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const notes = big ? [659.3, 784, 987.8, 1318.5] : [880, 1318.5];
      notes.forEach((f, i) => {
        const o = actx.createOscillator(), g = actx.createGain();
        o.type = 'sine'; o.frequency.value = f;
        const t0 = actx.currentTime + i * (big ? 0.09 : 0.06);
        g.gain.setValueAtTime(0, t0);
        g.gain.linearRampToValueAtTime(0.16, t0 + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.6);
        o.connect(g).connect(actx.destination);
        o.start(t0); o.stop(t0 + 0.65);
      });
    } catch (e) { /* audio unavailable */ }
  }
  const buzz = (p) => { if (S.settings.haptics && navigator.vibrate) navigator.vibrate(p); };
  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const SHAPES = ['♥', '✦', '●', '✿', '•'];
  function burst(x, y, count = 16, spread = 90) {
    if (reducedMotion()) return;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'particle c' + (i % 4);
      p.textContent = SHAPES[i % SHAPES.length];
      p.style.left = x + 'px'; p.style.top = y + 'px';
      p.style.fontSize = 9 + Math.random() * 9 + 'px';
      document.body.appendChild(p);
      const a = Math.random() * Math.PI * 2, d = spread * (0.45 + Math.random() * 0.75);
      const dx = Math.cos(a) * d, dy = Math.sin(a) * d - 30;
      p.animate([
        { transform: 'translate(-50%,-50%) scale(.4)', opacity: 1 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1) rotate(${(Math.random() - 0.5) * 120}deg)`, opacity: 1, offset: 0.6 },
        { transform: `translate(calc(-50% + ${dx * 1.1}px), calc(-50% + ${dy + 40}px)) scale(.6)`, opacity: 0 },
      ], { duration: 800 + Math.random() * 400, easing: 'cubic-bezier(.2,.7,.3,1)' }).onfinish = () => p.remove();
    }
  }
  function floatText(x, y, text) {
    const t = document.createElement('span');
    t.className = 'float-text'; t.textContent = text;
    t.style.left = x + 'px'; t.style.top = y + 'px';
    document.body.appendChild(t);
    t.animate([
      { transform: 'translate(-50%, 0) scale(.7)', opacity: 0 },
      { transform: 'translate(-50%, -22px) scale(1.05)', opacity: 1, offset: 0.25 },
      { transform: 'translate(-50%, -60px) scale(1)', opacity: 0 },
    ], { duration: 1300, easing: 'ease-out' }).onfinish = () => t.remove();
  }
  function confettiRain() {
    if (reducedMotion()) return;
    const W = innerWidth;
    for (let i = 0; i < 60; i++) {
      const p = document.createElement('span');
      p.className = 'particle c' + (i % 4);
      p.textContent = SHAPES[i % SHAPES.length];
      p.style.left = Math.random() * W + 'px'; p.style.top = '-20px';
      p.style.fontSize = 10 + Math.random() * 12 + 'px';
      p.style.zIndex = 60;
      document.body.appendChild(p);
      const drift = (Math.random() - 0.5) * 120;
      p.animate([
        { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
        { transform: `translate(${drift}px, ${innerHeight + 40}px) rotate(${Math.random() * 540}deg)`, opacity: 0.9 },
      ], { duration: 1800 + Math.random() * 1600, delay: Math.random() * 600, easing: 'cubic-bezier(.3,.1,.6,1)' }).onfinish = () => p.remove();
    }
  }

  // ───────────────────────── toast, sheets, dialogs ─────────────────────────
  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
  }

  function openSheet(html, { onClose, cls = '' } = {}) {
    const layer = $('#layer');
    const wrap = document.createElement('div');
    wrap.className = 'sheet-wrap';
    wrap.innerHTML = `<div class="backdrop"></div><div class="sheet ${cls}" role="dialog" aria-modal="true">
      <div class="sheet-top"><div class="grab"></div><button class="sheet-x" aria-label="Close">${ICON.x}</button></div>${html}</div>`;
    layer.appendChild(wrap);
    requestAnimationFrame(() => wrap.classList.add('open'));
    const sheet = $('.sheet', wrap);
    const backdrop = $('.backdrop', wrap);
    let closed = false;
    const close = () => {
      if (closed) return;
      closed = true;
      sheet.style.transition = ''; sheet.style.transform = ''; backdrop.style.opacity = '';
      wrap.classList.remove('open');
      document.removeEventListener('keydown', onKey);
      setTimeout(() => wrap.remove(), 260);
      onClose && onClose();
    };
    const onKey = (e) => { if (e.key === 'Escape' && wrap === layer.lastElementChild) close(); };
    document.addEventListener('keydown', onKey);
    backdrop.addEventListener('click', close);
    $('.sheet-x', wrap).addEventListener('click', close);
    // swipe down to dismiss: from the handle any time, from anywhere else once scrolled to the top
    let x0 = 0, y0 = null, t0 = 0, dy = 0, dragging = false, fromTop = false;
    sheet.addEventListener('touchstart', (e) => {
      y0 = null;
      if (e.touches.length > 1 || e.target.closest('input, textarea, select, .stepper, .chips.scroll')) return;
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; t0 = Date.now();
      dy = 0; dragging = false; fromTop = !!e.target.closest('.sheet-top');
    }, { passive: true });
    sheet.addEventListener('touchmove', (e) => {
      if (y0 == null) return;
      const d = e.touches[0].clientY - y0, dx = e.touches[0].clientX - x0;
      if (!dragging) {
        if (Math.abs(d) < 8 && Math.abs(dx) < 8) return;
        if (d < 0 || Math.abs(dx) > Math.abs(d) || (!fromTop && sheet.scrollTop > 0)) { y0 = null; return; }
        dragging = true; sheet.style.transition = 'none';
      }
      e.preventDefault();
      dy = Math.max(0, d - 8);
      sheet.style.transform = `translateY(${dy}px)`;
      backdrop.style.opacity = String(Math.max(0, 1 - dy / (sheet.offsetHeight || 1)));
    }, { passive: false });
    const endDrag = () => {
      if (!dragging) { y0 = null; return; }
      dragging = false; y0 = null;
      const fast = dy / Math.max(1, Date.now() - t0) > 0.5;
      if (dy > Math.min(140, sheet.offsetHeight * 0.25) || (fast && dy > 40)) close();
      else { sheet.style.transition = ''; sheet.style.transform = ''; backdrop.style.opacity = ''; }
    };
    sheet.addEventListener('touchend', endDrag);
    sheet.addEventListener('touchcancel', endDrag);
    return { el: sheet, close };
  }

  function confirmDialog({ title, body, ok = 'OK', cancel = 'Cancel', danger = false }) {
    return new Promise((resolve) => {
      let answered = false;
      const s = openSheet(`
        <div class="dialog">
          <h2>${esc(title)}</h2>
          ${body ? `<p>${esc(body)}</p>` : ''}
          <div class="row-btns">
            <button class="btn ghost" data-a="no">${esc(cancel)}</button>
            <button class="btn ${danger ? 'danger' : 'primary'}" data-a="yes">${esc(ok)}</button>
          </div>
        </div>`, { cls: 'compact', onClose: () => { if (!answered) resolve(false); } });
      s.el.addEventListener('click', (e) => {
        const a = e.target.closest('[data-a]');
        if (!a) return;
        answered = true; resolve(a.dataset.a === 'yes'); s.close();
      });
    });
  }

  // media: user GIF if set, otherwise animated figure
  function mountMedia(host, ex) {
    host.innerHTML = '';
    const gif = (S.gifs[ex.id] || ex.gif || '').trim();
    if (gif) {
      const img = new Image();
      img.alt = ex.name; img.className = 'media-img'; img.src = gif; img.loading = 'lazy';
      img.onerror = () => { host.innerHTML = ''; window.Figure.mount(host, ex.anim); };
      host.appendChild(img);
    } else {
      window.Figure.mount(host, ex.anim);
    }
  }
  const mountAll = (root) => $$('[data-fig]', root).forEach((el) => { const ex = exById(el.dataset.fig); if (ex) mountMedia(el, ex); });

  // ───────────────────────── tabs ─────────────────────────
  function setTab(tab) {
    UI.tab = tab;
    $$('.tab').forEach((b) => b.classList.toggle('active', b.dataset.tab === tab));
    $$('.screen').forEach((s) => s.classList.toggle('active', s.id === 'screen-' + tab));
    if (tab === 'workout') renderWorkout();
    if (tab === 'exercises') renderExercises();
    if (tab === 'stats') renderStats();
    $('#screens').scrollTop = 0;
  }

  // ═════════════════════════ WORKOUT ═════════════════════════
  function relLabel(k) {
    const d = diffDays(todayKey(), k);
    if (d === 0) return 'Today';
    if (d === -1) return 'Yesterday';
    if (d === 1) return 'Tomorrow';
    if (Math.abs(d) < 14) return d < 0 ? `${-d} days ago` : `In ${d} days`;
    const w = Math.round(Math.abs(d) / 7);
    return d < 0 ? `${w} weeks ago` : `In ${w} weeks`;
  }

  function dayStatus(k) {
    const rows = rowsFor(k);
    const done = rows.filter((r) => r.done).length;
    return { total: rows.length, done };
  }

  function weekStrip(k) {
    const ws = S.settings.weekStart;
    const start = addDays(k, -((dowOf(k) - ws + 7) % 7));
    const t = todayKey();
    let html = '';
    for (let i = 0; i < 7; i++) {
      const d = addDays(start, i);
      const st = dayStatus(d);
      const state = !st.total ? 'rest' : st.done === st.total ? 'full' : st.done ? 'part' : d < t ? 'missed' : 'todo';
      html += `<button class="ws-day ${d === k ? 'sel' : ''} ${d === t ? 'today' : ''} ${state}" data-act="goto" data-k="${d}" aria-label="${fmtShort(d)}">
        <span class="ws-dow">${DOW[dowOf(d)][0]}</span>
        <span class="ws-num">${dateOf(d).getDate()}</span>
        <span class="ws-dot"></span>
      </button>`;
    }
    return html;
  }

  function ringSVG(done, total) {
    const r = 26, c = 2 * Math.PI * r, f = total ? done / total : 0;
    return `<svg class="ring" viewBox="0 0 64 64" aria-hidden="true">
      <defs><linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--peach)"/><stop offset="1" stop-color="var(--accent)"/></linearGradient></defs>
      <circle cx="32" cy="32" r="${r}" class="ring-bg"/>
      <circle cx="32" cy="32" r="${r}" class="ring-fg" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${(c * (1 - f)).toFixed(1)}"/>
    </svg>`;
  }

  function cardHTML(r, mode) {
    const done = !!r.done;
    const p = r.item && r.item.prog && r.item.prog.on ? r.item.prog : null;
    const grown = r.item && !done ? r.reps - r.item.reps : 0;
    const meta = `${r.sets} × ${fmtAmount(r.reps, r.unit)}`;
    const chip = p ? `<span class="chip-up" title="Auto-progression">${ICON.up}${grown > 0 ? `+${grown}` : progLabel(p, r.unit)}</span>` : '';
    const ctl = mode === 'future'
      ? `<span class="check locked" aria-hidden="true">${ICON.lock}</span>`
      : `<button class="check ${done ? 'on' : ''} ${mode === 'past' && done ? 'sealed' : ''}" data-act="check" aria-pressed="${done}" aria-label="${done ? 'Done' : 'Mark done'}: ${esc(r.ex.name)}">
          <svg viewBox="0 0 44 44"><circle class="c-bg" cx="22" cy="22" r="19"/><path class="c-tick" d="M13.5 22.5l6 6 11-12"/></svg>
        </button>`;
    return `<li class="wcard ${done ? 'done' : ''} ${mode}" data-id="${r.id}">
      <button class="wcard-main" data-act="info" aria-label="About ${esc(r.ex.name)}">
        <div class="thumb" data-fig="${esc(r.ex.id)}"></div>
        <div class="wcard-text">
          <div class="wname">${esc(r.ex.name)}</div>
          <div class="wmeta"><span>${meta}</span>${chip}</div>
        </div>
      </button>
      ${ctl}
    </li>`;
  }

  function progressHTML(k, rows, mode) {
    const done = rows.filter((r) => r.done).length;
    if (mode === 'future') {
      return `<div class="progress-card future"><div class="pc-text"><div class="pc-big">${rows.length} planned</div><div class="pc-sub">Preview only. You can check these off on the day.</div></div></div>`;
    }
    let reps = 0, secs = 0;
    rows.filter((r) => r.done).forEach((r) => { if (r.unit === 'reps') reps += r.sets * r.reps; else secs += r.sets * r.reps * (r.unit === 'min' ? 60 : 1); });
    const allDone = done === rows.length;
    const sub = [reps ? `${fmt(reps)} reps` : '', secs ? fmtTime(secs) : ''].filter(Boolean).join(' · ') || (mode === 'past' ? 'Forgot to log something? Tap to catch up.' : 'Let’s get moving');
    return `<div class="progress-card ${allDone ? 'complete' : ''}">
      <div class="pc-ring">${ringSVG(done, rows.length)}<span class="pc-frac">${allDone ? ICON.check : `${done}/${rows.length}`}</span></div>
      <div class="pc-text"><div class="pc-big">${allDone ? 'All done' : `${done} of ${rows.length} done`}</div><div class="pc-sub">${sub}</div></div>
    </div>`;
  }

  function renderWorkout(slide = 0) {
    const scr = $('#screen-workout');
    const k = UI.date, t = todayKey();
    const mode = k < t ? 'past' : k > t ? 'future' : 'today';
    const rows = rowsFor(k);
    const custom = !!S.dayNames[dowOf(k)];

    let body;
    if (!S.plan.some((i) => !i.removed) && !rows.length) {
      body = `<div class="empty">
        <div class="empty-art">${figureBadge()}</div>
        <h2>Your plan is empty</h2>
        <p>Build your plan on the Exercises screen. Set it up once and your workouts show up here every day.</p>
        <button class="btn primary" data-act="to-exercises">${ICON.plus} Build your plan</button>
      </div>`;
    } else if (!rows.length) {
      body = `<div class="empty rest">
        <div class="empty-emoji">☁️</div>
        <h2>Rest day</h2>
        <p>Nothing planned for ${esc(dayName(k))}. Recovery is part of the plan.</p>
      </div>`;
    } else {
      body = `${progressHTML(k, rows, mode)}
        ${mode === 'past' && rows.some((r) => !r.done) ? `<div class="hint">${ICON.pencil}<span>Catching up? You can still log past workouts. They lock once checked.</span></div>` : ''}
        <ul class="wlist">${rows.map((r) => cardHTML(r, mode)).join('')}</ul>`;
    }

    scr.innerHTML = `
      <header class="wk-head">
        <div class="wk-eyebrow">
          <span class="eyebrow ${mode}">${relLabel(k)}</span>
          ${k !== t ? `<button class="pill" data-act="today">Back to today</button>` : ''}
        </div>
        <div class="wk-titlebar">
          <button class="nav-arrow" data-act="prev" aria-label="Previous day">${ICON.left}</button>
          <button class="wk-title" data-act="rename" aria-label="Rename ${DOW[dowOf(k)]}">
            <h1>${esc(dayName(k))}<span class="pen">${ICON.pencil}</span></h1>
            <div class="wk-date">${custom ? DOW[dowOf(k)] + ' · ' : ''}${dateOf(k).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</div>
          </button>
          <button class="nav-arrow" data-act="next" aria-label="Next day">${ICON.right}</button>
        </div>
        <div class="weekstrip">${weekStrip(k)}</div>
      </header>
      <div class="wk-body ${slide > 0 ? 'in-right' : slide < 0 ? 'in-left' : ''}">${body}</div>`;
    mountAll(scr);
  }

  function figureBadge() {
    return `<svg viewBox="0 0 120 120" class="badge-art"><circle cx="60" cy="60" r="54" class="ba-bg"/>
      <path d="M38 80h44M60 33v12M48 40l-6 22M72 40l6 22M54 64l-4 16M66 64l4 16" class="ba-fig"/><circle cx="60" cy="26" r="7" class="ba-head"/></svg>`;
  }

  function goDay(n) {
    UI.date = addDays(UI.date, n);
    renderWorkout(n);
  }

  function updateAfterCheck(card, row) {
    const k = UI.date;
    const rows = rowsFor(k);
    const mode = k < todayKey() ? 'past' : 'today';
    const pc = $('#screen-workout .progress-card');
    if (pc) pc.outerHTML = progressHTML(k, rows, mode);
    $('#screen-workout .weekstrip').innerHTML = weekStrip(k);
    const fresh = rows.find((r) => r.id === row.id);
    if (fresh && card) {
      card.classList.toggle('done', !!fresh.done);
      const btn = $('.check', card);
      btn.classList.toggle('on', !!fresh.done);
      btn.setAttribute('aria-pressed', !!fresh.done);
      if (mode === 'past' && fresh.done) btn.classList.add('sealed');
    }
    return rows;
  }

  async function onCheck(card) {
    const k = UI.date, t = todayKey();
    const row = rowsFor(k).find((r) => r.id === card.dataset.id);
    if (!row) return;
    const btn = $('.check', card);
    if (k > t) { toast(`You can check this off on ${fmtShort(k)}`); return; }
    if (row.done) {
      if (k === t) {
        delete S.log[k][row.id];
        if (!Object.keys(S.log[k]).length) delete S.log[k];
        save(); buzz(8);
        updateAfterCheck(card, row);
      } else {
        btn.classList.remove('nope'); void btn.offsetWidth; btn.classList.add('nope');
        toast('Past workouts are locked in 🔒');
      }
      return;
    }
    if (k < t) {
      const ok = await confirmDialog({
        title: `Log ${row.ex.name}?`,
        body: `Mark ${row.sets} × ${fmtAmount(row.reps, row.unit)} as done for ${fmtShort(k)}. Past days can't be unchecked later.`,
        ok: 'Yes, I did it',
      });
      if (!ok) return;
    }
    (S.log[k] = S.log[k] || {})[row.id] = { ex: row.ex.id, name: row.ex.name, sets: row.sets, reps: row.reps, unit: row.unit, t: Date.now() };
    save();
    const rows = updateAfterCheck(card, row);
    card.classList.add('just');
    setTimeout(() => card.classList.remove('just'), 900);
    const b = btn.getBoundingClientRect();
    const cx = b.left + b.width / 2, cy = b.top + b.height / 2;
    burst(cx, cy);
    floatText(cx - 30, cy - 18, row.unit === 'reps' ? `+${fmt(row.sets * row.reps)} reps` : `+${fmtTime(row.sets * row.reps * (row.unit === 'min' ? 60 : 1))}`);
    buzz([12, 40, 18]);
    const allDone = rows.every((r) => r.done);
    chime(false);
    if (allDone) setTimeout(() => dayComplete(k, rows), 650);
  }

  function dayComplete(k, rows) {
    chime(true); buzz([20, 60, 20, 60, 40]);
    confettiRain();
    let reps = 0, secs = 0;
    rows.forEach((r) => { if (r.unit === 'reps') reps += r.sets * r.reps; else secs += r.sets * r.reps * (r.unit === 'min' ? 60 : 1); });
    const st = streaks();
    const wrap = document.createElement('div');
    wrap.className = 'celebrate';
    wrap.innerHTML = `<div class="cel-card" role="dialog" aria-label="Day complete">
      <div class="cel-spark">${ICON.sparkle}</div>
      <div class="cel-eyebrow">${esc(dayName(k))}</div>
      <h2>Day complete</h2>
      <p>${[reps ? `${fmt(reps)} reps` : '', secs ? fmtTime(secs) : ''].filter(Boolean).join(' and ')}. You showed up for yourself.</p>
      ${st.cur > 1 ? `<div class="cel-streak">${ICON.flame}<b>${st.cur}</b> workout streak</div>` : ''}
      <button class="btn primary">Yay!</button>
    </div>`;
    document.body.appendChild(wrap);
    requestAnimationFrame(() => wrap.classList.add('open'));
    const close = () => { wrap.classList.remove('open'); setTimeout(() => wrap.remove(), 300); };
    wrap.addEventListener('click', close);
  }

  function renameDay() {
    const w = dowOf(UI.date), cur = S.dayNames[w] || '';
    const ideas = ['Leg Day', 'Glute Day', 'Upper Body', 'Core', 'Cardio', 'Full Body', 'Rest & Stretch', 'Booty Day'];
    const s = openSheet(`<div class="dialog">
      <h2>Name your ${DOW[w]}s</h2>
      <p>Shown every ${DOW[w]}. Leave it blank to use the weekday.</p>
      <input class="field" id="dn" maxlength="28" placeholder="${DOW[w]}" value="${esc(cur)}" autocomplete="off">
      <div class="chips wrap">${ideas.map((i) => `<button class="chip" data-idea="${esc(i)}">${esc(i)}</button>`).join('')}</div>
      <div class="row-btns">
        ${cur ? '<button class="btn ghost" data-a="reset">Reset</button>' : '<button class="btn ghost" data-a="cancel">Cancel</button>'}
        <button class="btn primary" data-a="save">Save</button>
      </div></div>`, { cls: 'compact' });
    const input = $('#dn', s.el);
    setTimeout(() => input.focus(), 250);
    const commit = (v) => { v = v.trim(); if (v) S.dayNames[w] = v; else delete S.dayNames[w]; save(); s.close(); renderWorkout(); };
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') commit(input.value); });
    s.el.addEventListener('click', (e) => {
      const idea = e.target.closest('[data-idea]');
      if (idea) { input.value = idea.dataset.idea; input.focus(); return; }
      const a = e.target.closest('[data-a]')?.dataset.a;
      if (a === 'save') commit(input.value);
      if (a === 'reset') commit('');
      if (a === 'cancel') s.close();
    });
  }

  function initWorkoutEvents() {
    const scr = $('#screen-workout');
    scr.addEventListener('click', (e) => {
      const a = e.target.closest('[data-act]');
      if (!a) return;
      const act = a.dataset.act;
      if (act === 'prev') goDay(-1);
      else if (act === 'next') goDay(1);
      else if (act === 'today') { const n = diffDays(UI.date, todayKey()); UI.date = todayKey(); renderWorkout(Math.sign(n)); }
      else if (act === 'goto') { const n = diffDays(UI.date, a.dataset.k); if (n) { UI.date = a.dataset.k; renderWorkout(Math.sign(n)); } }
      else if (act === 'rename') renameDay();
      else if (act === 'to-exercises') setTab('exercises');
      else if (act === 'check') onCheck(a.closest('.wcard'));
      else if (act === 'info') {
        const card = a.closest('.wcard');
        const row = rowsFor(UI.date).find((r) => r.id === card.dataset.id);
        if (row && exById(row.ex.id)) openExercise(row.ex.id);
      }
    });
    // swipe: right = back in time, left = forward
    let sx = null, sy = 0;
    scr.addEventListener('touchstart', (e) => { if (e.target.closest('.weekstrip')) return; sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    scr.addEventListener('touchend', (e) => {
      if (sx == null) return;
      const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      sx = null;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) goDay(dx < 0 ? 1 : -1);
    }, { passive: true });
    document.addEventListener('keydown', (e) => {
      if (UI.tab !== 'workout' || $('#layer').children.length || e.target.matches('input, textarea')) return;
      if (e.key === 'ArrowLeft') goDay(-1);
      if (e.key === 'ArrowRight') goDay(1);
    });
  }

  // ═════════════════════════ EXERCISES ═════════════════════════
  function renderExercises() {
    const scr = $('#screen-exercises');
    const planCount = S.plan.filter((i) => !i.removed && exById(i.ex)).length;
    scr.innerHTML = `
      <header class="scr-head">
        <h1>Exercises</h1>
        <button class="icon-btn" data-act="create" aria-label="Create custom exercise">${ICON.plus}</button>
      </header>
      <div class="seg" role="tablist">
        <button role="tab" class="${UI.exView === 'library' ? 'on' : ''}" data-act="view" data-v="library">Library</button>
        <button role="tab" class="${UI.exView === 'plan' ? 'on' : ''}" data-act="view" data-v="plan">My plan${planCount ? ` <span class="count">${planCount}</span>` : ''}</button>
      </div>
      <div id="ex-body"></div>`;
    UI.exView === 'library' ? renderLibrary() : renderPlan();
  }

  function renderLibrary() {
    const body = $('#ex-body');
    const filters = [['all', 'All'], ['plan', 'In my plan'], ...Object.entries(window.GROUPS).map(([k, [v]]) => [k, v])];
    if (S.custom.some((c) => !c.deleted)) filters.push(['custom', 'Custom']);
    const gears = [['any', 'Any equipment'], ...Object.entries(window.EQUIPMENT)];
    body.innerHTML = `
      <label class="search">${ICON.search}<input id="exq" type="search" placeholder="Search exercises, muscles, equipment" value="${esc(UI.q)}" autocomplete="off"></label>
      <div class="filter-row"><span class="filter-lbl">Works</span><div class="chips scroll">${filters.map(([k, v]) => `<button class="chip ${UI.lib === k ? 'on' : ''}" data-act="filter" data-f="${k}">${v}</button>`).join('')}</div></div>
      <div class="filter-row"><span class="filter-lbl">Uses</span><div class="chips scroll">${gears.map(([k, v]) => `<button class="chip ${UI.gear === k ? 'on' : ''}" data-act="gear" data-g="${k}">${v}</button>`).join('')}</div></div>
      <p class="muted lib-count" id="lib-count"></p>
      <div class="ex-grid" id="ex-grid"></div>`;
    $$('.filter-row .chips', body).forEach((row) => {
      const on = $('.chip.on', row);
      if (on) row.scrollLeft = Math.max(0, on.offsetLeft - row.offsetLeft - 60);
    });
    renderGrid();
    $('#exq').addEventListener('input', (e) => { UI.q = e.target.value; renderGrid(); });
  }

  function renderGrid() {
    const q = UI.q.trim().toLowerCase();
    const list = library().filter((ex) => {
      if (UI.lib === 'plan' && !activeItem(ex.id)) return false;
      if (UI.lib === 'custom' && !ex.custom) return false;
      if (window.GROUPS[UI.lib] && !window.groupsOf(ex).includes(UI.lib)) return false;
      if (UI.gear !== 'any' && ![...window.gearOf(ex), ...(ex.opt || [])].includes(UI.gear)) return false;
      if (!q) return true;
      const hay = [ex.name, window.CATEGORIES[ex.cat], ...Object.keys(ex.regions || {}).map((r) => window.REGIONS[r]),
        ...window.groupsOf(ex).map((g) => window.GROUPS[g][0]), ...[...window.gearOf(ex), ...(ex.opt || [])].map((g) => window.EQUIPMENT[g])].join(' ').toLowerCase();
      return q.split(/\s+/).every((w) => hay.includes(w));
    });
    const needs = (ex) => window.gearOf(ex).includes(UI.gear);
    if (UI.gear !== 'any') list.sort((a, b) => needs(b) - needs(a));
    $('#lib-count').textContent = `${list.length} exercise${list.length === 1 ? '' : 's'}`;
    const grid = $('#ex-grid');
    grid.innerHTML = list.map((ex) => {
      const item = activeItem(ex.id);
      return `<button class="ex-card ${item ? 'in' : ''}" data-act="open" data-ex="${esc(ex.id)}">
        <div class="ex-media" data-fig="${esc(ex.id)}"></div>
        ${item ? `<span class="badge">${ICON.check}${item.days.length === 7 ? 'Daily' : item.days.length + '×/wk'}</span>` : ''}
        <div class="ex-name">${esc(ex.name)}</div>
        <div class="ex-tags">${esc(groupText(ex))}</div>
        <div class="ex-gear">${esc(gearText(ex))}${UI.gear !== 'any' && !window.gearOf(ex).includes(UI.gear) ? ` · <em>${esc(window.EQUIPMENT[UI.gear].toLowerCase())} optional</em>` : ''}</div>
      </button>`;
    }).join('') + `<button class="ex-card add" data-act="create"><div class="add-ico">${ICON.plus}</div><div class="ex-name">Create your own</div><div class="ex-tags">Custom exercise</div></button>`;
    if (!list.length && q) grid.insertAdjacentHTML('afterbegin', `<p class="muted span-all">No matches for “${esc(UI.q)}”.</p>`);
    mountAll(grid);
  }

  function orderedDays() {
    const ws = S.settings.weekStart;
    return [0, 1, 2, 3, 4, 5, 6].map((i) => (i + ws) % 7);
  }

  function renderPlan() {
    const body = $('#ex-body');
    const items = S.plan.filter((i) => !i.removed && exById(i.ex));
    if (!items.length) {
      body.innerHTML = `<div class="empty small"><h2>Nothing planned yet</h2><p>Open any exercise in the Library and tap <b>Add to plan</b>.</p>
        <button class="btn primary" data-act="view" data-v="library">Browse exercises</button></div>`;
      return;
    }
    const t = todayKey();
    body.innerHTML = `<p class="muted plan-sum">${items.length} exercise${items.length > 1 ? 's' : ''} · ${items.reduce((n, i) => n + i.days.length, 0)} sessions a week</p>` +
      orderedDays().map((w) => {
        const day = items.filter((i) => i.days.includes(w));
        return `<section class="plan-day">
          <div class="pd-head">
            <h3>${esc(S.dayNames[w] || DOW[w])}${S.dayNames[w] ? `<small>${DOW[w]}</small>` : ''}</h3>
            <button class="link" data-act="rename-w" data-w="${w}">Rename</button>
          </div>
          ${day.length ? `<ul class="pd-list">${day.map((i) => {
            const ex = exById(i.ex);
            return `<li><button class="pd-item" data-act="open" data-ex="${esc(ex.id)}">
              <div class="thumb sm" data-fig="${esc(ex.id)}"></div>
              <div class="pd-text"><b>${esc(ex.name)}</b><span>${i.sets} × ${fmtAmount(target(i, t), i.unit)}${i.prog && i.prog.on ? ` · <em>${progLabel(i.prog, i.unit)}</em>` : ''}</span></div>
              ${ICON.right}</button></li>`;
          }).join('')}</ul>` : '<p class="pd-rest">Rest day</p>'}
        </section>`;
      }).join('');
    mountAll(body);
  }

  function renameWeekday(w) {
    // reuse the workout rename sheet by temporarily pointing at a matching date
    const saved = UI.date;
    UI.date = addDays(todayKey(), (w - dowOf(todayKey()) + 7) % 7);
    renameDay();
    UI.date = saved;
    const obs = new MutationObserver(() => { if (!$('#layer').children.length) { obs.disconnect(); renderExercises(); } });
    obs.observe($('#layer'), { childList: true });
  }

  function initExerciseEvents() {
    $('#screen-exercises').addEventListener('click', (e) => {
      const a = e.target.closest('[data-act]');
      if (!a) return;
      const act = a.dataset.act;
      if (act === 'view') { UI.exView = a.dataset.v; renderExercises(); }
      else if (act === 'filter') { UI.lib = a.dataset.f; renderLibrary(); }
      else if (act === 'gear') { UI.gear = a.dataset.g; renderLibrary(); }
      else if (act === 'open') openExercise(a.dataset.ex);
      else if (act === 'create') editCustom();
      else if (act === 'rename-w') renameWeekday(+a.dataset.w);
    });
  }

  // ───────── exercise detail + plan config sheet ─────────
  function openExercise(exId) {
    const ex = exById(exId);
    if (!ex) return;
    const t = todayKey();
    const item = activeItem(ex.id);
    const cfg = item
      ? { sets: item.sets, reps: target(item, t), days: [...item.days], prog: { on: false, amt: 1, every: 'week', max: 0, ...item.prog } }
      : { sets: ex.sets || 3, reps: ex.reps || 10, days: [], prog: { on: false, amt: ex.unit === 'reps' ? 1 : 5, every: 'week', max: 0 } };
    const unit = item ? item.unit : ex.unit;
    const orig = JSON.stringify(cfg);

    const s = openSheet(`
      <div class="ex-sheet">
        <div class="ex-hero" data-fig="${esc(ex.id)}"></div>
        <div class="ex-head">
          <h2>${esc(ex.name)}</h2>
          <div class="tags">${Object.entries(ex.regions || {}).sort((a, b) => b[1] - a[1]).map(([r, w]) => `<span class="tag ${w >= 1 ? 'pri' : ''}">${window.REGIONS[r]}</span>`).join('')}</div>
          <dl class="ex-facts">
            <dt>Works</dt><dd>${esc(groupText(ex)) || '—'}</dd>
            <dt>Uses</dt><dd>${esc(window.gearOf(ex).map((g) => window.EQUIPMENT[g]).join(', '))}${ex.opt && ex.opt.length ? `<span class="opt"> · optional: ${esc(ex.opt.map((g) => window.EQUIPMENT[g].toLowerCase()).join(', '))}</span>` : ''}${ex.note ? `<span class="opt"> · ${esc(ex.note)}</span>` : ''}</dd>
          </dl>
        </div>
        ${ex.desc ? `<p class="ex-desc">${esc(ex.desc)}</p>` : ''}
        ${ex.tips && ex.tips.length ? `<div class="tips"><h4>Good form</h4><ul>${ex.tips.map((tp) => `<li>${ICON.check}<span>${esc(tp)}</span></li>`).join('')}</ul></div>` : ''}
        <div class="cfg" id="cfg"></div>
        <details class="more">
          <summary>Use your own GIF</summary>
          <p class="muted">Paste a link to a GIF or image to show instead of the animated figure.</p>
          <input class="field" id="gif" type="url" placeholder="https://…/squat.gif" value="${esc(S.gifs[ex.id] || '')}">
          <div class="row-btns"><button class="btn ghost" data-a="gif-clear">Use figure</button><button class="btn soft" data-a="gif-save">Save GIF</button></div>
        </details>
        ${ex.custom ? `<div class="row-btns"><button class="btn ghost" data-a="edit-custom">Edit exercise</button><button class="btn ghost danger-text" data-a="del-custom">Delete exercise</button></div>` : ''}
      </div>`, { cls: 'tall' });

    mountMedia($('.ex-hero', s.el), ex);
    const cfgEl = $('#cfg', s.el);

    const stepperCtl = (key, val, label) => `<div class="stepper" data-k="${key}"><button data-d="-1" aria-label="Less">−</button><input inputmode="numeric" value="${val}" aria-label="${label}"><button data-d="1" aria-label="More">+</button></div>`;
    const stepper = (key, val, label) => `<div class="field-row"><span>${label}</span>${stepperCtl(key, val, label)}</div>`;

    function preview() {
      const fake = { reps: cfg.reps, from: t, progFrom: t, prog: cfg.prog };
      const pts = [['Now', t], ['1 mo', addDays(t, 30)], ['3 mo', addDays(t, 91)], ['6 mo', addDays(t, 182)]];
      return `<div class="prog-preview">${pts.map(([l, k]) => `<div><b>${fmt(target(fake, k))}</b><span>${l}</span></div>`).join('<i>→</i>')}</div>`;
    }

    function drawCfg() {
      const u = UNIT[unit];
      const ordered = orderedDays();
      cfgEl.innerHTML = `
        <h4>${item ? 'In your plan' : 'Add to your plan'}</h4>
        ${stepper('sets', cfg.sets, 'Sets')}
        ${stepper('reps', cfg.reps, unit === 'reps' ? 'Reps' : unit === 'secs' ? 'Seconds' : 'Minutes')}
        <div class="field-label">Days <span class="quick"><button data-q="all">Every day</button><button data-q="wk">Weekdays</button><button data-q="none">Clear</button></span></div>
        <div class="days">${ordered.map((w) => `<button class="day ${cfg.days.includes(w) ? 'on' : ''}" data-day="${w}" aria-pressed="${cfg.days.includes(w)}" title="${esc(S.dayNames[w] || DOW[w])}">${DOW[w].slice(0, 2)}</button>`).join('')}</div>
        <div class="field-row toggle-row">
          <span>Auto-progression<small>Gradually increase ${unit === 'reps' ? 'reps' : 'time'}</small></span>
          <button class="switch ${cfg.prog.on ? 'on' : ''}" data-a="prog" role="switch" aria-checked="${cfg.prog.on}" aria-label="Auto-progression"><i></i></button>
        </div>
        ${cfg.prog.on ? `<div class="prog-box">
          <div class="prog-line">Add ${stepperCtl('amt', cfg.prog.amt, 'Amount')} ${u} every</div>
          <div class="seg small">${['day', 'week', 'month'].map((p) => `<button class="${cfg.prog.every === p ? 'on' : ''}" data-every="${p}">${p}</button>`).join('')}</div>
          ${stepper('max', cfg.prog.max || 0, `Stop at (0 = no limit)`)}
          ${preview()}
        </div>` : ''}
        <div class="row-btns sticky">
          ${item ? '<button class="btn ghost danger-text" data-a="remove">Remove</button>' : ''}
          <button class="btn primary grow" data-a="save">${item ? 'Save changes' : 'Add to plan'}</button>
        </div>`;
    }
    drawCfg();

    const setVal = (k, v) => {
      if (k === 'sets') cfg.sets = clamp(v, 1, 20);
      if (k === 'reps') cfg.reps = clamp(v, 1, 9999);
      if (k === 'amt') cfg.prog.amt = clamp(v, 1, 999);
      if (k === 'max') cfg.prog.max = clamp(v, 0, 9999);
    };
    const stepOf = (k) => (k === 'sets' ? 1 : STEP[unit]);

    s.el.addEventListener('change', (e) => {
      const st = e.target.closest('.stepper');
      if (st) { setVal(st.dataset.k, parseInt(e.target.value, 10) || 0); drawCfg(); }
    });

    s.el.addEventListener('click', async (e) => {
      const st = e.target.closest('.stepper button');
      if (st) {
        const k = st.parentElement.dataset.k;
        const cur = k === 'sets' ? cfg.sets : k === 'reps' ? cfg.reps : cfg.prog[k] || 0;
        setVal(k, cur + stepOf(k) * +st.dataset.d);
        drawCfg(); buzz(4);
        return;
      }
      const day = e.target.closest('[data-day]');
      if (day) {
        const w = +day.dataset.day;
        cfg.days = cfg.days.includes(w) ? cfg.days.filter((d) => d !== w) : [...cfg.days, w];
        drawCfg(); buzz(4); return;
      }
      const q = e.target.closest('[data-q]');
      if (q) { cfg.days = q.dataset.q === 'all' ? [0, 1, 2, 3, 4, 5, 6] : q.dataset.q === 'wk' ? [1, 2, 3, 4, 5] : []; drawCfg(); return; }
      const ev = e.target.closest('[data-every]');
      if (ev) { cfg.prog.every = ev.dataset.every; drawCfg(); return; }

      const a = e.target.closest('[data-a]')?.dataset.a;
      if (a === 'prog') { cfg.prog.on = !cfg.prog.on; drawCfg(); }
      if (a === 'save') {
        if (!cfg.days.length) { toast('Pick at least one day'); $('.days', s.el).classList.add('nope'); return; }
        if (item) {
          const before = JSON.parse(orig);
          const progChanged = cfg.reps !== before.reps || JSON.stringify(cfg.prog) !== JSON.stringify(before.prog);
          item.sets = cfg.sets; item.days = [...cfg.days].sort();
          if (progChanged) { item.reps = cfg.reps; item.prog = { ...cfg.prog }; item.progFrom = t; }
          toast('Plan updated');
        } else {
          S.plan.push({ id: uid(), ex: ex.id, sets: cfg.sets, reps: cfg.reps, unit, days: [...cfg.days].sort(), prog: { ...cfg.prog }, from: t, progFrom: t });
          toast(`${ex.name} added to your plan ✨`);
          buzz([10, 30, 10]);
        }
        save(); s.close(); refresh();
      }
      if (a === 'remove') {
        const ok = await confirmDialog({ title: `Remove ${ex.name}?`, body: 'It will leave your plan from today on. Your history and stats stay.', ok: 'Remove', danger: true });
        if (!ok) return;
        item.removed = t;
        if (!Object.values(S.log).some((d) => d[item.id])) S.plan = S.plan.filter((i) => i !== item);
        save(); s.close(); refresh(); toast('Removed from plan');
      }
      if (a === 'gif-save') {
        const url = $('#gif', s.el).value.trim();
        if (url) S.gifs[ex.id] = url; else delete S.gifs[ex.id];
        save(); mountMedia($('.ex-hero', s.el), ex); refresh(); toast(url ? 'GIF saved' : 'Using the figure');
      }
      if (a === 'gif-clear') {
        delete S.gifs[ex.id]; $('#gif', s.el).value = '';
        save(); mountMedia($('.ex-hero', s.el), ex); refresh();
      }
      if (a === 'edit-custom') { s.close(); setTimeout(() => editCustom(ex), 280); }
      if (a === 'del-custom') {
        const ok = await confirmDialog({ title: `Delete ${ex.name}?`, body: 'It’s removed from the library and your plan. Past workouts still count in your stats.', ok: 'Delete', danger: true });
        if (!ok) return;
        ex.deleted = true;
        S.plan.forEach((i) => { if (i.ex === ex.id && !i.removed) i.removed = t; });
        save(); s.close(); refresh();
      }
    });
  }

  function refresh() {
    if (UI.tab === 'exercises') renderExercises();
    if (UI.tab === 'workout') renderWorkout();
    if (UI.tab === 'stats') renderStats();
  }

  function editCustom(existing) {
    const ex = existing || { name: '', cat: 'lower', unit: 'reps', regions: {}, desc: '', tips: [], gif: '' };
    const sel = new Set(Object.keys(ex.regions));
    const gsel = new Set((ex.gear || []).filter((g) => g !== 'bodyweight'));
    const s = openSheet(`<div class="dialog form">
      <h2>${existing ? 'Edit exercise' : 'Create an exercise'}</h2>
      <label class="lbl">Name<input class="field" id="cn" maxlength="40" value="${esc(ex.name)}" placeholder="e.g. Cable Kickback"></label>
      <div class="lbl">Measure in</div>
      <div class="seg small" id="cu">${['reps', 'secs', 'min'].map((u) => `<button class="${ex.unit === u ? 'on' : ''}" data-u="${u}">${u === 'reps' ? 'Reps' : u === 'secs' ? 'Seconds' : 'Minutes'}</button>`).join('')}</div>
      <div class="lbl">Category</div>
      <div class="chips wrap" id="cc">${Object.entries(window.CATEGORIES).map(([k, v]) => `<button class="chip ${ex.cat === k ? 'on' : ''}" data-c="${k}">${v}</button>`).join('')}</div>
      <div class="lbl">Equipment <small>(none = bodyweight)</small></div>
      <div class="chips wrap" id="cq">${Object.entries(window.EQUIPMENT).filter(([k]) => k !== 'bodyweight').map(([k, v]) => `<button class="chip ${gsel.has(k) ? 'on' : ''}" data-q="${k}">${v}</button>`).join('')}</div>
      <div class="lbl">Muscles worked <small>(for body stats)</small></div>
      <div class="chips wrap" id="cr">${Object.entries(window.REGIONS).map(([k, v]) => `<button class="chip ${sel.has(k) ? 'on' : ''}" data-r="${k}">${v}</button>`).join('')}</div>
      <label class="lbl">Description<textarea class="field" id="cd" rows="2" placeholder="What is it?">${esc(ex.desc)}</textarea></label>
      <label class="lbl">Form tips <small>(one per line)</small><textarea class="field" id="ct" rows="3">${esc((ex.tips || []).join('\n'))}</textarea></label>
      <label class="lbl">GIF link <small>(optional)</small><input class="field" id="cg" type="url" value="${esc(ex.gif || '')}" placeholder="https://"></label>
      <div class="row-btns"><button class="btn ghost" data-a="cancel">Cancel</button><button class="btn primary" data-a="save">${existing ? 'Save' : 'Create'}</button></div>
    </div>`, { cls: 'tall' });
    let unit = ex.unit, cat = ex.cat;
    s.el.addEventListener('click', (e) => {
      const u = e.target.closest('[data-u]');
      if (u) { unit = u.dataset.u; $$('#cu button', s.el).forEach((b) => b.classList.toggle('on', b === u)); return; }
      const c = e.target.closest('[data-c]');
      if (c) { cat = c.dataset.c; $$('#cc .chip', s.el).forEach((b) => b.classList.toggle('on', b === c)); return; }
      const q = e.target.closest('[data-q]');
      if (q) { const k = q.dataset.q; gsel.has(k) ? gsel.delete(k) : gsel.add(k); q.classList.toggle('on'); return; }
      const r = e.target.closest('[data-r]');
      if (r) { const k = r.dataset.r; sel.has(k) ? sel.delete(k) : sel.add(k); r.classList.toggle('on'); return; }
      const a = e.target.closest('[data-a]')?.dataset.a;
      if (a === 'cancel') s.close();
      if (a === 'save') {
        const name = $('#cn', s.el).value.trim();
        if (!name) { toast('Give it a name'); return; }
        const data = {
          name, unit, cat, gear: [...gsel],
          regions: Object.fromEntries([...sel].map((k) => [k, 1])),
          desc: $('#cd', s.el).value.trim(),
          tips: $('#ct', s.el).value.split('\n').map((x) => x.trim()).filter(Boolean),
          gif: $('#cg', s.el).value.trim(),
        };
        let id;
        if (existing) { Object.assign(existing, data); id = existing.id; }
        else {
          id = 'c_' + uid();
          S.custom.push({ id, custom: true, sets: 3, reps: unit === 'reps' ? 10 : unit === 'secs' ? 30 : 10, anim: null, ...data });
        }
        save(); s.close(); refresh();
        setTimeout(() => openExercise(id), 300);
      }
    });
  }

  // ═════════════════════════ STATS ═════════════════════════
  const RANGES = [['week', 'Week', 7], ['month', 'Month', 30], ['year', 'Year', 365], ['all', 'All time', 0]];

  function collect(range) {
    const t = todayKey();
    const days = RANGES.find((r) => r[0] === range)[2];
    const from = days ? addDays(t, -(days - 1)) : '0000-00-00';
    const out = { reps: 0, secs: 0, checks: 0, days: 0, byEx: {}, byRegion: {}, byDay: {} };
    for (const [k, day] of Object.entries(S.log)) {
      if (k < from || k > t) continue;
      const entries = Object.values(day);
      if (!entries.length) continue;
      out.days++;
      const d = (out.byDay[k] = { sets: 0, reps: 0, secs: 0, n: 0 });
      for (const e of entries) {
        out.checks++; d.n++;
        const ex = exById(e.ex);
        const amount = e.sets * e.reps * (e.unit === 'min' ? 60 : 1);
        const timed = e.unit !== 'reps';
        if (timed) { out.secs += amount; d.secs += amount; } else { out.reps += amount; d.reps += amount; }
        d.sets += e.sets;
        const b = (out.byEx[e.ex + '|' + (timed ? 't' : 'r')] = out.byEx[e.ex + '|' + (timed ? 't' : 'r')] || { id: e.ex, name: ex ? ex.name : e.name, timed, total: 0, times: 0 });
        b.total += amount; b.times++;
        for (const [r, w] of Object.entries((ex && ex.regions) || {})) out.byRegion[r] = (out.byRegion[r] || 0) + e.sets * w;
      }
    }
    return out;
  }

  function streaks() {
    const t = todayKey();
    const keys = Object.keys(S.log).filter((k) => Object.keys(S.log[k]).length).sort();
    if (!keys.length) return { cur: 0, best: 0 };
    let cur = 0, best = 0;
    for (let k = keys[0]; k <= t; k = addDays(k, 1)) {
      const did = S.log[k] && Object.keys(S.log[k]).length;
      if (did) { cur++; best = Math.max(best, cur); }
      else if (k !== t && scheduled(k).length) cur = 0;
    }
    return { cur, best };
  }

  const MILESTONES = [
    ['First workout', (a) => a.checks >= 1],
    ['100 reps', (a) => a.reps >= 100],
    ['500 reps', (a) => a.reps >= 500],
    ['1,000 reps', (a) => a.reps >= 1000],
    ['5,000 reps', (a) => a.reps >= 5000],
    ['10,000 reps', (a) => a.reps >= 10000],
    ['25,000 reps', (a) => a.reps >= 25000],
    ['100,000 reps', (a) => a.reps >= 100000],
    ['10 active days', (a) => a.days >= 10],
    ['50 active days', (a) => a.days >= 50],
    ['100 active days', (a) => a.days >= 100],
    ['365 active days', (a) => a.days >= 365],
    ['1 hour of holds & cardio', (a) => a.secs >= 3600],
    ['10 hours of holds & cardio', (a) => a.secs >= 36000],
    ['7-day streak', (a, s) => s.best >= 7],
    ['30-day streak', (a, s) => s.best >= 30],
  ];

  function themeMode() {
    const th = document.documentElement.getAttribute('data-theme');
    if (th === 'light' || th === 'dark') return th;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function barsHTML(list, valueFmt, max) {
    return `<ol class="bars">${list.map((b, i) => `
      <li>
        <span class="rank r${i + 1}">${i + 1}</span>
        <div class="bar-main">
          <div class="bar-top"><span class="bar-name">${esc(b.name)}</span><span class="bar-val">${valueFmt(b)}</span></div>
          <div class="bar-track"><div class="bar-fill" style="--w:${Math.max(2, (b.total / max) * 100).toFixed(1)}%"></div></div>
        </div>
      </li>`).join('')}</ol>`;
  }

  function heatmapHTML() {
    const t = todayKey(), weeks = 20, ws = S.settings.weekStart;
    const end = addDays(t, (ws + 6 - dowOf(t) + 7) % 7);
    const start = addDays(end, -(weeks * 7 - 1));
    const all = collect('all').byDay;
    const vals = Object.values(all).map((d) => d.sets).sort((a, b) => a - b);
    const q = (p) => vals.length ? vals[Math.min(vals.length - 1, Math.floor(p * vals.length))] : 0;
    const cuts = [q(0.25), q(0.5), q(0.75)];
    let cells = '';
    for (let k = start; k <= end; k = addDays(k, 1)) {
      const d = all[k];
      const lvl = !d ? 0 : d.sets <= cuts[0] ? 1 : d.sets <= cuts[1] ? 2 : d.sets <= cuts[2] ? 3 : 4;
      const future = k > t;
      cells += `<button class="hm l${lvl} ${future ? 'fut' : ''} ${k === t ? 'today' : ''}" data-k="${k}" ${future ? 'tabindex="-1"' : ''} aria-label="${fmtShort(k)}"></button>`;
    }
    const dl = [0, 1, 2, 3, 4, 5, 6].map((i) => (i % 2 ? '' : DOW[(i + ws) % 7][0]));
    return `<div class="hm-wrap"><div class="hm-days">${dl.map((d) => `<span>${d}</span>`).join('')}</div><div class="hm-grid">${cells}</div></div>
      <div class="hm-foot"><span id="hm-info" class="muted">Tap a day for details</span><span class="hm-legend">Less <i class="hm l1"></i><i class="hm l2"></i><i class="hm l3"></i><i class="hm l4"></i> More</span></div>`;
  }

  function renderStats() {
    const scr = $('#screen-stats');
    const d = collect(UI.range);
    const allTime = collect('all');
    const st = streaks();
    const repEx = Object.values(d.byEx).filter((b) => !b.timed).sort((a, b) => b.total - a.total);
    const timeEx = Object.values(d.byEx).filter((b) => b.timed).sort((a, b) => b.total - a.total);
    const regions = Object.entries(d.byRegion).sort((a, b) => b[1] - a[1]);
    const regionTotal = regions.reduce((n, [, v]) => n + v, 0);
    const rangeLabel = { week: 'this week', month: 'in the last 30 days', year: 'this past year', all: 'all time' }[UI.range];
    const earned = MILESTONES.filter(([, test]) => test(allTime, st));
    const empty = !d.checks;

    const top = repEx[0];
    const funFact = top
      ? `You’ve done <b>${fmt(top.total)}</b> ${esc(top.name.toLowerCase())}${top.name.endsWith('s') ? '' : 's'} ${rangeLabel}${regions[0] ? `, and your <b>${esc(window.REGIONS[regions[0][0]].toLowerCase())}</b> got the most love` : ''}.`
      : timeEx[0] ? `You’ve spent <b>${fmtTime(timeEx[0].total)}</b> on ${esc(timeEx[0].name.toLowerCase())} ${rangeLabel}.` : '';

    scr.innerHTML = `
      <header class="scr-head">
        <h1>Your progress</h1>
        <button class="icon-btn" data-act="settings" aria-label="Settings">${ICON.gear}</button>
      </header>
      <div class="seg" role="tablist">${RANGES.map(([k, l]) => `<button class="${UI.range === k ? 'on' : ''}" data-act="range" data-r="${k}">${l}</button>`).join('')}</div>

      <div class="hero">
        <div class="hero-label">Total reps · ${rangeLabel}</div>
        <div class="hero-num" data-count="${d.reps}">0</div>
        <div class="hero-sub">${empty ? 'Check off your first workout and watch this grow.' : `across ${fmt(d.checks)} completed exercise${d.checks === 1 ? '' : 's'}`}</div>
      </div>

      <div class="tiles">
        <div class="tile"><span class="t-val">${fmt(d.days)}</span><span class="t-lbl">Active days</span></div>
        <div class="tile"><span class="t-val">${d.secs ? fmtTime(d.secs) : '0'}</span><span class="t-lbl">Holds & cardio</span></div>
        <div class="tile"><span class="t-val">${ICON.flame}${fmt(st.cur)}</span><span class="t-lbl">Current streak</span></div>
        <div class="tile"><span class="t-val">${fmt(st.best)}</span><span class="t-lbl">Best streak</span></div>
      </div>

      ${funFact ? `<p class="fun">${ICON.sparkle}<span>${funFact}</span></p>` : ''}

      <section class="card">
        <h3>Most done</h3>
        ${repEx.length ? barsHTML(repEx.slice(0, 8), (b) => `${fmt(b.total)} reps`, repEx[0].total) : `<p class="muted">Your top exercises will rank here.</p>`}
        ${timeEx.length ? `<h4 class="sub-h">Longest held</h4>${barsHTML(timeEx.slice(0, 5), (b) => fmtTime(b.total), timeEx[0].total)}` : ''}
      </section>

      <section class="card">
        <h3>Body hotspots</h3>
        <p class="muted small">Where your training went ${rangeLabel}. Tap a muscle.</p>
        <div class="bodymaps" id="bodymaps"></div>
        <div class="heat-legend"><span>Less</span><i id="heat-ramp"></i><span>More</span></div>
        <div id="region-pick" class="region-pick muted">&nbsp;</div>
        ${regions.length ? `<ol class="bars regions">${regions.map(([r, v]) => `
          <li><span class="swatch" style="background:${window.Body.heat(v / regions[0][1], themeMode())}"></span>
            <div class="bar-main"><div class="bar-top"><span class="bar-name">${window.REGIONS[r]}</span><span class="bar-val">${Math.round((v / regionTotal) * 100)}%</span></div>
            <div class="bar-track"><div class="bar-fill" style="--w:${((v / regions[0][1]) * 100).toFixed(1)}%"></div></div></div></li>`).join('')}</ol>` : ''}
      </section>

      <section class="card">
        <h3>Activity</h3>
        ${heatmapHTML()}
      </section>

      <section class="card">
        <h3>Milestones <small>${earned.length} of ${MILESTONES.length}</small></h3>
        <div class="badges">${MILESTONES.map(([l, test]) => {
          const got = test(allTime, st);
          return `<div class="mbadge ${got ? 'got' : ''}"><span class="mb-ico">${got ? ICON.trophy : ICON.lock}</span><span>${l}</span></div>`;
        }).join('')}</div>
      </section>`;

    const mode = themeMode();
    window.Body.render($('#bodymaps'), d.byRegion, {
      mode, model: S.settings.body,
      onPick: (r) => {
        const v = d.byRegion[r] || 0;
        $('#region-pick').innerHTML = `<b>${window.REGIONS[r]}</b> · ${v ? `${fmt(v)} weighted sets · ${Math.round((v / regionTotal) * 100)}% of your training` : 'not trained yet'}`;
        $$('#bodymaps [data-region]').forEach((p) => p.classList.toggle('picked', p.dataset.region === r));
      },
    });
    $('#heat-ramp').style.background = `linear-gradient(90deg, ${window.Body.RAMPS[mode].join(',')})`;
    countUp($('.hero-num'), d.reps);
  }

  function countUp(el, to) {
    if (reducedMotion() || to === 0) { el.textContent = fmt(to); return; }
    const t0 = performance.now(), dur = 1100;
    const step = (now) => {
      const p = clamp((now - t0) / dur, 0, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(to * e);
      if (p < 1 && el.isConnected) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function initStatsEvents() {
    const scr = $('#screen-stats');
    scr.addEventListener('click', (e) => {
      const a = e.target.closest('[data-act]');
      if (a?.dataset.act === 'range') { UI.range = a.dataset.r; renderStats(); return; }
      if (a?.dataset.act === 'settings') { openSettings(); return; }
      const cell = e.target.closest('.hm[data-k]');
      if (cell && !cell.classList.contains('fut')) {
        const k = cell.dataset.k, day = collect('all').byDay[k];
        $$('.hm.sel', scr).forEach((c) => c.classList.remove('sel'));
        cell.classList.add('sel');
        $('#hm-info').innerHTML = day
          ? `<b>${fmtShort(k)}</b> · ${day.n} exercise${day.n > 1 ? 's' : ''}${day.reps ? ` · ${fmt(day.reps)} reps` : ''}${day.secs ? ` · ${fmtTime(day.secs)}` : ''}`
          : `<b>${fmtShort(k)}</b> · rest`;
      }
    });
  }

  // ═════════════════════════ SETTINGS ═════════════════════════
  function openSettings() {
    const st = S.settings;
    const hasDemo = Object.values(S.log).some((d) => Object.values(d).some((e) => e.demo));
    const seg = (key, opts) => `<div class="seg small" data-set="${key}">${opts.map(([v, l]) => `<button class="${String(st[key]) === String(v) ? 'on' : ''}" data-v="${v}">${l}</button>`).join('')}</div>`;
    const sw = (key, label) => `<div class="field-row toggle-row"><span>${label}</span><button class="switch ${st[key] ? 'on' : ''}" data-sw="${key}" role="switch" aria-checked="${!!st[key]}" aria-label="${label}"><i></i></button></div>`;
    const s = openSheet(`<div class="dialog form settings">
      <h2>Settings</h2>
      <div class="lbl">Week starts on</div>${seg('weekStart', [[1, 'Monday'], [0, 'Sunday']])}
      <div class="lbl">Appearance</div>${seg('theme', [['auto', 'Auto'], ['light', 'Light'], ['dark', 'Dark']])}
      ${sw('sound', 'Check-off sounds')}
      ${sw('haptics', 'Vibration')}
      <h4>Your data</h4>
      <p class="muted small">Everything is stored on this device. Export a backup now and then.<br>Last backup: <b>${S.lastBackup ? fmtMonthDay(S.lastBackup) : 'never'}</b></p>
      <div class="stack">
        <button class="btn soft" data-a="export">Export backup</button>
        <button class="btn soft" data-a="import">Import backup</button>
        <input type="file" id="imp" accept="application/json,.json" hidden>
        ${hasDemo ? '<button class="btn soft" data-a="undemo">Remove sample history</button>' : '<button class="btn soft" data-a="demo">Add sample history (for testing)</button>'}
        <button class="btn ghost danger-text" data-a="wipe">Erase everything</button>
      </div>
      <p class="muted tiny center">likeher · made for you</p>
    </div>`, { cls: 'tall' });

    s.el.addEventListener('click', async (e) => {
      const sb = e.target.closest('[data-set] button');
      if (sb) {
        const key = sb.parentElement.dataset.set;
        st[key] = key === 'weekStart' ? +sb.dataset.v : sb.dataset.v;
        $$('button', sb.parentElement).forEach((b) => b.classList.toggle('on', b === sb));
        save(); applyTheme(); return;
      }
      const swb = e.target.closest('[data-sw]');
      if (swb) { const k = swb.dataset.sw; st[k] = !st[k]; swb.classList.toggle('on', st[k]); swb.setAttribute('aria-checked', st[k]); save(); if (k === 'sound' && st[k]) chime(false); return; }
      const a = e.target.closest('[data-a]')?.dataset.a;
      if (a === 'export') exportData();
      if (a === 'import') $('#imp', s.el).click();
      if (a === 'demo') {
        const ok = await confirmDialog({ title: 'Add sample history?', body: 'Fills about 6 months of fake workouts so you can try the stats. Remove it any time from Settings.', ok: 'Add sample data' });
        if (ok) { addDemo(); s.close(); refresh(); toast('Sample history added'); }
      }
      if (a === 'undemo') { removeDemo(); s.close(); refresh(); toast('Sample history removed'); }
      if (a === 'wipe') {
        const ok = await confirmDialog({ title: 'Erase everything?', body: 'Your plan, history and stats will be deleted from this device. This can’t be undone.', ok: 'Erase', danger: true });
        if (ok) { S = defaults(); save(); applyTheme(); s.close(); UI.date = todayKey(); refresh(); toast('All data erased'); }
      }
    });
    $('#imp', s.el).addEventListener('change', async (e) => {
      const f = e.target.files[0];
      if (!f) return;
      try {
        const data = JSON.parse(await f.text());
        if (!data || !Array.isArray(data.plan) || typeof data.log !== 'object') throw new Error('bad');
        const ok = await confirmDialog({ title: 'Replace your data?', body: `This backup has ${data.plan.length} plan items and ${Object.keys(data.log).length} logged days. It will replace what's on this device.`, ok: 'Import' });
        if (!ok) return;
        const d = defaults();
        S = { ...d, ...data, settings: { ...d.settings, ...(data.settings || {}) } };
        save(); applyTheme(); s.close(); refresh(); toast('Backup imported');
      } catch (err) { toast('That file isn’t a likeher backup'); }
    });
  }

  async function exportData() {
    const name = `likeher-backup-${todayKey()}.json`;
    const blob = new Blob([JSON.stringify(S, null, 1)], { type: 'application/json' });
    const done = () => { S.lastBackup = todayKey(); save(); toast('Backup saved'); };
    // On phones, the share sheet lets you save to Files / iCloud / Drive or send it to yourself
    const file = typeof File === 'function' ? new File([blob], name, { type: 'application/json' }) : null;
    if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: 'likeher backup' }); done(); return; }
      catch (err) { if (err.name === 'AbortError') return; }
    }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    done();
  }

  function addDemo() {
    const t = todayKey(), start = addDays(t, -182);
    if (!S.plan.some((i) => !i.removed)) {
      const P = (ex, days, sets, reps, prog) => {
        const e = exById(ex);
        S.plan.push({ id: uid(), ex, sets, reps, unit: e.unit, days, prog: prog || { on: false, amt: 1, every: 'week', max: 0 }, from: start, progFrom: start, demo: true });
      };
      const wk = { on: true, amt: 1, every: 'week', max: 30 };
      P('squat', [1, 4], 3, 10, wk); P('glute-bridge', [1, 4], 3, 12, wk); P('reverse-lunge', [1], 3, 8);
      P('calf-raise', [1, 4], 3, 15); P('knee-push-up', [2, 5], 3, 8, wk); P('bent-over-row', [2, 5], 3, 10);
      P('shoulder-press', [2], 3, 10); P('plank', [2, 5], 3, 25, { on: true, amt: 5, every: 'month', max: 90 });
      P('crunch', [3], 3, 15); P('dead-bug', [3], 3, 10); P('walk', [3, 6], 1, 20);
      P('hip-thrust', [4], 3, 12, wk); P('donkey-kick', [4], 3, 12); P('jumping-jacks', [6], 3, 30);
      if (!S.dayNames[1]) S.dayNames[1] = 'Leg Day';
      if (!S.dayNames[2]) S.dayNames[2] = 'Upper Body';
      if (!S.dayNames[4]) S.dayNames[4] = 'Glute Day';
    } else {
      S.plan.forEach((i) => { if (i.from > start) { i.from = start; i.progFrom = start; } });
    }
    for (let k = start; k < t; k = addDays(k, 1)) {
      if (Math.random() < 0.12) continue; // skipped day
      for (const i of scheduled(k)) {
        if (Math.random() < 0.1) continue;
        const ex = exById(i.ex);
        const day = (S.log[k] = S.log[k] || {});
        if (!day[i.id]) day[i.id] = { ex: i.ex, name: ex.name, sets: i.sets, reps: target(i, k), unit: i.unit, t: dateOf(k).getTime() + 64800000, demo: true };
      }
    }
    save();
  }

  function removeDemo() {
    for (const [k, day] of Object.entries(S.log)) {
      for (const [id, e] of Object.entries(day)) if (e.demo) delete day[id];
      if (!Object.keys(day).length) delete S.log[k];
    }
    const t = todayKey();
    S.plan = S.plan.filter((i) => !i.demo);
    S.plan.forEach((i) => { if (i.from < t && !Object.values(S.log).some((d) => d[i.id])) { i.from = t; i.progFrom = t; } });
    save();
  }

  // ═════════════════════════ boot ═════════════════════════
  function applyTheme() {
    const th = S.settings.theme;
    if (th === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', th);
    if (UI.tab === 'stats') renderStats();
  }

  function boot() {
    applyTheme();
    $$('.tab').forEach((b) => b.addEventListener('click', () => { if (b.dataset.tab === UI.tab && b.dataset.tab === 'workout' && UI.date !== todayKey()) { UI.date = todayKey(); renderWorkout(); } else setTab(b.dataset.tab); }));
    initWorkoutEvents();
    initExerciseEvents();
    initStatsEvents();
    renderWorkout();
    // roll over to the new day if the app stays open past midnight
    let lastToday = todayKey();
    const tick = () => {
      const t = todayKey();
      if (t !== lastToday) { if (UI.date === lastToday) UI.date = t; lastToday = t; refresh(); }
    };
    setInterval(tick, 60000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => { if (UI.tab === 'stats') renderStats(); });
    if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
    // ask the browser not to clear our data under storage pressure
    if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
  }

  boot();
})();
