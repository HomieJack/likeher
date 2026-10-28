/* likeher — animated exercise figures.
 * Interpolates between pose keyframes (see js/exercises.js) and draws a
 * stick figure into an SVG. One requestAnimationFrame loop drives every
 * figure on screen.
 */
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const L = { torso: 46, neck: 6, head: 9, ua: 24, fa: 22, th: 32, sh: 31, foot: 9 };
  const GROUND = 145;
  const rad = (d) => (d * Math.PI) / 180;
  const deg = (r) => (r * 180) / Math.PI;
  const dir = (a) => [Math.sin(rad(a)), Math.cos(rad(a))];
  const angOf = (v) => deg(Math.atan2(v[0], v[1]));
  const lerp = (a, b, t) => a + (b - a) * t;
  const lerpAng = (a, b, t) => a + ((((b - a + 540) % 360) - 180) * t);
  const ease = (t) => 0.5 - Math.cos(Math.PI * t) / 2;

  // Two-bone IK. s = +1 bends clockwise (elbows back), -1 counter (knees forward).
  function ik(root, target, a, b, s) {
    const dx = target[0] - root[0], dy = target[1] - root[1];
    let d = Math.hypot(dx, dy) || 0.001;
    const ux = dx / d, uy = dy / d;
    d = Math.min(Math.max(d, Math.abs(a - b) + 0.01), a + b - 0.01);
    const cos = (a * a + d * d - b * b) / (2 * a * d);
    const off = Math.acos(Math.max(-1, Math.min(1, cos))) * s;
    const c = Math.cos(off), sn = Math.sin(off);
    const j = [root[0] + a * (ux * c - uy * sn), root[1] + a * (ux * sn + uy * c)];
    const ex = target[0] - j[0], ey = target[1] - j[1];
    const el = Math.hypot(ex, ey) || 1;
    return [j, [j[0] + (ex / el) * b, j[1] + (ey / el) * b]];
  }

  function solveLimb(root, limb, a, b, defBend) {
    if (limb.p) return ik(root, limb.p, a, b, limb.b || defBend);
    const d1 = dir(limb.a[0]), j = [root[0] + d1[0] * a, root[1] + d1[1] * a];
    const d2 = dir(limb.a[1]);
    return [j, [j[0] + d2[0] * b, j[1] + d2[1] * b]];
  }

  function toAngles(root, limb, a, b, defBend) {
    if (limb.a) return limb;
    const [j, e] = solveLimb(root, limb, a, b, defBend);
    return { a: [angOf([j[0] - root[0], j[1] - root[1]]), angOf([e[0] - j[0], e[1] - j[1]])] };
  }

  // Fill in far limbs that weren't given (slightly offset copy of the near one).
  function normalize(f) {
    const farOf = (l) => (l.p ? { p: [l.p[0] - 4, l.p[1]], b: l.b } : { a: [l.a[0] - 8, l.a[1] - 8] });
    const legs = f.legs.length > 1 ? f.legs : [f.legs[0], farOf(f.legs[0])];
    const arms = f.arms.length > 1 ? f.arms : [f.arms[0], farOf(f.arms[0])];
    return { hip: f.hip, t: f.t, legs, arms };
  }

  function blend(A, B, t) {
    const hip = [lerp(A.hip[0], B.hip[0], t), lerp(A.hip[1], B.hip[1], t)];
    const tt = lerpAng(A.t, B.t, t);
    const neckA = add(A.hip, A.t, L.torso), neckB = add(B.hip, B.t, L.torso);
    const limb = (la, lb, rootA, rootB, a, b, bend) => {
      if (la.p && lb.p) return { p: [lerp(la.p[0], lb.p[0], t), lerp(la.p[1], lb.p[1], t)], b: la.b || lb.b };
      const xa = toAngles(rootA, la, a, b, bend), xb = toAngles(rootB, lb, a, b, bend);
      return { a: [lerpAng(xa.a[0], xb.a[0], t), lerpAng(xa.a[1], xb.a[1], t)] };
    };
    return {
      hip, t: tt,
      legs: [0, 1].map((i) => limb(A.legs[i], B.legs[i], A.hip, B.hip, L.th, L.sh, -1)),
      arms: [0, 1].map((i) => limb(A.arms[i], B.arms[i], neckA, neckB, L.ua, L.fa, 1)),
    };
  }

  function add(p, a, len) {
    const d = dir(a);
    return [p[0] + d[0] * len, p[1] + d[1] * len];
  }

  // Resolve a pose into joint positions.
  function skeleton(f, grounded) {
    const neck = add(f.hip, f.t, L.torso);
    const up = dir(f.t);
    const head = [neck[0] + up[0] * (L.neck + L.head), neck[1] + up[1] * (L.neck + L.head)];
    const legs = f.legs.map((l) => {
      const [knee, ankle] = solveLimb(f.hip, l, L.th, L.sh, -1);
      const sd = [ankle[0] - knee[0], ankle[1] - knee[1]];
      const sl = Math.hypot(sd[0], sd[1]) || 1;
      let toe = [ankle[0] - (sd[1] / sl) * L.foot, ankle[1] + (sd[0] / sl) * L.foot];
      const lift = GROUND - ankle[1];
      if (grounded && lift >= -1 && lift < L.foot && toe[1] > GROUND - 3) {
        toe = [ankle[0] + Math.sqrt(Math.max(0, L.foot * L.foot - lift * lift)), GROUND];
      }
      return [f.hip, knee, ankle, toe];
    });
    const arms = f.arms.map((l) => {
      const [elbow, hand] = solveLimb(neck, l, L.ua, L.fa, 1);
      return [neck, elbow, hand];
    });
    return { hip: f.hip, neck, head, up, legs, arms };
  }

  const pathOf = (pts) => 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L');

  function el(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  function build(svg, anim) {
    const g = {};
    if (anim.ground !== false) el('line', { x1: 8, y1: GROUND + 4.5, x2: 192, y2: GROUND + 4.5, class: 'fg-ground' }, svg);
    for (const p of anim.props || []) {
      if (p.type === 'box') el('rect', { x: p.x, y: p.y + 4, width: p.w, height: p.h + 0.5, rx: 3, class: 'fg-prop' }, svg);
      if (p.type === 'wall') el('line', { x1: p.x, y1: 20, x2: p.x, y2: GROUND + 4.5, class: 'fg-prop-line' }, svg);
      if (p.type === 'bar') el('line', { x1: 40, y1: p.y, x2: 160, y2: p.y, class: 'fg-prop-line' }, svg);
      if (p.type === 'pbar') {
        el('line', { x1: p.x1, y1: p.y + 4, x2: p.x2, y2: p.y + 4, class: 'fg-prop-line' }, svg);
        el('line', { x1: p.x1 + 6, y1: p.y + 4, x2: p.x1 + 6, y2: 160, class: 'fg-prop-line thin' }, svg);
        el('line', { x1: p.x2 - 6, y1: p.y + 4, x2: p.x2 - 6, y2: 160, class: 'fg-prop-line thin' }, svg);
      }
      if (p.type === 'ball') el('circle', { cx: p.x, cy: GROUND + 3 - p.r, r: p.r, class: 'fg-prop' }, svg);
    }
    // cable tower: a post with a pulley at anim.cable = [x, y]
    if (anim.cable && anim.post !== false) {
      el('line', { x1: anim.cable[0], y1: 0, x2: anim.cable[0], y2: GROUND + 4.5, class: 'fg-prop-line' }, svg);
      el('circle', { cx: anim.cable[0], cy: anim.cable[1], r: 3.5, class: 'fg-pulley' }, svg);
    }
    // band / cable lines run from each hand to an anchor; loops sit around both legs
    const lineCls = anim.cable ? 'fg-cable' : 'fg-band';
    g.lines = anim.band || anim.cable ? [el('path', { class: lineCls }, svg), el('path', { class: lineCls }, svg)] : null;
    const far = anim.front ? 'fg-limb' : 'fg-limb fg-far';
    g.legF = el('path', { class: far }, svg);
    g.armF = el('path', { class: far }, svg);
    g.loop = anim.loop ? el('path', { class: 'fg-loop', 'data-at': anim.loop }, svg) : null;
    const weight = (cls) => anim.kb ? el('path', { d: 'M-3.5 -1a3.5 3.5 0 0 1 7 0M-5.5 5a5.5 5.5 0 1 0 11 0a5.5 5.5 0 1 0 -11 0', class: cls + ' fg-kb' }, svg)
      : el('rect', { width: 11, height: 6, rx: 2, class: cls }, svg);
    g.dbF = anim.db && anim.db !== 'near' ? weight(anim.front ? 'fg-db' : 'fg-db fg-far-db') : null;
    g.pony = anim.front ? null : el('path', { class: 'fg-hair' }, svg);
    g.torso = el('path', { class: 'fg-torso' }, svg);
    g.head = el('circle', { r: L.head, class: 'fg-head' }, svg);
    g.bun = anim.front ? el('circle', { r: 4.2, class: 'fg-hair-fill' }, svg) : null;
    g.legN = el('path', { class: 'fg-limb' }, svg);
    g.armN = el('path', { class: 'fg-limb' }, svg);
    g.dbN = anim.db ? weight('fg-db') : null;
    g.anchor = anim.band || anim.cable;
    g.from = anim.from || 'hands';
    g.bb = anim.bb ? el('circle', { r: 11, class: 'fg-plate' }, svg) : null;
    return g;
  }

  function draw(g, s) {
    g.legF.setAttribute('d', pathOf(s.legs[1]));
    g.legN.setAttribute('d', pathOf(s.legs[0]));
    g.armF.setAttribute('d', pathOf(s.arms[1]));
    g.armN.setAttribute('d', pathOf(s.arms[0]));
    const hipLow = [s.hip[0] - s.up[0] * 2, s.hip[1] - s.up[1] * 2];
    g.torso.setAttribute('d', pathOf([hipLow, s.neck]));
    g.head.setAttribute('cx', s.head[0].toFixed(1));
    g.head.setAttribute('cy', s.head[1].toFixed(1));
    if (g.pony) {
      // ponytail hangs off the back of the head
      const u = s.up, back = [u[1], -u[0]];
      const h = s.head;
      const p0 = [h[0] + back[0] * 6 + u[0] * 4, h[1] + back[1] * 6 + u[1] * 4];
      const p1 = [h[0] + back[0] * 15 + u[0] * 2, h[1] + back[1] * 15 + u[1] * 2 + 4];
      const p2 = [h[0] + back[0] * 13 - u[0] * 10, h[1] + back[1] * 13 - u[1] * 10 + 6];
      g.pony.setAttribute('d', `M${p0[0].toFixed(1)} ${p0[1].toFixed(1)}Q${p1[0].toFixed(1)} ${p1[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`);
    }
    if (g.bun) {
      g.bun.setAttribute('cx', (s.head[0] + s.up[0] * 9).toFixed(1));
      g.bun.setAttribute('cy', (s.head[1] + s.up[1] * 9).toFixed(1));
    }
    const placeDb = (r, hand) => {
      if (!r) return;
      if (r.tagName === 'path') r.setAttribute('transform', `translate(${hand[0].toFixed(1)} ${(hand[1] + 2).toFixed(1)})`);
      else { r.setAttribute('x', (hand[0] - 5.5).toFixed(1)); r.setAttribute('y', (hand[1] - 3).toFixed(1)); }
    };
    if (g.lines) {
      const hands = [s.arms[0][2], s.arms[1][2]];
      let segs;
      if (g.anchor === 'hands') segs = [[hands[0], hands[1]]];
      else if (g.from === 'foot') segs = [[s.legs[0][2], g.anchor]];
      else segs = hands.map((h, i) => [h, g.anchor === 'feet' ? s.legs[i][2] : g.anchor]);
      g.lines.forEach((ln, i) => ln.setAttribute('d', segs[i] ? pathOf(segs[i]) : ''));
    }
    if (g.loop) {
      const j = g.loop.dataset.at === 'ankles' ? 2 : 1;
      const a = s.legs[0][j], b = s.legs[1][j];
      g.loop.setAttribute('d', pathOf([[a[0] + 0.01, a[1]], b]));
    }
    placeDb(g.dbN, s.arms[0][2]);
    placeDb(g.dbF, s.arms[1][2]);
    if (g.bb) { g.bb.setAttribute('cx', s.arms[0][2][0].toFixed(1)); g.bb.setAttribute('cy', (s.arms[0][2][1] + 2).toFixed(1)); }
  }

  const DEFAULT_ANIM = {
    dur: 900,
    frames: [
      { hip: [100, 82], t: 180, legs: [{ p: [101, 145] }], arms: [{ a: [6, 3] }] },
      { hip: [100, 84], t: 180, legs: [{ p: [101, 145] }], arms: [{ a: [100, 100] }] },
    ],
  };

  const live = new Set();
  const reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  let raf = 0;

  function frameAt(fig, now) {
    const { frames, dur } = fig;
    const n = frames.length;
    const total = (now + fig.offset) / dur;
    const i = Math.floor(total) % n;
    const local = total - Math.floor(total);
    const p = ease(Math.min(1, Math.max(0, (local - 0.12) / 0.76)));
    return blend(frames[i], frames[(i + 1) % n], p);
  }

  function tick(now) {
    raf = 0;
    for (const fig of live) {
      if (!fig.svg.isConnected) { live.delete(fig); fig.io && fig.io.disconnect(); continue; }
      if (!fig.visible) continue;
      draw(fig.g, skeleton(frameAt(fig, now), fig.grounded));
    }
    if (live.size && !reduced) raf = requestAnimationFrame(tick);
  }

  /** Mount an animated figure inside `host`. */
  function mount(host, anim) {
    anim = anim && anim.frames ? anim : DEFAULT_ANIM;
    const svg = el('svg', { viewBox: '0 -16 200 176', class: 'fig', 'aria-hidden': 'true' });
    host.appendChild(svg);
    const fig = {
      svg, g: build(svg, anim), frames: anim.frames.map(normalize), dur: anim.dur || 900,
      grounded: anim.ground !== false, visible: true, offset: Math.random() * 400,
    };
    draw(fig.g, skeleton(fig.frames[0], fig.grounded));
    if (reduced) return fig;
    if ('IntersectionObserver' in window) {
      fig.io = new IntersectionObserver((es) => { fig.visible = es[es.length - 1].isIntersecting; });
      fig.io.observe(svg);
    }
    live.add(fig);
    if (!raf) raf = requestAnimationFrame(tick);
    return fig;
  }

  window.Figure = { mount };
})();
