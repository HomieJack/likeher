/* likeher — exercise library
 *
 * Add an exercise by appending an object to EXERCISES:
 *   id        unique string
 *   name      display name
 *   cat       'lower' | 'upper' | 'core' | 'cardio' | 'mobility'
 *   unit      'reps' | 'secs' | 'min'
 *   sets/reps defaults when adding to a plan
 *   gear      equipment keys it needs, see EQUIPMENT ([] = bodyweight)
 *   opt       optional equipment keys that make it harder
 *   regions   { regionKey: weight }  1 = primary, 0.5 = secondary (see REGIONS)
 *   desc      one-line description
 *   tips      good-form cues
 *   anim      animated figure (see js/figure.js). Optional; `gif` (URL) also works.
 *
 * Figure coordinates: 200 x 160 box, ground at y=145, figure faces right.
 * Angles are degrees from straight down; +90 = forward, 180 = up, -90 = backward.
 *   P(x, y, bend)  limb reaches for a point (feet/hands planted)
 *   A(upper, lower) limb set by angles
 */
(function () {
  const P = (x, y, b) => ({ p: [x, y], b });
  const A = (u, l) => ({ a: [u, l] });
  const pose = (hip, t, legs, arms) => ({ hip, t, legs, arms });

  const FEET = [P(101, 145), P(97, 145)];
  const HANG = [A(6, 3), A(-6, -3)];
  const STAND = pose([100, 82], 180, FEET, HANG);
  const standArms = (arms) => pose([100, 82], 180, FEET, arms);

  const SQUAT_TOP = pose([98, 82], 178, FEET, [A(20, 25)]);
  const SQUAT_BOT = pose([78, 116], 140, FEET, [A(92, 92)]);
  const PU_TOP = pose([96.6, 118.4], 115, [P(40, 145), P(43, 145)], [P(138, 145), P(134, 145)]);
  const PU_BOT = pose([101.8, 134], 100, [P(40, 145), P(43, 145)], [P(138, 145), P(134, 145)]);
  const QUAD = pose([78, 113], 107, [P(47, 143), P(51, 143)], [A(0, 0), A(-4, -2)]);
  const LIE = (t, legs, arms) => pose([100, 140], t, legs, arms);
  const BENT_KNEES = [P(132, 145), P(128, 145)];
  const LUNGE = (front, back) => pose([100, 110], 180, [front, back], HANG);

  window.REGIONS = {
    shoulders: 'Shoulders', chest: 'Chest', biceps: 'Biceps', triceps: 'Triceps',
    forearms: 'Forearms', abs: 'Abs', obliques: 'Obliques', upperBack: 'Upper back',
    lowerBack: 'Lower back', glutes: 'Glutes', quads: 'Quads', hamstrings: 'Hamstrings',
    adductors: 'Inner thighs', calves: 'Calves',
  };

  window.CATEGORIES = {
    lower: 'Lower body', upper: 'Upper body', core: 'Core', cardio: 'Cardio', weights: 'Weights',
  };

  window.EXERCISES = [
    // ───────── Lower body ─────────
    {
      id: 'squat', name: 'Bodyweight Squat', cat: 'lower', unit: 'reps', sets: 3, reps: 12, equip: '',
      regions: { quads: 1, glutes: 1, hamstrings: 0.5, calves: 0.3, abs: 0.2 },
      desc: 'The foundation of lower-body strength: sit back and down, then drive up.',
      tips: ['Feet about shoulder-width, toes slightly out', 'Push hips back like sitting into a chair', 'Knees track over toes', 'Chest proud, heels stay down'],
      anim: { frames: [SQUAT_TOP, SQUAT_BOT], dur: 900 },
    },
    {
      id: 'sumo-squat', name: 'Sumo Squat', cat: 'lower', unit: 'reps', sets: 3, reps: 12, equip: '',
      regions: { adductors: 1, glutes: 1, quads: 0.7, hamstrings: 0.3 },
      desc: 'A wide-stance squat that lights up the inner thighs and glutes.',
      tips: ['Stance wider than hips, toes turned out', 'Push knees out over toes', 'Keep torso tall', 'Squeeze glutes at the top'],
      anim: {
        front: true, dur: 900, frames: [
          pose([100, 84], 180, [P(122, 145, -1), P(78, 145, 1)], [A(30, 160), A(-30, -160)]),
          pose([100, 110], 180, [P(122, 145, -1), P(78, 145, 1)], [A(30, 160), A(-30, -160)]),
        ],
      },
    },
    {
      id: 'jump-squat', name: 'Jump Squat', cat: 'lower', unit: 'reps', sets: 3, reps: 10, equip: '',
      regions: { quads: 1, glutes: 1, calves: 0.6, hamstrings: 0.4 },
      desc: 'An explosive squat that builds power and gets your heart rate up.',
      tips: ['Load into a squat, then jump tall', 'Swing arms for momentum', 'Land softly, knees bent', 'Go straight into the next rep'],
      anim: { dur: 520, frames: [SQUAT_BOT, pose([100, 66], 180, [P(100, 129), P(97, 129)], [A(170, 175)])] },
    },
    {
      id: 'lunge', name: 'Forward Lunge', cat: 'lower', unit: 'reps', sets: 3, reps: 10, equip: '',
      regions: { quads: 1, glutes: 1, hamstrings: 0.5, adductors: 0.3, calves: 0.3 },
      desc: 'Step forward and lower until both knees bend about 90°. Alternate legs.',
      tips: ['Take a long step', 'Front knee stays above the ankle', 'Back knee hovers just off the floor', 'Push through the front heel to return'],
      anim: { dur: 800, frames: [STAND, LUNGE(P(127, 145), P(72, 143)), STAND, LUNGE(P(72, 143), P(127, 145))] },
    },
    {
      id: 'reverse-lunge', name: 'Reverse Lunge', cat: 'lower', unit: 'reps', sets: 3, reps: 10, equip: '',
      regions: { glutes: 1, quads: 0.8, hamstrings: 0.5, adductors: 0.3 },
      desc: 'Step back into a lunge. Easier on the knees than a forward lunge.',
      tips: ['Step straight back', 'Keep weight in the front heel', 'Torso upright', 'Drive up through the front leg'],
      anim: { dur: 800, frames: [STAND, LUNGE(P(127, 145), P(72, 143)), STAND, LUNGE(P(72, 143), P(127, 145))] },
    },
    {
      id: 'curtsy-lunge', name: 'Curtsy Lunge', cat: 'lower', unit: 'reps', sets: 3, reps: 10, equip: '',
      regions: { glutes: 1, adductors: 0.8, quads: 0.7 },
      desc: 'Cross one leg behind the other like a curtsy to target the side glutes.',
      tips: ['Step back and across', 'Hips stay square to the front', 'Lower with control', 'Alternate sides'],
      anim: { dur: 800, frames: [STAND, LUNGE(P(124, 145), P(76, 143)), STAND, LUNGE(P(76, 143), P(124, 145))] },
    },
    {
      id: 'glute-bridge', name: 'Glute Bridge', cat: 'lower', unit: 'reps', sets: 3, reps: 15, equip: 'Mat',
      regions: { glutes: 1, hamstrings: 0.6, lowerBack: 0.3, abs: 0.2 },
      desc: 'Lie on your back and lift your hips to build strong glutes.',
      tips: ['Feet flat, hip-width, close to your hips', 'Drive through your heels', 'Squeeze glutes hard at the top', 'Don’t arch your lower back'],
      anim: { dur: 900, frames: [LIE(-92, [P(130, 145)], [A(88, 88)]), pose([100, 115], -59, [P(130, 145)], [A(88, 88)])] },
    },
    {
      id: 'single-leg-bridge', name: 'Single-Leg Glute Bridge', cat: 'lower', unit: 'reps', sets: 3, reps: 10, equip: 'Mat',
      regions: { glutes: 1, hamstrings: 0.7, abs: 0.3 },
      desc: 'A tougher bridge on one leg. Do equal reps on each side.',
      tips: ['Extend one leg straight', 'Keep hips level, no tilting', 'Pause at the top', 'Switch sides each set'],
      anim: { dur: 900, frames: [LIE(-92, [P(160, 122), P(126, 145)], [A(88, 88)]), pose([100, 115], -59, [P(154, 83), P(126, 145)], [A(88, 88)])] },
    },
    {
      id: 'hip-thrust', name: 'Hip Thrust', cat: 'lower', unit: 'reps', sets: 3, reps: 12, equip: 'Bench or couch',
      regions: { glutes: 1, hamstrings: 0.5, quads: 0.3 },
      desc: 'Shoulders on a bench, drive your hips up. The best glute builder there is.',
      tips: ['Upper back on the bench edge', 'Chin tucked, ribs down', 'Shins vertical at the top', 'Hold the squeeze for a second'],
      anim: {
        dur: 900, props: [{ type: 'box', x: 18, y: 112, w: 40, h: 33 }],
        frames: [pose([92, 138], -125, BENT_KNEES, [A(100, 100)]), pose([96, 112], -90, BENT_KNEES, [A(100, 100)])],
      },
    },
    {
      id: 'calf-raise', name: 'Calf Raise', cat: 'lower', unit: 'reps', sets: 3, reps: 20, equip: '',
      regions: { calves: 1 },
      desc: 'Rise onto your toes, then lower slowly. Simple and effective.',
      tips: ['Lift as high as you can', 'Pause at the top', 'Lower slowly for 2–3 seconds', 'Hold a wall for balance if needed'],
      anim: { dur: 700, frames: [STAND, pose([100, 74], 180, [P(101, 137), P(97, 137)], HANG)] },
    },
    {
      id: 'wall-sit', name: 'Wall Sit', cat: 'lower', unit: 'secs', sets: 3, reps: 30, equip: 'Wall',
      regions: { quads: 1, glutes: 0.5, calves: 0.2 },
      desc: 'Hold a seated position against a wall. Your quads will feel this one.',
      tips: ['Back flat against the wall', 'Thighs parallel to the floor', 'Knees above ankles', 'Breathe steadily'],
      anim: {
        dur: 1600, props: [{ type: 'wall', x: 64 }],
        frames: [pose([74, 113], 180, [P(106, 145)], [A(40, 80)]), pose([74, 114], 180, [P(106, 145)], [A(40, 80)])],
      },
    },
    {
      id: 'step-up', name: 'Step-Up', cat: 'lower', unit: 'reps', sets: 3, reps: 10, equip: 'Box or step',
      regions: { quads: 1, glutes: 1, hamstrings: 0.3, calves: 0.3 },
      desc: 'Step up onto a sturdy box or stair, then step back down.',
      tips: ['Whole foot on the box', 'Drive through the top leg, not the bottom one', 'Stand all the way up', 'Lower with control'],
      anim: {
        dur: 750, props: [{ type: 'box', x: 112, y: 117, w: 44, h: 28 }],
        frames: [
          pose([88, 82], 180, [P(89, 145), P(87, 145)], HANG),
          pose([104, 88], 172, [P(128, 117), P(88, 145)], [A(-20, 10), A(20, 30)]),
          pose([128, 56], 180, [P(129, 117), P(125, 117)], HANG),
          pose([104, 88], 172, [P(128, 117), P(88, 145)], [A(-20, 10), A(20, 30)]),
        ],
      },
    },
    {
      id: 'bulgarian-split-squat', name: 'Bulgarian Split Squat', cat: 'lower', unit: 'reps', sets: 3, reps: 8, equip: 'Bench',
      regions: { quads: 1, glutes: 1, adductors: 0.4, hamstrings: 0.3 },
      desc: 'Rear foot on a bench, sink down on the front leg. Do equal reps each side.',
      tips: ['Front foot far enough forward', 'Lower straight down', 'Lean slightly forward for more glutes', 'Keep the front heel planted'],
      anim: {
        dur: 900, props: [{ type: 'box', x: 30, y: 112, w: 44, h: 33 }],
        frames: [pose([104, 84], 178, [P(124, 145), P(70, 112)], HANG), pose([100, 110], 176, [P(124, 145), P(70, 112)], HANG)],
      },
    },
    {
      id: 'single-leg-rdl', name: 'Single-Leg Deadlift', cat: 'lower', unit: 'reps', sets: 3, reps: 8, equip: '',
      regions: { hamstrings: 1, glutes: 1, lowerBack: 0.4, abs: 0.3 },
      desc: 'Hinge forward on one leg while the other reaches back. Builds balance too.',
      tips: ['Soft bend in the standing knee', 'Hips stay square to the floor', 'Back flat, body moves like a seesaw', 'Squeeze glute to stand'],
      anim: { dur: 1000, frames: [pose([100, 82], 180, FEET, [A(4, 2)]), pose([98, 86], 96, [P(102, 145), P(38, 92)], [A(0, 0)])] },
    },
    {
      id: 'donkey-kick', name: 'Donkey Kick', cat: 'lower', unit: 'reps', sets: 3, reps: 15, equip: 'Mat',
      regions: { glutes: 1, hamstrings: 0.4, abs: 0.2 },
      desc: 'On all fours, kick one bent leg up toward the ceiling.',
      tips: ['Hands under shoulders, knees under hips', 'Keep the knee bent at 90°', 'Push the heel up to the ceiling', 'Don’t arch your back'],
      anim: { dur: 700, frames: [QUAD, pose([78, 113], 107, [P(46, 82), P(51, 143)], [A(0, 0), A(-4, -2)])] },
    },
    {
      id: 'fire-hydrant', name: 'Fire Hydrant', cat: 'lower', unit: 'reps', sets: 3, reps: 15, equip: 'Mat',
      regions: { glutes: 1, adductors: 0.3, abs: 0.2 },
      desc: 'On all fours, lift a bent leg out to the side to target the outer glutes.',
      tips: ['Keep the knee bent', 'Lift to hip height', 'Don’t shift your weight', 'Move slowly'],
      anim: { dur: 700, frames: [QUAD, pose([78, 113], 107, [P(52, 116), P(51, 143)], [A(0, 0), A(-4, -2)])] },
    },
    {
      id: 'glute-kickback', name: 'Glute Kickback', cat: 'lower', unit: 'reps', sets: 3, reps: 12, equip: 'Mat',
      regions: { glutes: 1, hamstrings: 0.6 },
      desc: 'On all fours, extend one leg straight back and up.',
      tips: ['Reach long through the heel', 'Stop at hip height', 'Keep the core tight', 'Alternate or do all reps on one side'],
      anim: { dur: 700, frames: [QUAD, pose([78, 113], 107, [P(20, 96), P(51, 143)], [A(0, 0), A(-4, -2)])] },
    },
    {
      id: 'side-leg-lift', name: 'Side-Lying Leg Lift', cat: 'lower', unit: 'reps', sets: 3, reps: 15, equip: 'Mat',
      regions: { glutes: 1, obliques: 0.3, adductors: 0.3 },
      desc: 'Lie on your side and raise your top leg to work the outer hip.',
      tips: ['Stack your hips', 'Lead with the heel', 'Lift slowly, lower slower', 'Switch sides each set'],
      anim: { dur: 800, frames: [LIE(-90, [A(90, 90), A(91, 91)], [A(70, 100), A(-150, -30)]), LIE(-90, [A(125, 125), A(91, 91)], [A(70, 100), A(-150, -30)])] },
    },

    // ───────── Upper body ─────────
    {
      id: 'push-up', name: 'Push-Up', cat: 'upper', unit: 'reps', sets: 3, reps: 8, equip: '',
      regions: { chest: 1, triceps: 0.8, shoulders: 0.6, abs: 0.4 },
      desc: 'The classic upper-body move. Lower your chest to the floor and press away.',
      tips: ['Hands slightly wider than shoulders', 'Body in one straight line', 'Elbows angle back about 45°', 'Chest nearly touches the floor'],
      anim: { dur: 850, frames: [PU_TOP, PU_BOT] },
    },
    {
      id: 'knee-push-up', name: 'Knee Push-Up', cat: 'upper', unit: 'reps', sets: 3, reps: 10, equip: 'Mat',
      regions: { chest: 1, triceps: 0.7, shoulders: 0.5, abs: 0.3 },
      desc: 'A push-up from your knees. A great way to build up to full push-ups.',
      tips: ['Straight line from knees to head', 'Hands under shoulders', 'Lower with control', 'Squeeze glutes'],
      anim: {
        dur: 850, frames: [
          pose([86.2, 126.1], 125, [P(42, 122), P(46, 122)], [P(126, 145), P(122, 145)]),
          pose([90, 132], 106, [P(44, 120), P(48, 120)], [P(126, 145), P(122, 145)]),
        ],
      },
    },
    {
      id: 'diamond-push-up', name: 'Diamond Push-Up', cat: 'upper', unit: 'reps', sets: 3, reps: 6, equip: '',
      regions: { triceps: 1, chest: 0.7, shoulders: 0.5 },
      desc: 'Hands close together under your chest to focus on the triceps.',
      tips: ['Thumbs and index fingers form a diamond', 'Elbows stay close to the body', 'Body straight', 'Drop to knees if needed'],
      anim: { dur: 850, frames: [PU_TOP, PU_BOT] },
    },
    {
      id: 'pike-push-up', name: 'Pike Push-Up', cat: 'upper', unit: 'reps', sets: 3, reps: 8, equip: '',
      regions: { shoulders: 1, triceps: 0.7, upperBack: 0.3 },
      desc: 'Hips high in an upside-down V, lower your head toward the floor.',
      tips: ['Hips stacked high', 'Head moves forward of the hands', 'Elbows point back', 'Push the floor away'],
      anim: {
        dur: 900, frames: [
          pose([94, 92], 69, [P(60, 145), P(63, 145)], [P(145, 145), P(141, 145)]),
          pose([94, 92], 50, [P(60, 145), P(63, 145)], [P(145, 145), P(141, 145)]),
        ],
      },
    },
    {
      id: 'bench-dip', name: 'Tricep Dip', cat: 'upper', unit: 'reps', sets: 3, reps: 10, equip: 'Bench or chair',
      regions: { triceps: 1, shoulders: 0.5, chest: 0.3 },
      desc: 'Hands on a bench behind you, bend your elbows to lower and press up.',
      tips: ['Fingers face forward', 'Hips stay close to the bench', 'Elbows bend straight back', 'Lower to about 90°'],
      anim: {
        dur: 850, props: [{ type: 'box', x: 28, y: 110, w: 54, h: 35 }],
        frames: [pose([86, 110], 186, [P(138, 145)], [P(80, 110)]), pose([86, 136], 184, [P(138, 145)], [P(80, 110)])],
      },
    },
    {
      id: 'parallel-dip', name: 'Parallel Bar Dip', cat: 'upper', unit: 'reps', sets: 3, reps: 6, equip: 'Dip bars',
      regions: { triceps: 1, chest: 0.8, shoulders: 0.6 },
      desc: 'Support yourself on parallel bars and lower your body by bending the elbows.',
      tips: ['Start with arms locked out', 'Lean slightly forward', 'Lower until elbows reach 90°', 'Use a band for assistance'],
      anim: {
        dur: 900, ground: false, props: [{ type: 'pbar', y: 74, x1: 82, x2: 130 }],
        frames: [pose([100, 72], 180, [P(86, 126), P(82, 124)], [P(103, 72)]), pose([100, 96], 168, [P(86, 148), P(82, 146)], [P(103, 72)])],
      },
    },
    {
      id: 'pull-up', name: 'Pull-Up', cat: 'upper', unit: 'reps', sets: 3, reps: 5, equip: 'Pull-up bar',
      regions: { upperBack: 1, biceps: 0.7, forearms: 0.5, shoulders: 0.3 },
      desc: 'Hang from a bar and pull your chin over it. Use a band if needed.',
      tips: ['Start from a full hang', 'Pull elbows down toward your ribs', 'Chin over the bar', 'Lower slowly'],
      anim: {
        dur: 1000, ground: false, props: [{ type: 'bar', y: 16 }],
        frames: [pose([100, 106], 180, [P(90, 158), P(86, 156)], [P(102, 16), P(98, 16)]), pose([100, 74], 180, [P(90, 126), P(86, 124)], [P(102, 16), P(98, 16)])],
      },
    },
    {
      id: 'superman', name: 'Superman', cat: 'upper', unit: 'reps', sets: 3, reps: 12, equip: 'Mat',
      regions: { lowerBack: 1, upperBack: 0.6, glutes: 0.5, hamstrings: 0.3 },
      desc: 'Lie face down and lift your arms, chest and legs off the floor.',
      tips: ['Reach long through fingers and toes', 'Look at the floor, neck neutral', 'Squeeze glutes', 'Hold for a second at the top'],
      anim: {
        dur: 900, frames: [
          pose([90, 137], 90, [P(27, 138), P(30, 139)], [A(90, 90)]),
          pose([90, 138], 104, [P(29, 124), P(32, 126)], [A(104, 104)]),
        ],
      },
    },

    // ───────── Core ─────────
    {
      id: 'plank', name: 'Plank', cat: 'core', unit: 'secs', sets: 3, reps: 30, equip: 'Mat',
      regions: { abs: 1, obliques: 0.5, shoulders: 0.4, glutes: 0.3, lowerBack: 0.3 },
      desc: 'Hold a straight line from head to heels on your forearms.',
      tips: ['Elbows under shoulders', 'Squeeze glutes and brace your abs', 'Hips level, not sagging or piked', 'Breathe!'],
      anim: {
        dur: 1800, frames: [
          pose([101.8, 131.1], 103, [P(40, 145), P(43, 145)], [A(0, 90), A(-3, 88)]),
          pose([101.8, 129.6], 103, [P(40, 145), P(43, 145)], [A(0, 90), A(-3, 88)]),
        ],
      },
    },
    {
      id: 'side-plank', name: 'Side Plank', cat: 'core', unit: 'secs', sets: 2, reps: 20, equip: 'Mat',
      regions: { obliques: 1, abs: 0.5, shoulders: 0.4, glutes: 0.3 },
      desc: 'Balance on one forearm with your body stacked sideways. Do both sides.',
      tips: ['Elbow under shoulder', 'Stack feet or stagger them', 'Lift hips high', 'Top arm reaches up'],
      anim: {
        dur: 1800, frames: [
          pose([101.8, 131.1], 103, [P(40, 145), P(43, 141)], [A(0, 90), A(185, 185)]),
          pose([101.8, 129.1], 103, [P(40, 145), P(43, 141)], [A(0, 90), A(180, 180)]),
        ],
      },
    },
    {
      id: 'crunch', name: 'Crunch', cat: 'core', unit: 'reps', sets: 3, reps: 15, equip: 'Mat',
      regions: { abs: 1, obliques: 0.3 },
      desc: 'Curl your shoulders off the floor using your abs.',
      tips: ['Lower back stays on the floor', 'Don’t pull on your neck', 'Exhale as you curl up', 'Slow and controlled'],
      anim: { dur: 800, frames: [LIE(-92, BENT_KNEES, [A(80, 88)]), LIE(-118, BENT_KNEES, [A(70, 75)])] },
    },
    {
      id: 'sit-up', name: 'Sit-Up', cat: 'core', unit: 'reps', sets: 3, reps: 12, equip: 'Mat',
      regions: { abs: 1, obliques: 0.4 },
      desc: 'Roll all the way up from lying to sitting, then back down.',
      tips: ['Feet anchored or flat', 'Roll up one vertebra at a time', 'Lower slowly', 'Arms forward if you need help'],
      anim: { dur: 1000, frames: [LIE(-92, BENT_KNEES, [A(80, 88)]), LIE(168, BENT_KNEES, [A(110, 110)])] },
    },
    {
      id: 'leg-raise', name: 'Lying Leg Raise', cat: 'core', unit: 'reps', sets: 3, reps: 12, equip: 'Mat',
      regions: { abs: 1 },
      desc: 'Lying on your back, raise straight legs up to vertical and lower slowly.',
      tips: ['Lower back pressed into the floor', 'Legs as straight as you can', 'Lower slowly, don’t drop', 'Hands under hips for support'],
      anim: { dur: 1000, frames: [LIE(-90, [A(90, 90), A(91, 91)], [A(88, 88)]), LIE(-90, [A(178, 178), A(176, 176)], [A(88, 88)])] },
    },
    {
      id: 'flutter-kicks', name: 'Flutter Kicks', cat: 'core', unit: 'secs', sets: 3, reps: 30, equip: 'Mat',
      regions: { abs: 1 },
      desc: 'Small, quick alternating kicks with straight legs just off the floor.',
      tips: ['Shoulders slightly lifted', 'Low back flat', 'Small, fast kicks', 'Point your toes'],
      anim: { dur: 260, frames: [LIE(-100, [A(100, 100), A(108, 108)], [A(88, 88)]), LIE(-100, [A(108, 108), A(100, 100)], [A(88, 88)])] },
    },
    {
      id: 'bicycle-crunch', name: 'Bicycle Crunch', cat: 'core', unit: 'reps', sets: 3, reps: 20, equip: 'Mat',
      regions: { obliques: 1, abs: 0.8 },
      desc: 'Bring opposite elbow to knee while the other leg extends. Like pedaling a bike.',
      tips: ['Hands lightly behind your head', 'Rotate your shoulder, not just your elbow', 'Fully extend the straight leg', 'Count each side as one rep'],
      anim: {
        dur: 600, frames: [
          pose([100, 138], -120, [P(118, 116), P(158, 124)], [A(150, 120)]),
          pose([100, 138], -125, [P(158, 124), P(118, 116)], [A(150, 120)]),
        ],
      },
    },
    {
      id: 'mountain-climbers', name: 'Mountain Climbers', cat: 'core', unit: 'secs', sets: 3, reps: 30, equip: '',
      regions: { abs: 1, shoulders: 0.5, quads: 0.4, obliques: 0.3 },
      desc: 'From a high plank, drive your knees toward your chest, one at a time, quickly.',
      tips: ['Hands under shoulders', 'Hips stay low', 'Drive knees fast', 'Keep breathing'],
      anim: { dur: 330, frames: [{ ...PU_TOP, legs: [P(108, 138), P(40, 145)] }, { ...PU_TOP, legs: [P(40, 145), P(108, 138)] }] },
    },
    {
      id: 'hollow-hold', name: 'Hollow Hold', cat: 'core', unit: 'secs', sets: 3, reps: 20, equip: 'Mat',
      regions: { abs: 1, obliques: 0.3 },
      desc: 'Lift your arms, shoulders and legs off the floor and hold a banana shape.',
      tips: ['Low back glued to the floor', 'Arms by your ears', 'Bend knees to make it easier', 'Hold, don’t rock'],
      anim: {
        dur: 1600, frames: [
          LIE(-112, [A(103, 103), A(104, 104)], [A(-112, -112), A(-114, -114)]),
          LIE(-110, [A(101, 101), A(102, 102)], [A(-110, -110), A(-112, -112)]),
        ],
      },
    },
    {
      id: 'dead-bug', name: 'Dead Bug', cat: 'core', unit: 'reps', sets: 3, reps: 12, equip: 'Mat',
      regions: { abs: 1, obliques: 0.3 },
      desc: 'On your back, extend opposite arm and leg while keeping your core braced.',
      tips: ['Start in tabletop, arms up', 'Low back stays pressed down', 'Move slowly', 'Exhale as you extend'],
      anim: {
        dur: 900, frames: [
          LIE(-90, [P(131, 109), A(98, 98)], [A(180, 180), A(-100, -100)]),
          LIE(-90, [A(98, 98), P(131, 109)], [A(-100, -100), A(180, 180)]),
        ],
      },
    },
    {
      id: 'bird-dog', name: 'Bird Dog', cat: 'core', unit: 'reps', sets: 3, reps: 12, equip: 'Mat',
      regions: { lowerBack: 1, abs: 0.6, glutes: 0.6, shoulders: 0.3 },
      desc: 'On all fours, reach one arm forward and the opposite leg back.',
      tips: ['Back flat like a tabletop', 'Reach long, don’t lift high', 'Hips stay square', 'Pause, then switch'],
      anim: {
        dur: 900, frames: [
          QUAD, pose([78, 113], 107, [P(47, 143), P(17, 104)], [A(92, 92), A(-4, -2)]),
          QUAD, pose([78, 113], 107, [P(17, 104), P(51, 143)], [A(0, 0), A(92, 92)]),
        ],
      },
    },
    {
      id: 'v-up', name: 'V-Up', cat: 'core', unit: 'reps', sets: 3, reps: 10, equip: 'Mat',
      regions: { abs: 1, obliques: 0.3 },
      desc: 'Lift your arms and legs at the same time to meet in a V.',
      tips: ['Start long and flat', 'Lift legs and torso together', 'Reach for your toes', 'Lower with control'],
      anim: {
        dur: 900, frames: [
          LIE(-90, [A(90, 90), A(91, 91)], [A(-90, -90), A(-91, -91)]),
          LIE(-140, [A(140, 140), A(141, 141)], [A(140, 140), A(139, 139)]),
        ],
      },
    },

    // ───────── Cardio ─────────
    {
      id: 'jumping-jacks', name: 'Jumping Jacks', cat: 'cardio', unit: 'reps', sets: 3, reps: 30, equip: '',
      regions: { calves: 0.6, shoulders: 0.5, quads: 0.4, adductors: 0.4, glutes: 0.3 },
      desc: 'Jump your feet out while raising your arms overhead, then back in.',
      tips: ['Land softly on the balls of your feet', 'Arms fully overhead', 'Find a steady rhythm', 'Step it out for low impact'],
      anim: {
        front: true, dur: 380, frames: [
          pose([100, 82], 180, [P(104, 145, -1), P(96, 145, 1)], [A(8, 4), A(-8, -4)]),
          pose([100, 76], 180, [P(124, 137, -1), P(76, 137, 1)], [A(140, 165), A(-140, -165)]),
        ],
      },
    },
    {
      id: 'high-knees', name: 'High Knees', cat: 'cardio', unit: 'secs', sets: 3, reps: 30, equip: '',
      regions: { quads: 0.6, abs: 0.5, calves: 0.5, glutes: 0.3 },
      desc: 'Run in place, driving your knees up to hip height.',
      tips: ['Knees to hip height', 'Stay on the balls of your feet', 'Pump your arms', 'Stand tall'],
      anim: {
        dur: 300, frames: [
          pose([100, 80], 178, [P(128, 110), P(99, 143)], [A(-40, 30), A(40, 120)]),
          pose([100, 80], 178, [P(99, 143), P(128, 110)], [A(40, 120), A(-40, 30)]),
        ],
      },
    },
    {
      id: 'butt-kicks', name: 'Butt Kicks', cat: 'cardio', unit: 'secs', sets: 3, reps: 30, equip: '',
      regions: { hamstrings: 0.7, calves: 0.5, quads: 0.3 },
      desc: 'Jog in place, kicking your heels up toward your glutes.',
      tips: ['Heels toward glutes', 'Knees point down', 'Quick, light steps', 'Arms swing naturally'],
      anim: {
        dur: 300, frames: [
          pose([100, 80], 178, [P(86, 100), P(99, 143)], [A(-40, 30), A(40, 120)]),
          pose([100, 80], 178, [P(99, 143), P(86, 100)], [A(40, 120), A(-40, 30)]),
        ],
      },
    },
    {
      id: 'jump-rope', name: 'Jump Rope', cat: 'cardio', unit: 'secs', sets: 3, reps: 60, equip: 'Jump rope (or imaginary!)',
      regions: { calves: 1, shoulders: 0.3, forearms: 0.3, quads: 0.3 },
      desc: 'Small, quick hops. Works with or without a rope.',
      tips: ['Stay on the balls of your feet', 'Small jumps, an inch off the floor', 'Turn the rope with your wrists', 'Elbows close to your sides'],
      anim: { dur: 280, frames: [standArms([A(25, 70), A(-15, 60)]), pose([100, 75], 180, [P(101, 138), P(97, 138)], [A(25, 70), A(-15, 60)])] },
    },
    {
      id: 'burpee', name: 'Burpee', cat: 'cardio', unit: 'reps', sets: 3, reps: 8, equip: '',
      regions: { quads: 0.6, chest: 0.5, abs: 0.5, shoulders: 0.4, glutes: 0.4, calves: 0.3 },
      desc: 'Squat, jump back to plank, jump in, and leap up. A full-body workout in one move.',
      tips: ['Hands down, then jump feet back', 'Keep your plank strong', 'Jump feet to your hands', 'Explode up with arms overhead'],
      anim: {
        dur: 450, frames: [
          STAND,
          pose([89, 125], 122, FEET, [P(138, 145), P(134, 145)]),
          PU_TOP,
          pose([89, 125], 122, FEET, [P(138, 145), P(134, 145)]),
          pose([100, 64], 180, [P(100, 127), P(97, 127)], [A(172, 176)]),
        ],
      },
    },
    {
      id: 'arm-circles', name: 'Arm Circles', cat: 'cardio', unit: 'secs', sets: 2, reps: 30, equip: '',
      regions: { shoulders: 1 },
      desc: 'Arms out to the sides, make small circles. Switch direction halfway.',
      tips: ['Arms straight at shoulder height', 'Small, controlled circles', 'Shoulders down, away from ears', 'Reverse halfway through'],
      anim: {
        front: true, dur: 220, frames: [
          standArms([A(84, 84), A(-84, -84)]), standArms([A(90, 96), A(-90, -96)]),
          standArms([A(96, 90), A(-96, -90)]), standArms([A(90, 84), A(-90, -84)]),
        ],
      },
    },
    {
      id: 'jog', name: 'Jog', cat: 'cardio', unit: 'min', sets: 1, reps: 15, equip: '',
      regions: { calves: 0.8, quads: 0.7, hamstrings: 0.5, glutes: 0.5 },
      desc: 'An easy, conversational-pace run, outside or on a treadmill.',
      tips: ['Run at a pace where you can still talk', 'Land under your hips, not out in front', 'Relax your shoulders', 'Short, quick steps'],
      anim: {
        dur: 330, frames: [
          pose([100, 80], 175, [P(125, 135), P(78, 128)], [A(-50, 40), A(50, 120)]),
          pose([100, 80], 175, [P(78, 128), P(125, 135)], [A(50, 120), A(-50, 40)]),
        ],
      },
    },
    {
      id: 'walk', name: 'Brisk Walk', cat: 'cardio', unit: 'min', sets: 1, reps: 20, equip: '',
      regions: { calves: 0.6, glutes: 0.4, quads: 0.4, hamstrings: 0.3 },
      desc: 'A brisk walk, fast enough to raise your breathing.',
      tips: ['Walk tall', 'Swing your arms', 'Push off through your toes', 'Add hills for more challenge'],
      anim: {
        dur: 500, frames: [
          pose([100, 82], 180, [P(114, 145), P(86, 145)], [A(-20, -10), A(20, 30)]),
          pose([100, 82], 180, [P(86, 145), P(114, 145)], [A(20, 30), A(-20, -10)]),
        ],
      },
    },

    // ───────── Weights ─────────
    {
      id: 'bicep-curl', name: 'Dumbbell Curl', cat: 'weights', unit: 'reps', sets: 3, reps: 12, equip: 'Dumbbells',
      regions: { biceps: 1, forearms: 0.5 },
      desc: 'Curl the weights up toward your shoulders, keeping your elbows still.',
      tips: ['Elbows pinned to your sides', 'No swinging', 'Squeeze at the top', 'Lower slowly'],
      anim: { db: true, dur: 800, frames: [standArms([A(4, 2), A(-4, -2)]), standArms([A(4, 165), A(-4, 165)])] },
    },
    {
      id: 'hammer-curl', name: 'Hammer Curl', cat: 'weights', unit: 'reps', sets: 3, reps: 12, equip: 'Dumbbells',
      regions: { biceps: 1, forearms: 0.8 },
      desc: 'A curl with palms facing each other. Hits the arms and forearms.',
      tips: ['Palms face in the whole time', 'Elbows still', 'Control the way down', 'Alternate or do both together'],
      anim: { db: true, dur: 800, frames: [standArms([A(4, 2), A(-4, -2)]), standArms([A(4, 165), A(-4, 165)])] },
    },
    {
      id: 'shoulder-press', name: 'Shoulder Press', cat: 'weights', unit: 'reps', sets: 3, reps: 10, equip: 'Dumbbells',
      regions: { shoulders: 1, triceps: 0.6, upperBack: 0.2 },
      desc: 'Press the weights from your shoulders to straight overhead.',
      tips: ['Start with weights at ear height', 'Ribs down, don’t arch', 'Press straight up', 'Lower to ear height'],
      anim: { db: true, front: true, dur: 850, frames: [standArms([A(80, 175), A(-80, -175)]), standArms([A(160, 180), A(-160, -180)])] },
    },
    {
      id: 'lateral-raise', name: 'Lateral Raise', cat: 'weights', unit: 'reps', sets: 3, reps: 12, equip: 'Light dumbbells',
      regions: { shoulders: 1, upperBack: 0.2 },
      desc: 'Raise the weights out to the sides up to shoulder height. Great for shoulders.',
      tips: ['Slight bend in the elbows', 'Lead with your elbows', 'Stop at shoulder height', 'Go light, move slowly'],
      anim: { db: true, front: true, dur: 850, frames: [standArms([A(12, 10), A(-12, -10)]), standArms([A(88, 90), A(-88, -90)])] },
    },
    {
      id: 'front-raise', name: 'Front Raise', cat: 'weights', unit: 'reps', sets: 3, reps: 12, equip: 'Light dumbbells',
      regions: { shoulders: 1 },
      desc: 'Lift the weights straight in front of you to shoulder height.',
      tips: ['Arms nearly straight', 'Stop at shoulder height', 'Don’t lean back', 'Lower slowly'],
      anim: { db: true, dur: 850, frames: [standArms([A(4, 4)]), standArms([A(92, 92)])] },
    },
    {
      id: 'bent-over-row', name: 'Bent-Over Row', cat: 'weights', unit: 'reps', sets: 3, reps: 10, equip: 'Dumbbells',
      regions: { upperBack: 1, biceps: 0.5, lowerBack: 0.3, shoulders: 0.3 },
      desc: 'Hinge forward and row the weights toward your hips.',
      tips: ['Flat back, hinged at the hips', 'Pull elbows back past your ribs', 'Squeeze your shoulder blades together', 'Neck neutral'],
      anim: {
        db: true, dur: 850, frames: [
          pose([90, 86], 110, FEET, [A(0, 0), A(-3, -2)]),
          pose([90, 86], 110, FEET, [A(-75, 0), A(-78, -2)]),
        ],
      },
    },
    {
      id: 'goblet-squat', name: 'Goblet Squat', cat: 'weights', unit: 'reps', sets: 3, reps: 10, equip: 'Dumbbell or kettlebell',
      regions: { quads: 1, glutes: 1, abs: 0.4, adductors: 0.3 },
      desc: 'Hold a weight at your chest and squat deep.',
      tips: ['Weight held close to your chest', 'Elbows inside your knees at the bottom', 'Chest up', 'Drive through your heels'],
      anim: { db: true, dur: 950, frames: [{ ...SQUAT_TOP, arms: [A(15, 165)] }, { ...SQUAT_BOT, arms: [A(15, 165)] }] },
    },
    {
      id: 'db-rdl', name: 'Romanian Deadlift', cat: 'weights', unit: 'reps', sets: 3, reps: 10, equip: 'Dumbbells',
      regions: { hamstrings: 1, glutes: 1, lowerBack: 0.5 },
      desc: 'Hinge at the hips with soft knees and lower the weights along your legs.',
      tips: ['Push your hips back, not down', 'Weights stay close to your legs', 'Flat back', 'Feel the stretch, then squeeze up'],
      anim: { db: true, dur: 1000, frames: [standArms([A(4, 2)]), pose([88, 86], 105, FEET, [A(-2, -2)])] },
    },
    {
      id: 'deadlift', name: 'Deadlift', cat: 'weights', unit: 'reps', sets: 3, reps: 8, equip: 'Barbell',
      regions: { hamstrings: 1, glutes: 1, lowerBack: 0.8, upperBack: 0.5, quads: 0.5, forearms: 0.4 },
      desc: 'Lift a barbell from the floor to standing with a flat back.',
      tips: ['Bar over mid-foot', 'Brace before you pull', 'Push the floor away', 'Lock out with glutes, not your back'],
      anim: { bb: true, dur: 1000, frames: [pose([82, 108], 130, [P(104, 145), P(100, 145)], [A(0, 0), A(-2, 0)]), standArms([A(0, 0), A(-2, 0)])] },
    },
    {
      id: 'overhead-tricep', name: 'Overhead Tricep Extension', cat: 'weights', unit: 'reps', sets: 3, reps: 12, equip: 'Dumbbell',
      regions: { triceps: 1 },
      desc: 'Lower a weight behind your head and press it back up.',
      tips: ['Elbows point forward, close to your head', 'Only your forearms move', 'Full stretch at the bottom', 'Ribs down'],
      anim: { db: true, dur: 850, frames: [standArms([A(172, -20), A(168, -24)]), standArms([A(172, 178), A(168, 174)])] },
    },
    {
      id: 'kb-swing', name: 'Kettlebell Swing', cat: 'weights', unit: 'reps', sets: 3, reps: 15, equip: 'Kettlebell',
      regions: { glutes: 1, hamstrings: 0.8, lowerBack: 0.5, shoulders: 0.3, abs: 0.3 },
      desc: 'Hinge and snap your hips forward to swing the bell to chest height.',
      tips: ['It’s a hip hinge, not a squat', 'Snap your hips and squeeze glutes', 'Arms just guide the bell', 'Stand tall at the top'],
      anim: { db: true, dur: 650, frames: [pose([86, 90], 118, FEET, [A(-15, -15)]), standArms([A(90, 90)])] },
    },
    {
      id: 'farmer-carry', name: 'Farmer’s Carry', cat: 'weights', unit: 'secs', sets: 3, reps: 40, equip: 'Dumbbells',
      regions: { forearms: 1, upperBack: 0.6, abs: 0.5, shoulders: 0.3 },
      desc: 'Walk tall while holding heavy weights at your sides.',
      tips: ['Shoulders back and down', 'Stand tall, don’t lean', 'Short, steady steps', 'Grip hard'],
      anim: {
        db: true, dur: 500, frames: [
          pose([100, 82], 180, [P(112, 145), P(88, 145)], [A(-2, -2), A(2, 2)]),
          pose([100, 82], 180, [P(88, 145), P(112, 145)], [A(2, 2), A(-2, -2)]),
        ],
      },
    },
  ];

  // ═════════ Expanded library ═════════
  // gear: equipment it needs (see EQUIPMENT). opt: equipment that makes it harder but isn't required.
  const DB_SIDE = standArms([A(2, 2), A(-2, -2)]);
  const FSTAND = (arms) => pose([100, 82], 180, [P(104, 145, -1), P(96, 145, 1)], arms);
  const HIPS_F = [A(40, -40), A(-40, 40)];               // front view, hands on hips
  const CLASP_F = [A(30, -112), A(-30, 112)];            // front view, hands together at chest
  const BEHIND_HEAD = [A(120, -100), A(116, -104)];      // side view, hands behind head
  const BENCH = { type: 'box', x: 28, y: 112, w: 90, h: 33 };
  const ON_BENCH = (arms) => pose([86, 110], -90, [P(130, 145), P(126, 145)], arms);
  const SEAT = { type: 'box', x: 64, y: 115, w: 46, h: 30 };
  const SEATED = (arms, t = 180) => pose([88, 112], t, [P(128, 145), P(124, 145)], arms);
  const BACK_BAR = [A(-35, 150)];                         // bar resting on upper back
  const BRIDGE_DN = LIE(-92, [P(130, 145)], [A(88, 88)]);
  const BRIDGE_UP = pose([100, 115], -59, [P(130, 145)], [A(88, 88)]);
  const HINGE = (arms) => pose([88, 86], 108, FEET, arms);
  const RDL_DN = pose([86, 88], 106, FEET, [A(0, 0), A(-2, 0)]);
  const LUNGE_DN = LUNGE(P(127, 145), P(72, 143));
  const LUNGE_DN2 = LUNGE(P(72, 143), P(127, 145));
  const SPLIT_UP = pose([100, 88], 178, [P(127, 145), P(72, 143)], HANG);
  const INC_TOP = pose([101, 104], 131, [P(52, 145), P(55, 145)], [P(140, 115), P(136, 115)]);
  const INC_BOT = pose([105, 112], 122, [P(52, 145), P(55, 145)], [P(140, 115), P(136, 115)]);
  const FOLD = pose([94, 82], 32, FEET, [P(124, 145), P(120, 145)]);
  const PIKE = pose([94, 92], 69, [P(60, 145), P(63, 145)], [P(145, 145), P(141, 145)]);
  const FARM = (arms) => pose([101.8, 131.1], 103, [P(40, 145), P(43, 145)], arms);
  const PRONE = (t, legs, arms) => pose([80, 138], t, legs, arms);
  const HANG_BAR = pose([100, 106], 180, [P(90, 158), P(86, 156)], [P(102, 16), P(98, 16)]);
  const BEAR = (a, b) => pose([82, 107], 100, a, b);
  const SIT = (t, legs, arms) => pose([88, 138], t, legs, arms);

  window.EXERCISES.push(
    // ───────── Lower body · bodyweight ─────────
    {
      id: 'squat-pulse', name: 'Squat Pulse', cat: 'lower', unit: 'reps', sets: 3, reps: 20, gear: [],
      regions: { quads: 1, glutes: 1, hamstrings: 0.3 },
      desc: 'Stay low in a squat and pulse a few inches up and down. Big burn, no equipment.',
      tips: ['Sink to just above parallel', 'Small, controlled pulses', 'Weight in your heels', 'Keep chest lifted'],
      anim: { dur: 420, frames: [SQUAT_BOT, pose([82, 108], 148, FEET, [A(92, 92)])] },
    },
    {
      id: 'squat-hold', name: 'Squat Hold', cat: 'lower', unit: 'secs', sets: 3, reps: 30, gear: [],
      regions: { quads: 1, glutes: 0.8, adductors: 0.3 },
      desc: 'Sit at the bottom of a squat and hold it. A wall sit without the wall.',
      tips: ['Thighs near parallel', 'Arms out front for balance', 'Knees pushed out', 'Breathe slowly'],
      anim: { dur: 1600, frames: [SQUAT_BOT, { ...SQUAT_BOT, hip: [78, 117] }] },
    },
    {
      id: 'side-lunge', name: 'Side Lunge', cat: 'lower', unit: 'reps', sets: 3, reps: 10, gear: [],
      regions: { adductors: 1, glutes: 1, quads: 0.8, hamstrings: 0.3 },
      desc: 'Step wide to one side and sit back into that hip, other leg straight.',
      tips: ['Toes face forward', 'Sit back, not down', 'Straight leg stays long', 'Push off to return'],
      anim: {
        front: true, dur: 800, frames: [
          FSTAND(CLASP_F), pose([116, 106], 180, [P(146, 145, -1), P(66, 145, 1)], CLASP_F),
          FSTAND(CLASP_F), pose([84, 106], 180, [P(134, 145, -1), P(54, 145, 1)], CLASP_F),
        ],
      },
    },
    {
      id: 'cossack-squat', name: 'Cossack Squat', cat: 'lower', unit: 'reps', sets: 3, reps: 8, gear: [],
      regions: { adductors: 1, quads: 0.8, glutes: 0.8, hamstrings: 0.4 },
      desc: 'A deep side-to-side squat that builds strength and hip mobility together.',
      tips: ['Very wide stance', 'Shift all the way to one side', 'Straight-leg toes point up', 'Go only as deep as feels good'],
      anim: {
        front: true, dur: 1000, frames: [
          pose([118, 118], 180, [P(146, 145, -1), P(60, 145, 1)], [A(60, 110), A(-10, 90)]),
          pose([82, 118], 180, [P(140, 145, -1), P(54, 145, 1)], [A(10, -90), A(-60, -110)]),
        ],
      },
    },
    {
      id: 'split-squat', name: 'Split Squat', cat: 'lower', unit: 'reps', sets: 3, reps: 10, gear: [],
      regions: { quads: 1, glutes: 1, hamstrings: 0.4, adductors: 0.3 },
      desc: 'Stand in a long stride and lower straight down. Do equal reps each side.',
      tips: ['Feet stay planted the whole set', 'Drop the back knee straight down', 'Front shin fairly upright', 'Torso tall'],
      anim: { dur: 850, frames: [SPLIT_UP, LUNGE_DN] },
    },
    {
      id: 'walking-lunge', name: 'Walking Lunge', cat: 'lower', unit: 'reps', sets: 3, reps: 12, gear: [],
      regions: { quads: 1, glutes: 1, hamstrings: 0.5, adductors: 0.3, calves: 0.3 },
      desc: 'Lunge forward, bring the back foot through, and keep travelling.',
      tips: ['Long, steady steps', 'Back knee hovers low', 'Stay tall through the middle', 'Count each leg as one rep'],
      anim: { dur: 750, frames: [LUNGE_DN, STAND, LUNGE_DN2, STAND] },
    },
    {
      id: 'jumping-lunge', name: 'Jumping Lunge', cat: 'lower', unit: 'reps', sets: 3, reps: 10, gear: [],
      regions: { quads: 1, glutes: 1, calves: 0.6, hamstrings: 0.4 },
      desc: 'Explode up from a lunge and switch legs in the air.',
      tips: ['Start in a solid lunge', 'Drive up with both legs', 'Switch quickly', 'Land softly and sink straight in'],
      anim: {
        dur: 420, frames: [
          LUNGE_DN, pose([100, 72], 180, [P(110, 132), P(90, 132)], [A(60, 90), A(-40, -20)]),
          LUNGE_DN2, pose([100, 72], 180, [P(90, 132), P(110, 132)], [A(-40, -20), A(60, 90)]),
        ],
      },
    },
    {
      id: 'single-leg-calf-raise', name: 'Single-Leg Calf Raise', cat: 'lower', unit: 'reps', sets: 3, reps: 12, gear: [], opt: ['box'],
      regions: { calves: 1 },
      desc: 'A calf raise on one foot. Stand on a step edge for a bigger stretch.',
      tips: ['Hold something for balance', 'All the way up onto the big toe', 'Slow lower', 'Switch sides'],
      anim: { dur: 700, frames: [standArms([A(60, 90)]), pose([100, 74], 180, [P(101, 137), A(-10, -70)], [A(60, 90)])].map((f, i) => i ? f : { ...f, legs: [P(101, 145), A(-10, -70)] }) },
    },
    {
      id: 'frog-pump', name: 'Frog Pump', cat: 'lower', unit: 'reps', sets: 3, reps: 20, gear: ['mat'],
      regions: { glutes: 1, adductors: 0.4 },
      desc: 'A glute bridge with the soles of your feet together and knees open wide.',
      tips: ['Soles together, knees out', 'Feet close to your hips', 'Quick pumps, big squeeze', 'Ribs stay down'],
      anim: { dur: 520, frames: [LIE(-92, [P(122, 145)], [A(88, 88)]), pose([100, 120], -64, [P(122, 145)], [A(88, 88)])] },
    },
    {
      id: 'marching-bridge', name: 'Marching Bridge', cat: 'lower', unit: 'reps', sets: 3, reps: 16, gear: ['mat'],
      regions: { glutes: 1, hamstrings: 0.6, abs: 0.5 },
      desc: 'Hold a bridge at the top and march one knee up at a time.',
      tips: ['Hips stay high and level', 'Lift the knee slowly', 'Don’t let the hips drop or twist', 'Breathe out as you lift'],
      anim: {
        dur: 650, frames: [
          { ...BRIDGE_UP, legs: [P(130, 145), P(126, 145)] }, { ...BRIDGE_UP, legs: [A(150, 70), P(126, 145)] },
          { ...BRIDGE_UP, legs: [P(130, 145), P(126, 145)] }, { ...BRIDGE_UP, legs: [P(130, 145), A(150, 70)] },
        ],
      },
    },
    {
      id: 'glute-bridge-hold', name: 'Glute Bridge Hold', cat: 'lower', unit: 'secs', sets: 3, reps: 30, gear: ['mat'],
      regions: { glutes: 1, hamstrings: 0.5, abs: 0.3 },
      desc: 'Lift into a bridge and hold the squeeze at the top.',
      tips: ['Drive through your heels', 'Squeeze the whole time', 'Straight line knees to shoulders', 'Breathe steadily'],
      anim: { dur: 1600, frames: [BRIDGE_UP, { ...BRIDGE_UP, hip: [100, 117] }] },
    },
    {
      id: 'clamshell', name: 'Clamshell', cat: 'lower', unit: 'reps', sets: 3, reps: 15, gear: ['mat'], opt: ['band'],
      regions: { glutes: 1, adductors: 0.2 },
      desc: 'Lie on your side, knees bent, and open your top knee like a clam. Targets the side glutes.',
      tips: ['Feet stay together', 'Hips stacked, don’t roll back', 'Open slow, close slower', 'Add a mini band to make it harder'],
      anim: {
        loop: 'knees', dur: 800, frames: [
          LIE(-90, [A(140, 60), A(141, 61)], [A(70, 100), A(-150, -30)]),
          LIE(-90, [A(170, 70), A(141, 61)], [A(70, 100), A(-150, -30)]),
        ],
      },
    },
    {
      id: 'standing-kickback', name: 'Standing Glute Kickback', cat: 'lower', unit: 'reps', sets: 3, reps: 15, gear: [],
      regions: { glutes: 1, hamstrings: 0.5 },
      desc: 'Stand tall, hold something for balance, and sweep one leg straight back.',
      tips: ['Squeeze the glute, don’t swing', 'Small lean forward is fine', 'No arching the lower back', 'Switch sides'],
      anim: {
        dur: 750, props: [{ type: 'wall', x: 150 }], frames: [
          pose([100, 82], 176, FEET, [P(148, 70), P(146, 72)]),
          pose([100, 84], 164, [P(101, 145), A(-40, -35)], [P(148, 70), P(146, 72)]),
        ],
      },
    },
    {
      id: 'standing-abduction', name: 'Standing Leg Lift', cat: 'lower', unit: 'reps', sets: 3, reps: 15, gear: [], opt: ['band'],
      regions: { glutes: 1, obliques: 0.3, adductors: 0.2 },
      desc: 'Stand tall and lift one straight leg out to the side.',
      tips: ['Toes point forward', 'Lift from the hip, not by leaning', 'Control it down', 'Switch sides'],
      anim: { front: true, dur: 700, frames: [FSTAND(HIPS_F), pose([98, 82], 184, [A(36, 36), P(96, 145, 1)], HIPS_F)] },
    },
    {
      id: 'good-morning', name: 'Good Morning', cat: 'lower', unit: 'reps', sets: 3, reps: 12, gear: [], opt: ['barbell'],
      regions: { hamstrings: 1, glutes: 0.8, lowerBack: 0.7 },
      desc: 'Hands behind your head, hinge forward with a flat back, then stand up.',
      tips: ['Soft knees', 'Push your hips straight back', 'Back stays flat', 'Stop when you feel the hamstrings stretch'],
      anim: { dur: 1000, frames: [standArms(BEHIND_HEAD), HINGE([A(48, -172), A(44, -176)])] },
    },
    {
      id: 'box-jump', name: 'Box Jump', cat: 'lower', unit: 'reps', sets: 3, reps: 8, gear: ['box'],
      regions: { quads: 1, glutes: 1, calves: 0.7, hamstrings: 0.4 },
      desc: 'Jump from the floor onto a sturdy box and land softly in a squat.',
      tips: ['Start with a low box', 'Swing your arms', 'Land with soft knees, whole foot on the box', 'Step down, don’t jump down'],
      anim: {
        dur: 520, props: [{ type: 'box', x: 120, y: 115, w: 44, h: 30 }], frames: [
          pose([80, 82], 180, [P(81, 145), P(77, 145)], HANG),
          pose([72, 108], 140, [P(81, 145), P(77, 145)], [A(-50, -40)]),
          pose([108, 72], 176, [P(120, 118), P(116, 118)], [A(160, 170)]),
          pose([138, 74], 165, [P(144, 115), P(140, 115)], [A(80, 90)]),
        ],
      },
    },

    // ───────── Lower body · bands ─────────
    {
      id: 'lateral-band-walk', name: 'Lateral Band Walk', cat: 'lower', unit: 'reps', sets: 3, reps: 12, gear: ['band'],
      regions: { glutes: 1, quads: 0.4, adductors: 0.2 },
      desc: 'Mini band above your knees, sit into a half squat and step side to side.',
      tips: ['Stay low the whole time', 'Push knees out against the band', 'Feet never touch', 'Count steps each way'],
      anim: {
        front: true, loop: 'knees', dur: 600, frames: [
          pose([100, 94], 180, [P(122, 145, -1), P(78, 145, 1)], HIPS_F),
          pose([100, 92], 180, [P(112, 145, -1), P(88, 145, 1)], HIPS_F),
        ],
      },
    },
    {
      id: 'monster-walk', name: 'Monster Walk', cat: 'lower', unit: 'reps', sets: 3, reps: 12, gear: ['band'],
      regions: { glutes: 1, quads: 0.5 },
      desc: 'With a band around your knees, take wide diagonal steps forward in a half squat.',
      tips: ['Half-squat posture', 'Step forward and out', 'Keep tension on the band', 'Go slow and controlled'],
      anim: {
        loop: 'knees', dur: 600, frames: [
          pose([98, 94], 172, [P(118, 145), P(84, 145)], [A(-20, 30), A(20, 50)]),
          pose([98, 94], 172, [P(84, 145), P(118, 145)], [A(20, 50), A(-20, 30)]),
        ],
      },
    },
    {
      id: 'banded-squat', name: 'Banded Squat', cat: 'lower', unit: 'reps', sets: 3, reps: 15, gear: ['band'],
      regions: { quads: 1, glutes: 1, adductors: 0.3 },
      desc: 'A squat with a mini band above your knees to fire up the glutes.',
      tips: ['Push knees out into the band', 'Sit back and down', 'Heels stay down', 'Squeeze glutes at the top'],
      anim: { loop: 'knees', dur: 900, frames: [SQUAT_TOP, SQUAT_BOT] },
    },
    {
      id: 'banded-bridge', name: 'Banded Glute Bridge', cat: 'lower', unit: 'reps', sets: 3, reps: 15, gear: ['band', 'mat'],
      regions: { glutes: 1, hamstrings: 0.5 },
      desc: 'A glute bridge with a band above your knees. Press out at the top.',
      tips: ['Knees push out against the band', 'Drive through heels', 'Pause and squeeze', 'Lower slowly'],
      anim: { loop: 'knees', dur: 900, frames: [BRIDGE_DN, BRIDGE_UP] },
    },
    {
      id: 'band-kickback', name: 'Banded Kickback', cat: 'lower', unit: 'reps', sets: 3, reps: 15, gear: ['band', 'mat'],
      regions: { glutes: 1, hamstrings: 0.6 },
      desc: 'On all fours, loop a band around your foot and hands, then kick back against it.',
      tips: ['Band under your hands, around the working foot', 'Push the heel back and up', 'Don’t arch your back', 'Switch sides'],
      anim: { band: 'feet', dur: 750, frames: [QUAD, pose([78, 113], 107, [P(20, 96), P(51, 143)], [A(0, 0), A(-4, -2)])] },
    },
    {
      id: 'band-rdl', name: 'Banded Deadlift', cat: 'lower', unit: 'reps', sets: 3, reps: 12, gear: ['band'],
      regions: { hamstrings: 1, glutes: 1, lowerBack: 0.5 },
      desc: 'Stand on a band, hold the ends and hinge, then drive your hips forward to stand.',
      tips: ['Hips back, flat back', 'Hands stay close to your legs', 'Snap hips forward at the top', 'Tension the whole time'],
      anim: { band: 'feet', dur: 1000, frames: [standArms([A(4, 2)]), RDL_DN] },
    },

    // ───────── Lower body · dumbbells / kettlebell ─────────
    {
      id: 'db-squat', name: 'Dumbbell Squat', cat: 'lower', unit: 'reps', sets: 3, reps: 12, gear: ['dumbbell'],
      regions: { quads: 1, glutes: 1, hamstrings: 0.4, forearms: 0.3 },
      desc: 'A squat holding a dumbbell in each hand at your sides.',
      tips: ['Arms hang straight', 'Sit back and down', 'Chest up', 'Drive through the whole foot'],
      anim: { db: true, dur: 950, frames: [DB_SIDE, { ...SQUAT_BOT, arms: [A(8, 4), A(4, 0)] }] },
    },
    {
      id: 'db-lunge', name: 'Dumbbell Lunge', cat: 'lower', unit: 'reps', sets: 3, reps: 10, gear: ['dumbbell'],
      regions: { quads: 1, glutes: 1, hamstrings: 0.5, forearms: 0.3 },
      desc: 'Reverse lunges holding dumbbells at your sides.',
      tips: ['Step back long', 'Front knee over the ankle', 'Weights hang still', 'Alternate legs'],
      anim: { db: true, dur: 850, frames: [DB_SIDE, { ...LUNGE_DN, arms: [A(2, 2), A(-2, -2)] }, DB_SIDE, { ...LUNGE_DN2, arms: [A(2, 2), A(-2, -2)] }] },
    },
    {
      id: 'db-sumo-squat', name: 'Dumbbell Sumo Squat', cat: 'lower', unit: 'reps', sets: 3, reps: 12, gear: ['dumbbell'], opt: ['kettlebell'],
      regions: { adductors: 1, glutes: 1, quads: 0.7 },
      desc: 'A wide squat holding one dumbbell between your legs.',
      tips: ['Wide stance, toes out', 'Weight hangs straight down', 'Knees track over toes', 'Squeeze at the top'],
      anim: {
        front: true, db: true, dur: 950, frames: [
          pose([100, 84], 180, [P(122, 145, -1), P(78, 145, 1)], [A(14, -10), A(-14, 10)]),
          pose([100, 110], 180, [P(122, 145, -1), P(78, 145, 1)], [A(14, -10), A(-14, 10)]),
        ],
      },
    },
    {
      id: 'db-hip-thrust', name: 'Dumbbell Hip Thrust', cat: 'lower', unit: 'reps', sets: 3, reps: 12, gear: ['dumbbell', 'bench'], opt: ['barbell'],
      regions: { glutes: 1, hamstrings: 0.5, quads: 0.3 },
      desc: 'Hip thrusts with a dumbbell resting across your hips.',
      tips: ['Hold the weight on your hip bones', 'Chin tucked', 'Shins vertical at the top', 'Pause and squeeze'],
      anim: {
        db: 'near', dur: 900, props: [{ type: 'box', x: 18, y: 112, w: 40, h: 33 }],
        frames: [pose([92, 138], -125, BENT_KNEES, [A(118, 30)]), pose([96, 112], -90, BENT_KNEES, [A(142, 30)])],
      },
    },
    {
      id: 'db-step-up', name: 'Dumbbell Step-Up', cat: 'lower', unit: 'reps', sets: 3, reps: 10, gear: ['dumbbell', 'box'],
      regions: { quads: 1, glutes: 1, hamstrings: 0.3, forearms: 0.3 },
      desc: 'Step-ups holding a dumbbell in each hand.',
      tips: ['Whole foot on the box', 'Lean slightly forward', 'Stand all the way up', 'Lower slowly'],
      anim: {
        db: true, dur: 800, props: [{ type: 'box', x: 112, y: 117, w: 44, h: 28 }],
        frames: [
          pose([88, 82], 180, [P(89, 145), P(87, 145)], [A(2, 2), A(-2, -2)]),
          pose([104, 88], 172, [P(128, 117), P(88, 145)], [A(2, 2), A(-2, -2)]),
          pose([128, 56], 180, [P(129, 117), P(125, 117)], [A(2, 2), A(-2, -2)]),
          pose([104, 88], 172, [P(128, 117), P(88, 145)], [A(2, 2), A(-2, -2)]),
        ],
      },
    },
    {
      id: 'db-bulgarian', name: 'Dumbbell Bulgarian Split Squat', cat: 'lower', unit: 'reps', sets: 3, reps: 8, gear: ['dumbbell', 'bench'],
      regions: { quads: 1, glutes: 1, adductors: 0.4, hamstrings: 0.3 },
      desc: 'Rear foot up on a bench and a dumbbell in each hand. One of the toughest leg builders.',
      tips: ['Find your stance before adding weight', 'Lower straight down', 'Front heel stays planted', 'Equal reps each side'],
      anim: {
        db: true, dur: 950, props: [{ type: 'box', x: 30, y: 112, w: 44, h: 33 }],
        frames: [pose([104, 84], 178, [P(124, 145), P(70, 112)], [A(2, 2), A(-2, -2)]), pose([100, 110], 176, [P(124, 145), P(70, 112)], [A(2, 2), A(-2, -2)])],
      },
    },
    {
      id: 'db-calf-raise', name: 'Dumbbell Calf Raise', cat: 'lower', unit: 'reps', sets: 3, reps: 15, gear: ['dumbbell'],
      regions: { calves: 1, forearms: 0.2 },
      desc: 'Calf raises holding dumbbells for extra load.',
      tips: ['Rise high onto the toes', 'Pause at the top', 'Slow on the way down', 'Stand tall'],
      anim: { db: true, dur: 700, frames: [DB_SIDE, pose([100, 74], 180, [P(101, 137), P(97, 137)], [A(2, 2), A(-2, -2)])] },
    },
    {
      id: 'db-sl-rdl', name: 'Single-Leg Dumbbell Deadlift', cat: 'lower', unit: 'reps', sets: 3, reps: 8, gear: ['dumbbell'], opt: ['kettlebell'],
      regions: { hamstrings: 1, glutes: 1, lowerBack: 0.4, abs: 0.3 },
      desc: 'Hinge on one leg holding a weight, then stand back up tall.',
      tips: ['Weight in the hand opposite the standing leg', 'Hips stay square', 'Flat back', 'Go slow for balance'],
      anim: { db: 'near', dur: 1050, frames: [pose([100, 82], 180, FEET, [A(4, 2)]), pose([98, 86], 96, [P(102, 145), P(38, 92)], [A(0, 0)])] },
    },
    {
      id: 'kb-deadlift', name: 'Kettlebell Deadlift', cat: 'lower', unit: 'reps', sets: 3, reps: 12, gear: ['kettlebell'], opt: ['dumbbell'],
      regions: { hamstrings: 1, glutes: 1, quads: 0.5, lowerBack: 0.5, forearms: 0.3 },
      desc: 'Pick a kettlebell up from between your feet with a flat back, then stand tall.',
      tips: ['Bell between your feet', 'Hips back, chest proud', 'Push the floor away', 'Squeeze glutes to finish'],
      anim: { db: 'near', kb: true, dur: 1000, frames: [standArms([A(2, 2)]), pose([84, 102], 122, FEET, [A(0, 0)])] },
    },
    {
      id: 'kb-sumo-deadlift', name: 'Kettlebell Sumo Deadlift', cat: 'lower', unit: 'reps', sets: 3, reps: 12, gear: ['kettlebell'], opt: ['dumbbell'],
      regions: { glutes: 1, adductors: 1, hamstrings: 0.6, quads: 0.5 },
      desc: 'A wide-stance deadlift that hits the inner thighs and glutes.',
      tips: ['Wide stance, toes out', 'Arms long, bell between feet', 'Knees out as you stand', 'Back flat'],
      anim: {
        front: true, db: 'near', kb: true, dur: 1000, frames: [
          pose([100, 84], 180, [P(124, 145, -1), P(76, 145, 1)], [A(4, -4), A(-4, 4)]),
          pose([100, 112], 180, [P(124, 145, -1), P(76, 145, 1)], [A(4, -4), A(-4, 4)]),
        ],
      },
    },

    // ───────── Lower body · barbell ─────────
    {
      id: 'back-squat', name: 'Barbell Back Squat', cat: 'lower', unit: 'reps', sets: 4, reps: 8, gear: ['barbell'],
      regions: { quads: 1, glutes: 1, hamstrings: 0.5, lowerBack: 0.4, abs: 0.3 },
      desc: 'The classic strength lift: barbell across your upper back, squat down and stand up.',
      tips: ['Bar sits on the upper back, not your neck', 'Brace your core first', 'Knees out, hips back', 'Stand up by driving the floor away'],
      anim: { bb: true, dur: 1000, frames: [{ ...SQUAT_TOP, arms: BACK_BAR }, { ...SQUAT_BOT, arms: [A(-75, 110)] }] },
    },
    {
      id: 'front-squat', name: 'Barbell Front Squat', cat: 'lower', unit: 'reps', sets: 4, reps: 6, gear: ['barbell'],
      regions: { quads: 1, glutes: 0.8, abs: 0.5, upperBack: 0.4 },
      desc: 'Bar rests on the front of your shoulders. Keeps you upright and hits the quads.',
      tips: ['Elbows high', 'Stay tall', 'Sit straight down between your heels', 'Brace hard'],
      anim: { bb: true, dur: 1000, frames: [{ ...SQUAT_TOP, arms: [A(100, -111)] }, pose([84, 118], 156, FEET, [A(76, -135)])] },
    },
    {
      id: 'bb-hip-thrust', name: 'Barbell Hip Thrust', cat: 'lower', unit: 'reps', sets: 4, reps: 10, gear: ['barbell', 'bench'],
      regions: { glutes: 1, hamstrings: 0.5, quads: 0.3 },
      desc: 'The heavy-hitter for glutes. Use a pad on the bar for comfort.',
      tips: ['Bar across your hip crease', 'Upper back on the bench', 'Chin tucked, ribs down', 'Full lockout with a squeeze'],
      anim: {
        bb: true, dur: 950, props: [{ type: 'box', x: 18, y: 112, w: 40, h: 33 }],
        frames: [pose([92, 138], -125, BENT_KNEES, [A(118, 30)]), pose([96, 112], -90, BENT_KNEES, [A(142, 30)])],
      },
    },
    {
      id: 'bb-rdl', name: 'Barbell Romanian Deadlift', cat: 'lower', unit: 'reps', sets: 4, reps: 8, gear: ['barbell'],
      regions: { hamstrings: 1, glutes: 1, lowerBack: 0.6, forearms: 0.4 },
      desc: 'Lower the bar down your thighs by pushing your hips back, then return.',
      tips: ['Start standing', 'Bar slides down your legs', 'Stop at mid-shin or when your back wants to round', 'Hips forward to stand'],
      anim: { bb: true, dur: 1050, frames: [standArms([A(0, 0), A(-2, 0)]), RDL_DN] },
    },
    {
      id: 'sumo-deadlift', name: 'Sumo Deadlift', cat: 'lower', unit: 'reps', sets: 4, reps: 6, gear: ['barbell'],
      regions: { glutes: 1, adductors: 0.8, hamstrings: 0.7, quads: 0.6, lowerBack: 0.5 },
      desc: 'A wide-stance barbell deadlift with your hands inside your knees.',
      tips: ['Shins close to the bar', 'Knees pushed out', 'Chest up, back flat', 'Push the floor apart'],
      anim: {
        front: true, bb: true, dur: 1050, frames: [
          pose([100, 84], 180, [P(126, 145, -1), P(74, 145, 1)], [A(8, 2), A(-8, -2)]),
          pose([100, 110], 180, [P(126, 145, -1), P(74, 145, 1)], [A(8, 2), A(-8, -2)]),
        ],
      },
    },
    {
      id: 'bb-lunge', name: 'Barbell Reverse Lunge', cat: 'lower', unit: 'reps', sets: 3, reps: 8, gear: ['barbell'],
      regions: { quads: 1, glutes: 1, hamstrings: 0.4, abs: 0.3 },
      desc: 'Reverse lunges with a barbell across your upper back.',
      tips: ['Brace before stepping', 'Step back long', 'Torso upright', 'Alternate legs'],
      anim: { bb: true, dur: 900, frames: [standArms(BACK_BAR), { ...LUNGE_DN, arms: BACK_BAR }, standArms(BACK_BAR), { ...LUNGE_DN2, arms: BACK_BAR }] },
    },
    {
      id: 'bb-glute-bridge', name: 'Barbell Glute Bridge', cat: 'lower', unit: 'reps', sets: 3, reps: 12, gear: ['barbell', 'mat'],
      regions: { glutes: 1, hamstrings: 0.5 },
      desc: 'A glute bridge from the floor with a barbell across your hips.',
      tips: ['Roll the bar over your hips', 'Feet close to your glutes', 'Drive through heels', 'Pause at the top'],
      anim: { bb: true, dur: 900, frames: [LIE(-92, [P(130, 145)], [A(120, 40)]), pose([100, 115], -59, [P(130, 145)], [A(140, 60)])] },
    },

    // ───────── Upper body · bodyweight ─────────
    {
      id: 'wall-push-up', name: 'Wall Push-Up', cat: 'upper', unit: 'reps', sets: 3, reps: 15, gear: [],
      regions: { chest: 1, triceps: 0.6, shoulders: 0.5 },
      desc: 'Push-ups against a wall. The gentlest way to start.',
      tips: ['Hands at shoulder height', 'Body in one straight line', 'Lower your chest to the wall', 'Step back to make it harder'],
      anim: {
        dur: 850, props: [{ type: 'wall', x: 162 }], frames: [
          pose([96.6, 88], 155, [P(70, 145), P(67, 145)], [P(160, 60), P(158, 62)]),
          pose([106, 93.4], 145, [P(70, 145), P(67, 145)], [P(160, 60), P(158, 62)]),
        ],
      },
    },
    {
      id: 'incline-push-up', name: 'Incline Push-Up', cat: 'upper', unit: 'reps', sets: 3, reps: 10, gear: ['bench'],
      regions: { chest: 1, triceps: 0.7, shoulders: 0.5, abs: 0.3 },
      desc: 'Hands on a bench or counter. Easier than the floor, same benefits.',
      tips: ['Hands just wider than shoulders', 'Straight line from head to heels', 'Chest to the edge', 'Lower the surface as you get stronger'],
      anim: { dur: 850, props: [{ type: 'box', x: 120, y: 115, w: 52, h: 30 }], frames: [INC_TOP, INC_BOT] },
    },
    {
      id: 'decline-push-up', name: 'Decline Push-Up', cat: 'upper', unit: 'reps', sets: 3, reps: 8, gear: ['bench'],
      regions: { chest: 1, shoulders: 0.8, triceps: 0.7, abs: 0.4 },
      desc: 'Feet up on a bench to shift more work to your upper chest and shoulders.',
      tips: ['Feet on the bench, hands on the floor', 'Body stays straight', 'Lower with control', 'Don’t let hips sag'],
      anim: {
        dur: 850, props: [{ type: 'box', x: 18, y: 115, w: 44, h: 30 }], frames: [
          pose([102.4, 106.9], 97, [P(40, 115), P(43, 115)], [P(150, 145), P(146, 145)]),
          pose([104.1, 119], 86, [P(40, 115), P(43, 115)], [P(150, 145), P(146, 145)]),
        ],
      },
    },
    {
      id: 'wide-push-up', name: 'Wide Push-Up', cat: 'upper', unit: 'reps', sets: 3, reps: 8, gear: [],
      regions: { chest: 1, shoulders: 0.6, triceps: 0.5, abs: 0.4 },
      desc: 'A push-up with your hands set wide to target the chest.',
      tips: ['Hands wider than shoulders', 'Elbows bend out to the sides', 'Chest to the floor', 'Squeeze glutes for a straight body'],
      anim: { dur: 850, frames: [PU_TOP, PU_BOT] },
    },
    {
      id: 'plank-up-down', name: 'Plank Up-Down', cat: 'upper', unit: 'reps', sets: 3, reps: 10, gear: ['mat'],
      regions: { triceps: 1, shoulders: 0.8, abs: 0.8, chest: 0.4 },
      desc: 'Move between a forearm plank and a high plank, one arm at a time.',
      tips: ['Hips stay level', 'Feet a little wider for balance', 'Hands under shoulders', 'Switch the leading arm'],
      anim: { dur: 700, frames: [PU_TOP, FARM([A(0, 90), A(-3, 88)])] },
    },
    {
      id: 'inchworm', name: 'Inchworm', cat: 'upper', unit: 'reps', sets: 3, reps: 8, gear: [],
      regions: { shoulders: 0.8, abs: 0.7, hamstrings: 0.5, chest: 0.4 },
      desc: 'Fold forward, walk your hands out to a plank, then walk them back in.',
      tips: ['Keep legs as straight as you can', 'Walk out to a strong plank', 'Optional push-up at the bottom', 'Walk back slowly'],
      anim: { dur: 800, frames: [STAND, FOLD, PU_TOP, FOLD] },
    },
    {
      id: 'chin-up', name: 'Chin-Up', cat: 'upper', unit: 'reps', sets: 3, reps: 5, gear: ['bar'], opt: ['band'],
      regions: { biceps: 1, upperBack: 1, forearms: 0.5, abs: 0.3 },
      desc: 'A pull-up with palms facing you. Usually a bit easier and great for biceps.',
      tips: ['Palms face you, shoulder-width', 'Pull chest toward the bar', 'Lower all the way', 'Loop a band on the bar for help'],
      anim: {
        dur: 1000, ground: false, props: [{ type: 'bar', y: 16 }],
        frames: [HANG_BAR, pose([100, 74], 180, [P(90, 126), P(86, 124)], [P(102, 16), P(98, 16)])],
      },
    },
    {
      id: 'negative-pull-up', name: 'Negative Pull-Up', cat: 'upper', unit: 'reps', sets: 3, reps: 5, gear: ['bar'],
      regions: { upperBack: 1, biceps: 0.8, forearms: 0.5 },
      desc: 'Jump or step to the top of a pull-up, then lower yourself as slowly as you can.',
      tips: ['Start with chin over the bar', 'Take 3–5 seconds to lower', 'Stay tight', 'The best way to earn your first pull-up'],
      anim: {
        dur: 2000, ground: false, props: [{ type: 'bar', y: 16 }],
        frames: [pose([100, 74], 180, [P(90, 126), P(86, 124)], [P(102, 16), P(98, 16)]), HANG_BAR],
      },
    },
    {
      id: 'dead-hang', name: 'Dead Hang', cat: 'upper', unit: 'secs', sets: 3, reps: 20, gear: ['bar'],
      regions: { forearms: 1, upperBack: 0.6, shoulders: 0.4 },
      desc: 'Simply hang from a bar. Builds grip strength and decompresses the spine.',
      tips: ['Full grip around the bar', 'Shoulders slightly engaged', 'Relax the legs', 'Breathe'],
      anim: { dur: 2200, ground: false, props: [{ type: 'bar', y: 16 }], frames: [HANG_BAR, { ...HANG_BAR, legs: [P(94, 158), P(90, 156)] }] },
    },
    {
      id: 'inverted-row', name: 'Inverted Row', cat: 'upper', unit: 'reps', sets: 3, reps: 8, gear: ['bar'],
      regions: { upperBack: 1, biceps: 0.6, forearms: 0.4, abs: 0.3 },
      desc: 'Hang under a low bar or sturdy table with heels down and pull your chest up.',
      tips: ['Body straight like an upside-down plank', 'Pull your chest to the bar', 'Squeeze shoulder blades', 'Bend knees to make it easier'],
      anim: {
        dur: 900, props: [{ type: 'bar', y: 80 }], frames: [
          pose([100.2, 130.7], 103, [P(40, 145), P(43, 145)], [P(135, 80), P(131, 80)]),
          pose([97.4, 113.9], 118, [P(40, 145), P(43, 145)], [P(135, 80), P(131, 80)]),
        ],
      },
    },
    {
      id: 'reverse-snow-angel', name: 'Reverse Snow Angel', cat: 'upper', unit: 'reps', sets: 3, reps: 10, gear: ['mat'],
      regions: { upperBack: 1, shoulders: 0.6, lowerBack: 0.4 },
      desc: 'Lie face down, lift your chest and sweep your arms from your hips to overhead.',
      tips: ['Lift chest just a little', 'Thumbs up', 'Arms hover off the floor', 'Slow sweeps'],
      anim: {
        dur: 1100, frames: [
          pose([90, 137], 96, [P(27, 138), P(30, 139)], [A(-80, -80)]),
          pose([90, 137], 100, [P(27, 138), P(30, 139)], [A(100, 100)]),
        ],
      },
    },

    // ───────── Upper body · dumbbells ─────────
    {
      id: 'db-bench-press', name: 'Dumbbell Chest Press', cat: 'upper', unit: 'reps', sets: 3, reps: 10, gear: ['dumbbell', 'bench'],
      regions: { chest: 1, triceps: 0.6, shoulders: 0.5 },
      desc: 'Lie on a bench and press two dumbbells up over your chest.',
      tips: ['Feet flat, shoulder blades pinched', 'Lower to chest level', 'Press up and slightly in', 'No bench? Do it on the floor'],
      anim: { db: true, dur: 900, props: [BENCH], frames: [ON_BENCH([A(178, 178), A(176, 176)]), ON_BENCH([A(60, 180), A(58, 178)])] },
    },
    {
      id: 'incline-db-press', name: 'Incline Dumbbell Press', cat: 'upper', unit: 'reps', sets: 3, reps: 10, gear: ['dumbbell', 'bench'],
      regions: { chest: 1, shoulders: 0.7, triceps: 0.6 },
      desc: 'A chest press on an inclined bench to work the upper chest.',
      tips: ['Bench at about 30°', 'Lower to upper chest', 'Press up over your shoulders', 'Control every rep'],
      anim: {
        db: true, dur: 900, props: [{ type: 'box', x: 50, y: 115, w: 48, h: 30 }], frames: [
          pose([84, 110], -140, [P(132, 145), P(128, 145)], [A(150, 150), A(148, 148)]),
          pose([84, 110], -140, [P(132, 145), P(128, 145)], [A(40, 170), A(38, 168)]),
        ],
      },
    },
    {
      id: 'db-fly', name: 'Dumbbell Fly', cat: 'upper', unit: 'reps', sets: 3, reps: 12, gear: ['dumbbell', 'bench'],
      regions: { chest: 1, shoulders: 0.4 },
      desc: 'Lying on a bench, open your arms wide in an arc, then hug them back together.',
      tips: ['Slight bend in the elbows', 'Open until you feel a chest stretch', 'Bring weights together over your chest', 'Go lighter than for presses'],
      anim: { db: true, dur: 1000, props: [BENCH], frames: [ON_BENCH([A(178, 178), A(176, 176)]), ON_BENCH([A(84, 110), A(82, 108)])] },
    },
    {
      id: 'single-arm-row', name: 'Single-Arm Row', cat: 'upper', unit: 'reps', sets: 3, reps: 10, gear: ['dumbbell', 'bench'], opt: ['kettlebell'],
      regions: { upperBack: 1, biceps: 0.6, shoulders: 0.3, forearms: 0.3 },
      desc: 'One hand on a bench, row a dumbbell up to your hip with the other.',
      tips: ['Flat back, parallel to the floor', 'Pull your elbow to your hip', 'Don’t twist', 'Switch sides'],
      anim: {
        db: 'near', dur: 850, props: [{ type: 'box', x: 128, y: 112, w: 46, h: 33 }], frames: [
          pose([88, 88], 100, [P(102, 145), P(70, 145)], [A(0, 0), P(144, 112)]),
          pose([88, 88], 100, [P(102, 145), P(70, 145)], [A(-75, 0), P(144, 112)]),
        ],
      },
    },
    {
      id: 'renegade-row', name: 'Renegade Row', cat: 'upper', unit: 'reps', sets: 3, reps: 8, gear: ['dumbbell'],
      regions: { upperBack: 1, abs: 0.8, shoulders: 0.5, biceps: 0.4, triceps: 0.3 },
      desc: 'In a high plank on dumbbells, row one weight up at a time.',
      tips: ['Feet wide for balance', 'Hips stay square to the floor', 'Elbow back to your ribs', 'Alternate sides'],
      anim: {
        db: true, dur: 700, frames: [
          PU_TOP, { ...PU_TOP, arms: [A(-60, 30), P(134, 145)] },
          PU_TOP, { ...PU_TOP, arms: [P(138, 145), A(-64, 26)] },
        ],
      },
    },
    {
      id: 'arnold-press', name: 'Arnold Press', cat: 'upper', unit: 'reps', sets: 3, reps: 10, gear: ['dumbbell'],
      regions: { shoulders: 1, triceps: 0.5, upperBack: 0.2 },
      desc: 'A shoulder press that starts palms-in in front of your face and rotates as you press.',
      tips: ['Start with weights in front of your chin', 'Open elbows out as you press', 'Finish palms forward overhead', 'Reverse on the way down'],
      anim: { db: true, front: true, dur: 1000, frames: [standArms([A(20, -170), A(-20, 170)]), standArms([A(160, 180), A(-160, -180)])] },
    },
    {
      id: 'upright-row', name: 'Upright Row', cat: 'upper', unit: 'reps', sets: 3, reps: 12, gear: ['dumbbell'], opt: ['barbell'],
      regions: { shoulders: 1, upperBack: 0.6, biceps: 0.3 },
      desc: 'Pull the weights straight up your body to chest height, elbows leading.',
      tips: ['Elbows go up and out', 'Stop at chest height', 'Keep weights close to your body', 'Shoulders down, away from ears'],
      anim: { db: true, front: true, dur: 850, frames: [standArms([A(8, -4), A(-8, 4)]), standArms([A(90, -117), A(-90, 117)])] },
    },
    {
      id: 'reverse-fly', name: 'Bent-Over Reverse Fly', cat: 'upper', unit: 'reps', sets: 3, reps: 12, gear: ['dumbbell'],
      regions: { upperBack: 1, shoulders: 0.8 },
      desc: 'Hinge forward and lift light weights out to your sides. Great for posture.',
      tips: ['Flat back, hinge at the hips', 'Soft elbows', 'Lead with your pinkies', 'Squeeze between your shoulder blades'],
      anim: { db: true, dur: 900, frames: [HINGE([A(0, 0), A(-3, -2)]), HINGE([A(-60, -60), A(-64, -64)])] },
    },
    {
      id: 'tricep-kickback', name: 'Tricep Kickback', cat: 'upper', unit: 'reps', sets: 3, reps: 12, gear: ['dumbbell'],
      regions: { triceps: 1 },
      desc: 'Hinge forward, pin your elbows by your sides and straighten your arms back.',
      tips: ['Upper arms stay still', 'Squeeze at full straightness', 'Light weights, good form', 'Lower with control'],
      anim: { db: true, dur: 800, frames: [HINGE([A(-80, 0), A(-82, -2)]), HINGE([A(-80, -82), A(-82, -84)])] },
    },
    {
      id: 'skull-crusher', name: 'Skull Crusher', cat: 'upper', unit: 'reps', sets: 3, reps: 10, gear: ['dumbbell', 'bench'], opt: ['barbell'],
      regions: { triceps: 1 },
      desc: 'Lying on a bench, bend only at the elbows to lower weights beside your head.',
      tips: ['Upper arms point to the ceiling', 'Only your forearms move', 'Lower slowly', 'Press back up without flaring elbows'],
      anim: { db: true, dur: 900, props: [BENCH], frames: [ON_BENCH([A(172, 172), A(170, 170)]), ON_BENCH([A(172, -70), A(170, -72)])] },
    },
    {
      id: 'db-pullover', name: 'Dumbbell Pullover', cat: 'upper', unit: 'reps', sets: 3, reps: 10, gear: ['dumbbell', 'bench'],
      regions: { chest: 0.8, upperBack: 0.8, triceps: 0.4, abs: 0.3 },
      desc: 'Hold one dumbbell over your chest and arc it back behind your head.',
      tips: ['Both hands on one weight', 'Slight elbow bend', 'Go back until you feel a stretch', 'Ribs stay down'],
      anim: { db: 'near', dur: 1100, props: [BENCH], frames: [ON_BENCH([A(178, 178)]), ON_BENCH([A(-100, -95)])] },
    },
    {
      id: 'concentration-curl', name: 'Concentration Curl', cat: 'upper', unit: 'reps', sets: 3, reps: 10, gear: ['dumbbell', 'bench'],
      regions: { biceps: 1, forearms: 0.3 },
      desc: 'Seated, elbow braced on your inner thigh, curl the weight up slowly.',
      tips: ['Elbow pinned to your thigh', 'Curl toward your shoulder', 'Squeeze at the top', 'Switch arms'],
      anim: { db: 'near', dur: 850, props: [SEAT], frames: [SEATED([A(10, 6), A(60, 40)], 150), SEATED([A(10, 150), A(60, 40)], 150)] },
    },
    {
      id: 'db-shrug', name: 'Dumbbell Shrug', cat: 'upper', unit: 'reps', sets: 3, reps: 15, gear: ['dumbbell'],
      regions: { upperBack: 1, forearms: 0.4 },
      desc: 'Hold heavy dumbbells and lift your shoulders straight up toward your ears.',
      tips: ['Arms stay straight', 'Straight up, no rolling', 'Pause at the top', 'Lower slowly'],
      anim: { db: true, dur: 700, frames: [DB_SIDE, pose([100, 80], 180, [P(101, 145), P(97, 145)], [A(2, 2), A(-2, -2)])] },
    },
    {
      id: 'db-floor-press', name: 'Floor Press', cat: 'upper', unit: 'reps', sets: 3, reps: 10, gear: ['dumbbell', 'mat'],
      regions: { chest: 1, triceps: 0.8, shoulders: 0.4 },
      desc: 'A chest press lying on the floor. No bench needed, and easy on the shoulders.',
      tips: ['Knees bent, feet flat', 'Lower until your upper arms touch the floor', 'Press straight up', 'Pause briefly at the bottom'],
      anim: { db: true, dur: 900, frames: [LIE(-90, BENT_KNEES, [A(178, 178), A(176, 176)]), LIE(-90, BENT_KNEES, [A(90, 180), A(88, 178)])] },
    },
    {
      id: 'zottman-curl', name: 'Zottman Curl', cat: 'upper', unit: 'reps', sets: 3, reps: 10, gear: ['dumbbell'],
      regions: { biceps: 1, forearms: 0.8 },
      desc: 'Curl up palms-up, rotate at the top, and lower palms-down.',
      tips: ['Elbows stay at your sides', 'Rotate at the top', 'Lower slowly palms down', 'Light weight to start'],
      anim: { db: true, dur: 1000, frames: [standArms([A(4, 2), A(-4, -2)]), standArms([A(4, 165), A(-4, 165)])] },
    },

    // ───────── Upper body · barbell ─────────
    {
      id: 'bench-press', name: 'Barbell Bench Press', cat: 'upper', unit: 'reps', sets: 4, reps: 8, gear: ['barbell', 'bench'],
      regions: { chest: 1, triceps: 0.7, shoulders: 0.6 },
      desc: 'Lie on a bench and press a barbell up from your chest. Use a spotter or safeties.',
      tips: ['Eyes under the bar', 'Shoulder blades squeezed together', 'Lower to mid-chest', 'Feet planted, press up'],
      anim: { bb: true, dur: 950, props: [BENCH], frames: [ON_BENCH([A(178, 178), A(176, 176)]), ON_BENCH([A(60, 180), A(58, 178)])] },
    },
    {
      id: 'overhead-press', name: 'Barbell Overhead Press', cat: 'upper', unit: 'reps', sets: 4, reps: 6, gear: ['barbell'],
      regions: { shoulders: 1, triceps: 0.7, upperBack: 0.4, abs: 0.4 },
      desc: 'Press a barbell from your shoulders to straight overhead while standing.',
      tips: ['Squeeze glutes and brace', 'Move your head back as the bar passes', 'Finish with the bar over your mid-foot', 'Lower to the collarbone'],
      anim: { bb: true, dur: 950, frames: [standArms([A(100, -111), A(98, -113)]), standArms([A(176, 178), A(174, 176)])] },
    },
    {
      id: 'bb-row', name: 'Barbell Row', cat: 'upper', unit: 'reps', sets: 4, reps: 8, gear: ['barbell'],
      regions: { upperBack: 1, biceps: 0.6, lowerBack: 0.5, forearms: 0.4 },
      desc: 'Hinge forward and row a barbell to your lower ribs.',
      tips: ['Flat back, chest over the bar', 'Pull to your belly button', 'Squeeze shoulder blades', 'Don’t jerk the weight'],
      anim: { bb: true, dur: 850, frames: [pose([90, 86], 110, FEET, [A(0, 0), A(-3, -2)]), pose([90, 86], 110, FEET, [A(-70, 10), A(-73, 8)])] },
    },
    {
      id: 'bb-curl', name: 'Barbell Curl', cat: 'upper', unit: 'reps', sets: 3, reps: 10, gear: ['barbell'],
      regions: { biceps: 1, forearms: 0.5 },
      desc: 'Curl a barbell from your thighs to your shoulders.',
      tips: ['Elbows stay by your sides', 'No swinging', 'Squeeze at the top', 'Lower all the way down'],
      anim: { bb: true, dur: 850, frames: [standArms([A(4, 2), A(-4, -2)]), standArms([A(4, 165), A(-4, 165)])] },
    },

    // ───────── Upper body · bands ─────────
    {
      id: 'band-pull-apart', name: 'Band Pull-Apart', cat: 'upper', unit: 'reps', sets: 3, reps: 15, gear: ['band'],
      regions: { upperBack: 1, shoulders: 0.7 },
      desc: 'Hold a band at chest height and pull it apart until it touches your chest.',
      tips: ['Arms straight, at shoulder height', 'Squeeze your shoulder blades', 'Slow return', 'Great warm-up for posture'],
      anim: { band: 'hands', front: true, dur: 850, frames: [standArms([A(60, 80), A(-60, -80)]), standArms([A(90, 92), A(-90, -92)])] },
    },
    {
      id: 'band-row', name: 'Band Row', cat: 'upper', unit: 'reps', sets: 3, reps: 12, gear: ['band'],
      regions: { upperBack: 1, biceps: 0.5, shoulders: 0.3 },
      desc: 'Anchor a band in front of you and row the handles back to your ribs.',
      tips: ['Stand tall, slight knee bend', 'Elbows drive back', 'Squeeze and pause', 'Let the band pull you forward slowly'],
      anim: {
        band: [178, 72], dur: 850, props: [{ type: 'wall', x: 178 }], frames: [
          pose([96, 84], 176, [P(110, 145), P(84, 145)], [A(92, 92), A(90, 90)]),
          pose([96, 84], 176, [P(110, 145), P(84, 145)], [A(-40, 90), A(-42, 88)]),
        ],
      },
    },
    {
      id: 'band-chest-press', name: 'Band Chest Press', cat: 'upper', unit: 'reps', sets: 3, reps: 12, gear: ['band'],
      regions: { chest: 1, triceps: 0.6, shoulders: 0.5 },
      desc: 'Band anchored behind you at chest height. Press the handles straight forward.',
      tips: ['Step forward until the band is tight', 'Staggered stance', 'Press out at chest height', 'Slow on the return'],
      anim: {
        band: [22, 60], dur: 850, props: [{ type: 'wall', x: 22 }], frames: [
          pose([96, 84], 176, [P(114, 145), P(80, 145)], [A(-70, 90), A(-72, 88)]),
          pose([96, 84], 176, [P(114, 145), P(80, 145)], [A(92, 92), A(90, 90)]),
        ],
      },
    },
    {
      id: 'band-curl', name: 'Band Bicep Curl', cat: 'upper', unit: 'reps', sets: 3, reps: 15, gear: ['band'],
      regions: { biceps: 1, forearms: 0.4 },
      desc: 'Stand on the band and curl the handles up to your shoulders.',
      tips: ['Elbows pinned at your sides', 'Squeeze at the top', 'Slow lower', 'Step wider for more tension'],
      anim: { band: 'feet', dur: 800, frames: [standArms([A(4, 2), A(-4, -2)]), standArms([A(4, 165), A(-4, 165)])] },
    },
    {
      id: 'band-pushdown', name: 'Band Tricep Pushdown', cat: 'upper', unit: 'reps', sets: 3, reps: 15, gear: ['band'],
      regions: { triceps: 1 },
      desc: 'Anchor a band up high and push it down until your arms are straight.',
      tips: ['Elbows locked at your sides', 'Only forearms move', 'Squeeze at the bottom', 'Control the way up'],
      anim: {
        band: [162, 4], dur: 800, props: [{ type: 'wall', x: 164 }], frames: [
          pose([100, 82], 176, FEET, [A(8, 110), A(6, 108)]),
          pose([100, 82], 176, FEET, [A(8, 10), A(6, 8)]),
        ],
      },
    },
    {
      id: 'band-face-pull', name: 'Band Face Pull', cat: 'upper', unit: 'reps', sets: 3, reps: 15, gear: ['band'],
      regions: { upperBack: 1, shoulders: 0.8 },
      desc: 'Pull a band anchored at face height toward your forehead, elbows high and wide.',
      tips: ['Elbows high', 'Pull the band apart as it comes in', 'Squeeze the back of your shoulders', 'Slow return'],
      anim: {
        band: [178, 34], dur: 850, props: [{ type: 'wall', x: 178 }], frames: [
          pose([96, 84], 176, [P(110, 145), P(84, 145)], [A(100, 100), A(98, 98)]),
          pose([96, 84], 176, [P(110, 145), P(84, 145)], [A(120, -110), A(118, -112)]),
        ],
      },
    },
    {
      id: 'band-lateral-raise', name: 'Band Lateral Raise', cat: 'upper', unit: 'reps', sets: 3, reps: 15, gear: ['band'],
      regions: { shoulders: 1 },
      desc: 'Stand on a band and raise your arms out to the sides.',
      tips: ['Slight bend in the elbows', 'Lift to shoulder height', 'Lead with the elbows', 'Control the way down'],
      anim: { band: 'feet', front: true, dur: 850, frames: [FSTAND([A(12, 10), A(-12, -10)]), FSTAND([A(88, 90), A(-88, -90)])] },
    },
    {
      id: 'band-overhead-press', name: 'Band Shoulder Press', cat: 'upper', unit: 'reps', sets: 3, reps: 12, gear: ['band'],
      regions: { shoulders: 1, triceps: 0.6 },
      desc: 'Stand on a band and press the handles from your shoulders to overhead.',
      tips: ['Start with hands at shoulder height', 'Press straight up', 'Ribs down', 'Lower slowly'],
      anim: { band: 'feet', front: true, dur: 850, frames: [FSTAND([A(80, 175), A(-80, -175)]), FSTAND([A(160, 180), A(-160, -180)])] },
    },
    {
      id: 'band-pulldown', name: 'Band Lat Pulldown', cat: 'upper', unit: 'reps', sets: 3, reps: 12, gear: ['band'],
      regions: { upperBack: 1, biceps: 0.5, shoulders: 0.3 },
      desc: 'Anchor a band overhead and pull it down to your chest.',
      tips: ['Start arms straight overhead', 'Pull elbows down to your ribs', 'Chest up', 'Let it rise slowly'],
      anim: {
        band: [112, -10], dur: 900, props: [{ type: 'bar', y: -10 }], frames: [
          pose([100, 82], 180, FEET, [A(174, 178), A(172, 176)]),
          pose([100, 82], 180, FEET, [A(20, 175), A(18, 173)]),
        ],
      },
    },

    // ───────── Core ─────────
    {
      id: 'russian-twist', name: 'Russian Twist', cat: 'core', unit: 'reps', sets: 3, reps: 20, gear: ['mat'], opt: ['dumbbell', 'kettlebell'],
      regions: { obliques: 1, abs: 0.7 },
      desc: 'Sit leaning back with feet up and rotate your hands side to side.',
      tips: ['Lean back with a long spine', 'Feet off the floor if you can', 'Turn from your ribs, not just your arms', 'Hold a weight to progress'],
      anim: {
        dur: 600, frames: [
          SIT(-150, [P(134, 126), P(130, 128)], [A(140, 120), A(130, 110)]),
          SIT(-150, [P(134, 126), P(130, 128)], [A(70, 90), A(60, 80)]),
        ],
      },
    },
    {
      id: 'reverse-crunch', name: 'Reverse Crunch', cat: 'core', unit: 'reps', sets: 3, reps: 15, gear: ['mat'],
      regions: { abs: 1, obliques: 0.3 },
      desc: 'Lying down, curl your knees toward your chest and lift your hips slightly.',
      tips: ['Knees bent at 90°', 'Curl the hips up, don’t swing', 'Arms flat for support', 'Lower slowly'],
      anim: {
        dur: 850, frames: [
          LIE(-90, [A(150, 60), A(151, 61)], [A(90, 90)]),
          pose([102, 132], -76, [A(-160, 110), A(-161, 111)], [A(90, 90)]),
        ],
      },
    },
    {
      id: 'toe-touch', name: 'Toe Touch Crunch', cat: 'core', unit: 'reps', sets: 3, reps: 15, gear: ['mat'],
      regions: { abs: 1 },
      desc: 'Legs straight up to the ceiling, reach your hands up to touch your toes.',
      tips: ['Legs vertical', 'Lift shoulder blades off the floor', 'Reach, don’t pull your neck', 'Lower slowly'],
      anim: { dur: 800, frames: [LIE(-92, [A(178, 178), A(176, 176)], [A(160, 160)]), LIE(-125, [A(178, 178), A(176, 176)], [A(150, 155)])] },
    },
    {
      id: 'heel-taps', name: 'Heel Taps', cat: 'core', unit: 'reps', sets: 3, reps: 20, gear: ['mat'],
      regions: { obliques: 1, abs: 0.6 },
      desc: 'Shoulders lifted, reach side to side to tap each heel.',
      tips: ['Knees bent, feet flat', 'Shoulders stay off the floor', 'Short side-to-side reaches', 'Breathe out each tap'],
      anim: {
        dur: 500, frames: [
          LIE(-112, BENT_KNEES, [A(82, 82), A(96, 96)]),
          LIE(-112, BENT_KNEES, [A(96, 96), A(82, 82)]),
        ],
      },
    },
    {
      id: 'scissor-kicks', name: 'Scissor Kicks', cat: 'core', unit: 'secs', sets: 3, reps: 30, gear: ['mat'],
      regions: { abs: 1, adductors: 0.3 },
      desc: 'Lying down, cross and uncross your straight legs in big scissor motions.',
      tips: ['Lower back pressed down', 'Legs straight', 'Bigger range = harder', 'Keep breathing'],
      anim: { dur: 420, frames: [LIE(-96, [A(115, 115), A(145, 145)], [A(88, 88)]), LIE(-96, [A(145, 145), A(115, 115)], [A(88, 88)])] },
    },
    {
      id: 'plank-shoulder-tap', name: 'Plank Shoulder Taps', cat: 'core', unit: 'reps', sets: 3, reps: 20, gear: [],
      regions: { abs: 1, shoulders: 0.7, obliques: 0.5, triceps: 0.3 },
      desc: 'In a high plank, tap each hand to the opposite shoulder without rocking.',
      tips: ['Feet wider for stability', 'Hips stay still', 'Slow taps', 'Squeeze glutes'],
      anim: {
        dur: 550, frames: [
          PU_TOP, { ...PU_TOP, arms: [A(-20, 60), P(134, 145)] },
          PU_TOP, { ...PU_TOP, arms: [P(138, 145), A(-24, 56)] },
        ],
      },
    },
    {
      id: 'side-plank-dip', name: 'Side Plank Hip Dip', cat: 'core', unit: 'reps', sets: 3, reps: 12, gear: ['mat'],
      regions: { obliques: 1, abs: 0.5, glutes: 0.3 },
      desc: 'From a side plank, lower your hip toward the floor and lift it back up.',
      tips: ['Elbow under your shoulder', 'Dip slowly', 'Lift higher than the start', 'Switch sides'],
      anim: {
        dur: 800, frames: [
          FARM([A(0, 90), A(185, 185)]),
          pose([101.8, 140], 98, [P(40, 145), P(43, 141)], [A(0, 90), A(185, 185)]),
        ],
      },
    },
    {
      id: 'bear-plank', name: 'Bear Plank', cat: 'core', unit: 'secs', sets: 3, reps: 30, gear: [],
      regions: { abs: 1, shoulders: 0.6, quads: 0.4 },
      desc: 'On hands and toes, lift your knees an inch off the floor and hold.',
      tips: ['Knees under hips, hands under shoulders', 'Knees hover just off the floor', 'Back flat as a table', 'Breathe'],
      anim: { dur: 1600, frames: [BEAR([P(58, 145), P(54, 145)], [P(128, 145), P(124, 145)]), { ...BEAR([P(58, 145), P(54, 145)], [P(128, 145), P(124, 145)]), hip: [82, 109] }] },
    },
    {
      id: 'bear-crawl', name: 'Bear Crawl', cat: 'core', unit: 'secs', sets: 3, reps: 30, gear: [],
      regions: { abs: 0.8, shoulders: 0.8, quads: 0.6, triceps: 0.3 },
      desc: 'Crawl forward on hands and feet with your knees hovering just off the ground.',
      tips: ['Opposite hand and foot move together', 'Hips low and level', 'Small steps', 'Go forward and back'],
      anim: {
        dur: 450, frames: [
          BEAR([P(62, 145), P(52, 145)], [P(124, 145), P(132, 145)]),
          BEAR([P(52, 145), P(62, 145)], [P(132, 145), P(124, 145)]),
        ],
      },
    },
    {
      id: 'hanging-knee-raise', name: 'Hanging Knee Raise', cat: 'core', unit: 'reps', sets: 3, reps: 10, gear: ['bar'],
      regions: { abs: 1, forearms: 0.6, obliques: 0.3 },
      desc: 'Hang from a bar and lift your knees up toward your chest.',
      tips: ['Stop swinging before each rep', 'Curl your pelvis up', 'Lower slowly', 'Straight legs = harder'],
      anim: { dur: 950, ground: false, props: [{ type: 'bar', y: 16 }], frames: [HANG_BAR, { ...HANG_BAR, legs: [A(100, 8), A(98, 6)] }] },
    },
    {
      id: 'ball-crunch', name: 'Stability Ball Crunch', cat: 'core', unit: 'reps', sets: 3, reps: 15, gear: ['ball'],
      regions: { abs: 1, obliques: 0.3 },
      desc: 'Lie back over a stability ball and crunch up. A bigger range than floor crunches.',
      tips: ['Ball under your lower back', 'Feet wide for balance', 'Curl up, don’t sit up', 'Hands lightly by your head'],
      anim: {
        dur: 900, props: [{ type: 'ball', x: 86, r: 22 }], frames: [
          pose([96, 104], -105, [P(134, 145), P(130, 145)], [A(-160, -100)]),
          pose([96, 104], -135, [P(134, 145), P(130, 145)], [A(170, -110)]),
        ],
      },
    },
    {
      id: 'ball-bridge', name: 'Stability Ball Bridge', cat: 'lower', unit: 'reps', sets: 3, reps: 12, gear: ['ball', 'mat'],
      regions: { hamstrings: 1, glutes: 1, abs: 0.4 },
      desc: 'Heels on a stability ball, lift your hips into a straight line. Wobbles make it work.',
      tips: ['Arms flat for balance', 'Press heels into the ball', 'Squeeze glutes at the top', 'Keep the ball still'],
      anim: {
        dur: 950, props: [{ type: 'ball', x: 160, r: 16 }], frames: [
          LIE(-90, [P(158, 116), P(154, 117)], [A(88, 88)]),
          pose([104, 124], -71, [P(158, 116), P(154, 117)], [A(88, 88)]),
        ],
      },
    },
    {
      id: 'standing-oblique-crunch', name: 'Standing Oblique Crunch', cat: 'core', unit: 'reps', sets: 3, reps: 12, gear: [],
      regions: { obliques: 1, abs: 0.5 },
      desc: 'Hands behind your head, bring one knee up and out to meet your elbow.',
      tips: ['Stand tall to start', 'Crunch your side, not forward', 'Knee lifts out to the side', 'Alternate sides'],
      anim: { front: true, dur: 700, frames: [FSTAND([A(150, -110), A(-150, 110)]), pose([100, 84], 168, [A(60, -20), P(96, 145, 1)], [A(110, -130), A(-150, 110)])] },
    },
    {
      id: 'woodchop', name: 'Woodchop', cat: 'core', unit: 'reps', sets: 3, reps: 12, gear: ['dumbbell'], opt: ['band', 'kettlebell'],
      regions: { obliques: 1, abs: 0.6, shoulders: 0.5 },
      desc: 'Sweep a weight diagonally from high over one shoulder down past the opposite knee.',
      tips: ['Pivot your back foot', 'Turn from your trunk', 'Arms stay long', 'Do both sides'],
      anim: {
        front: true, db: 'near', dur: 900, frames: [
          pose([100, 84], 178, [P(118, 145, -1), P(82, 145, 1)], [A(140, 170), A(120, 150)]),
          pose([98, 96], 186, [P(118, 145, -1), P(82, 145, 1)], [A(-30, -20), A(-15, -45)]),
        ],
      },
    },
    {
      id: 'db-side-bend', name: 'Dumbbell Side Bend', cat: 'core', unit: 'reps', sets: 3, reps: 12, gear: ['dumbbell'],
      regions: { obliques: 1, lowerBack: 0.3 },
      desc: 'Hold a weight in one hand and bend sideways, then pull yourself upright with your side.',
      tips: ['Bend straight sideways, not forward', 'Only go a few inches', 'Use your opposite side to come up', 'Switch hands'],
      anim: { front: true, db: 'near', dur: 900, frames: [FSTAND([A(4, 2), A(-40, 40)]), pose([100, 82], 164, [P(104, 145, -1), P(96, 145, 1)], [A(4, 2), A(-40, 40)])] },
    },
    {
      id: 'weighted-crunch', name: 'Weighted Crunch', cat: 'core', unit: 'reps', sets: 3, reps: 12, gear: ['dumbbell', 'mat'],
      regions: { abs: 1 },
      desc: 'A crunch holding a weight on your chest for more resistance.',
      tips: ['Hug the weight to your chest', 'Lift shoulders, not your neck', 'Exhale as you curl', 'Lower slowly'],
      anim: { db: 'near', dur: 800, frames: [LIE(-92, BENT_KNEES, [A(130, 30)]), LIE(-118, BENT_KNEES, [A(120, 20)])] },
    },

    // ───────── Cardio ─────────
    {
      id: 'squat-jacks', name: 'Squat Jacks', cat: 'cardio', unit: 'reps', sets: 3, reps: 15, gear: [],
      regions: { quads: 0.8, glutes: 0.7, adductors: 0.5, calves: 0.4 },
      desc: 'Jump your feet wide into a squat, then hop them back together.',
      tips: ['Land softly', 'Sink into the squat when wide', 'Hands at your chest', 'Find a steady rhythm'],
      anim: {
        front: true, dur: 450, frames: [
          pose([100, 88], 180, [P(106, 145, -1), P(94, 145, 1)], CLASP_F),
          pose([100, 110], 180, [P(126, 145, -1), P(74, 145, 1)], CLASP_F),
        ],
      },
    },
    {
      id: 'skaters', name: 'Skaters', cat: 'cardio', unit: 'reps', sets: 3, reps: 16, gear: [],
      regions: { glutes: 0.8, quads: 0.7, adductors: 0.4, calves: 0.4 },
      desc: 'Leap side to side, landing on one leg like a speed skater.',
      tips: ['Push off sideways', 'Land softly on one leg', 'Swing your arms across', 'Back foot taps lightly'],
      anim: {
        front: true, dur: 500, frames: [
          pose([124, 96], 172, [P(128, 145, -1), P(102, 136, 1)], [A(-40, -30), A(-70, -60)]),
          pose([76, 96], 188, [P(98, 136, -1), P(72, 145, 1)], [A(70, 60), A(40, 30)]),
        ],
      },
    },
    {
      id: 'star-jumps', name: 'Star Jumps', cat: 'cardio', unit: 'reps', sets: 3, reps: 10, gear: [],
      regions: { quads: 0.6, calves: 0.6, shoulders: 0.4, glutes: 0.5 },
      desc: 'Crouch, then explode up into a big star shape in the air.',
      tips: ['Start in a quarter squat', 'Jump up and spread wide', 'Land soft with feet together', 'Reset each rep'],
      anim: {
        front: true, dur: 520, frames: [
          pose([100, 102], 180, [P(108, 145, -1), P(92, 145, 1)], [A(20, 10), A(-20, -10)]),
          pose([100, 62], 180, [P(132, 118, -1), P(68, 118, 1)], [A(140, 140), A(-140, -140)]),
        ],
      },
    },
    {
      id: 'tuck-jumps', name: 'Tuck Jumps', cat: 'cardio', unit: 'reps', sets: 3, reps: 8, gear: [],
      regions: { quads: 0.8, abs: 0.5, calves: 0.6, glutes: 0.5 },
      desc: 'Jump straight up and pull your knees toward your chest.',
      tips: ['Jump first, then tuck', 'Knees to chest', 'Land softly', 'Rest between reps if needed'],
      anim: {
        dur: 520, frames: [
          SQUAT_BOT,
          pose([100, 66], 180, [A(115, 5), A(112, 2)], [A(80, 60)]),
        ],
      },
    },
    {
      id: 'lateral-shuffle', name: 'Lateral Shuffle', cat: 'cardio', unit: 'secs', sets: 3, reps: 30, gear: [],
      regions: { quads: 0.7, glutes: 0.6, adductors: 0.5, calves: 0.5 },
      desc: 'Stay low in an athletic stance and shuffle quickly side to side.',
      tips: ['Knees bent, hips back', 'Feet never cross', 'Stay on the balls of your feet', 'Quick and light'],
      anim: {
        front: true, dur: 380, frames: [
          pose([110, 94], 180, [P(132, 145, -1), P(92, 145, 1)], [A(40, 120), A(-40, -120)]),
          pose([90, 94], 180, [P(108, 145, -1), P(68, 145, 1)], [A(40, 120), A(-40, -120)]),
        ],
      },
    },
    {
      id: 'step-jacks', name: 'Step Jacks', cat: 'cardio', unit: 'reps', sets: 3, reps: 20, gear: [],
      regions: { calves: 0.4, shoulders: 0.4, quads: 0.3, glutes: 0.3 },
      desc: 'A no-jump jumping jack: step one foot out as your arms go up. Easy on the joints.',
      tips: ['Step wide to one side', 'Arms sweep overhead', 'Alternate sides', 'Speed up for more cardio'],
      anim: {
        front: true, dur: 500, frames: [
          FSTAND([A(8, 4), A(-8, -4)]), pose([100, 82], 180, [P(126, 145, -1), P(96, 145, 1)], [A(140, 165), A(-140, -165)]),
          FSTAND([A(8, 4), A(-8, -4)]), pose([100, 82], 180, [P(104, 145, -1), P(74, 145, 1)], [A(140, 165), A(-140, -165)]),
        ],
      },
    },
    {
      id: 'shadow-boxing', name: 'Shadow Boxing', cat: 'cardio', unit: 'min', sets: 1, reps: 3, gear: [],
      regions: { shoulders: 1, abs: 0.5, triceps: 0.4, calves: 0.3 },
      desc: 'Throw punches at the air while bouncing on your toes. Fun and sweaty.',
      tips: ['Hands up by your face', 'Rotate your hips into punches', 'Stay light on your feet', 'Breathe out each punch'],
      anim: {
        dur: 320, frames: [
          pose([98, 84], 174, [P(116, 145), P(82, 145)], [A(92, 92), A(50, 170)]),
          pose([98, 84], 174, [P(116, 145), P(82, 145)], [A(50, 170), A(92, 92)]),
        ],
      },
    },
    {
      id: 'fast-feet', name: 'Fast Feet', cat: 'cardio', unit: 'secs', sets: 3, reps: 20, gear: [],
      regions: { calves: 1, quads: 0.5 },
      desc: 'In a half squat, tap your feet up and down as fast as you can.',
      tips: ['Stay low', 'Tiny, quick steps', 'Arms pump', 'Stay on the balls of your feet'],
      anim: {
        dur: 160, frames: [
          pose([98, 92], 168, [P(112, 138), P(92, 145)], [A(30, 110), A(-20, 70)]),
          pose([98, 92], 168, [P(112, 145), P(92, 138)], [A(-20, 70), A(30, 110)]),
        ],
      },
    },
    {
      id: 'sprint', name: 'Sprint Intervals', cat: 'cardio', unit: 'secs', sets: 6, reps: 20, gear: [],
      regions: { quads: 0.8, hamstrings: 0.8, glutes: 0.8, calves: 0.6 },
      desc: 'Run as fast as you can for a short burst, then walk to recover. Repeat.',
      tips: ['Warm up first', 'Drive your knees', 'Pump your arms', 'Walk between rounds'],
      anim: {
        dur: 230, frames: [
          pose([100, 80], 170, [P(132, 120), P(76, 140)], [A(-60, 40), A(70, 140)]),
          pose([100, 80], 170, [P(76, 140), P(132, 120)], [A(70, 140), A(-60, 40)]),
        ],
      },
    },
    {
      id: 'stair-climb', name: 'Stair Climb', cat: 'cardio', unit: 'min', sets: 1, reps: 10, gear: ['box'],
      regions: { quads: 0.8, glutes: 0.8, calves: 0.6 },
      desc: 'Walk up and down stairs (or step up and down a sturdy step) at a steady pace.',
      tips: ['Whole foot on each step', 'Use the rail if you need it', 'Stand tall', 'Take two at a time for glutes'],
      anim: {
        dur: 600, props: [{ type: 'box', x: 112, y: 117, w: 44, h: 28 }],
        frames: [
          pose([88, 82], 180, [P(89, 145), P(87, 145)], [A(-20, 10), A(20, 30)]),
          pose([104, 88], 172, [P(128, 117), P(88, 145)], [A(20, 30), A(-20, 10)]),
          pose([128, 56], 180, [P(129, 117), P(125, 117)], [A(-20, 10), A(20, 30)]),
          pose([104, 88], 172, [P(128, 117), P(88, 145)], [A(20, 30), A(-20, 10)]),
        ],
      },
    },
    {
      id: 'dance', name: 'Dance Cardio', cat: 'cardio', unit: 'min', sets: 1, reps: 15, gear: [],
      regions: { calves: 0.5, glutes: 0.5, quads: 0.5, shoulders: 0.4, abs: 0.3 },
      desc: 'Put on music you love and move. It all counts.',
      tips: ['Keep moving the whole song', 'Big arm moves burn more', 'Have fun with it', 'Sip water between songs'],
      anim: {
        front: true, dur: 420, frames: [
          pose([104, 86], 172, [P(116, 145, -1), P(92, 145, 1)], [A(150, 170), A(-40, 40)]),
          pose([100, 90], 180, [P(112, 145, -1), P(88, 145, 1)], [A(40, -40), A(-40, 40)]),
          pose([96, 86], 188, [P(108, 145, -1), P(84, 145, 1)], [A(40, -40), A(-150, -170)]),
          pose([100, 90], 180, [P(112, 145, -1), P(88, 145, 1)], [A(90, 160), A(-90, -160)]),
        ],
      },
    },
    {
      id: 'cycling', name: 'Cycling', cat: 'cardio', unit: 'min', sets: 1, reps: 20, gear: ['machine'],
      regions: { quads: 1, glutes: 0.6, calves: 0.5, hamstrings: 0.4 },
      desc: 'A stationary bike or a ride outside. Low impact, great for your legs and heart.',
      tips: ['Seat at hip height', 'Slight knee bend at the bottom', 'Push and pull the pedals', 'Mix in faster intervals'],
      anim: {
        dur: 700, ground: false, props: [{ type: 'box', x: 72, y: 96, w: 24, h: 8 }], frames: [
          pose([84, 96], 140, [P(118, 118), P(108, 144)], [P(136, 70), P(132, 70)]),
          pose([84, 96], 140, [P(128, 132), P(98, 130)], [P(136, 70), P(132, 70)]),
          pose([84, 96], 140, [P(108, 144), P(118, 118)], [P(136, 70), P(132, 70)]),
          pose([84, 96], 140, [P(98, 130), P(128, 132)], [P(136, 70), P(132, 70)]),
        ],
      },
    },
    {
      id: 'rowing', name: 'Rowing Machine', cat: 'cardio', unit: 'min', sets: 1, reps: 10, gear: ['machine'],
      regions: { upperBack: 1, quads: 0.7, glutes: 0.5, biceps: 0.4, hamstrings: 0.4, abs: 0.3 },
      desc: 'Legs push, body swings back, arms pull. A full-body cardio workout.',
      tips: ['Legs, then body, then arms', 'Reverse it on the way back', 'Back stays tall', 'Smooth, not jerky'],
      anim: {
        dur: 1100, props: [{ type: 'box', x: 20, y: 130, w: 150, h: 15 }], frames: [
          pose([84, 124], 155, [P(124, 128), P(120, 128)], [A(100, 100), A(98, 98)]),
          pose([58, 124], -162, [P(124, 128), P(120, 128)], [A(30, 120), A(28, 118)]),
        ],
      },
    },
    {
      id: 'incline-walk', name: 'Incline Treadmill Walk', cat: 'cardio', unit: 'min', sets: 1, reps: 20, gear: ['machine'],
      regions: { glutes: 0.8, calves: 0.8, hamstrings: 0.6, quads: 0.5 },
      desc: 'Walk on a treadmill with the incline turned up. Easy on the joints, great for glutes.',
      tips: ['Incline 8–12%, moderate pace', 'Don’t hold the rails', 'Stand tall', 'Swing your arms naturally'],
      anim: {
        dur: 520, frames: [
          pose([100, 82], 174, [P(118, 145), P(84, 145)], [A(-25, -15), A(25, 35)]),
          pose([100, 82], 174, [P(84, 145), P(118, 145)], [A(25, 35), A(-25, -15)]),
        ],
      },
    },

    // ───────── Machines & cables ─────────
    {
      id: 'lat-pulldown', name: 'Lat Pulldown', cat: 'upper', unit: 'reps', sets: 3, reps: 10, gear: ['machine'],
      regions: { upperBack: 1, biceps: 0.6, shoulders: 0.3 },
      desc: 'Seated at the machine, pull the bar down to your upper chest.',
      tips: ['Thighs snug under the pads', 'Lean back slightly', 'Pull elbows down to your sides', 'Let it rise with control'],
      anim: {
        cable: [92, -12], post: false, dur: 950, props: [SEAT, { type: 'bar', y: -12 }], frames: [
          SEATED([A(176, 178), A(174, 176)], 172), SEATED([A(30, 170), A(28, 168)], 168),
        ],
      },
    },
    {
      id: 'cable-row', name: 'Seated Cable Row', cat: 'upper', unit: 'reps', sets: 3, reps: 10, gear: ['cable'],
      regions: { upperBack: 1, biceps: 0.5, lowerBack: 0.3 },
      desc: 'Sit tall and pull the cable handle to your stomach.',
      tips: ['Knees soft', 'Chest up, back tall', 'Squeeze shoulder blades together', 'Arms straighten slowly'],
      anim: {
        cable: [186, 122], dur: 900, props: [{ type: 'box', x: 40, y: 122, w: 60, h: 23 }], frames: [
          pose([72, 118], 172, [P(150, 124), P(146, 124)], [A(96, 96), A(94, 94)]),
          pose([72, 118], 182, [P(150, 124), P(146, 124)], [A(-40, 90), A(-42, 88)]),
        ],
      },
    },
    {
      id: 'cable-kickback', name: 'Cable Kickback', cat: 'lower', unit: 'reps', sets: 3, reps: 12, gear: ['cable'], opt: ['band'],
      regions: { glutes: 1, hamstrings: 0.5 },
      desc: 'Ankle strap on a low cable, hold the machine and kick one leg back.',
      tips: ['Slight forward lean', 'Kick back and up with the heel', 'Squeeze, don’t swing', 'Switch legs'],
      anim: {
        cable: [176, 140], from: 'foot', dur: 800, frames: [
          pose([110, 82], 164, [P(114, 145), P(112, 145)], [P(166, 70), P(164, 72)]),
          pose([110, 84], 156, [A(-45, -40), P(112, 145)], [P(166, 70), P(164, 72)]),
        ],
      },
    },
    {
      id: 'cable-pull-through', name: 'Cable Pull-Through', cat: 'lower', unit: 'reps', sets: 3, reps: 12, gear: ['cable'], opt: ['band'],
      regions: { glutes: 1, hamstrings: 0.8, lowerBack: 0.3 },
      desc: 'Facing away from a low cable, hinge forward with the rope between your legs, then snap your hips through.',
      tips: ['Hips back, not down', 'Arms just hold on', 'Drive hips forward to stand', 'Squeeze glutes at the top'],
      anim: { cable: [14, 140], dur: 1000, frames: [pose([100, 82], 180, FEET, [A(-4, -4), A(-6, -6)]), pose([94, 88], 108, FEET, [A(-30, -30), A(-32, -32)])] },
    },
    {
      id: 'cable-pushdown', name: 'Cable Tricep Pushdown', cat: 'upper', unit: 'reps', sets: 3, reps: 12, gear: ['cable'],
      regions: { triceps: 1 },
      desc: 'Push a cable bar or rope down until your arms are straight.',
      tips: ['Elbows pinned at your sides', 'Only forearms move', 'Full lockout', 'Control the way up'],
      anim: {
        cable: [150, 4], dur: 800, frames: [
          pose([100, 82], 174, FEET, [A(8, 110), A(6, 108)]), pose([100, 82], 174, FEET, [A(8, 10), A(6, 8)]),
        ],
      },
    },
    {
      id: 'cable-face-pull', name: 'Cable Face Pull', cat: 'upper', unit: 'reps', sets: 3, reps: 15, gear: ['cable'],
      regions: { upperBack: 1, shoulders: 0.8 },
      desc: 'Pull a rope at face height toward your forehead with elbows high.',
      tips: ['Elbows high and wide', 'Pull the rope apart', 'Squeeze the back of the shoulders', 'Light weight'],
      anim: {
        cable: [180, 34], dur: 850, frames: [
          pose([96, 84], 176, [P(110, 145), P(84, 145)], [A(100, 100), A(98, 98)]),
          pose([96, 84], 176, [P(110, 145), P(84, 145)], [A(120, -110), A(118, -112)]),
        ],
      },
    },
    {
      id: 'leg-press', name: 'Leg Press', cat: 'lower', unit: 'reps', sets: 3, reps: 12, gear: ['machine'],
      regions: { quads: 1, glutes: 0.8, hamstrings: 0.3 },
      desc: 'Seated in the machine, press the platform away with your feet.',
      tips: ['Feet hip-width on the platform', 'Lower until knees reach about 90°', 'Don’t lock your knees hard', 'Lower back stays on the pad'],
      anim: {
        ground: false, dur: 1000, props: [{ type: 'box', x: 40, y: 118, w: 70, h: 16 }], frames: [
          pose([90, 118], -130, [P(132, 92), P(128, 93)], [A(60, 60)]),
          pose([90, 118], -130, [P(150, 70), P(146, 71)], [A(60, 60)]),
        ],
      },
    },
    {
      id: 'leg-curl', name: 'Leg Curl', cat: 'lower', unit: 'reps', sets: 3, reps: 12, gear: ['machine'],
      regions: { hamstrings: 1, calves: 0.3 },
      desc: 'Lying face down on the machine, curl your heels toward your glutes.',
      tips: ['Hips pressed into the pad', 'Curl all the way up', 'Lower slowly', 'Point toes up'],
      anim: {
        dur: 900, props: [{ type: 'box', x: 40, y: 112, w: 120, h: 33 }], frames: [
          pose([86, 110], 90, [A(-90, -90), A(-91, -91)], [A(30, 100)]),
          pose([86, 110], 90, [A(-90, 160), A(-91, 158)], [A(30, 100)]),
        ],
      },
    },
    {
      id: 'leg-extension', name: 'Leg Extension', cat: 'lower', unit: 'reps', sets: 3, reps: 12, gear: ['machine'],
      regions: { quads: 1 },
      desc: 'Seated on the machine, straighten your legs against the pad.',
      tips: ['Back against the seat', 'Lift until legs are straight', 'Pause at the top', 'Lower slowly'],
      anim: {
        dur: 900, props: [SEAT], frames: [
          pose([86, 110], 176, [A(88, 8), A(86, 6)], [A(10, 60)]),
          pose([86, 110], 176, [A(92, 88), A(90, 86)], [A(10, 60)]),
        ],
      },
    },
    {
      id: 'hip-abduction-machine', name: 'Hip Abduction Machine', cat: 'lower', unit: 'reps', sets: 3, reps: 15, gear: ['machine'],
      regions: { glutes: 1, adductors: 0.2 },
      desc: 'Seated, press your knees out against the pads. Targets the side glutes.',
      tips: ['Sit tall or lean slightly forward', 'Push out with the knees', 'Pause wide', 'Slow return'],
      anim: {
        front: true, dur: 900, props: [{ type: 'box', x: 76, y: 112, w: 48, h: 33 }], frames: [
          pose([100, 108], 180, [P(112, 145, -1), P(88, 145, 1)], [A(30, 10), A(-30, -10)]),
          pose([100, 108], 180, [P(140, 140, -1), P(60, 140, 1)], [A(30, 10), A(-30, -10)]),
        ],
      },
    },
    {
      id: 'hip-adduction-machine', name: 'Hip Adduction Machine', cat: 'lower', unit: 'reps', sets: 3, reps: 15, gear: ['machine'],
      regions: { adductors: 1 },
      desc: 'Seated with knees wide, squeeze the pads together. Works the inner thighs.',
      tips: ['Start at a comfortable stretch', 'Squeeze knees together', 'Pause at the middle', 'Open slowly'],
      anim: {
        front: true, dur: 900, props: [{ type: 'box', x: 76, y: 112, w: 48, h: 33 }], frames: [
          pose([100, 108], 180, [P(140, 140, -1), P(60, 140, 1)], [A(30, 10), A(-30, -10)]),
          pose([100, 108], 180, [P(112, 145, -1), P(88, 145, 1)], [A(30, 10), A(-30, -10)]),
        ],
      },
    },

    // ───────── Stretch & mobility ─────────
    {
      id: 'childs-pose', name: 'Child’s Pose', cat: 'mobility', unit: 'secs', sets: 1, reps: 45, gear: ['mat'],
      regions: { lowerBack: 0.6, upperBack: 0.4, shoulders: 0.3, glutes: 0.3 },
      desc: 'Kneel, sit back on your heels and stretch your arms forward on the floor.',
      tips: ['Knees wide or together', 'Sink your hips to your heels', 'Reach long through your fingers', 'Breathe into your back'],
      anim: { dur: 2400, frames: [pose([70, 125], 78, [P(66, 143)], [P(160, 145), P(156, 145)]), pose([68, 127], 80, [P(66, 143)], [P(158, 145), P(154, 145)])] },
    },
    {
      id: 'cat-cow', name: 'Cat-Cow', cat: 'mobility', unit: 'reps', sets: 1, reps: 10, gear: ['mat'],
      regions: { lowerBack: 0.7, upperBack: 0.5, abs: 0.3 },
      desc: 'On all fours, slowly round your back up, then let it dip as you look up.',
      tips: ['Move with your breath', 'Exhale to round', 'Inhale to arch', 'Go slow'],
      anim: { dur: 1600, frames: [{ ...QUAD, hip: [78, 110], t: 100 }, { ...QUAD, hip: [78, 115], t: 114 }] },
    },
    {
      id: 'hip-flexor-stretch', name: 'Kneeling Hip Flexor Stretch', cat: 'mobility', unit: 'secs', sets: 2, reps: 30, gear: ['mat'],
      regions: { quads: 0.6, abs: 0.2, glutes: 0.2 },
      desc: 'Kneel in a lunge and gently push your hips forward to stretch the front of your back leg.',
      tips: ['Back knee on a cushion', 'Squeeze the back glute', 'Small forward shift', 'Stay tall'],
      anim: {
        dur: 2200, frames: [
          pose([96, 112], 180, [P(132, 145), P(48, 143, 1)], [A(30, -30)]),
          pose([102, 114], 182, [P(132, 145), P(52, 143, 1)], [A(30, -30)]),
        ],
      },
    },
    {
      id: 'pigeon-pose', name: 'Pigeon Pose', cat: 'mobility', unit: 'secs', sets: 2, reps: 45, gear: ['mat'],
      regions: { glutes: 0.8, quads: 0.3, lowerBack: 0.3 },
      desc: 'Front shin across the mat, back leg long, and fold forward to stretch the hip.',
      tips: ['Square your hips', 'Use a cushion under the hip if needed', 'Fold forward only if it feels good', 'Switch sides'],
      anim: {
        dur: 2400, frames: [
          pose([96, 132], 170, [P(124, 142), A(-84, -88)], [P(118, 145), P(114, 145)]),
          pose([96, 134], 120, [P(124, 142), A(-84, -88)], [P(150, 145), P(146, 145)]),
        ],
      },
    },
    {
      id: 'hamstring-stretch', name: 'Seated Hamstring Stretch', cat: 'mobility', unit: 'secs', sets: 2, reps: 30, gear: ['mat'],
      regions: { hamstrings: 1, lowerBack: 0.4, calves: 0.3 },
      desc: 'Sit with your legs straight and reach for your toes.',
      tips: ['Hinge from the hips', 'Back stays long', 'Reach, don’t bounce', 'Bend knees slightly if needed'],
      anim: { dur: 2400, frames: [SIT(170, [A(90, 90), A(91, 91)], [A(70, 80)]), SIT(124, [A(90, 90), A(91, 91)], [A(80, 86)])] },
    },
    {
      id: 'butterfly-stretch', name: 'Butterfly Stretch', cat: 'mobility', unit: 'secs', sets: 2, reps: 30, gear: ['mat'],
      regions: { adductors: 1, glutes: 0.3 },
      desc: 'Sit tall with the soles of your feet together and let your knees fall open.',
      tips: ['Hold your feet', 'Sit up tall', 'Gently press knees toward the floor', 'Breathe slowly'],
      anim: {
        front: true, dur: 1400, frames: [
          pose([100, 132], 180, [P(104, 146, -1), P(96, 146, 1)], [A(20, 0), A(-20, 0)]),
          pose([100, 132], 180, [P(104, 146, -1), P(96, 146, 1)], [A(18, -4), A(-18, 4)]),
        ],
      },
    },
    {
      id: 'cobra', name: 'Cobra Stretch', cat: 'mobility', unit: 'secs', sets: 2, reps: 20, gear: ['mat'],
      regions: { abs: 0.6, lowerBack: 0.4, chest: 0.3 },
      desc: 'Lying face down, press your chest up with your hands and stretch the front of your body.',
      tips: ['Hips stay on the floor', 'Shoulders down, away from ears', 'Only go as high as is comfortable', 'Breathe'],
      anim: {
        dur: 1800, frames: [
          PRONE(92, [A(-90, -90), A(-91, -91)], [P(118, 145), P(114, 145)]),
          PRONE(128, [A(-90, -90), A(-91, -91)], [P(118, 145), P(114, 145)]),
        ],
      },
    },
    {
      id: 'downward-dog', name: 'Downward Dog', cat: 'mobility', unit: 'secs', sets: 2, reps: 30, gear: ['mat'],
      regions: { hamstrings: 0.7, calves: 0.7, shoulders: 0.6, upperBack: 0.3 },
      desc: 'Hands and feet on the floor, hips high in an upside-down V.',
      tips: ['Push the floor away', 'Hips up and back', 'Heels reach toward the floor', 'Bend knees if hamstrings are tight'],
      anim: { dur: 2000, frames: [PIKE, { ...PIKE, hip: [94, 90] }] },
    },
    {
      id: 'quad-stretch', name: 'Standing Quad Stretch', cat: 'mobility', unit: 'secs', sets: 2, reps: 30, gear: [],
      regions: { quads: 1 },
      desc: 'Stand on one leg and pull your other heel toward your glutes.',
      tips: ['Knees side by side', 'Stand tall', 'Hold a wall for balance', 'Switch sides'],
      anim: { dur: 2000, frames: [pose([100, 82], 180, [P(101, 145), A(-4, -172)], [A(-34, -10), A(40, 80)]), pose([100, 82], 180, [P(101, 145), A(-8, -170)], [A(-38, -14), A(40, 80)])] },
    },
    {
      id: 'side-stretch', name: 'Standing Side Stretch', cat: 'mobility', unit: 'secs', sets: 2, reps: 20, gear: [],
      regions: { obliques: 1, upperBack: 0.3 },
      desc: 'Reach one arm overhead and lean gently to the side.',
      tips: ['Feet hip-width', 'Reach up and over', 'Don’t lean forward', 'Switch sides'],
      anim: {
        front: true, dur: 1600, frames: [
          pose([100, 82], 166, [P(104, 145, -1), P(96, 145, 1)], [A(8, -20), A(-160, -150)]),
          pose([100, 82], 194, [P(104, 145, -1), P(96, 145, 1)], [A(160, 150), A(-8, 20)]),
        ],
      },
    },
  );

  // ═════════ Tags ═════════
  window.EQUIPMENT = {
    bodyweight: 'Bodyweight', dumbbell: 'Dumbbells', band: 'Resistance band', barbell: 'Barbell',
    kettlebell: 'Kettlebell', bench: 'Bench', mat: 'Mat', box: 'Box / step', bar: 'Pull-up bar',
    ball: 'Stability ball', cable: 'Cable', machine: 'Machine',
  };
  // Muscle groups shown as "Works" tags. Derived from regions (weight ≥ 0.5).
  window.GROUPS = {
    legs: ['Legs', ['quads', 'hamstrings', 'calves', 'adductors']],
    glutes: ['Glutes', ['glutes']],
    chest: ['Chest', ['chest']],
    back: ['Back', ['upperBack', 'lowerBack']],
    shoulders: ['Shoulders', ['shoulders']],
    arms: ['Arms', ['biceps', 'triceps', 'forearms']],
    core: ['Core', ['abs', 'obliques']],
    cardio: ['Cardio', []],
    mobility: ['Stretch', []],
  };
  window.CATEGORIES = { lower: 'Lower body', upper: 'Upper body', core: 'Core', cardio: 'Cardio', mobility: 'Stretch & mobility' };

  const LOADS = ['dumbbell', 'barbell', 'kettlebell', 'band', 'cable', 'machine'];
  const LEGACY_EQUIP = {
    'Mat': ['mat'], 'Bench or couch': ['bench'], 'Box or step': ['box'], 'Bench': ['bench'], 'Bench or chair': ['bench'],
    'Dip bars': ['bar'], 'Pull-up bar': ['bar'], 'Dumbbells': ['dumbbell'], 'Light dumbbells': ['dumbbell'], 'Dumbbell': ['dumbbell'],
    'Dumbbell or kettlebell': ['dumbbell', 'kettlebell'], 'Barbell': ['barbell'], 'Kettlebell': ['kettlebell'],
  };

  /** Equipment keys an exercise is tagged with (bodyweight added when nothing loads it). */
  window.gearOf = function (ex) {
    const g = (ex.gear || LEGACY_EQUIP[ex.equip] || []).filter((k) => window.EQUIPMENT[k]);
    return g.some((k) => LOADS.includes(k)) ? g : ['bodyweight', ...g.filter((k) => k !== 'bodyweight')];
  };
  /** Muscle-group keys an exercise works. */
  window.groupsOf = function (ex) {
    const out = [];
    for (const [k, [, regs]] of Object.entries(window.GROUPS)) {
      if (regs.some((r) => (ex.regions || {})[r] >= 0.5)) out.push(k);
    }
    if (ex.cat === 'cardio') out.push('cardio');
    if (ex.cat === 'mobility') out.push('mobility');
    return out;
  };

  // Older entries: weights folded into body areas, extra equipment options
  const byId = Object.fromEntries(window.EXERCISES.map((e) => [e.id, e]));
  for (const ex of window.EXERCISES) {
    if (!ex.gear) ex.gear = LEGACY_EQUIP[ex.equip] || [];
    if (ex.cat === 'weights') ex.cat = window.groupsOf(ex).some((g) => g === 'legs' || g === 'glutes') ? 'lower' : 'upper';
    delete ex.equip;
  }
  Object.assign(byId['kb-swing'].anim, { kb: true, db: 'near' });
  byId['goblet-squat'].anim.db = 'near';
  byId['db-rdl'].gear = ['dumbbell']; byId['db-rdl'].opt = ['kettlebell', 'barbell'];
  byId['bent-over-row'].opt = ['barbell', 'kettlebell'];
  byId['overhead-tricep'].opt = ['kettlebell'];
  byId['farmer-carry'].opt = ['kettlebell'];
  byId['hip-thrust'].opt = ['dumbbell', 'barbell', 'band'];
  byId['glute-bridge'].opt = ['band', 'dumbbell'];
  byId['donkey-kick'].opt = ['band'];
  byId['fire-hydrant'].opt = ['band'];
  byId['side-leg-lift'].opt = ['band'];
  byId['squat'].opt = ['band'];
  byId['pull-up'].opt = ['band'];
  byId['jump-rope'].gear = [];
  byId['jump-rope'].note = 'Jump rope, or just mime it';
  byId['bicep-curl'].opt = ['band'];
  byId['lateral-raise'].opt = ['band'];
  byId['shoulder-press'].opt = ['band', 'kettlebell'];
})();
