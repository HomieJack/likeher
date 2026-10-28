/* likeher — body region heat map.
 * BODY_MODELS holds one entry per body type ('female' for now). Each model
 * has a silhouette outline (right half, mirrored) and region shapes for the
 * front and back views. Shapes are point lists smoothed with Catmull-Rom.
 */
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const CX = 80;
  const mirror = (pts) => pts.map(([x, y]) => [2 * CX - x, y]);

  function smooth(pts, closed = true) {
    const n = pts.length;
    const at = (i) => pts[closed ? (i + n) % n : Math.max(0, Math.min(n - 1, i))];
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < (closed ? n : n - 1); i++) {
      const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += `C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0]} ${p2[1]}`;
    }
    return d + (closed ? 'Z' : '');
  }

  const FEMALE_OUTLINE = [
    [87, 52], [89, 63], [100, 67], [113, 72], [122, 79], [127, 90], [127, 105], [128, 122], [130, 140],
    [133, 160], [134, 180], [134, 195], [137, 207], [133, 218], [127, 214], [126, 198], [124, 178],
    [121, 158], [118, 140], [116, 120], [113, 103], [111, 113], [109, 128], [103, 148], [102, 160],
    [107, 178], [113, 196], [115, 215], [113, 240], [107, 265], [104, 280], [106, 300], [104, 322],
    [99, 340], [101, 350], [92, 352], [89, 346], [89, 334], [87, 312], [86, 292], [86, 276], [85, 255],
    [83, 232], [81, 214],
  ];

  const SHOULDER = [[110, 74], [121, 78], [127, 90], [126, 104], [118, 100], [112, 88]];
  const UPPER_ARM = [[115, 104], [124, 102], [128, 118], [126, 134], [119, 134], [115, 118]];
  const FOREARM = [[120, 142], [129, 142], [133, 165], [132, 188], [126, 190], [122, 168]];

  // region: list of [points, isCenter]
  const FEMALE = {
    outline: FEMALE_OUTLINE,
    front: {
      shoulders: [[SHOULDER]],
      chest: [[[[84, 77], [100, 73], [110, 80], [111, 95], [101, 104], [88, 102], [83, 92]]]],
      biceps: [[UPPER_ARM]],
      forearms: [[FOREARM]],
      abs: [[[[72, 110], [88, 110], [90, 128], [89, 165], [85, 182], [75, 182], [71, 165], [70, 128]], true]],
      obliques: [[[[93, 113], [104, 126], [102, 146], [106, 170], [97, 182], [91, 170], [93, 140]]]],
      quads: [[[[91, 203], [103, 196], [113, 204], [114, 228], [109, 256], [102, 270], [95, 266], [90, 240]]]],
      adductors: [[[[82, 216], [88, 206], [89, 232], [88, 258], [84, 262], [82, 240]]]],
      calves: [[[[96, 284], [105, 287], [106, 306], [102, 326], [97, 322], [94, 302]]]],
    },
    back: {
      upperBack: [
        [[[80, 56], [90, 62], [108, 70], [97, 79], [87, 92], [80, 99]]],
        [[[95, 86], [111, 93], [110, 110], [104, 136], [95, 148], [89, 124], [88, 100]]],
      ],
      shoulders: [[SHOULDER]],
      triceps: [[UPPER_ARM]],
      forearms: [[FOREARM]],
      lowerBack: [[[[71, 141], [89, 141], [92, 160], [90, 176], [80, 180], [70, 176], [68, 160]], true]],
      glutes: [[[[82, 181], [96, 177], [110, 185], [115, 202], [110, 220], [96, 226], [83, 220], [81, 200]]]],
      hamstrings: [[[[84, 231], [98, 231], [111, 227], [112, 247], [106, 268], [96, 272], [88, 258]]]],
      calves: [[[[89, 281], [100, 277], [107, 291], [107, 311], [101, 328], [94, 326], [88, 306]]]],
    },
    chestLines: true,
  };

  const BODY_MODELS = { female: FEMALE };

  // Sequential ramps (one hue, light → dark on light theme; dark → light on dark theme)
  const RAMPS = {
    light: ['#f1e2e2', '#f7c4cf', '#f08aa3', '#dc4677', '#a3164f'],
    dark: ['#3a2c3c', '#6b3550', '#a8456f', '#e8679a', '#ffc0d5'],
  };
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  function heat(v, mode) {
    const r = RAMPS[mode];
    if (v <= 0) return r[0];
    const x = Math.min(1, v) * (r.length - 1) * 0.999 + 0.0001;
    const i = Math.floor(x), f = x - i;
    const a = hex(r[i]), b = hex(r[Math.min(r.length - 1, i + 1)]);
    return '#' + a.map((c, k) => Math.round(c + (b[k] - c) * f).toString(16).padStart(2, '0')).join('');
  }

  let uid = 0;
  function view(model, side, values, max, mode, onPick) {
    const id = 'bglow' + uid++;
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 160 360');
    svg.setAttribute('class', 'bodymap');
    svg.setAttribute('role', 'img');
    const regions = model[side];
    const label = Object.keys(regions).map((r) => `${window.REGIONS[r]} ${values[r] ? Math.round(values[r]) : 0} sets`).join(', ');
    svg.setAttribute('aria-label', `${side === 'front' ? 'Front' : 'Back'} of body: ${label}`);
    const body = smooth([...model.outline, ...mirror(model.outline).reverse()]);
    const hair = side === 'front'
      ? `<ellipse cx="80" cy="27" rx="17.5" ry="20.5" class="bm-hair"/><circle cx="80" cy="7" r="8" class="bm-hair"/>
         <ellipse cx="80" cy="33" rx="14" ry="17" class="bm-skin"/>`
      : `<circle cx="80" cy="7" r="8" class="bm-hair"/><ellipse cx="80" cy="30" rx="16.5" ry="20.5" class="bm-hair"/>`;
    let shapes = '', glows = '';
    for (const [region, parts] of Object.entries(regions)) {
      const v = max ? (values[region] || 0) / max : 0;
      const fill = heat(v, mode);
      for (const [pts, center] of parts) {
        const ds = center ? [smooth(pts)] : [smooth(pts), smooth(mirror(pts))];
        for (const d of ds) {
          shapes += `<path d="${d}" fill="${fill}" class="bm-region" data-region="${region}"/>`;
          if (v > 0.3) glows += `<path d="${d}" fill="${heat(v, mode)}" opacity="${(v * 0.85).toFixed(2)}"/>`;
        }
      }
    }
    const lines = side === 'front' && model.chestLines
      ? `<path d="M87 101Q97 110 109 101M73 101Q63 110 51 101" class="bm-line"/>` : '';
    svg.innerHTML = `
      <defs><filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5"/></filter></defs>
      ${hair}
      <rect x="73" y="45" width="14" height="14" rx="4" class="bm-skin"/>
      <path d="${body}" class="bm-body"/>
      <g filter="url(#${id})">${glows}</g>
      ${shapes}${lines}`;
    svg.addEventListener('click', (e) => {
      const r = e.target.closest('[data-region]');
      if (r && onPick) onPick(r.dataset.region);
    });
    return svg;
  }

  /** Render front + back views into `host`. values: {region: weightedSets} */
  function render(host, values, opts = {}) {
    const model = BODY_MODELS[opts.model] || FEMALE;
    const max = Math.max(0, ...Object.values(values));
    const mode = opts.mode || 'light';
    host.innerHTML = '';
    for (const side of ['front', 'back']) {
      const wrap = document.createElement('figure');
      wrap.className = 'bodymap-wrap';
      wrap.appendChild(view(model, side, values, max, mode, opts.onPick));
      const cap = document.createElement('figcaption');
      cap.textContent = side === 'front' ? 'Front' : 'Back';
      wrap.appendChild(cap);
      host.appendChild(wrap);
    }
  }

  window.Body = { render, heat, RAMPS, BODY_MODELS };
})();
