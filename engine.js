/* FitFlow — data + rule-based adaptive engine (offline, no deps) */
window.FF = (function () {
  const APP_VERSION = '1.3.0';
  const DAY = 864e5;
  const uid = () => Math.random().toString(36).slice(2, 10);
  const iso = (daysAgo, h = 7, m = 0) => { const d = new Date(Date.now() - daysAgo * DAY); d.setHours(h, m, 0, 0); return d.toISOString(); };
  /* YYYY-MM-DD in the phone's own timezone (toISOString() is UTC: before 07:00 WIB it returns yesterday) */
  const localDate = (d) => { const x = d ? new Date(d) : new Date(); return new Date(x.getTime() - x.getTimezoneOffset() * 60000).toISOString().slice(0, 10); };
  /* measuredAt for a picked date: today → now; a past day → 07:00 local (morning weigh-in) */
  const measuredAtFor = (ymd) => { if (!ymd || ymd >= localDate()) return new Date().toISOString(); const d = new Date(ymd + 'T07:00:00'); return isNaN(d) ? new Date().toISOString() : d.toISOString(); };
  const daysSince = (isoStr) => Math.floor((Date.now() - new Date(isoStr).getTime()) / DAY);

  /* ---------- Locations ---------- */
  const LOCATIONS = [
    { id: 'home-strength', label: 'Rumah — Strength', short: 'Rumah', kind: 'strength', loc: 'home' },
    { id: 'fithub', label: 'FitHub — Strength', short: 'FitHub', kind: 'strength', loc: 'gym' },
    { id: 'home-treadmill', label: 'Rumah — Treadmill', short: 'Treadmill', kind: 'cardio' },
    { id: 'home-muaythai', label: 'Rumah — Muay Thai', short: 'Muay Thai', kind: 'muaythai' },
    { id: 'cardio-other', label: 'Cardio lainnya', short: 'Cardio', kind: 'cardio' },
  ];

  /* ---------- Equipment ---------- */
  const EQUIPMENT = [
    ['home', 'FT1 functional trainer', 2.5, ['cable-adj', 'cable-high', 'pulldown', 'row']], ['home', 'Dumbbell', 2.5, ['dumbbell']], ['home', 'Pull-up bar', 0, ['pullup']], ['home', 'Bench', 0, ['bench']], ['home', 'Bodyweight', 0, ['bodyweight']],
    ['gym', 'Dumbbell', 2.5, ['dumbbell']], ['gym', 'Barbell + plates', 2.5, ['barbell']], ['gym', 'Adjustable bench', 0, ['bench']], ['gym', 'Decline adjusted bench', 0, ['decline']],
    ['gym', 'Preacher bench', 0, ['preacher']], ['gym', 'Back extension bench', 0, ['backext-bench']], ['gym', 'Power rack', 2.5, ['rack']], ['gym', 'Smith machine', 2.5, ['smith']],
    ['gym', 'Chest press vertical machine', 5, ['chestpress']], ['gym', 'Multi press machine', 5, ['multipress']], ['gym', 'Pec fly / rear delt machine', 5, ['pecfly']], ['gym', 'Dip / chin assist machine', 5, ['dipassist', 'pullup']],
    ['gym', 'Jungle 8 — adjustable pulley', 2.5, ['cable-adj']], ['gym', 'Jungle 8 — hanging pulley', 2.5, ['cable-high']], ['gym', 'Jungle 8 — pulldown', 5, ['pulldown']], ['gym', 'Jungle 8 — row', 5, ['row']],
    ['gym', 'Leg press machine', 5, ['legpress']], ['gym', 'Super squat machine', 5, ['supersquat']], ['gym', 'Leg extension machine', 5, ['legext']], ['gym', 'Leg curl prone machine', 5, ['legcurl']],
    ['gym', 'Abductor & adductor machine', 5, ['abadduct']], ['gym', 'Torso rotation machine', 5, ['torso']], ['gym', 'Bodyweight', 0, ['bodyweight']],
  ].map(([loc, name, inc, cats], i) => ({ id: 'eq' + i, loc, name, inc, cats: cats || [], available: true, favorite: false }));

  /* ---------- Exercises ----------
     pat: hpush vpush hpull vpull knee hip shabd elbflex elbext calf core
     kind: major | accessory ; loc: home/gym ; start: starting weight kg */
  const EX = [
    ['ft1-chest-press', 'FT1 Chest Press', ['chest', 'triceps'], 'hpush', 'FT1 cable', 2.5, ['home'], 'major', [8, 12], 25, 1, ['cable-adj']],
    ['db-bench-press', 'Dumbbell Bench Press', ['chest', 'triceps'], 'hpush', 'Dumbbell + adjustable bench', 2.5, ['home', 'gym'], 'major', [8, 12], 16, 1, ['dumbbell', 'bench']],
    ['incline-db-press', 'Incline Dumbbell Press', ['chest', 'shoulder'], 'hpush', 'Dumbbell + adjustable bench', 2.5, ['home', 'gym'], 'major', [8, 12], 14, 1, ['dumbbell', 'bench']],
    ['decline-db-press', 'Decline Dumbbell Press', ['chest', 'triceps'], 'hpush', 'Dumbbell + decline adjusted bench', 2.5, ['gym'], 'accessory', [8, 12], 16, 0, ['dumbbell', 'decline']],
    ['machine-chest-press', 'Chest Press Vertical', ['chest', 'triceps'], 'hpush', 'Chest press vertical machine', 5, ['gym'], 'major', [8, 12], 40, 1, ['chestpress']],
    ['incline-chest-press', 'Incline Press (Multi Press)', ['chest', 'shoulder'], 'hpush', 'Multi press machine', 5, ['gym'], 'major', [8, 12], 35, 0, ['multipress']],
    ['pec-deck', 'Pec Fly', ['chest'], 'hpush', 'Pec fly / rear delt machine', 5, ['gym'], 'accessory', [10, 15], 40, 0, ['pecfly']],
    ['db-shoulder-press', 'Dumbbell Shoulder Press', ['shoulder', 'triceps'], 'vpush', 'Dumbbell', 2.5, ['home', 'gym'], 'major', [8, 12], 12, 1, ['dumbbell']],
    ['machine-shoulder-press', 'Shoulder Press (Multi Press)', ['shoulder', 'triceps'], 'vpush', 'Multi press machine', 5, ['gym'], 'major', [8, 12], 30, 1, ['multipress']],
    ['lateral-raise', 'Lateral Raise', ['shoulder'], 'shabd', 'Dumbbell', 2.5, ['home', 'gym'], 'accessory', [12, 20], 8, 1, ['dumbbell']],
    ['lateral-raise-machine', 'Cable Lateral Raise', ['shoulder'], 'shabd', 'Jungle 8 — adjustable pulley', 2.5, ['gym'], 'accessory', [12, 20], 10, 0, ['cable-adj']],
    ['rear-delt-machine', 'Rear Delt Machine', ['shoulder', 'back'], 'hpull', 'Pec fly / rear delt machine', 5, ['gym'], 'accessory', [12, 18], 30, 0, ['pecfly']],
    ['pull-up', 'Pull-up', ['back', 'biceps'], 'vpull', 'Pull-up bar', 0, ['home', 'gym'], 'major', [5, 10], 0, 1, ['pullup']],
    ['assisted-pull-up', 'Assisted Pull-up / Chin', ['back', 'biceps'], 'vpull', 'Dip / chin assist machine', 5, ['gym'], 'major', [8, 12], 25, 1, ['dipassist']],
    ['lat-pulldown', 'Lat Pulldown (Jungle 8)', ['back', 'biceps'], 'vpull', 'Jungle 8 — pulldown', 5, ['gym'], 'major', [8, 12], 50, 1, ['pulldown']],
    ['ft1-pulldown', 'FT1 Kneeling Pulldown', ['back', 'biceps'], 'vpull', 'FT1 cable', 2.5, ['home'], 'major', [8, 12], 30, 1, ['pulldown']],
    ['seated-cable-row', 'Seated Cable Row (Jungle 8)', ['back', 'biceps'], 'hpull', 'Jungle 8 — row', 5, ['gym'], 'major', [8, 12], 45, 1, ['row']],
    ['machine-row', 'Cable Row — Wide Grip', ['back', 'biceps'], 'hpull', 'Jungle 8 — row', 5, ['gym'], 'major', [8, 12], 40, 0, ['row']],
    ['ft1-row', 'FT1 One-arm Cable Row', ['back', 'biceps'], 'hpull', 'FT1 cable', 2.5, ['home'], 'major', [8, 12], 20, 1, ['row']],
    ['bb-squat', 'Barbell Squat', ['quad', 'glute', 'core'], 'knee', 'Power rack + barbell', 2.5, ['gym'], 'major', [6, 10], 40, 1, ['rack', 'barbell']],
    ['smith-squat', 'Smith Machine Squat', ['quad', 'glute'], 'knee', 'Smith machine', 2.5, ['gym'], 'major', [8, 12], 40, 1, ['smith']],
    ['squat-machine', 'Super Squat', ['quad', 'glute'], 'knee', 'Super squat machine', 5, ['gym'], 'major', [8, 12], 60, 1, ['supersquat']],
    ['leg-press', 'Leg Press', ['quad', 'glute'], 'knee', 'Leg press machine', 5, ['gym'], 'major', [8, 12], 100, 1, ['legpress']],
    ['hack-squat', 'Pendulum / Hack Squat', ['quad', 'glute'], 'knee', 'Super squat machine', 5, ['gym'], 'major', [8, 12], 60, 0, ['supersquat']],
    ['goblet-squat', 'Goblet Squat', ['quad', 'glute'], 'knee', 'Dumbbell', 2.5, ['home', 'gym'], 'major', [10, 15], 20, 1, ['dumbbell']],
    ['bulgarian-split-squat', 'Bulgarian Split Squat', ['quad', 'glute'], 'knee', 'Dumbbell + bench', 2.5, ['home', 'gym'], 'major', [8, 12], 10, 0, ['dumbbell', 'bench']],
    ['leg-extension', 'Leg Extension', ['quad'], 'knee', 'Leg extension machine', 5, ['gym'], 'accessory', [10, 15], 40, 1, ['legext']],
    ['seated-leg-curl', 'Leg Curl (Prone)', ['hamglute'], 'hip', 'Leg curl prone machine', 5, ['gym'], 'accessory', [10, 15], 35, 1, ['legcurl']],
    ['lying-leg-curl', 'Leg Curl Prone — Single Leg', ['hamglute'], 'hip', 'Leg curl prone machine', 5, ['gym'], 'accessory', [10, 15], 30, 0, ['legcurl']],
    ['db-rdl', 'Dumbbell Romanian Deadlift', ['hamglute', 'back'], 'hip', 'Dumbbell', 2.5, ['home', 'gym'], 'major', [8, 12], 16, 1, ['dumbbell']],
    ['hip-thrust', 'Barbell Hip Thrust', ['hamglute'], 'hip', 'Barbell + adjustable bench', 2.5, ['gym'], 'major', [8, 12], 40, 0, ['barbell', 'bench']],
    ['back-extension', 'Back Extension', ['hamglute', 'back'], 'hip', 'Back extension bench', 0, ['gym'], 'accessory', [12, 20], 0, 0, ['backext-bench']],
    ['hip-abduction', 'Hip Abduction (Glute)', ['glute'], 'hip', 'Abductor & adductor machine', 5, ['gym'], 'accessory', [12, 20], 40, 0, ['abadduct']],
    ['hip-adduction', 'Hip Adduction (Adductor)', ['hamglute'], 'hip', 'Abductor & adductor machine', 5, ['gym'], 'accessory', [12, 20], 40, 0, ['abadduct']],
    ['calf-raise-machine', 'Smith Machine Calf Raise', ['calf'], 'calf', 'Smith machine', 5, ['gym'], 'accessory', [12, 20], 50, 1, ['smith']],
    ['db-calf-raise', 'Standing Calf Raise', ['calf'], 'calf', 'Dumbbell / bodyweight', 2.5, ['home', 'gym'], 'accessory', [12, 20], 16, 1, ['dumbbell']],
    ['db-curl', 'Dumbbell Curl', ['biceps'], 'elbflex', 'Dumbbell', 2.5, ['home', 'gym'], 'accessory', [10, 15], 10, 1, ['dumbbell']],
    ['preacher-curl', 'Preacher Curl', ['biceps'], 'elbflex', 'Preacher bench + dumbbell', 2.5, ['gym'], 'accessory', [8, 12], 10, 0, ['preacher', 'dumbbell']],
    ['cable-curl', 'Cable Curl', ['biceps'], 'elbflex', 'Cable (FT1 / Jungle 8)', 2.5, ['home', 'gym'], 'accessory', [10, 15], 15, 1, ['cable-adj']],
    ['triceps-pushdown', 'Triceps Pushdown', ['triceps'], 'elbext', 'Cable (FT1 / Jungle 8 hanging)', 2.5, ['home', 'gym'], 'accessory', [10, 15], 15, 1, ['cable-high']],
    ['overhead-triceps', 'Overhead Triceps Extension', ['triceps'], 'elbext', 'Dumbbell / cable', 2.5, ['home', 'gym'], 'accessory', [10, 15], 12, 0, ['dumbbell']],
    ['dip', 'Dip', ['chest', 'triceps'], 'elbext', 'Dip bar / assist (atau bodyweight)', 0, ['home', 'gym'], 'major', [6, 12], 0, 1, ['dipassist', 'bodyweight']],
    ['torso-rotation', 'Torso Rotation', ['core'], 'core', 'Torso rotation machine', 5, ['gym'], 'accessory', [12, 20], 25, 0, ['torso']],
    ['plank', 'Plank', ['core'], 'core', 'Bodyweight', 0, ['home', 'gym'], 'accessory', [30, 60], 0, 1, ['bodyweight']],
    ['cable-crunch', 'Cable Crunch', ['core'], 'core', 'Cable (FT1 / Jungle 8 hanging)', 2.5, ['home', 'gym'], 'accessory', [12, 20], 20, 0, ['cable-high']],
  ].map(a => ({ id: a[0], name: a[1], mus: a[2], pat: a[3], equip: a[4], inc: a[5], loc: a[6], kind: a[7], rep: a[8], start: a[9], pref: a[10], cats: a[11] || [] }));
  // Bilateral two-dumbbell moves (one weight per hand) — tonnage counts both limbs.
  const PER_HAND = new Set(['db-bench-press', 'incline-db-press', 'decline-db-press', 'db-shoulder-press', 'lateral-raise', 'db-rdl', 'db-calf-raise', 'db-curl', 'preacher-curl']);
  EX.forEach(e => { if (PER_HAND.has(e.id)) e.perHand = true; });
  const exById = id => EX.find(e => e.id === id);

  const MUSCLE_LABEL = { chest: 'Dada', shoulder: 'Bahu', back: 'Punggung', biceps: 'Biceps', triceps: 'Triceps', core: 'Core', quad: 'Quadriceps', hamglute: 'Hamstring/Glute', glute: 'Glute', calf: 'Betis' };
  const SORE_OPTIONS = [
    { id: 'chest', label: 'Dada' }, { id: 'shoulder', label: 'Bahu' }, { id: 'back', label: 'Punggung' },
    { id: 'arms', label: 'Biceps/Triceps' }, { id: 'core', label: 'Core' }, { id: 'quad', label: 'Quadriceps' },
    { id: 'hamglute', label: 'Hamstring/Glute' }, { id: 'calf', label: 'Betis' },
  ];
  const soreToMuscles = (s) => s === 'arms' ? ['biceps', 'triceps'] : [s];
  /* soreness ctx entries may be 'chest' (berat) or {id:'chest',level:'ringan'|'berat'} */
  const soreLevel = (entry) => typeof entry === 'string' ? { id: entry, level: 'berat' } : entry;

  /* ---------- Technique library ---------- */
  const PAT_LABEL = { hpush: 'Horizontal Push', vpush: 'Vertical Push', hpull: 'Horizontal Pull', vpull: 'Vertical Pull', knee: 'Squat / Knee-dominant', hip: 'Hinge / Hip-dominant', shabd: 'Shoulder Abduction', elbflex: 'Elbow Flexion', elbext: 'Elbow Extension', calf: 'Calf Plantar Flexion', core: 'Core Stability' };
  const TECH_DETAIL = {
    'machine-chest-press': {
      setup: 'Atur seat sehingga handle sejajar mid-chest. Punggung dan kepala menempel pada backrest, kaki rata di lantai.',
      startpos: 'Scapula ditarik ke belakang dan ke bawah, dada terangkat, pergelangan lurus segaris lengan bawah, siku ±45–60° dari torso.',
      cues: 'Bayangkan lengan atas bergerak mendekat satu sama lain karena kontraksi dada, bukan sekadar mendorong handle menggunakan tangan.',
      mistakes: ['Bahu terangkat ke arah telinga', 'Scapula lepas dari backrest saat mendorong', 'Siku terlalu lebar (90°)', 'ROM terlalu pendek', 'Bouncing di posisi bawah'],
    },
    'lat-pulldown': {
      setup: 'Atur thigh pad menahan paha. Grip sedikit lebih lebar dari bahu, telapak menghadap depan.',
      startpos: 'Duduk tegak dengan sedikit lean ke belakang (10–15°), dada terangkat, lengan lurus penuh di atas.',
      cues: 'Tarik siku ke arah pinggang, bukan menarik bar dengan tangan. Rasakan lat melebar di posisi atas dan berkontraksi saat bar mendekati dada.',
      mistakes: ['Momentum dengan ayunan badan', 'Bar ditarik ke belakang leher', 'Bahu tidak diturunkan sebelum menarik', 'ROM atas tidak penuh'],
    },
    'leg-press': {
      setup: 'Kaki selebar bahu di tengah platform, punggung bawah dan pinggul menempel penuh pada sandaran.',
      startpos: 'Lutut segaris arah jari kaki, safety handle terjangkau, core braced.',
      cues: 'Dorong melalui mid-foot dan tumit. Turunkan terkontrol sampai lutut ±90° tanpa pinggul terangkat dari sandaran.',
      mistakes: ['Lutut mengunci keras di atas', 'Pinggul terangkat (butt wink)', 'ROM terlalu pendek dengan beban besar', 'Lutut collapse ke dalam'],
    },
    'goblet-squat': {
      setup: 'Pegang dumbbell vertikal di depan dada, siku mengarah ke bawah. Kaki selebar bahu, jari kaki sedikit keluar.',
      startpos: 'Dada tegak, core braced, berat badan di mid-foot.',
      cues: 'Turun seperti duduk di antara kedua tumit. Siku bergerak di antara lutut. Dorong lantai menjauh saat naik.',
      mistakes: ['Tumit terangkat', 'Punggung membulat', 'Lutut collapse ke dalam', 'Kedalaman kurang'],
    },
    'db-rdl': {
      setup: 'Dumbbell di depan paha, kaki selebar pinggul, lutut soft (sedikit menekuk).',
      startpos: 'Bahu ditarik ke belakang, tulang belakang netral, pandangan mengikuti torso.',
      cues: 'Dorong pinggul ke belakang seperti menutup pintu mobil dengan pantat. Rasakan tarikan hamstring, bukan punggung bawah.',
      mistakes: ['Punggung membulat', 'Gerakan jadi squat (lutut terlalu menekuk)', 'Bar/dumbbell menjauh dari kaki', 'Hiperekstensi di atas'],
    },
    'lateral-raise': {
      setup: 'Berdiri tegak, dumbbell di samping paha, sedikit condong ke depan.',
      startpos: 'Siku sedikit menekuk dan dikunci di sudut tersebut, bahu ditarik turun menjauh dari telinga.',
      cues: 'Angkat dengan siku memimpin, seperti menuang air dari teko di posisi atas. Berhenti setinggi bahu.',
      mistakes: ['Momentum/ayunan badan', 'Bahu ikut terangkat (trap dominan)', 'Beban terlalu berat sehingga ROM pendek'],
    },
    'pull-up': {
      setup: 'Grip sedikit lebih lebar dari bahu, dead hang penuh, kaki menyilang di belakang.',
      startpos: 'Scapula ditarik turun (depressed) sebelum menarik, core kencang, tubuh tidak berayun.',
      cues: 'Bayangkan menarik siku ke tulang rusuk. Dada mengarah ke bar, bukan dagu mengejar bar.',
      mistakes: ['Kipping/berayun', 'ROM setengah', 'Bahu shrug di posisi bawah', 'Leher menjulur'],
    },
    'db-curl': {
      setup: 'Berdiri atau duduk tegak, dumbbell di samping dengan grip supinasi.',
      startpos: 'Siku menempel di sisi torso, bahu ditarik ke belakang.',
      cues: 'Hanya lengan bawah yang bergerak. Squeeze biceps satu detik di atas, turunkan 2–3 detik.',
      mistakes: ['Siku maju ke depan (jadi front raise)', 'Ayunan pinggang', 'Turun terlalu cepat'],
    },
    'preacher-curl': {
      setup: 'Atur tinggi preacher bench sehingga ketiak menempel di bantalan atas. Duduk stabil, lengan atas menempel penuh pada pad miring.',
      startpos: 'Grip supinasi selebar bahu, siku tertanam di pad, bahu rileks turun.',
      cues: 'Naikkan beban sampai kontraksi puncak tanpa siku terangkat. Turunkan penuh sampai lengan hampir lurus (jangan hyperextend), tahan 2–3 detik.',
      mistakes: ['Tidak menurunkan penuh (ROM pendek)', 'Siku terangkat dari pad', 'Beban terlalu berat sehingga menyentak', 'Bahu ikut naik'],
    },
    'back-extension': {
      setup: 'Atur pad paha tepat di bawah tulang pinggul agar pinggang bebas menekuk. Pergelangan kaki terkunci di bawah roller.',
      startpos: 'Tubuh lurus dari kepala ke tumit, tangan menyilang di dada atau di belakang kepala.',
      cues: 'Turunkan torso dengan menekuk di pinggul (bukan membulatkan punggung), lalu angkat sampai tubuh segaris — jangan hyperextend. Remas glute di atas.',
      mistakes: ['Hyperekstensi berlebihan di puncak', 'Membulatkan punggung bawah', 'Momentum ayun', 'ROM terlalu pendek'],
    },
    'hip-abduction': {
      setup: 'Duduk tegak di abductor machine, punggung menempel sandaran, pad di sisi luar paha.',
      startpos: 'Lutut dan kaki rapat di posisi awal, core braced, tangan memegang handle.',
      cues: 'Buka kedua paha ke luar melawan pad dengan kontraksi glute medius, tahan 1 detik di posisi terbuka, kembali terkontrol.',
      mistakes: ['Condong badan untuk bantu dorong', 'Gerakan menyentak', 'ROM tidak penuh', 'Beban terlalu berat'],
    },
    'hip-adduction': {
      setup: 'Duduk tegak di adductor machine, pad di sisi dalam paha, kaki mulai terbuka.',
      startpos: 'Punggung menempel sandaran, core braced, paha terbuka senyaman mungkin (tanpa nyeri).',
      cues: 'Rapatkan kedua paha melawan pad dengan otot adduktor, tahan 1 detik, buka kembali perlahan menahan beban.',
      mistakes: ['Membuka terlalu lebar hingga nyeri selangkangan', 'Menyentak menutup', 'ROM pendek', 'Punggung lepas dari sandaran'],
    },
    'torso-rotation': {
      setup: 'Duduk di torso rotation machine, kunci panel/pad dada dan paha agar pinggul tidak ikut berputar.',
      startpos: 'Duduk tegak, core braced, pandangan lurus, rotasi mulai dari posisi netral.',
      cues: 'Putar torso perlahan dari otot oblique, bukan momentum. Tahan sebentar di ujung rotasi, kembali terkontrol. Latih kedua sisi seimbang.',
      mistakes: ['Beban terlalu berat sehingga memutar lewat momentum', 'Pinggul ikut berputar', 'Menahan napas', 'ROM asimetris kiri-kanan'],
    },
    'decline-db-press': {
      setup: 'Atur bench ke sudut decline ringan (±15–30°), kunci kaki. Angkat dumbbell ke posisi dada bawah.',
      startpos: 'Scapula ditarik, pergelangan lurus, siku ±45° dari torso.',
      cues: 'Dorong dumbbell ke atas menyatu di garis dada bawah, turunkan terkontrol sampai peregangan dada. Fokus pada pectoral bagian bawah.',
      mistakes: ['Decline terlalu curam (jadi tekanan bahu/leher)', 'Siku terlalu lebar', 'Bouncing di bawah', 'ROM pendek'],
    },
  };
  const techniqueFor = (id) => {
    const ex = exById(id); if (!ex) return null;
    const d = TECH_DETAIL[id] || {};
    const lower = ['knee', 'hip', 'calf'].includes(ex.pat);
    return {
      name: ex.name, pattern: PAT_LABEL[ex.pat], equip: ex.equip,
      target: ex.mus.map(m => MUSCLE_LABEL[m] || m).join(', '),
      support: ex.pat === 'hpush' || ex.pat === 'vpush' ? 'Triceps, deltoid anterior, core' : ex.pat === 'hpull' || ex.pat === 'vpull' ? 'Biceps, rear delt, forearm' : lower ? 'Core, erector spinae' : 'Core, stabilizer bahu',
      setup: d.setup || 'Atur alat (seat, bench, cable) sehingga sendi yang bekerja sejajar sumbu gerakan. Posisi kaki stabil, grip selebar nyaman.',
      startpos: d.startpos || 'Tulang belakang netral, scapula terkontrol, pergelangan lurus, core braced sebelum repetisi pertama.',
      steps: ['Setup posisi dan brace core', 'Mulai gerakan dari otot target, bukan momentum', 'Fase concentric terkontrol (±1 detik)', 'Tahan sejenak di posisi puncak', 'Fase eccentric perlahan (2–3 detik)', 'Reset posisi sebelum repetisi berikutnya'],
      breathing: 'Inhale saat fase menurunkan (eccentric), exhale saat mendorong/menarik (concentric). Brace ringan sebelum repetisi berat; jangan menahan napas terlalu lama.',
      tempo: 'Eccentric terkontrol 2–3 detik · pause singkat · concentric halus 1 detik.',
      rom: 'Gunakan rentang gerak penuh yang bebas nyeri. Berhenti sebelum sendi mengunci keras; sesuaikan ROM dengan alat yang dipakai.',
      cues: d.cues || 'Fokuskan perhatian pada otot target yang memendek dan memanjang. Jika otot kompensator lebih terasa, turunkan beban dan perlambat tempo.',
      mistakes: d.mistakes || ['Beban terlalu berat sehingga teknik rusak', 'ROM terlalu pendek', 'Momentum menggantikan kontraksi otot', 'Napas ditahan sepanjang set'],
      safety: 'Hentikan set bila muncul nyeri sendi tajam (bukan rasa terbakar otot). Turunkan beban bila 2 set berturut-turut gagal di bawah target bawah.',
      alternatives: EX.filter(e => e.pat === ex.pat && e.id !== id).slice(0, 4).map(e => e.name),
      refs: 'Prinsip umum mengacu pada position stands ACSM & NSCA untuk resistance training.',
    };
  };

  /* ---------- Warm-up / cool-down ---------- */
  const warmupFor = (patterns) => {
    const upper = patterns.some(p => ['hpush', 'vpush', 'hpull', 'vpull', 'shabd', 'elbflex', 'elbext'].includes(p));
    const lower = patterns.some(p => ['knee', 'hip', 'calf'].includes(p));
    const list = [{ t: 'General', dur: '3–5 mnt', goal: 'Naikkan suhu inti & detak jantung', items: ['Treadmill / jalan cepat ringan', 'Zona 1–2, napas mulai berat ringan', 'Cukup sampai sedikit berkeringat'] }];
    if (upper) list.push({ t: 'Mobility', dur: '2–3 mnt', goal: 'Buka rentang gerak bahu & thoracic', items: ['Arm circles — ×10 tiap arah', 'Thoracic rotation — ×8 / sisi', 'Scapular slide (wall slide) — ×10', 'Band pull-apart — ×15'] });
    if (lower) list.push({ t: 'Mobility', dur: '2–3 mnt', goal: 'Buka pinggul, lutut & pergelangan kaki', items: ['Ankle rocks — ×10 / sisi', 'Hip rotation (90/90) — ×8 / sisi', 'Bodyweight squat pelan — ×10', 'Leg swings — ×10 / sisi'] });
    list.push({ t: 'Activation', dur: '2 mnt', goal: 'Nyalakan otot penstabil sebelum beban', items: upper && !lower ? ['Scapular retraction — ×12', 'Band/cable external rotation ringan — ×12', 'Face pull ringan — ×15'] : ['Glute bridge — ×12', 'Bodyweight squat — ×10', 'Bird-dog — ×8 / sisi'] });
    list.push({ t: 'Specific', dur: '2–3 mnt', goal: 'Ramp-up ke gerakan pertama (tidak dihitung volume)', items: ['Set 1: ±50% beban kerja × 10', 'Set 2: ±70% beban kerja × 5', 'Istirahat singkat, lalu mulai set kerja'] });
    return list.map(w => ({ ...w, d: w.items.join(', ') }));
  };
  const COOLDOWN = [{ t: 'Active', d: 'Jalan pelan 2–3 menit' }, { t: 'Breathing', d: 'Napas hidung 4-4-8 ×5 siklus' }, { t: 'Stretch', d: 'Stretching statis ringan otot yang dilatih, 20–30 detik/area' }];

  /* ---------- HR / cardio ---------- */
  const hrMax = (db) => db.settings.hrMaxOverride || Math.round(208 - 0.7 * db.profile.age);
  // suggest calibration when several recent sessions record a maxHr above the active HRmax (not a one-off spike)
  function hrMaxSuggestion(db) {
    const active = hrMax(db);
    const highs = db.sessions.filter(s => s.cardio && s.cardio.maximumHr && daysSince(s.date) <= 90 && s.cardio.maximumHr > active + 2)
      .map(s => s.cardio.maximumHr).sort((a, b) => b - a);
    if (highs.length < 2) return null;
    const suggested = highs[0]; // highest sustained observed
    return { suggested, count: highs.length, current: active };
  }
  const classifyCardio = (db, avgHr, durMin) => {
    if (!avgHr) return durMin >= 45 ? 'sedang' : 'ringan';
    const hrr = (avgHr - db.settings.restingHr) / (hrMax(db) - db.settings.restingHr);
    return hrr < 0.55 ? 'ringan' : hrr < 0.75 ? 'sedang' : 'berat';
  };
  const INTENSITY_FACTOR = { ringan: 1.0, sedang: 1.5, berat: 2.0 };
  const cardioLoad = (min, intensity, type) => Math.round(min * (type === 'muaythai' && intensity === 'berat' ? 2.2 : INTENSITY_FACTOR[intensity] || 1));
  const CARDIO_TYPES = [
    { id: 'treadmill-walk', label: 'Treadmill Walk' }, { id: 'treadmill-run', label: 'Treadmill Run' },
    { id: 'outdoor-walk', label: 'Outdoor Walk' }, { id: 'outdoor-run', label: 'Outdoor Run' },
    { id: 'cycling', label: 'Cycling' }, { id: 'muaythai', label: 'Muay Thai' }, { id: 'other', label: 'Cardio lainnya' },
  ];

  /* ---------- Recovery model ---------- */
  const MT_MUSCLES = ['shoulder', 'core', 'quad', 'hamglute', 'calf'];
  function muscleDays(db) {
    const res = {}; Object.keys(MUSCLE_LABEL).forEach(m => res[m] = 99);
    db.sessions.forEach(s => {
      const d = daysSince(s.date);
      (s.exercises || []).forEach(se => { const ex = exById(se.exId); if (ex) ex.mus.forEach(m => { if (d < res[m]) res[m] = d; }); });
      if (s.sessionType === 'muaythai') MT_MUSCLES.forEach(m => { if (d < res[m]) res[m] = d; });
    });
    return res;
  }
  function patternDays(db) {
    const res = {}; Object.keys(PAT_LABEL).forEach(p => res[p] = 99);
    db.sessions.forEach(s => { const d = daysSince(s.date); (s.exercises || []).forEach(se => { const ex = exById(se.exId); if (ex && d < res[ex.pat]) res[ex.pat] = d; }); });
    return res;
  }
  const recentCardioLoad = (db, days) => db.sessions.filter(s => (s.cardio) && daysSince(s.date) < days).reduce((a, s) => a + (s.cardio.load || 0), 0);
  const lastSession = (db) => db.sessions.slice().sort((a, b) => new Date(b.date) - new Date(a.date))[0];

  /* Recovery map: readiness status per major muscle group for the body silhouette.
     ready (≥3d rest) · partial (1–2d) · sore (0d or flagged) · nodata (never trained). */
  const BODY_GROUPS = {
    chest: ['chest'], shoulders: ['shoulder'], back: ['back'], arms: ['biceps', 'triceps'],
    core: ['core'], quads: ['quad'], hamglutes: ['hamglute', 'glute'], calves: ['calf'],
  };
  function recoveryMap(db) {
    const md = muscleDays(db);
    const out = {};
    for (const g in BODY_GROUPS) {
      const d = Math.min(...BODY_GROUPS[g].map(m => md[m] ?? 99));
      out[g] = d >= 99 ? 'nodata' : d === 0 ? 'sore' : d <= 2 ? 'partial' : 'ready';
      out[g + 'Days'] = d >= 99 ? null : d;
      // recovery %: 0d≈35%, 1d≈65%, 2d≈85%, ≥3d=100% (no data = null)
      out[g + 'Pct'] = d >= 99 ? null : d >= 3 ? 100 : Math.round([35, 65, 85][d]);
    }
    return out;
  }

  /* ---------- 1RM & PR ---------- */
  // Bodyweight-loaded movements: effective load = bodyweight × leverage ratio + any added weight.
  const BW_RATIO = { 'pull-up': 1.0, 'dip': 1.0, 'push-up': 0.64 };
  const isBWmove = id => BW_RATIO[id] != null;
  function bodyKg(db) {
    const m = (db.bodyMetrics || []).slice().sort((a, b) => new Date(b.measuredAt) - new Date(a.measuredAt))[0];
    return (m && m.weightKg) || (db.targets && db.targets.weightKg) || 70;
  }
  // Cable pulley conversion: functional-trainer / adjustable-pulley cables run 2:1 (feel half the
  // stack you pin). Dedicated pulldown/row stations feel ~true (1:1) so are omitted. The user logs
  // the STACK number they set; effLoad converts to effective resistance for tonnage/1RM comparability.
  const CABLE_RATIO = { 'ft1-chest-press': 0.5, 'ft1-pulldown': 0.5, 'ft1-row': 0.5, 'cable-curl': 0.5, 'lateral-raise-machine': 0.5, 'triceps-pushdown': 0.5, 'cable-crunch': 0.5 };
  // Home adjustable dumbbell discrete loads (9·18·27·35·44·53 lb ≈ these kg). Progression snaps to these.
  const DUMBBELL_LADDER = [4, 8, 12, 16, 20, 24];
  const nextLoadUp = (cur, ladder) => { for (const v of ladder) if (v > cur + 0.01) return v; return null; };
  // effective per-rep load for a set of a given exercise (accounts for bodyweight moves + cable ratio)
  function effLoad(db, exId, w) {
    if (exId === 'assisted-pull-up') return Math.max(0, +(bodyKg(db) - (w || 0)).toFixed(1)); // logged value is assistance
    const cr = CABLE_RATIO[exId];
    if (cr) return +((w || 0) * cr).toFixed(1);
    const r = BW_RATIO[exId];
    return r ? +(bodyKg(db) * r + (w || 0)).toFixed(1) : (w || 0);
  }
  // tonnage (kg lifted) for one exercise's working sets, bodyweight-aware
  function setTonnage(db, exId, sets) {
    const ex = exById(exId); const hands = (ex && ex.perHand) ? 2 : 1;
    return (sets || []).filter(s => s.type === 'working').reduce((c, st) => c + effLoad(db, exId, st.weight) * (st.reps || 0) * hands, 0);
  }
  const e1rm = (w, reps) => w > 0 && reps > 0 ? +(w * (1 + reps / 30)).toFixed(1) : 0; // Epley
  function bestSet(db, se) { // best working set by estimated 1RM (bodyweight-aware)
    let best = 0, bw = 0, br = 0, eff = 0;
    (se.sets || []).filter(s => s.type === 'working').forEach(s => { const e = e1rm(effLoad(db, se.exId, s.weight), s.reps); if (e > best) { best = e; bw = s.weight; br = s.reps; eff = effLoad(db, se.exId, s.weight); } });
    return { e1rm: best, weight: bw, reps: br, effWeight: eff };
  }
  function prMap(db) { // best e1rm ever per exercise, with the date it was set
    const map = {};
    db.sessions.slice().sort((a, b) => new Date(a.date) - new Date(b.date)).forEach(s => (s.exercises || []).forEach(se => {
      const b = bestSet(db, se); if (!b.e1rm) return;
      if (!map[se.exId] || b.e1rm > map[se.exId].e1rm) map[se.exId] = { ...b, date: s.date, sessionId: s.id };
    }));
    return map;
  }
  function sessionPRs(db, sessionId) { // exercises in this session that set an all-time e1rm PR
    const pr = prMap(db); const out = [];
    const s = db.sessions.find(x => x.id === sessionId); if (!s) return out;
    (s.exercises || []).forEach(se => { if (pr[se.exId] && pr[se.exId].sessionId === sessionId) out.push({ exId: se.exId, name: se.name, e1rm: pr[se.exId].e1rm }); });
    return out;
  }
  const MUSCLE_GROUP = { chest: 'push', shoulder: 'push', triceps: 'push', back: 'pull', biceps: 'pull', quad: 'legs', hamglute: 'legs', glute: 'legs', calf: 'legs', core: 'core' };

  /* Per-exercise history: every session's best working set, e1rm trend, PR, and totals. */
  function exerciseHistory(db, exId) {
    const rows = [];
    db.sessions.slice().sort((a, b) => new Date(a.date) - new Date(b.date)).forEach(s => (s.exercises || []).forEach(se => {
      if (se.exId !== exId) return;
      const ws = (se.sets || []).filter(x => x.type === 'working');
      if (!ws.length) return;
      const b = bestSet(db, se);
      const vol = setTonnage(db, se.exId, ws);
      const topW = Math.max(...ws.map(x => effLoad(db, se.exId, x.weight)), 0);
      rows.push({ date: s.date, sessionId: s.id, e1rm: b.e1rm, topWeight: topW, bestReps: b.reps, bestW: isBWmove(se.exId) ? b.effWeight : b.weight, sets: ws.length, volume: Math.round(vol), feedback: s.feedback, isBW: isBWmove(se.exId) });
    }));
    if (!rows.length) return { rows: [], count: 0 };
    const e1rms = rows.map(r => r.e1rm);
    const pr = Math.max(...e1rms);
    const prRow = rows.find(r => r.e1rm === pr);
    const first = rows[0], last = rows[rows.length - 1];
    const delta = +(last.e1rm - first.e1rm).toFixed(1);
    const totalVol = rows.reduce((a, r) => a + r.volume, 0);
    const totalSets = rows.reduce((a, r) => a + r.sets, 0);
    return {
      rows, count: rows.length, pr, prDate: prRow ? prRow.date : null,
      first: first.e1rm, last: last.e1rm, delta,
      firstDate: first.date, lastDate: last.date, totalVol, totalSets,
      min: Math.min(...e1rms), max: Math.max(...e1rms),
    };
  }

  /* ---------- Streak & achievements (offline) ---------- */
  // Streak = consecutive days with ≥1 completed session, counting today or yesterday as still-alive.
  function streakInfo(db) {
    const days = new Set(db.sessions.filter(s => s.status === 'completed').map(s => new Date(s.date).toDateString()));
    const dayMs = 864e5; const today = new Date(); today.setHours(0, 0, 0, 0);
    let cur = 0; let alive = false;
    // current streak: walk back from today (or yesterday if today empty)
    let cursor = new Date(today);
    if (!days.has(cursor.toDateString())) cursor = new Date(today.getTime() - dayMs);
    if (days.has(cursor.toDateString())) { alive = true; while (days.has(cursor.toDateString())) { cur++; cursor = new Date(cursor.getTime() - dayMs); } }
    // longest streak ever
    let longest = 0; const sorted = [...days].map(d => new Date(d).getTime()).sort((a, b) => a - b);
    let run = 0, prev = null;
    sorted.forEach(t => { if (prev != null && t - prev === dayMs) run++; else run = 1; prev = t; if (run > longest) longest = run; });
    // sessions this ISO-ish week (last 7 days) and this month
    const week = db.sessions.filter(s => s.status === 'completed' && daysSince(s.date) < 7).length;
    const total = db.sessions.filter(s => s.status === 'completed').length;
    const doneToday = days.has(today.toDateString());
    // weekly consistency: how many of the last N ISO-ish weeks hit ≥ target sessions (default 3)
    const weekTarget = (db.settings && db.settings.weeklyTarget) || 3;
    const weekOf = (ms) => { const d = new Date(ms); d.setHours(0, 0, 0, 0); const dow = (d.getDay() + 6) % 7; return d.getTime() - dow * dayMs; };
    const wkCount = {};
    db.sessions.filter(s => s.status === 'completed').forEach(s => { const wk = weekOf(new Date(s.date).getTime()); wkCount[wk] = (wkCount[wk] || 0) + 1; });
    const thisWk = weekOf(Date.now());
    let weekStreak = 0; let wcur = thisWk;
    // this week still counts as alive even if not yet at target; break only on a fully-missed past week
    if ((wkCount[thisWk] || 0) < weekTarget) wcur = thisWk - 7 * dayMs;
    while ((wkCount[wcur] || 0) >= weekTarget) { weekStreak++; wcur -= 7 * dayMs; }
    const weekHit = (wkCount[thisWk] || 0);
    return { current: cur, longest: Math.max(longest, cur), alive, week, total, doneToday, weekStreak, weekHit, weekTarget };
  }

  const ACHIEVEMENTS = [
    { id: 'first-session', icon: '◆', tier: 'start', name: 'Langkah Pertama', desc: 'Selesaikan sesi pertamamu', test: (d, st) => st.total >= 1 },
    { id: 'streak-3', icon: '▲', tier: 'streak', name: 'Momentum', desc: '3 hari beruntun', test: (d, st) => st.longest >= 3 },
    { id: 'streak-7', icon: '★', tier: 'streak', name: 'Satu Minggu Solid', desc: '7 hari beruntun', test: (d, st) => st.longest >= 7 },
    { id: 'streak-30', icon: '✦', tier: 'streak', name: 'Tak Terbendung', desc: '30 hari beruntun', test: (d, st) => st.longest >= 30 },
    { id: 'sessions-10', icon: '●', tier: 'volume', name: 'Konsisten', desc: '10 sesi total', test: (d, st) => st.total >= 10 },
    { id: 'sessions-50', icon: '⬢', tier: 'volume', name: 'Veteran', desc: '50 sesi total', test: (d, st) => st.total >= 50 },
    { id: 'sessions-100', icon: '⬣', tier: 'volume', name: 'Centurion', desc: '100 sesi total', test: (d, st) => st.total >= 100 },
    { id: 'first-pr', icon: '⚡', tier: 'strength', name: 'Rekor Baru', desc: 'Catat PR pertama', test: (d) => Object.keys(prMap(d)).length >= 1 },
    { id: 'pr-10', icon: '☆', tier: 'strength', name: 'Pemecah Rekor', desc: '10 PR sepanjang waktu', test: (d) => Object.values(prMap(d)).length >= 10 },
    { id: 'tonnage-100k', icon: '⛰', tier: 'strength', name: '100 Ton Club', desc: 'Total 100.000 kg diangkat', test: (d) => totalTonnage(d) >= 100000 },
    { id: 'cardio-10', icon: '❤', tier: 'cardio', name: 'Jantung Kuat', desc: '10 sesi cardio', test: (d) => d.sessions.filter(s => s.cardio).length >= 10 },
    { id: 'muaythai-5', icon: '✕', tier: 'cardio', name: 'Nak Muay', desc: '5 sesi Muay Thai', test: (d) => d.sessions.filter(s => s.sessionType === 'muaythai').length >= 5 },
    { id: 'balanced', icon: '◈', tier: 'special', name: 'Seimbang', desc: 'Latih push, pull & legs dalam 1 minggu', test: (d) => balancedWeek(d) },
    { id: 'early-bird', icon: '☀', tier: 'special', name: 'Early Bird', desc: 'Selesaikan sesi sebelum jam 7 pagi', test: (d) => d.sessions.some(s => s.status === 'completed' && new Date(s.date).getHours() < 7) },
    { id: 'sessions-25', icon: '◐', tier: 'volume', name: 'Terbiasa', desc: '25 sesi total', test: (d, st) => st.total >= 25 },
    { id: 'streak-14', icon: '✧', tier: 'streak', name: 'Dua Minggu', desc: '14 hari beruntun', test: (d, st) => st.longest >= 14 },
    { id: 'streak-60', icon: '❋', tier: 'streak', name: 'Disiplin Baja', desc: '60 hari beruntun', test: (d, st) => st.longest >= 60 },
    { id: 'streak-100', icon: '❈', tier: 'streak', name: 'Seratus Hari', desc: '100 hari beruntun', test: (d, st) => st.longest >= 100 },
    { id: 'pr-25', icon: '✵', tier: 'strength', name: 'Mesin PR', desc: '25 PR sepanjang waktu', test: (d) => Object.values(prMap(d)).length >= 25 },
    { id: 'tonnage-500k', icon: '⛏', tier: 'strength', name: 'Setengah Juta', desc: 'Total 500.000 kg diangkat', test: (d) => totalTonnage(d) >= 500000 },
    { id: 'pullup-strong', icon: '⤒', tier: 'strength', name: 'Raja Pull-up', desc: 'Pull-up 12 reps dalam satu set', test: (d) => d.sessions.some(s => (s.exercises || []).some(e => e.exId === 'pull-up' && e.sets.some(x => x.type === 'working' && x.reps >= 12))) },
    { id: 'cardio-25', icon: '♥', tier: 'cardio', name: 'Kardio Rutin', desc: '25 sesi cardio', test: (d) => d.sessions.filter(s => s.cardio).length >= 25 },
    { id: 'distance-50', icon: '➤', tier: 'cardio', name: '50 KM', desc: 'Total 50 km lari/jalan', test: (d) => d.sessions.filter(s => s.cardio).reduce((a, s) => a + (s.cardio.distanceKm || 0), 0) >= 50 },
    { id: 'muaythai-20', icon: '✖', tier: 'cardio', name: 'Petarung', desc: '20 sesi Muay Thai', test: (d) => d.sessions.filter(s => s.sessionType === 'muaythai').length >= 20 },
    { id: 'nutrition-7', icon: '⬥', tier: 'special', name: 'Gizi Terjaga', desc: '7 hari protein on-target', test: (d) => { const t = nutritionTargets(d).protein; const days = {}; ((d.nutrition && d.nutrition.log) || []).forEach(e => { const k = new Date(e.at).toDateString(); days[k] = (days[k] || 0) + (e.p || 0); }); return Object.values(days).filter(p => p >= t * 0.95).length >= 7; } },
    { id: 'body-log-30', icon: '⚖', tier: 'special', name: 'Timbang Rutin', desc: '30 catatan berat badan', test: (d) => (d.bodyMetrics || []).length >= 30 },
    { id: 'officer', icon: '❖', tier: 'rank', name: 'Naik Perwira', desc: 'Capai pangkat Letnan Dua (Lv 55)', test: (d) => levelInfo(xpTotal(d).total).level >= 55 },
    { id: 'general', icon: '★', tier: 'rank', name: 'Bintang', desc: 'Capai pangkat Jenderal (Lv 99)', test: (d) => levelInfo(xpTotal(d).total).level >= 99 },
    // Nutrition
    { id: 'nutrition-first', icon: '🍽', tier: 'nutrisi', name: 'Mulai Catat', desc: 'Catat makanan pertama', test: (d) => ((d.nutrition && d.nutrition.log) || []).length >= 1 },
    { id: 'nutrition-log-100', icon: '📋', tier: 'nutrisi', name: 'Rajin Catat', desc: '100 entri makanan', test: (d) => ((d.nutrition && d.nutrition.log) || []).length >= 100 },
    { id: 'protein-30', icon: '💪', tier: 'nutrisi', name: 'Protein Konsisten', desc: '30 hari protein on-target', test: (d) => proteinTargetDays(d) >= 30 },
    { id: 'protein-streak-14', icon: '🔗', tier: 'nutrisi', name: 'Streak Protein', desc: 'Protein on-target 14 hari beruntun', test: (d) => nutritionProteinStreak(d) >= 14 },
    { id: 'clean-week', icon: '🥗', tier: 'nutrisi', name: 'Minggu Bersih', desc: '5 hari tanpa lewat batas LDL & purin dalam seminggu', test: (d) => cleanDays7(d) >= 5 },
    { id: 'macro-master', icon: '🎯', tier: 'nutrisi', name: 'Makro Presisi', desc: '10 hari kalori dalam ±10% target', test: (d) => macroPreciseDays(d) >= 10 },
  ];
  function proteinTargetDays(db) { const t = nutritionTargets(db).protein; const days = {}; ((db.nutrition && db.nutrition.log) || []).forEach(e => { const k = new Date(e.at).toDateString(); days[k] = (days[k] || 0) + (e.p || 0); }); return Object.values(days).filter(p => p >= t * 0.95).length; }
  function cleanDays7(db) { let n = 0; for (let i = 0; i < 7; i++) { const d = new Date(Date.now() - i * DAY).toDateString(); const log = ((db.nutrition && db.nutrition.log) || []).filter(e => new Date(e.at).toDateString() === d); if (!log.length) continue; const h = healthLoad(db, d); if (!h.ldlHigh && !h.purineHigh) n++; } return n; }
  function macroPreciseDays(db) { const t = nutritionTargets(db).kcal; const days = {}; ((db.nutrition && db.nutrition.log) || []).forEach(e => { const k = new Date(e.at).toDateString(); days[k] = (days[k] || 0) + (e.kcal || 0); }); return Object.values(days).filter(k => Math.abs(k - t) <= t * 0.1).length; }
  function totalTonnage(db) {
    return db.sessions.filter(s => s.sessionType === 'strength').reduce((a, s) => a + (s.exercises || []).reduce((b, e) => b + setTonnage(db, e.exId, e.sets), 0), 0);
  }
  function balancedWeek(db) {
    const grp = new Set();
    db.sessions.filter(s => s.status === 'completed' && daysSince(s.date) < 7).forEach(s => (s.exercises || []).forEach(e => { const ex = exById(e.exId); if (ex) grp.add(MUSCLE_GROUP[ex.mus[0]] || 'core'); }));
    return grp.has('push') && grp.has('pull') && grp.has('legs');
  }
  function achievementState(db) {
    const st = streakInfo(db);
    return ACHIEVEMENTS.map(a => ({ id: a.id, icon: a.icon, glyph: ACH_GLYPH[a.id] || 'M8 12 H16', tier: a.tier, name: a.name, desc: a.desc, unlocked: !!a.test(db, st) }));
  }
  // Unique inner glyph (single path, 24×24) per achievement — drawn inside a medal frame in the UI.
  const ACH_GLYPH = {
    'first-session': 'M6 3 V21 M6 3 H18 L15 7 L18 11 H6',
    'streak-3': 'M12 3 C13.5 7 17 8.5 14.5 13 A4 4 0 1 1 9.5 13 C8.5 10 10.5 7.5 12 3 Z',
    'streak-7': 'M4 7 H20 V20 H4 Z M4 11 H20 M8 4 V8 M16 4 V8',
    'streak-14': 'M4 7 H20 V20 H4 Z M4 11 H20 M9 14 H11 V17 M13 14 H15 V17 H13',
    'streak-30': 'M12 2 L14.6 8 L21 8.6 L16 13 L17.6 20 L12 16.4 L6.4 20 L8 13 L3 8.6 L9.4 8 Z',
    'streak-60': 'M12 3 A9 9 0 1 0 12.1 3 M12 3 V12 L18 15',
    'streak-100': 'M5 20 V6 M5 6 H10 A4 4 0 0 1 10 14 H5 M14 5 A4.5 7 0 1 0 14.01 5 M20 5 A4.5 7 0 1 0 20.01 5',
    'sessions-10': 'M4 14 L9 14 L11 6 L13 18 L15 10 L20 10',
    'sessions-25': 'M12 3 L20 7.5 V16.5 L12 21 L4 16.5 V7.5 Z M12 8 V16 M8 10 V14 M16 10 V14',
    'sessions-50': 'M4 20 V4 L20 20 M8 20 V9 M12 20 V13 M16 20 V16',
    'sessions-100': 'M6 4 V20 M6 4 H12 A4 4 0 0 1 12 12 H6 M15 20 L15 4 L20 4 M15 12 H19',
    'first-pr': 'M13 2 L4 14 H11 L10 22 L20 9 H12 Z',
    'pr-10': 'M12 2 L4 9 L7 20 H17 L20 9 Z M12 2 V13 M9 20 L12 13 L15 20',
    'pr-25': 'M12 2 L15 9 L22 9 L16.5 13.5 L18.5 21 L12 16.5 L5.5 21 L7.5 13.5 L2 9 L9 9 Z M12 6 V13',
    'pullup-strong': 'M4 5 H20 M8 5 V11 A4 4 0 0 0 16 11 V5 M12 15 V21 M9 21 H15',
    'tonnage-100k': 'M7 9 A5 5 0 0 1 17 9 L20 20 H4 Z M9 9 H15',
    'tonnage-500k': 'M3 20 L9 5 L12 12 L15 5 L21 20 Z M8 20 A4 4 0 0 1 16 20',
    'cardio-10': 'M12 21 C6 16 3 12 3 8 A4 4 0 0 1 12 6 A4 4 0 0 1 21 8 C21 12 18 16 12 21 Z',
    'cardio-25': 'M3 12 H7 L9 7 L12 17 L14 10 L16 12 H21 M12 20 C8 17 5 14 5 11',
    'distance-50': 'M6 20 A3 3 0 1 0 6 14 A3 3 0 0 0 6 20 Z M18 20 A3 3 0 1 0 18 14 A3 3 0 0 0 18 20 Z M8.5 16 H14 L16 10 H11 L9.5 7 H7',
    'muaythai-5': 'M7 8 A2 3 0 0 1 11 8 V13 A3 3 0 0 1 5 13 V6 A2 2 0 0 1 9 6 M14 4 L20 10 M14 10 L20 4',
    'muaythai-20': 'M8 4 L8 12 A4 4 0 0 0 16 12 L16 4 M6 4 H18 M12 16 V20 M8 20 H16',
    'balanced': 'M12 3 V21 M4 7 H20 M7 7 L4 13 A3 3 0 0 0 10 13 Z M17 7 L14 13 A3 3 0 0 0 20 13 Z',
    'early-bird': 'M12 4 V2 M5 11 A7 7 0 0 1 19 11 Z M3 14 H21 M6 11 L4 9 M18 11 L20 9',
    'nutrition-7': 'M12 8 C12 4 8 3 7 6 C6 3 2 4 3 9 C4 14 12 20 12 20 C12 20 20 14 21 9 C22 4 18 3 17 6 C16 3 12 4 12 8 Z',
    'body-log-30': 'M5 7 H19 L21 19 A2 2 0 0 1 19 21 H5 A2 2 0 0 1 3 19 Z M8 7 A4 4 0 0 1 16 7 M8 13 H16',
    'officer': 'M12 2 L14 7 H19 L15 10.5 L16.5 16 L12 12.8 L7.5 16 L9 10.5 L5 7 H10 Z M6 18 H18 V21 H6 Z',
    'general': 'M12 2 L14.6 8 L21 8.6 L16 13 L17.6 20 L12 16.4 L6.4 20 L8 13 L3 8.6 L9.4 8 Z M12 12 L12 12',
    'nutrition-first': 'M6 3 V11 A3 3 0 0 0 12 11 V3 M9 3 V8 M18 3 C16 5 16 9 18 11 L18 21',
    'nutrition-log-100': 'M6 3 H15 L18 6 V21 H6 Z M9 9 H15 M9 13 H15 M9 17 H13',
    'protein-30': 'M7 8 A2 3 0 0 1 11 8 V13 A3 3 0 0 1 5 13 V6 A2 2 0 0 1 9 6 M14 4 L20 10 M14 10 L20 4',
    'protein-streak-14': 'M9 8 A3 3 0 0 0 9 14 L11 12 M15 16 A3 3 0 0 0 15 10 L13 12',
    'clean-week': 'M4 13 L9 13 L11 6 L13 18 L15 13 L20 13 M12 20 A8 8 0 0 1 4 12',
    'macro-master': 'M12 3 A9 9 0 1 0 12.1 3 M12 8 A4 4 0 1 0 12.1 8 M12 12 L12 12.01',
  };

  /* ---------- XP · Rank ladder · Career path (offline) ---------- */
  // Deterministic XP from history: sessions, PRs, active days, protein on-target days.
  function xpTotal(db) {
    const done = db.sessions.filter(s => s.status === 'completed');
    const sessXP = done.length * 100;
    const prEvents = done.reduce((a, s) => a + sessionPRs(db, s.id).length, 0);
    const prXP = prEvents * 50;
    const activeDays = new Set(done.map(s => new Date(s.date).toDateString())).size;
    const dayXP = activeDays * 20;
    // protein on-target days (all-time)
    const tgt = nutritionTargets(db).protein; const pDays = {};
    ((db.nutrition && db.nutrition.log) || []).forEach(e => { const k = new Date(e.at).toDateString(); pDays[k] = (pDays[k] || 0) + (e.p || 0); });
    const proteinXP = Object.values(pDays).filter(p => p >= tgt * 0.95).length * 15;
    return { total: sessXP + prXP + dayXP + proteinXP, sessXP, prXP, dayXP, proteinXP, sessions: done.length, prEvents, activeDays };
  }
  // Level 1–99 with an escalating per-level cost.
  function levelInfo(xp) {
    let lvl = 1, floor = 0, step = 150;
    while (lvl < 99) { const next = floor + step; if (xp < next) break; floor = next; lvl++; step += 30; }
    const ceil = lvl < 99 ? floor + step : floor;
    return { level: lvl, floorXP: floor, ceilXP: ceil, inLevel: xp - floor, span: Math.max(1, ceil - floor), max: lvl >= 99 };
  }
  // 22 TNI-style ranks across the 99 levels. insignia = abstract (chevron/bar/star) — NOT official TNI marks.
  const RANKS = [
    { min: 1, name: 'Prajurit Dua', abbr: 'Prada', tier: 'Tamtama', ins: 'chevron', n: 1 },
    { min: 4, name: 'Prajurit Satu', abbr: 'Pratu', tier: 'Tamtama', ins: 'chevron', n: 2 },
    { min: 8, name: 'Prajurit Kepala', abbr: 'Praka', tier: 'Tamtama', ins: 'chevron', n: 3 },
    { min: 12, name: 'Kopral Dua', abbr: 'Kopda', tier: 'Tamtama', ins: 'chevron-bar', n: 1 },
    { min: 16, name: 'Kopral Satu', abbr: 'Koptu', tier: 'Tamtama', ins: 'chevron-bar', n: 2 },
    { min: 20, name: 'Kopral Kepala', abbr: 'Kopka', tier: 'Tamtama', ins: 'chevron-bar', n: 3 },
    { min: 25, name: 'Sersan Dua', abbr: 'Serda', tier: 'Bintara', ins: 'wave', n: 1 },
    { min: 30, name: 'Sersan Satu', abbr: 'Sertu', tier: 'Bintara', ins: 'wave', n: 2 },
    { min: 35, name: 'Sersan Kepala', abbr: 'Serka', tier: 'Bintara', ins: 'wave', n: 3 },
    { min: 40, name: 'Sersan Mayor', abbr: 'Serma', tier: 'Bintara', ins: 'wave', n: 4 },
    { min: 45, name: 'Pembantu Letnan Dua', abbr: 'Pelda', tier: 'Bintara', ins: 'wave-star', n: 1 },
    { min: 50, name: 'Pembantu Letnan Satu', abbr: 'Peltu', tier: 'Bintara', ins: 'wave-star', n: 2 },
    { min: 55, name: 'Letnan Dua', abbr: 'Letda', tier: 'Perwira', ins: 'bar', n: 1, officer: true },
    { min: 60, name: 'Letnan Satu', abbr: 'Lettu', tier: 'Perwira', ins: 'bar', n: 2, officer: true },
    { min: 66, name: 'Kapten', abbr: 'Kapten', tier: 'Perwira', ins: 'bar', n: 3, officer: true },
    { min: 72, name: 'Mayor', abbr: 'Mayor', tier: 'Perwira', ins: 'rose', n: 1, officer: true },
    { min: 79, name: 'Letnan Kolonel', abbr: 'Letkol', tier: 'Perwira', ins: 'rose', n: 2, officer: true },
    { min: 86, name: 'Kolonel', abbr: 'Kolonel', tier: 'Perwira', ins: 'rose', n: 3, officer: true },
    { min: 91, name: 'Brigadir Jenderal', abbr: 'Brigjen', tier: 'Jenderal', ins: 'star', n: 1, officer: true },
    { min: 94, name: 'Mayor Jenderal', abbr: 'Mayjen', tier: 'Jenderal', ins: 'star', n: 2, officer: true },
    { min: 97, name: 'Letnan Jenderal', abbr: 'Letjen', tier: 'Jenderal', ins: 'star', n: 3, officer: true },
    { min: 99, name: 'Jenderal', abbr: 'Jenderal', tier: 'Jenderal', ins: 'star', n: 4, officer: true },
  ];
  const CAREER_PATHS = [
    { id: 'strength', name: 'Komando Kekuatan', tag: 'Strength', desc: 'Fokus beban & hipertrofi — badge dari PR & tonnage.' },
    { id: 'endurance', name: 'Batalyon Daya Tahan', tag: 'Endurance', desc: 'Fokus cardio & Muay Thai — badge dari jarak & zona HR.' },
    { id: 'hybrid', name: 'Pasukan Hibrida', tag: 'Hybrid', desc: 'Seimbang strength + cardio — badge recomposition.' },
  ];
  const CAREER_UNLOCK_LEVEL = 40; // Serma — reachable within a committed year
  function rankForLevel(level) {
    let r = RANKS[0]; for (const x of RANKS) if (level >= x.min) r = x; return r;
  }
  function rankProgress(db) {
    const xp = xpTotal(db);
    const li = levelInfo(xp.total);
    const rank = rankForLevel(li.level);
    const idx = RANKS.indexOf(rank);
    const nextRank = RANKS[idx + 1] || null;
    const careerEligible = li.level >= CAREER_UNLOCK_LEVEL;
    const career = (db.settings && db.settings.careerPath) || null;
    return {
      xp: xp.total, xpBreakdown: xp, level: li.level, max: li.max,
      inLevel: li.inLevel, span: li.span, pct: Math.round(li.inLevel / li.span * 100),
      rank, nextRank, rankIndex: idx, totalRanks: RANKS.length,
      levelsToNext: nextRank ? nextRank.min - li.level : 0,
      careerEligible, career, careerPath: career ? CAREER_PATHS.find(c => c.id === career) : null,
    };
  }
  function setCareerPath(db, id) { db.settings.careerPath = id; return db; }
  // returns list of achievement ids newly unlocked vs a previous snapshot of unlocked ids
  function newlyUnlocked(db, prevIds) {
    const now = achievementState(db).filter(a => a.unlocked).map(a => a.id);
    const prev = new Set(prevIds || []);
    return { all: now, fresh: now.filter(id => !prev.has(id)).map(id => ACHIEVEMENTS.find(a => a.id === id)) };
  }

  function weeklyTonnage(db, nWeeks) {
    const out = [];
    for (let k = 0; k < nWeeks; k++) {
      const grp = { push: 0, pull: 0, legs: 0, core: 0 };
      db.sessions.filter(s => s.sessionType === 'strength' && daysSince(s.date) >= k * 7 && daysSince(s.date) < (k + 1) * 7)
        .forEach(s => (s.exercises || []).forEach(se => { const ex = exById(se.exId); const g = ex ? (MUSCLE_GROUP[ex.mus[0]] || 'core') : 'core';
          grp[g] += setTonnage(db, se.exId, se.sets); }));
      out.push({ k, label: k === 0 ? 'Minggu ini' : k + ' mgg lalu', ...grp, total: grp.push + grp.pull + grp.legs + grp.core });
    }
    return out;
  }

  // Deload guard: flag accumulated fatigue — 3 straight weeks of ≥3 strength sessions with non-falling volume, no recovery/rest week
  function strengthVolWeek(db, k) {
    return db.sessions.filter(s => s.sessionType === 'strength' && daysSince(s.date) >= k * 7 && daysSince(s.date) < (k + 1) * 7)
      .reduce((a, s) => a + (s.exercises || []).reduce((b, e) => b + e.sets.filter(x => x.type === 'working').length, 0), 0);
  }
  function deloadCheck(db) {
    const cnt = k => db.sessions.filter(s => s.sessionType === 'strength' && daysSince(s.date) >= k * 7 && daysSince(s.date) < (k + 1) * 7).length;
    const v = [strengthVolWeek(db, 0), strengthVolWeek(db, 1), strengthVolWeek(db, 2)];
    const busy = cnt(0) >= 3 && cnt(1) >= 3 && cnt(2) >= 3;
    const rising = v[0] > 0 && v[0] >= v[1] * 0.9 && v[1] >= v[2] * 0.9;
    const recovered = db.sessions.some(s => s.sessionType === 'recovery' && daysSince(s.date) <= 12);
    const heavyFb = db.sessions.filter(s => s.sessionType === 'strength' && daysSince(s.date) <= 14 && s.feedback === 'berat').length >= 2;
    const due = (busy && rising && !recovered) || (heavyFb && cnt(0) >= 3 && !recovered);
    return { due, weeks: v, reason: due ? (heavyFb ? '2+ sesi terasa berat dalam 2 minggu tanpa minggu ringan' : '3 minggu berturut volume tinggi tanpa deload') : '' };
  }

  /* ---------- Progressive overload ---------- */
  function progressionFor(db, exId) {
    const ex = exById(exId);
    // collect this exercise's history, newest first
    const hist = [];
    db.sessions.slice().sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(s => (s.exercises || []).forEach(se => {
      if (se.exId === exId) { const ws = se.sets.filter(st => st.type === 'working' && st.done !== false); if (ws.length) hist.push({ ws, fb: se.fb || s.feedback }); }
    }));
    if (!hist.length) return { weight: ex.start, repLo: ex.rep[0], repHi: ex.rep[1], note: 'Beban awal — kalibrasi' };
    const last = hist[0], prev = hist[1];
    // base off the TOP working set (heaviest), not the last one — protects against drop/back-off sets
    const topSet = last.ws.reduce((m, st) => (st.weight || 0) > (m.weight || 0) ? st : m, last.ws[0]);
    const w = topSet.weight;
    const topAll = h => { const wk = h.ws.filter(st => (st.weight || 0) >= (h.ws.reduce((mx, s) => Math.max(mx, s.weight || 0), 0)) * 0.9); return wk.every(st => st.reps >= ex.rep[1]) && h.fb !== 'berat'; };
    const isFail = h => h.fb === 'berat' || h.ws.some(st => st.reps < ex.rep[0] - 2);
    // Fail twice in a row → deload the lift; a single bad day → hold, don't drop
    if (isFail(last) && prev && isFail(prev))
      return { weight: Math.max(0, +(w - (ex.inc || 2.5)).toFixed(1)), repLo: ex.rep[0], repHi: ex.rep[1], note: 'Turunkan beban — 2 sesi berturut terlalu berat' };
    if (isFail(last))
      return { weight: w, repLo: ex.rep[0], repHi: ex.rep[1], note: 'Ulangi beban — sesi lalu berat, beri kesempatan sekali lagi' };
    // Hit top reps twice in a row (or once with no prior history) → add load
    if (topAll(last) && (!prev || topAll(prev))) {
      if (isBWmove(exId) && !(ex.inc > 0)) {
        // pure bodyweight at rep ceiling → push reps further, then graduate to weighted
        return { weight: w, repLo: ex.rep[1], repHi: ex.rep[1] + 3, note: 'Sudah kuat di rep atas — tambah reps, lalu mulai weighted (BW+2.5 kg) bila konsisten' };
      }
      const inc = ex.inc || 2.5;
      const usesDb = (ex.cats || []).includes('dumbbell');
      const snap = usesDb ? nextLoadUp(w, DUMBBELL_LADDER) : null;
      if (snap != null) return { weight: snap, repLo: ex.rep[0], repHi: ex.rep[0] + 2, note: 'Naik ke dumbbell ' + snap + ' kg (langkah berikutnya di set adjustable-mu)' };
      return { weight: +(w + inc).toFixed(1), repLo: ex.rep[0], repHi: ex.rep[0] + 2, note: (isBWmove(exId) ? 'Tambah beban weighted +' : 'Naik beban +') + inc + ' kg (dari top set, double progression)' };
    }
    if (topAll(last))
      return { weight: w, repLo: ex.rep[0], repHi: ex.rep[1], note: 'Konfirmasi target atas sekali lagi sebelum naik beban' };
    return { weight: w, repLo: ex.rep[0], repHi: ex.rep[1], note: 'Pertahankan beban, tambah total reps' };
  }

  /* ---------- Session-type templates ---------- */
  const TYPE_PATTERNS = {
    'Quick Upper': ['hpush', 'shabd', 'vpush', 'vpull', 'elbflex', 'elbext', 'hpull', 'core'],
    'Full Body': ['hpush', 'hpull', 'knee', 'vpush', 'hip', 'core'],
    'Upper Push–Pull': ['hpush', 'vpull', 'vpush', 'hpull', 'shabd', 'elbflex'],
    'Upper Body': ['hpush', 'vpull', 'vpush', 'hpull', 'elbflex', 'elbext'],
    'Push': ['hpush', 'vpush', 'shabd', 'elbext', 'hpush', 'core'],
    'Pull': ['vpull', 'hpull', 'hpull', 'elbflex', 'shabd', 'core'],
    'Lower Body': ['knee', 'hip', 'knee', 'calf', 'core', 'hip'],
    'Strength Express': ['hpush', 'hpull', 'knee'],
  };

  /* ---------- Engine ---------- */
  function recommend(db, ctx) {
    const loc = LOCATIONS.find(l => l.id === ctx.locationId) || LOCATIONS[0];
    const reasons = [];
    const soreEntries = (ctx.soreness || []).map(soreLevel);
    const soreMus = soreEntries.filter(e => e.level === 'berat').flatMap(e => soreToMuscles(e.id));
    const soreLight = soreEntries.filter(e => e.level === 'ringan').flatMap(e => soreToMuscles(e.id));
    const last = lastSession(db);
    const load48 = recentCardioLoad(db, 2);
    const mtHeavyYesterday = last && last.sessionType === 'muaythai' && (last.cardio?.intensity === 'berat') && daysSince(last.date) <= 1;

    /* Gate 1 — readiness */
    if (ctx.readiness === 'lelah') {
      reasons.push({ gate: 'Gate 1 · Readiness', text: 'Kondisi "Lelah" — hindari strength berat & interval. Prioritas recovery.' });
      return {
        kind: 'recovery', type: 'Mobility / Recovery', focus: 'Pemulihan aktif',
        durationMin: Math.min(ctx.minutes, 30), location: loc.label, intensity: 'Ringan',
        items: ['Jalan santai 10–20 menit (Zona 1–2)', 'Mobility flow: hip, thoracic, bahu — 8–10 menit', 'Breathing reset 4-4-8 — 3 menit', 'Stretching area yang pegal'],
        reasons, exercises: [], workingSets: 0,
      };
    }
    reasons.push({ gate: 'Gate 1 · Readiness', text: ctx.readiness === 'agak-lelah' ? '"Agak lelah" — volume dikurangi (set −1 untuk accessory), pilih otot yang sudah pulih.' : '"Fit" — semua opsi tersedia, volume normal.' });

    /* Gate 2 — soreness */
    if (soreMus.length || soreLight.length) {
      const parts = [];
      if (soreMus.length) parts.push('berat: ' + soreMus.map(m => MUSCLE_LABEL[m]).join(', ') + ' (dihindari)');
      if (soreLight.length) parts.push('ringan: ' + soreLight.map(m => MUSCLE_LABEL[m]).join(', ') + ' (volume dikurangi)');
      reasons.push({ gate: 'Gate 2 · Soreness', text: 'Nyeri ' + parts.join(' · ') + '.' });
    } else reasons.push({ gate: 'Gate 2 · Soreness', text: 'Tidak ada nyeri otot — tidak ada pembatasan area.' });

    /* Cardio / Muay Thai locations */
    if (loc.kind === 'muaythai') {
      const hard = ctx.readiness === 'fit' && load48 < 60 && !mtHeavyYesterday;
      reasons.push({ gate: 'Gate 3 · Cardio load', text: 'Load cardio 48 jam terakhir: ' + load48 + (hard ? ' — sesi intens aman.' : ' — jaga intensitas teknik/sedang.') });
      return {
        kind: 'muaythai', type: 'Muay Thai', focus: hard ? 'Intensitas tinggi — bag work & kombinasi' : 'Teknik & flow — intensitas sedang',
        durationMin: ctx.minutes, location: loc.label, intensity: hard ? 'Berat' : 'Sedang',
        items: ['Shadow boxing 3×3 menit (warm-up)', hard ? 'Heavy bag: 5×3 menit kombinasi punch-kick, rest 60 dtk' : 'Bag work teknik: 4×3 menit, fokus form, rest 90 dtk', 'Knee & clinch drill 2×2 menit', 'Cool-down: jalan + stretch bahu/pinggul 5 menit'],
        reasons, exercises: [], workingSets: 0,
      };
    }
    if (loc.kind === 'cardio') {
      const legsSore = soreMus.some(m => ['quad', 'hamglute', 'calf'].includes(m));
      let level = 'sedang';
      if (ctx.readiness === 'agak-lelah' || load48 >= 90 || mtHeavyYesterday || legsSore) level = 'ringan';
      else if (load48 < 45 && ctx.readiness === 'fit') level = ctx.minutes >= 30 ? 'sedang' : 'ringan';
      reasons.push({ gate: 'Gate 3 · Sesi sebelumnya', text: mtHeavyYesterday ? 'Muay Thai berat kemarin — cardio hari ini diturunkan ke ringan.' : 'Load cardio 48 jam: ' + load48 + ' → intensitas ' + level + '.' });
      if (legsSore) reasons.push({ gate: 'Gate 2 · Soreness', text: 'Lower body nyeri — kurangi impact, pilih jalan/incline walk.' });
      const zone = level === 'ringan' ? 'Zona 2 (±' + Math.round(0.6 * (hrMax(db) - db.settings.restingHr) + db.settings.restingHr) + ' bpm)' : level === 'sedang' ? 'Zona 3 (±' + Math.round(0.7 * (hrMax(db) - db.settings.restingHr) + db.settings.restingHr) + ' bpm)' : 'Zona 4';
      return {
        kind: 'cardio', type: 'Cardio ' + (level === 'ringan' ? 'Recovery' : level === 'sedang' ? 'Moderate' : 'Heavy'),
        focus: (legsSore || level === 'ringan' ? 'Brisk walk / incline walk' : 'Steady run') + ' · ' + zone,
        durationMin: ctx.minutes, location: loc.label, intensity: level[0].toUpperCase() + level.slice(1),
        items: ['Warm-up jalan 5 menit', (level === 'ringan' ? 'Jalan cepat' : 'Lari steady') + ' ' + Math.max(10, ctx.minutes - 10) + ' menit di ' + zone, 'Cool-down 5 menit + stretch betis'],
        reasons, exercises: [], workingSets: 0,
      };
    }

    /* Strength — Gate 3 previous session */
    const mDays = muscleDays(db); soreMus.forEach(m => mDays[m] = 0);
    if (mtHeavyYesterday) {
      ['quad', 'hamglute', 'calf', 'shoulder', 'core'].forEach(m => mDays[m] = Math.min(mDays[m], 1));
      reasons.push({ gate: 'Gate 3 · Sesi sebelumnya', text: 'Muay Thai berat kemarin — lower body & shoulder volume tinggi dihindari 24 jam.' });
    } else if (last) reasons.push({ gate: 'Gate 3 · Sesi sebelumnya', text: 'Terakhir: ' + (last.title || last.sessionType) + ' (' + daysSince(last.date) + ' hari lalu).' });

    /* Gate 4 — movement coverage */
    const pDays = patternDays(db);
    const grp = {
      push: Math.min(mDays.chest, mDays.shoulder, mDays.triceps ?? 99),
      pull: Math.min(mDays.back, mDays.biceps ?? 99),
      lower: Math.min(mDays.quad, mDays.hamglute, mDays.calf),
    };
    const order = Object.entries(grp).sort((a, b) => b[1] - a[1]);
    let type; let typeWhy;
    const hasHistory = [grp.push, grp.pull, grp.lower].some(d => d < 99); // any group ever trained
    const legsNeglected = hasHistory && (grp.lower >= 4 || (order[0][0] === 'lower' && grp.lower >= 2 && grp.lower > grp.push && grp.lower > grp.pull));
    const canLower = EX.some(e => e.loc.includes(loc.loc) && ['knee', 'hip'].includes(e.pat));
    if (ctx.forceType && TYPE_PATTERNS[ctx.forceType]) { type = ctx.forceType; typeWhy = 'dipilih manual'; }
    else if (hasHistory && order[0][1] >= 3 && order[1][1] >= 3 && order[2][1] >= 3) { type = 'Full Body'; typeWhy = 'semua grup lama tak dilatih — full body untuk reset coverage'; }
    else if (legsNeglected && canLower) { type = 'Lower Body'; typeWhy = 'kaki tertinggal ' + fmtD(grp.lower) + ' — engine menyisipkan lower body'; }
    else { type = 'Quick Upper'; typeWhy = hasHistory ? 'default sesi upper: dada · side delt · shoulder · back' + (ctx.minutes >= 45 ? ' + lengan' : '') : 'awal — mulai dari Quick Upper (dada · side delt · shoulder · back)'; }
    reasons.push({ gate: 'Gate 4 · Movement coverage', text: 'Hari sejak stimulus — Push: ' + fmtD(grp.push) + ', Pull: ' + fmtD(grp.pull) + ', Lower: ' + fmtD(grp.lower) + ' → ' + type + ' (' + typeWhy + ').' });

    /* Gate 5 — time */
    const nEx = ctx.minutes <= 20 ? 3 : ctx.minutes <= 30 ? 4 : ctx.minutes <= 45 ? 5 : 6;
    const lvl = levelOf(db);
    reasons.push({ gate: 'Gate 5 · Waktu', text: ctx.minutes + ' menit → ' + nEx + ' gerakan, compound diprioritaskan. Level ' + LEVELS[lvl].toLowerCase() + (lvl === 'pemula' ? ' → 3 set compound, 2 set isolasi.' : lvl === 'lanjut' ? ' → compound hingga 4 set (dipangkas bila waktu tak cukup).' : ' → 3 set, compound pertama 4 set bila ≥60 menit.') });

    /* Gate 6 — deload guard */
    const deload = deloadCheck(db);
    if (deload.due) reasons.push({ gate: 'Gate 6 · Deload', text: 'Fatigue akumulatif: ' + deload.reason + '. Volume dipangkas ~1 set/gerakan & beban ditahan — pertimbangkan minggu ringan.' });
    else reasons.push({ gate: 'Gate 6 · Deload', text: 'Beban latihan mingguan dalam batas wajar — tidak perlu deload.' });

    /* Gate 7 — protein fueling (nutrition → recovery link) */
    const fuel = proteinAdequacy(db, 3);
    if (fuel.underfueled) reasons.push({ gate: 'Gate 7 · Nutrisi', text: 'Protein di bawah target pada ' + fuel.short + ' dari ' + fuel.logged + ' hari terakhir — recovery lebih lambat. Volume accessory dikurangi; utamakan protein hari ini.' });
    else if (fuel.logged >= 2) reasons.push({ gate: 'Gate 7 · Nutrisi', text: 'Asupan protein cukup beberapa hari terakhir — mendukung recovery & volume normal.' });

    /* Exercise scoring — equipment availability enforced via categories */
    const availCats = new Set(db.equipment.filter(e => e.available && e.loc === loc.loc).flatMap(e => e.cats || []));
    const eqAvailable = (ex) => (ex.cats || []).every(c => availCats.has(c));
    const eqOk = (ex) => ex.loc.includes(loc.loc) && eqAvailable(ex);
    let patterns = TYPE_PATTERNS[type].slice();
    if (type === 'Strength Express') patterns = order[0][0] === 'lower' ? ['knee', 'hip', 'calf', 'core'] : ['hpush', 'hpull', 'vpull', 'knee'];
    const picked = []; const usedPat = {}; const usedMus = {};
    const scored = EX.filter(eqOk).map(ex => {
      let sc = 0;
      sc += (pDays[ex.pat] >= 3 ? 3 : pDays[ex.pat]) * 2;
      sc += Math.min(...ex.mus.map(m => mDays[m] ?? 99)) >= 2 ? 4 : -2;
      if (ex.pref) sc += 3;
      if (ex.kind === 'major') sc += 2;
      if (ex.mus.some(m => soreMus.includes(m))) sc -= 100;
      if (ex.mus.some(m => soreLight.includes(m))) sc -= 3;
      return { ex, sc };
    }).sort((a, b) => b.sc - a.sc);
    patterns.forEach(p => {
      if (picked.length >= nEx) return;
      const cand = scored.find(s => s.ex.pat === p && s.sc > -50 && !picked.some(pk => pk.ex.id === s.ex.id) && (usedPat[p] || 0) < 2);
      if (cand) { picked.push(cand); usedPat[p] = (usedPat[p] || 0) + 1; cand.ex.mus.forEach(m => usedMus[m] = 1); }
    });
    for (const s of scored) { if (picked.length >= nEx) break; if (s.sc > -50 && !picked.some(pk => pk.ex.id === s.ex.id) && patterns.includes(s.ex.pat)) picked.push(s); }

    const exercises = picked.map((s, i) => {
      const prog = progressionFor(db, s.ex.id);
      let sets = lvl === 'pemula' && s.ex.kind === 'accessory' ? 2 : 3;
      if (ctx.readiness === 'agak-lelah' && s.ex.kind === 'accessory') sets = 2;
      if (fuel.underfueled && s.ex.kind === 'accessory') sets = Math.max(2, sets - 1);
      if (s.ex.mus.some(m => soreLight.includes(m))) sets = Math.max(2, sets - 1);
      if (ctx.readiness === 'fit' && s.ex.kind === 'major' && lvl !== 'pemula' && (lvl === 'lanjut' ? ctx.minutes >= 45 : ctx.minutes >= 60 && i === 0)) sets = 4;
      if (ctx.minutes <= 20) sets = Math.min(sets, 3);
      if (deload.due) sets = Math.max(2, sets - 1);
      const prog2 = deload.due ? { ...prog, weight: prog.weight, note: 'Deload — tahan beban, kurangi volume' } : prog;
      return { exId: s.ex.id, name: s.ex.name, equip: s.ex.equip, kind: s.ex.kind, pat: s.ex.pat, sets, weight: prog2.weight, repLo: prog2.repLo, repHi: prog2.repHi, rest: s.ex.kind === 'major' ? 120 : 60, note: prog2.note, inc: s.ex.inc };
    });
    const workingSets = exercises.reduce((a, e) => a + e.sets, 0);
    // Fallback: no exercise passed the filters (all equipment unavailable, or every muscle heavily sore).
    if (!exercises.length) {
      const allSore = soreMus.length >= 6;
      reasons.push({ gate: 'Fallback', text: allSore ? 'Hampir semua otot nyeri berat — strength ditunda, alihkan ke mobility/recovery.' : 'Alat untuk lokasi ini tidak cukup — tak ada gerakan yang bisa disusun. Aktifkan alat di menu More, atau lakukan sesi bodyweight.' });
      return {
        kind: 'recovery', type: allSore ? 'Recovery / Mobility' : 'Bodyweight / Mobility',
        focus: allSore ? 'Pemulihan aktif — otot masih recovery' : 'Bodyweight — alat terbatas',
        durationMin: Math.min(ctx.minutes, 30), location: loc.label, intensity: 'Ringan',
        items: allSore
          ? ['Jalan santai 10–15 menit', 'Mobility flow: hip, thoracic, bahu — 8 menit', 'Stretching area yang pegal', 'Breathing 4-4-8 — 3 menit']
          : ['Push-up 3×maks', 'Plank 3×45 detik', 'Bodyweight squat 3×20', 'Pull-up / row bila ada bar', 'Mobility penutup 5 menit'],
        reasons, exercises: [], workingSets: 0,
      };
    }
    // realistic duration: warm-up + execution + real rest (none after an exercise's last set) + setup/transition + cool-down
    const setupMin = loc.loc === 'gym' ? 2 : 1;
    const estOf = (list) => Math.round(8 + list.reduce((a, e) => a + e.sets * 0.75 + Math.max(0, e.sets - 1) * (e.rest / 60) + setupMin, 0) + 3);
    // trim accessory (then major) sets until the plan fits the time the user has
    let guard = 40;
    while (estOf(exercises) > ctx.minutes && guard-- > 0) {
      const cand = exercises.filter(e => e.sets > 2).sort((a, b) => (a.kind === 'accessory' ? 0 : 1) - (b.kind === 'accessory' ? 0 : 1) || b.sets - a.sets)[0];
      if (!cand) { if (exercises.length > 3) exercises.pop(); else break; } else cand.sets--;
    }
    const est = estOf(exercises);
    const whyBits = [];
    const freshest = order[0]; const staleName = { push: 'push', pull: 'pull', lower: 'lower' }[freshest[0]];
    if (freshest[1] >= 2 && freshest[1] < 99) whyBits.push(staleName + ' belum dilatih ' + freshest[1] + ' hari');
    const recentGrp = order[order.length - 1];
    if (recentGrp[1] <= 1) whyBits.push({ push: 'push', pull: 'pull', lower: 'kaki' }[recentGrp[0]] + ' baru kemarin');
    whyBits.push('readiness ' + ({ fit: 'fit', 'agak-lelah': 'agak lelah', lelah: 'lelah' }[ctx.readiness]));
    if (deload.due) whyBits.unshift('deload disarankan');
    return {
      kind: 'strength', type, focus: deload.due ? focusLabel(type, order) + ' · deload' : focusLabel(type, order), durationMin: est,
      location: loc.label, intensity: deload.due ? 'Ringan–sedang (deload)' : (ctx.readiness === 'fit' ? 'Sedang–berat' : 'Sedang'),
      why: whyBits.slice(0, 3).join(' · '),
      exercises, workingSets: exercises.reduce((a, e) => a + e.sets, 0), reasons, deload: deload.due, warmup: warmupFor(exercises.map(e => e.pat)), items: [],
    };
  }
  const fmtD = d => d >= 99 ? '—' : d + 'h';
  const TYPE_FOCUS = {
    'Quick Upper': 'Dada · side delt · shoulder · back',
    'Full Body': 'Semua grup otot utama', 'Upper Push–Pull': 'Dada, punggung & bahu',
    'Upper Body': 'Tubuh atas menyeluruh', 'Push': 'Dada, bahu & triceps',
    'Pull': 'Punggung, biceps & rear delt', 'Lower Body': 'Quads, hamstring & glute',
    'Strength Express': 'Compound cepat menyeluruh',
  };

  /* Alternative sessions: real different session types for today's context */
  function alternatives(db, ctx, currentType) {
    const loc = LOCATIONS.find(l => l.id === ctx.locationId) || LOCATIONS[0];
    const out = [];
    if (loc.kind === 'strength') {
      const types = Object.keys(TYPE_PATTERNS).filter(t => t !== currentType && (ctx.minutes > 30 || t === 'Quick Upper' || t === 'Strength Express'));
      types.slice(0, 4).forEach(t => {
        const r = recommend(db, { ...ctx, forceType: t });
        if (r.kind === 'strength') out.push({ title: t, sub: r.exercises.slice(0, 3).map(e => e.name).join(' · ') + (r.exercises.length > 3 ? ' +' + (r.exercises.length - 3) : ''), rec: r });
      });
      out.push({ title: 'Cardio Recovery', sub: 'Jalan cepat ' + Math.min(ctx.minutes, 30) + ' menit Zona 2', rec: recommend(db, { ...ctx, locationId: 'home-treadmill' }) });
    } else {
      out.push({ title: 'Full Body Strength', sub: 'Strength di lokasi terdekat', rec: recommend(db, { ...ctx, locationId: loc.loc === 'gym' ? 'fithub' : 'home-strength', forceType: 'Full Body' }) });
      out.push({ title: 'Mobility / Recovery', sub: 'Pemulihan aktif ' + Math.min(ctx.minutes, 30) + ' menit', rec: recommend(db, { ...ctx, readiness: 'lelah' }) });
    }
    return out.slice(0, 3);
  }
  const focusLabel = (type, order) => TYPE_FOCUS[type] || type;

  function previewNext(db, ctx, rec) {
    const grp = { push: 0, pull: 0, lower: 0 };
    const mark = t => { if (/Push–Pull|Upper|Push|Full/.test(t)) grp.push = 1; if (/Pull|Upper|Full/.test(t)) grp.pull = 1; if (/Lower|Full/.test(t)) grp.lower = 1; };
    mark(rec.type);
    const mDays = muscleDays(db);
    const out = [];
    const cardioGap = db.sessions.filter(s => s.cardio && s.sessionType !== 'muaythai' && daysSince(s.date) <= 3).length === 0;
    if (rec.kind !== 'cardio' && cardioGap) out.push({ title: 'Treadmill Moderate', sub: '30 menit · Zona 3' });
    if (!grp.lower && Math.min(mDays.quad, mDays.hamglute) >= 1) out.push({ title: 'Lower Body', sub: 'Leg press / squat fokus' });
    if (!grp.pull) out.push({ title: 'Pull', sub: 'Vertical + horizontal pull' });
    if (!grp.push) out.push({ title: 'Upper Push', sub: 'Chest & shoulder' });
    if (out.length < 2) out.push({ title: 'Full Body', sub: 'Coverage seimbang' });
    const day = new Date(); 
    return out.slice(0, 3).map((o, i) => { const d = new Date(day.getTime() + (i + 1) * DAY); return { ...o, day: d.toLocaleDateString('id-ID', { weekday: 'long' }) }; });
  }

  function replaceOptions(db, ctx, exId, excludeIds) {
    const ex = exById(exId); if (!ex) return [];
    const loc = LOCATIONS.find(l => l.id === ctx.locationId) || LOCATIONS[0];
    const availCats = new Set(db.equipment.filter(e => e.available && e.loc === loc.loc).flatMap(e => e.cats || []));
    const eqOk = (e) => e.loc.includes(loc.loc) && (e.cats || []).every(c => availCats.has(c));
    return EX.filter(e => e.id !== exId && !excludeIds.includes(e.id) && eqOk(e))
      .map(e => ({ e, sc: (e.pat === ex.pat ? 4 : 0) + (e.mus.some(m => ex.mus.includes(m)) ? 2 : 0) + (e.kind === ex.kind ? 1 : 0) }))
      .filter(x => x.sc >= 2).sort((a, b) => b.sc - a.sc).slice(0, 5).map(x => x.e);
  }

  /* ---------- Trends ---------- */
  const sortedMetrics = db => db.bodyMetrics.slice().sort((a, b) => new Date(a.measuredAt) - new Date(b.measuredAt));
  function movAvg(db, days, field) {
    const cutoff = Date.now() - days * DAY;
    const vals = db.bodyMetrics.filter(m => new Date(m.measuredAt).getTime() >= cutoff && m[field] != null).map(m => m[field]);
    return vals.length ? +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : null;
  }
  const timeCategory = (d) => { const h = new Date(d).getHours(); return h < 11 ? 'pagi' : h < 15 ? 'siang' : h < 19 ? 'sore' : 'malam'; };

  /* ---------- Nutrition ---------- */
  // Seed food library — Fauzan's staples, categorized. kcal derived from macros (4/4/9).
  const kc = (p, c, f) => Math.round(p * 4 + c * 4 + f * 9);
  // [id, name, icon, cat, unit, grams(per-100g?), p, c, f]
  const FOOD_ROWS = [
    // Telur & protein cepat
    ['telur-rebus', 'Telur rebus', '🥚', 'protein', '1 butir', false, 6.3, 0.4, 4.8, 1],
    ['telur-mata-sapi', 'Telur mata sapi', '🍳', 'protein', '1 butir + minyak', false, 6.3, 0.4, 9.8, 1],
    ['telur-dadar', 'Telur dadar', '🍳', 'protein', '2 butir + 1 sdm minyak', false, 13, 1, 24, 1],
    ['telur-saos-sambel', 'Telur + saus sambal', '🌶️', 'protein', '2 butir + saus', false, 13, 9, 15, 1],
    ['telur-cheddar', 'Telur + cheddar', '🧀', 'protein', '2 butir + 1 lembar', false, 18, 1, 21, 1],
    ['telur-mozzarella', 'Telur + mozzarella', '🧀', 'protein', '2 butir + 25 g', false, 19, 2, 20, 1],
    ['telur-dadar-padang', 'Telur dadar Padang', '🍳', 'protein', '1 potong', false, 10, 6, 14, 0],
    ['telur-balado', 'Telur balado', '🥚', 'protein', '1 butir', false, 7, 4, 8, 0],
    ['whey-truiso', 'Whey Fitlife TruISO', '🥤', 'protein', '1 scoop', false, 30, 4, 1, 1],
    ['greek-yogurt', 'Greek yogurt plain', '🥛', 'protein', '100 g', true, 10, 4, 0.4, 0],
    ['susu', 'Susu', '🥛', 'protein', '250 ml', false, 8, 12, 8, 0],
    ['keju-cheddar', 'Keju cheddar', '🧀', 'protein', '10 g', false, 2.5, 0.4, 3.3, 0],
    // Ayam
    ['ayam-dada-panggang', 'Dada ayam panggang', '🍗', 'ayam', '100 g', true, 31, 0, 3.6, 1],
    ['ayam-dada-goreng', 'Dada ayam goreng', '🍗', 'ayam', '100 g', true, 29, 6, 14, 0],
    ['ayam-dada', 'Ayam dada', '🍗', 'ayam', '150 g', false, 46, 0, 5, 0],
    ['paha-goreng', 'Paha ayam goreng', '🍗', 'ayam', '1 potong', false, 19, 4, 14, 0],
    ['sayap-goreng', 'Sayap ayam goreng', '🍗', 'ayam', '1 buah', false, 9, 3, 10, 0],
    ['kfc-crispy', 'Ayam crispy KFC', '🍗', 'ayam', '1 potong', false, 22, 10, 18, 1],
    ['chicken-katsu', 'Chicken katsu', '🍗', 'ayam', '100 g', true, 16, 18, 14, 0],
    ['nugget', 'Chicken nugget', '🍗', 'ayam', '1 buah', false, 3, 4, 3, 0],
    ['dada-ayam-nasi', 'Nasi + ayam dada', '🍛', 'ayam', '1 porsi', false, 45, 68, 12, 1],
    ['ayam-pop', 'Ayam pop Padang', '🍗', 'ayam', '1 potong ±200 g', false, 28, 5, 13, 0],
    ['ayam-bakar-padang', 'Ayam bakar Padang', '🍗', 'ayam', '1 potong', false, 30, 10, 14, 0],
    ['ayam-gulai', 'Ayam gulai', '🍛', 'ayam', '1 potong + kuah', false, 27, 6, 23, 0],
    ['ayam-rendang-dada', 'Ayam rendang', '🍛', 'ayam', '1 potong', false, 28, 10, 28, 0],
    ['ayam-goreng-kalasan', 'Ayam goreng Kalasan', '🍗', 'ayam', '1 potong', false, 26, 6, 18, 0],
    ['ayam-goreng-suharti', 'Ayam goreng Suharti + kremes', '🍗', 'ayam', '1 potong + kremes', false, 27, 10, 22, 0],
    ['ayam-penyet', 'Ayam penyet + sambal', '🌶️', 'ayam', '1 potong', false, 28, 5, 20, 1],
    ['ayam-geprek-lauk', 'Ayam geprek (lauk saja)', '🌶️', 'ayam', '1 potong', false, 26, 12, 20, 0],
    ['ayam-bakar-taliwang', 'Ayam bakar Taliwang', '🌶️', 'ayam', '1/2 ekor', false, 40, 8, 24, 0],
    ['ayam-kremes', 'Ayam kremes', '🍗', 'ayam', '1 potong', false, 25, 12, 22, 0],
    ['ayam-serundeng', 'Ayam goreng serundeng', '🍗', 'ayam', '1 potong', false, 26, 8, 18, 0],
    ['dada-ayam-fillet', 'Fillet dada ayam (tanpa kulit)', '🍗', 'ayam', '100 g', true, 31, 0, 3.6, 1],
    ['paha-atas-panggang', 'Paha atas ayam panggang', '🍗', 'ayam', '1 potong ±100 g', false, 24, 0, 9, 0],
    ['paha-bawah-goreng', 'Paha bawah (drumstick) goreng', '🍗', 'ayam', '1 buah', false, 15, 3, 11, 0],
    ['chicken-wings', 'Chicken wings (bumbu)', '🍗', 'ayam', '2 buah', false, 16, 4, 16, 1],
    ['ceker-ayam', 'Ceker ayam', '🍗', 'ayam', '3 buah', false, 8, 0, 6, 0],
    ['ati-ampela', 'Ati ampela ayam', '🍗', 'ayam', '1 tusuk/porsi', false, 12, 2, 6, 0],
    ['kulit-ayam-goreng', 'Kulit ayam goreng', '🍗', 'ayam', '30 g', false, 6, 3, 15, 0],
    ['ayam-rica', 'Ayam rica-rica', '🌶️', 'ayam', '1 potong', false, 27, 6, 16, 0],
    ['ayam-woku', 'Ayam woku', '🌶️', 'ayam', '1 potong + kuah', false, 26, 5, 18, 0],
    // Bebek
    ['bebek-goreng', 'Bebek goreng (Slamet dsb)', '🦆', 'ayam', '1 potong', false, 24, 3, 24, 1],
    ['bebek-bakar', 'Bebek bakar', '🦆', 'ayam', '1 potong', false, 25, 4, 20, 0],
    ['bebek-sambal-ijo', 'Bebek sambal ijo', '🦆', 'ayam', '1 potong', false, 24, 5, 22, 0],
    ['bebek-goreng-kremes', 'Bebek goreng kremes', '🦆', 'ayam', '1 potong + kremes', false, 25, 9, 26, 0],
    // Tahu & tempe
    ['tempe-goreng', 'Tempe goreng', '🟫', 'nabati', '1 potong ±35 g', false, 7, 5, 6, 1],
    ['tempe-orek', 'Tempe orek', '🟫', 'nabati', '100 g', true, 14, 12, 10, 0],
    ['tahu-kuning-goreng', 'Tahu kuning goreng', '🟨', 'nabati', '1 buah ±50 g', false, 5, 3, 7, 0],
    ['tahu-putih', 'Tahu putih / tofu lembut', '⬜', 'nabati', '100 g', true, 7, 2, 4, 0],
    ['egg-tofu', 'Egg tofu', '🟡', 'nabati', '100 g', true, 8, 4, 8, 0],
    ['tofu-goreng', 'Tofu goreng', '🟫', 'nabati', '100 g', true, 10, 8, 16, 0],
    ['tahu-isi', 'Tahu isi', '🥟', 'nabati', '1 buah', false, 4, 10, 7, 0],
    ['tahu-telur', 'Tahu telur', '🍳', 'nabati', '1 porsi', false, 14, 20, 18, 0],
    ['tempe-bacem', 'Tempe bacem', '🟫', 'nabati', '1 potong', false, 6, 9, 5, 0],
    ['tahu-bacem', 'Tahu bacem', '🟨', 'nabati', '1 buah', false, 5, 6, 4, 0],
    ['oncom', 'Oncom / pepes oncom', '🟫', 'nabati', '100 g', true, 12, 10, 6, 0],
    ['tempe-mentah', 'Tempe kukus/rebus', '🟫', 'nabati', '100 g', true, 19, 9, 11, 0],
    ['kacang-edamame', 'Edamame rebus', '🫛', 'nabati', '100 g', true, 11, 10, 5, 0],
    ['sayur-tumis-tempe', 'Tumis buncis tempe', '🥬', 'nabati', '1 porsi', false, 9, 12, 10, 0],
    ['tahu-sumedang', 'Tahu Sumedang / cihuni', '🟨', 'nabati', '3 buah', false, 6, 4, 8, 0],
    ['tahu-gejrot', 'Tahu gejrot', '🟤', 'nabati', '1 porsi', false, 6, 14, 6, 0],
    ['tahu-pong', 'Tahu pong / kopong', '🟨', 'nabati', '2 buah', false, 5, 3, 7, 0],
    ['kering-tempe', 'Kering tempe', '🟫', 'nabati', '2 sdm', false, 5, 12, 6, 0],
    ['perkedel-tahu', 'Perkedel tahu', '🟨', 'nabati', '1 buah', false, 5, 6, 6, 0],
    ['tahu-crispy', 'Tahu crispy', '🟫', 'nabati', '100 g', true, 8, 16, 16, 0],
    // Nasi & karbo
    ['nasi-putih', 'Nasi putih', '🍚', 'karbo', '100 g', true, 2.5, 28, 0.3, 1],
    ['nasi-goreng-ayam', 'Nasi goreng ayam', '🍛', 'karbo', '1 porsi', false, 18, 75, 20, 1],
    ['nasi-liwet', 'Nasi liwet', '🍚', 'karbo', '100 g', true, 3, 30, 4, 0],
    ['nasi-kfc', 'Nasi putih KFC', '🍚', 'karbo', '1 bungkus ±180 g', false, 5, 51, 0.5, 0],
    ['lontong', 'Lontong', '🍙', 'karbo', '100 g', true, 2, 25, 0.3, 0],
    ['ketupat', 'Ketupat', '🍙', 'karbo', '100 g', true, 2, 24, 0.2, 0],
    ['bihun-goreng', 'Bihun goreng', '🍜', 'karbo', '100 g', true, 5, 30, 8, 0],
    ['mie-instan-telur', 'Mi instan + telur', '🍜', 'karbo', '1 porsi', false, 13, 58, 22, 1],
    ['roti-tawar', 'Roti tawar', '🍞', 'karbo', '1 lembar', false, 3, 13, 1, 1],
    ['kentang-goreng', 'Kentang goreng', '🍟', 'karbo', '100 g', true, 3, 35, 15, 0],
    // Lauk Padang
    ['rendang', 'Rendang daging', '🍛', 'padang', '1 potong ±90 g', false, 21, 6, 20, 1],
    ['gulai-otak', 'Gulai otak', '🍛', 'padang', '1 potong', false, 9, 4, 16, 0],
    ['dendeng', 'Dendeng balado', '🌶️', 'padang', '100 g', true, 27, 10, 20, 0],
    ['perkedel', 'Perkedel kentang', '🥔', 'padang', '1 buah', false, 3, 10, 7, 0],
    ['kikil-gulai', 'Tunjang / kikil gulai', '🍛', 'padang', '1 potong', false, 8, 3, 14, 0],
    ['daun-singkong', 'Daun singkong rebus', '🥬', 'padang', '100 g', true, 4, 7, 5, 0],
    ['nangka-santan', 'Sayur nangka santan', '🥥', 'padang', '100 g', true, 2, 8, 7, 0],
    ['gulai-tunjang', 'Gulai tunjang', '🍛', 'padang', '1 potong', false, 9, 3, 16, 0],
    ['ikan-balado-padang', 'Ikan balado Padang', '🌶️', 'padang', '1 potong', false, 20, 4, 12, 0],
    ['telur-dadar-tebal', 'Telur dadar Padang tebal', '🍳', 'padang', '1 potong', false, 12, 5, 16, 0],
    ['gulai-ikan-padang', 'Gulai ikan Padang', '🍛', 'padang', '1 potong + kuah', false, 20, 5, 16, 0],
    ['sambal-ijo-teri', 'Sambal ijo teri kentang', '🌶️', 'padang', '2 sdm', false, 5, 8, 7, 0],
    ['gulai-cubadak', 'Gulai cubadak (nangka)', '🥥', 'padang', '100 g', true, 2, 9, 8, 0],
    ['ayam-gulai-padang', 'Ayam gulai Padang', '🍛', 'padang', '1 potong + kuah', false, 27, 6, 22, 0],
    ['telur-balado-padang', 'Telur balado Padang', '🥚', 'padang', '1 butir', false, 7, 5, 9, 0],
    ['gulai-kepala-ikan', 'Gulai kepala ikan', '🐟', 'padang', '1 porsi', false, 22, 5, 18, 0],
    ['paru-goreng', 'Paru goreng', '🍖', 'padang', '1 potong', false, 15, 2, 14, 0],
    ['babat-goreng', 'Limpa / babat goreng', '🍖', 'padang', '1 potong', false, 14, 2, 12, 0],
    ['ayam-balado', 'Ayam balado', '🌶️', 'padang', '1 potong', false, 26, 5, 16, 0],
    ['sambalado-tanak', 'Sambalado tanak', '🌶️', 'padang', '2 sdm', false, 3, 6, 8, 0],
    ['gulai-tambusu', 'Gulai tambusu', '🍛', 'padang', '1 potong', false, 10, 6, 14, 0],
    ['dendeng-batokok', 'Dendeng batokok', '🌶️', 'padang', '100 g', true, 28, 6, 16, 0],
    ['ikan-bilih', 'Ikan bilih goreng', '🐟', 'padang', '30 g', false, 12, 2, 6, 0],
    // Mie, bakso & kuah
    ['mie-ayam', 'Mie ayam', '🍜', 'kuah', '1 porsi ±400 g', false, 20, 65, 18, 1],
    ['bakso-kecil', 'Bakso sapi kecil', '🍢', 'kuah', '1 butir ±15 g', false, 2, 2, 1.5, 0],
    ['bakso-sedang', 'Bakso sapi sedang', '🍢', 'kuah', '1 butir ±25 g', false, 3, 3, 2.5, 0],
    ['soto-ayam', 'Soto ayam', '🍲', 'kuah', '1 mangkuk tanpa nasi', false, 18, 12, 14, 0],
    ['sop-bening', 'Sop ayam/sapi bening', '🍲', 'kuah', '1 mangkuk', false, 14, 8, 6, 0],
    ['bakso-malang', 'Bakso Malang / cuanki', '🍜', 'kuah', '1 porsi', false, 18, 40, 18, 0],
    ['opor-ayam', 'Opor ayam', '🍛', 'kuah', '1 potong + kuah', false, 24, 6, 22, 0],
    ['bubur-ayam', 'Bubur ayam lengkap', '🍚', 'kuah', '1 mangkuk ±400 g', false, 18, 55, 12, 0],
    ['seirock-toripaitan', 'Seirock-Ya Toripaitan', '🍜', 'kuah', '1 mangkuk', false, 39, 72, 32, 0],
    // Dimsum & snack
    ['siomay-ikan', 'Siomay ikan', '🥟', 'dimsum', '1 buah ±30 g', false, 3, 5, 1.5, 0],
    ['dimsum', 'Dimsum ayam/udang', '🥟', 'dimsum', '1 buah ±25 g', false, 3.5, 4, 2, 0],
    ['hakau', 'Hakau udang', '🦐', 'dimsum', '1 buah ±25 g', false, 3, 4.5, 0.5, 0],
    ['sate-ayam', 'Sate ayam (tanpa saus)', '🍢', 'dimsum', '1 tusuk ±15 g', false, 4, 1, 3.5, 1],
    ['martabak-telur', 'Martabak telur', '🥞', 'dimsum', '1 potong', false, 8, 15, 14, 0],
    ['martabak-manis', 'Martabak manis', '🥞', 'dimsum', '1 potong', false, 5, 35, 14, 0],
    ['martabak-manis-keju', 'Martabak manis keju coklat', '🥞', 'dimsum', '1 potong', false, 6, 38, 18, 0],
    ['martabak-mini', 'Martabak mini / kubang', '🥞', 'dimsum', '1 buah', false, 2, 12, 5, 0],
    ['terang-bulan-tipis', 'Terang bulan tipis kering', '🥞', 'dimsum', '1 potong', false, 4, 30, 10, 0],
    ['risol', 'Risol', '🥟', 'dimsum', '1 buah', false, 4, 15, 8, 0],
    ['pastel', 'Pastel', '🥟', 'dimsum', '1 buah', false, 4, 16, 9, 0],
    ['pizza-slice', 'Pizza (per slice)', '🍕', 'dimsum', '1 slice', false, 10, 30, 11, 0],
    ['sushi', 'Sushi', '🍣', 'dimsum', '1 pc', false, 2, 8, 1, 0],
    // Steak & pasta
    ['steak-sirloin', 'Steak sirloin (plain)', '🥩', 'steak', '100 g', true, 27, 0, 13, 1],
    ['steak-tenderloin', 'Steak tenderloin (plain)', '🥩', 'steak', '100 g', true, 28, 0, 10, 0],
    ['spaghetti-bolognese', 'Spaghetti bolognese', '🍝', 'steak', '1 porsi ±350 g', false, 24, 70, 21, 1],
    ['makaroni-schotel', 'Makaroni schotel', '🧀', 'steak', '100 g', true, 9, 18, 10, 0],
    ['chicken-steak', 'Chicken steak', '🍗', 'steak', '1 porsi', false, 30, 20, 18, 1],
    ['steak-lada-hitam', 'Steak sapi lada hitam', '🥩', 'steak', '1 porsi', false, 28, 18, 22, 0],
    ['spaghetti-aglio', 'Spaghetti aglio olio', '🍝', 'steak', '1 porsi', false, 12, 65, 18, 0],
    ['spaghetti-carbonara', 'Spaghetti carbonara', '🍝', 'steak', '1 porsi', false, 20, 62, 30, 0],
    ['lasagna', 'Lasagna', '🧀', 'steak', '1 potong', false, 18, 35, 20, 0],
    ['fettuccine', 'Fettuccine alfredo', '🍝', 'steak', '1 porsi', false, 16, 58, 28, 0],
    ['fish-and-chips', 'Fish and chips', '🍟', 'steak', '1 porsi', false, 26, 55, 30, 0],
    // Buah & sayur
    ['jeruk', 'Jeruk', '🍊', 'buah', '1 buah sedang', false, 1, 12, 0.2, 1],
    ['strawberry', 'Strawberry', '🍓', 'buah', '100 g', true, 0.7, 8, 0.3, 1],
    ['anggur', 'Anggur', '🍇', 'buah', '100 g', true, 0.6, 18, 0.2, 1],
    ['pisang', 'Pisang', '🍌', 'buah', '1 buah sedang', false, 1.3, 27, 0.4, 0],
    ['apel', 'Apel', '🍎', 'buah', '1 buah', false, 0.5, 25, 0.3, 0],
    ['brokoli', 'Brokoli rebus', '🥦', 'buah', '100 g', true, 2.8, 7, 0.4, 0],
    ['selada', 'Selada / romaine', '🥬', 'buah', '100 g', true, 1.4, 3, 0.2, 0],
    ['timun', 'Timun', '🥒', 'buah', '100 g', true, 0.7, 4, 0.1, 0],
    ['mangga', 'Mangga', '🥭', 'buah', '1 buah sedang', false, 1, 25, 0.3, 0],
    ['pepaya', 'Pepaya', '🫐', 'buah', '100 g', true, 0.5, 11, 0.2, 0],
    ['semangka', 'Semangka', '🍉', 'buah', '100 g', true, 0.6, 8, 0.2, 0],
    ['melon', 'Melon', '🍈', 'buah', '100 g', true, 0.8, 8, 0.2, 0],
    ['nanas', 'Nanas', '🍍', 'buah', '100 g', true, 0.5, 13, 0.1, 0],
    ['alpukat', 'Alpukat', '🥑', 'buah', '1/2 buah', false, 2, 9, 15, 0],
    ['naga', 'Buah naga', '🐉', 'buah', '100 g', true, 1.2, 13, 0.4, 0],
    ['kurma', 'Kurma', '🌴', 'buah', '3 buah', false, 0.6, 18, 0.1, 0],
    ['bayam-tumis', 'Bayam tumis', '🥬', 'buah', '100 g', true, 3, 6, 5, 0],
    ['kangkung-tumis', 'Kangkung tumis', '🥬', 'buah', '1 porsi', false, 3, 8, 8, 0],
    ['capcay', 'Capcay sayur', '🥗', 'buah', '1 porsi', false, 6, 14, 10, 0],
    ['wortel-rebus', 'Wortel rebus', '🥕', 'buah', '100 g', true, 0.9, 10, 0.2, 0],
    ['jagung-rebus', 'Jagung rebus', '🌽', 'buah', '1 buah', false, 3, 27, 1.5, 0],
    // Bumbu & tambahan (add-on)
    ['minyak-sdm', 'Minyak goreng', '🫗', 'bumbu', '1 sdm', false, 0, 0, 14, 0],
    ['minyak-sdt', 'Minyak goreng', '🫗', 'bumbu', '1 sdt', false, 0, 0, 5, 0],
    ['butter', 'Margarin / butter', '🧈', 'bumbu', '1 sdm', false, 0.1, 0, 12, 0],
    ['sambal-botol', 'Sambal botolan', '🌶️', 'bumbu', '1 sdm', false, 0.3, 3, 0.5, 0],
    ['sambal-minyak', 'Sambal ulek berminyak', '🌶️', 'bumbu', '1 sdm', false, 0.5, 2, 5, 0],
    ['sambal-hijau', 'Sambal hijau Padang', '🌶️', 'bumbu', '1 sdm', false, 0.5, 2, 4, 0],
    ['kecap-manis', 'Kecap manis', '🍶', 'bumbu', '1 sdm', false, 0.5, 11, 0, 0],
    ['saus-tomat', 'Saus tomat / cabai', '🍅', 'bumbu', '1 sdm', false, 0.2, 4, 0, 0],
    ['mayo', 'Mayones', '🥚', 'bumbu', '1 sdm', false, 0.1, 0.5, 10, 0],
    ['chili-oil', 'Chili oil', '🌶️', 'bumbu', '1 sdt', false, 0, 0, 5, 0],
    ['bumbu-kacang', 'Bumbu kacang', '🥜', 'bumbu', '1 sdm', false, 2.5, 4, 4, 0],
    ['dressing', 'Salad dressing', '🥗', 'bumbu', '1 sdm', false, 0.1, 1.5, 6, 0],
    ['bawang-goreng', 'Bawang goreng', '🧅', 'bumbu', '1 sdm', false, 0.5, 3, 4, 0],
    ['kerupuk', 'Kerupuk', '🍘', 'bumbu', '10 g', false, 0.5, 6, 2.5, 0],
    ['gula', 'Gula', '🍬', 'bumbu', '1 sdt', false, 0, 4, 0, 0],
    ['bumbu-kacang-sate', 'Bumbu kacang sate', '🥜', 'bumbu', '2 sdm', false, 4, 8, 8, 0],
    // Ikan & seafood
    ['ikan-kembung-goreng', 'Ikan kembung goreng', '🐟', 'seafood', '1 ekor ±80 g', false, 18, 0, 12, 1],
    ['ikan-lele-goreng', 'Lele goreng', '🐟', 'seafood', '1 ekor', false, 17, 0, 11, 0],
    ['ikan-nila-bakar', 'Ikan nila bakar', '🐟', 'seafood', '1 ekor ±150 g', false, 30, 1, 6, 1],
    ['gurame-goreng', 'Gurame goreng', '🐟', 'seafood', '1 potong', false, 20, 2, 14, 0],
    ['salmon-panggang', 'Salmon panggang', '🐟', 'seafood', '100 g', true, 22, 0, 13, 1],
    ['tuna-kaleng', 'Tuna kaleng (air)', '🐟', 'seafood', '100 g', true, 26, 0, 1, 1],
    ['udang-goreng', 'Udang goreng', '🦐', 'seafood', '100 g', true, 20, 3, 8, 0],
    ['udang-rebus', 'Udang rebus', '🦐', 'seafood', '100 g', true, 24, 0, 1, 1],
    ['cumi-goreng', 'Cumi goreng tepung', '🦑', 'seafood', '100 g', true, 15, 12, 12, 0],
    ['ikan-teri-goreng', 'Ikan teri goreng', '🐟', 'seafood', '30 g', false, 12, 0, 6, 0],
    ['pindang-ikan', 'Pindang / ikan kuah', '🐟', 'seafood', '1 potong + kuah', false, 20, 3, 8, 0],
    ['ikan-asin', 'Ikan asin', '🐟', 'seafood', '30 g', false, 12, 0, 5, 0],
    ['bandeng-goreng', 'Bandeng goreng', '🐟', 'seafood', '1 potong', false, 20, 0, 14, 0],
    ['bandeng-presto', 'Bandeng presto', '🐟', 'seafood', '1 potong', false, 20, 0, 12, 0],
    ['tongkol-balado', 'Tongkol balado', '🐟', 'seafood', '1 potong', false, 22, 4, 8, 0],
    ['tuna-steak', 'Tuna steak segar', '🐟', 'seafood', '100 g', true, 25, 0, 5, 1],
    ['mujair-goreng', 'Mujair goreng', '🐟', 'seafood', '1 ekor', false, 19, 0, 11, 0],
    ['patin-kuah', 'Patin kuah / pindang', '🐟', 'seafood', '1 potong + kuah', false, 20, 3, 9, 0],
    ['ikan-mas-goreng', 'Ikan mas goreng', '🐟', 'seafood', '1 ekor', false, 18, 0, 12, 0],
    ['kakap-asam-manis', 'Kakap asam manis', '🐟', 'seafood', '1 porsi', false, 24, 20, 14, 0],
    ['dori-goreng', 'Fillet dori goreng tepung', '🐟', 'seafood', '100 g', true, 15, 14, 12, 0],
    ['kepiting', 'Kepiting saus', '🦀', 'seafood', '1 porsi', false, 22, 12, 16, 0],
    ['kerang-rebus', 'Kerang rebus', '🦪', 'seafood', '100 g', true, 14, 4, 2, 0],
    ['kerang-hijau', 'Kerang hijau', '🦪', 'seafood', '100 g', true, 12, 4, 3, 0],
    ['cumi-saus-padang', 'Cumi saus Padang', '🦑', 'seafood', '1 porsi', false, 18, 10, 14, 0],
    ['udang-saus-padang', 'Udang saus Padang', '🦐', 'seafood', '1 porsi', false, 20, 10, 14, 0],
    ['udang-bakar', 'Udang bakar', '🦐', 'seafood', '100 g', true, 24, 1, 3, 0],
    ['otak-otak', 'Otak-otak ikan', '🐟', 'seafood', '1 buah', false, 3, 5, 3, 0],
    ['ikan-pesmol', 'Ikan pesmol', '🐟', 'seafood', '1 ekor + kuah', false, 18, 5, 12, 0],
    ['telur-asin', 'Telur asin', '🥚', 'seafood', '1 butir', false, 6, 1, 9, 0],
    ['kepiting-lada-hitam', 'Kepiting lada hitam', '🦀', 'seafood', '1 porsi', false, 22, 8, 18, 0],
    ['udang-telur-asin', 'Udang saus telur asin', '🦐', 'seafood', '1 porsi', false, 20, 8, 20, 0],
    ['cumi-telur-asin', 'Cumi saus telur asin', '🦑', 'seafood', '1 porsi', false, 18, 9, 18, 0],
    ['kerang-saus-padang', 'Kerang saus Padang', '🦪', 'seafood', '1 porsi', false, 14, 10, 12, 0],
    ['ikan-asam-manis', 'Ikan asam manis', '🐟', 'seafood', '1 porsi', false, 22, 22, 14, 0],
    ['gurita-bakar', 'Gurita / sotong bakar', '🦑', 'seafood', '100 g', true, 16, 3, 4, 0],
    ['ikan-bakar-jimbaran', 'Ikan bakar sambal matah', '🐟', 'seafood', '1 ekor ±150 g', false, 30, 3, 10, 0],
    ['lobster-bakar', 'Lobster bakar', '🦞', 'seafood', '100 g', true, 19, 1, 3, 0],
    ['scallop', 'Scallop / kerang simping', '🦪', 'seafood', '100 g', true, 20, 4, 1, 0],
    ['kepiting-soka', 'Kepiting soka goreng', '🦀', 'seafood', '1 porsi', false, 16, 12, 16, 0],
    // Gorengan & jajanan
    ['bakwan', 'Bakwan sayur', '🧅', 'gorengan', '1 buah', false, 2, 14, 9, 0],
    ['tempe-mendoan', 'Tempe mendoan', '🟫', 'gorengan', '1 lembar', false, 5, 9, 8, 0],
    ['pisang-goreng', 'Pisang goreng', '🍌', 'gorengan', '1 buah', false, 1.5, 20, 8, 0],
    ['cireng', 'Cireng', '⚪', 'gorengan', '1 buah', false, 1, 12, 5, 0],
    ['cilok', 'Cilok', '⚪', 'gorengan', '1 buah', false, 1, 8, 2, 0],
    ['tahu-bulat', 'Tahu bulat', '🟡', 'gorengan', '1 buah', false, 1.5, 2, 2.5, 0],
    ['gorengan-tahu', 'Gorengan tahu', '🟫', 'gorengan', '1 buah', false, 3, 6, 6, 0],
    ['lumpia', 'Lumpia', '🥟', 'gorengan', '1 buah', false, 3, 14, 7, 0],
    ['batagor', 'Batagor', '🥟', 'gorengan', '1 porsi', false, 12, 35, 20, 0],
    ['gado-gado', 'Gado-gado', '🥗', 'gorengan', '1 porsi', false, 14, 30, 22, 0],
    ['ketoprak', 'Ketoprak', '🥗', 'gorengan', '1 porsi', false, 13, 55, 18, 0],
    ['pecel', 'Pecel sayur', '🥗', 'gorengan', '1 porsi', false, 9, 22, 12, 0],
    ['nasi-uduk', 'Nasi uduk', '🍚', 'gorengan', '1 porsi', false, 5, 45, 10, 0],
    ['gethuk', 'Getuk / jajan pasar', '🍡', 'gorengan', '1 potong', false, 1, 22, 3, 0],
    ['klepon', 'Klepon', '🍡', 'gorengan', '3 buah', false, 1, 24, 3, 0],
    ['donat', 'Donat', '🍩', 'gorengan', '1 buah', false, 3, 25, 12, 0],
    ['roti-coklat', 'Roti isi coklat', '🍞', 'gorengan', '1 buah', false, 5, 35, 9, 0],
    ['biskuit', 'Biskuit', '🍪', 'gorengan', '3 keping', false, 2, 15, 5, 0],
    ['kacang-goreng', 'Kacang goreng', '🥜', 'gorengan', '30 g', false, 7, 6, 14, 0],
    // Minuman
    ['kopi-hitam', 'Kopi hitam tanpa gula', '☕', 'minuman', '1 cangkir', false, 0.3, 0, 0, 1],
    ['kopi-susu-gula', 'Kopi susu gula aren', '🥤', 'minuman', '1 gelas ±250 ml', false, 3, 30, 5, 1],
    ['teh-manis', 'Es teh manis', '🧋', 'minuman', '1 gelas', false, 0, 22, 0, 1],
    ['teh-tawar', 'Teh tawar', '🍵', 'minuman', '1 gelas', false, 0, 0, 0, 0],
    ['susu-coklat', 'Susu coklat', '🥛', 'minuman', '250 ml', false, 8, 26, 8, 0],
    ['jus-jeruk', 'Jus jeruk', '🍊', 'minuman', '1 gelas', false, 1.5, 26, 0.5, 0],
    ['jus-alpukat', 'Jus alpukat', '🥑', 'minuman', '1 gelas', false, 3, 30, 20, 0],
    ['boba', 'Boba milk tea', '🧋', 'minuman', '1 gelas ±500 ml', false, 4, 65, 12, 0],
    ['soda', 'Minuman soda', '🥤', 'minuman', '1 kaleng 330 ml', false, 0, 39, 0, 0],
    ['pocari', 'Isotonik / Pocari', '💧', 'minuman', '500 ml', false, 0, 32, 0, 0],
    ['air-kelapa', 'Air kelapa', '🥥', 'minuman', '1 gelas', false, 1.5, 9, 0.2, 0],
    ['milo', 'Milo / coklat malt', '🥤', 'minuman', '1 gelas', false, 4, 30, 5, 0],
    // Es & dessert tradisional
    ['es-doger', 'Es doger', '🍧', 'dessert', '1 gelas', false, 4, 45, 10, 0],
    ['es-podeng', 'Es puter / podeng', '🍨', 'dessert', '1 porsi', false, 3, 38, 9, 0],
    ['es-campur', 'Es campur', '🍧', 'dessert', '1 mangkuk', false, 3, 55, 8, 0],
    ['es-cendol', 'Es cendol / dawet', '🥤', 'dessert', '1 gelas', false, 2, 48, 7, 0],
    ['es-teler', 'Es teler', '🍧', 'dessert', '1 mangkuk', false, 4, 50, 12, 0],
    ['es-buah', 'Es buah', '🍹', 'dessert', '1 mangkuk', false, 2, 42, 3, 0],
    ['kolak', 'Kolak pisang', '🍌', 'dessert', '1 mangkuk', false, 2, 45, 9, 0],
    ['bubur-kacang-ijo', 'Bubur kacang hijau', '🥣', 'dessert', '1 mangkuk', false, 7, 45, 8, 0],
    ['bubur-sumsum', 'Bubur sumsum', '🥣', 'dessert', '1 mangkuk', false, 3, 35, 8, 0],
    ['puding', 'Puding', '🍮', 'dessert', '1 potong', false, 3, 25, 5, 0],
    // Jajanan pasar & kue
    ['lemper', 'Lemper ayam', '🍙', 'jajanan', '1 buah', false, 4, 26, 4, 0],
    ['risoles-mayo', 'Risoles mayo', '🥟', 'jajanan', '1 buah', false, 5, 18, 12, 0],
    ['pastel-jajanan', 'Pastel / jalangkote', '🥟', 'jajanan', '1 buah', false, 4, 18, 9, 0],
    ['kue-lapis', 'Kue lapis', '🍰', 'jajanan', '1 potong', false, 1.5, 28, 6, 0],
    ['nagasari', 'Nagasari', '🍮', 'jajanan', '1 buah', false, 1.5, 24, 3, 0],
    ['onde-onde', 'Onde-onde', '🍡', 'jajanan', '1 buah', false, 3, 24, 7, 0],
    ['dadar-gulung', 'Dadar gulung', '🥞', 'jajanan', '1 buah', false, 2, 22, 6, 0],
    ['kue-cubit', 'Kue cubit', '🧁', 'jajanan', '3 buah', false, 3, 26, 8, 0],
    ['serabi', 'Serabi', '🥞', 'jajanan', '1 buah', false, 2, 20, 6, 0],
    ['bolu-kukus', 'Bolu kukus', '🧁', 'jajanan', '1 buah', false, 2, 24, 4, 0],
    ['bika-ambon', 'Bika ambon', '🍰', 'jajanan', '1 potong', false, 2, 30, 8, 0],
    ['brownies', 'Brownies', '🍫', 'jajanan', '1 potong', false, 3, 32, 14, 0],
    ['bolu-brownies', 'Kue bolu', '🍰', 'jajanan', '1 potong', false, 3, 30, 10, 0],
    ['croissant', 'Croissant', '🥐', 'jajanan', '1 buah', false, 5, 26, 12, 0],
    ['roti-bakar', 'Roti bakar coklat keju', '🍞', 'jajanan', '1 porsi', false, 8, 45, 18, 0],
    ['kue-cucur', 'Kue cucur', '🍩', 'jajanan', '1 buah', false, 1.5, 26, 6, 0],
    // Makanan cepat saji & merk
    ['indomie-goreng', 'Indomie goreng', '🍜', 'merk', '1 bungkus', false, 8, 54, 17, 1],
    ['indomie-kuah', 'Indomie kuah (soto/kari)', '🍜', 'merk', '1 bungkus', false, 8, 50, 14, 1],
    ['indomie-telur', 'Indomie goreng + telur', '🍜', 'merk', '1 porsi', false, 14, 55, 27, 1],
    ['shihlin', 'Shihlin chicken XXL', '🍗', 'merk', '1 potong', false, 22, 30, 26, 1],
    ['chikuro', 'Chikuro chicken', '🍗', 'merk', '1 porsi', false, 14, 28, 18, 0],
    ['richeese', 'Richeese fire chicken', '🍗', 'merk', '1 potong + saus', false, 16, 14, 20, 0],
    ['mcd-burger', 'Burger (McD/BK)', '🍔', 'merk', '1 buah', false, 15, 32, 15, 0],
    ['bigmac', 'Big Mac', '🍔', 'merk', '1 buah', false, 25, 45, 33, 0],
    ['cfc-chicken', 'CFC/Hisana ayam', '🍗', 'merk', '1 potong', false, 20, 9, 16, 0],
    ['geprek', 'Ayam geprek + sambal', '🌶️', 'merk', '1 porsi + nasi', false, 32, 60, 24, 1],
    ['hokben', 'HokBen paket', '🍱', 'merk', '1 paket', false, 25, 75, 22, 0],
    ['kebab', 'Kebab', '🌯', 'merk', '1 buah', false, 20, 42, 18, 0],
    ['pisang-nugget', 'Pisang nugget', '🍌', 'merk', '1 porsi', false, 3, 40, 14, 0],
    ['seblak', 'Seblak', '🍜', 'merk', '1 porsi', false, 10, 45, 16, 0],
    ['mixue', 'Mixue es krim cone', '🍦', 'merk', '1 buah', false, 3, 30, 7, 0],
    ['kfc-original', 'Ayam original KFC', '🍗', 'merk', '1 potong', false, 24, 8, 16, 1],
    ['kfc-winger', 'KFC winger / sayap', '🍗', 'merk', '1 buah', false, 10, 6, 9, 0],
    ['mcd-mcnugget', 'McNuggets', '🍗', 'merk', '6 buah', false, 15, 16, 18, 0],
    ['mcd-fries', 'Kentang goreng McD', '🍟', 'merk', '1 medium', false, 4, 43, 16, 0],
    ['sabana', 'Sabana fried chicken', '🍗', 'merk', '1 potong', false, 12, 12, 14, 0],
    ['jco-donut', 'J.CO donut', '🍩', 'merk', '1 buah', false, 4, 26, 13, 0],
    ['pizza-hut-slice', 'Pizza Hut (per slice)', '🍕', 'merk', '1 slice', false, 11, 32, 12, 0],
    ['sushi-roll-merk', 'Sushi roll (isi 6)', '🍣', 'merk', '6 pcs', false, 10, 45, 8, 0],
    ['kopi-gerai', 'Latte / kopi susu gerai', '☕', 'merk', '1 grande', false, 9, 20, 9, 0],
    // Coklat & permen
    ['silverqueen', 'SilverQueen', '🍫', 'coklat', '1 bar kecil ±30 g', false, 3, 17, 10, 0],
    ['silverqueen-besar', 'SilverQueen (per 25 g)', '🍫', 'coklat', '25 g', false, 2.5, 14, 8.5, 0],
    ['delfi', 'Delfi / Cadbury', '🍫', 'coklat', '25 g', false, 2, 15, 8, 0],
    ['kitkat', 'KitKat', '🍫', 'coklat', '1 finger', false, 1, 10, 4.5, 0],
    ['toblerone', 'Toblerone', '🍫', 'coklat', '25 g', false, 2, 15, 8, 0],
    ['choki-choki', 'Choki-choki', '🍫', 'coklat', '1 buah', false, 0.5, 8, 3, 0],
    ['permen', 'Permen', '🍬', 'coklat', '1 buah', false, 0, 6, 0, 0],
    ['wafer', 'Wafer coklat', '🍫', 'coklat', '1 bungkus kecil', false, 1.5, 18, 7, 0],
    // Es krim
    ['magnum', 'Magnum', '🍦', 'eskrim', '1 buah', false, 4, 26, 20, 0],
    ['cornetto', 'Cornetto', '🍦', 'eskrim', '1 buah', false, 3, 27, 11, 0],
    ['paddle-pop', 'Paddle Pop', '🍡', 'eskrim', '1 buah', false, 1, 15, 3, 0],
    ['aice', 'Aice / es krim stik', '🍦', 'eskrim', '1 buah', false, 2, 20, 6, 0],
    ['eskrim-cup', 'Es krim cup', '🍨', 'eskrim', '1 cup ±100 ml', false, 3, 24, 11, 0],
    ['eskrim-scoop', 'Es krim (per scoop)', '🍨', 'eskrim', '1 scoop', false, 2, 16, 7, 0],
    // Masakan khas Nusantara berkuah & nasi
    ['rawon', 'Rawon daging', '🍲', 'nusantara', '1 mangkuk tanpa nasi', false, 22, 8, 20, 1],
    ['soto-mie', 'Soto mie Bogor', '🍜', 'nusantara', '1 mangkuk', false, 16, 45, 15, 1],
    ['soto-betawi', 'Soto Betawi', '🍲', 'nusantara', '1 mangkuk', false, 20, 12, 28, 0],
    ['soto-lamongan', 'Soto Lamongan', '🍲', 'nusantara', '1 mangkuk tanpa nasi', false, 16, 10, 12, 0],
    ['coto-makassar', 'Coto Makassar', '🍲', 'nusantara', '1 mangkuk', false, 20, 8, 22, 0],
    ['rabeg', 'Rabeg / tengkleng', '🍲', 'nusantara', '1 mangkuk', false, 22, 6, 24, 0],
    ['gulai-kambing', 'Gulai kambing', '🍛', 'nusantara', '1 mangkuk', false, 20, 8, 26, 0],
    ['sop-buntut', 'Sop buntut', '🍲', 'nusantara', '1 mangkuk', false, 26, 10, 24, 1],
    ['rawon-nasi', 'Nasi rawon komplit', '🍛', 'nusantara', '1 porsi', false, 25, 55, 22, 0],
    ['nasi-padang', 'Nasi Padang (rendang)', '🍛', 'nusantara', '1 porsi komplit', false, 32, 80, 38, 1],
    ['nasi-kuning', 'Nasi kuning komplit', '🍛', 'nusantara', '1 porsi', false, 14, 60, 18, 0],
    ['nasi-campur', 'Nasi campur', '🍛', 'nusantara', '1 porsi', false, 22, 70, 20, 0],
    ['gudeg', 'Gudeg komplit', '🍛', 'nusantara', '1 porsi', false, 18, 65, 22, 0],
    ['pecel-lele', 'Pecel lele + nasi', '🐟', 'nusantara', '1 porsi', false, 26, 55, 22, 1],
    ['ayam-penyet-nasi', 'Ayam penyet + nasi', '🌶️', 'nusantara', '1 porsi', false, 34, 58, 24, 1],
    ['nasi-bakar', 'Nasi bakar', '🍙', 'nusantara', '1 bungkus', false, 12, 55, 12, 0],
    ['nasi-kucing', 'Nasi kucing', '🍙', 'nusantara', '1 bungkus', false, 5, 30, 6, 0],
    ['ketupat-sayur', 'Ketupat sayur', '🍛', 'nusantara', '1 porsi', false, 8, 55, 18, 0],
    ['lontong-sayur', 'Lontong sayur', '🍛', 'nusantara', '1 porsi', false, 9, 52, 16, 0],
    ['nasi-pecel', 'Nasi pecel', '🍛', 'nusantara', '1 porsi', false, 11, 62, 16, 0],
    ['rujak', 'Rujak buah', '🥗', 'nusantara', '1 porsi', false, 3, 40, 3, 0],
    ['karedok', 'Karedok / lotek', '🥗', 'nusantara', '1 porsi', false, 10, 25, 14, 0],
    ['gado-gado-lontong', 'Gado-gado + lontong', '🥗', 'nusantara', '1 porsi', false, 16, 55, 24, 0],
    ['nasi-goreng-kampung', 'Nasi goreng kampung', '🍛', 'nusantara', '1 porsi', false, 14, 72, 18, 0],
    ['kwetiau-goreng', 'Kwetiau goreng', '🍜', 'nusantara', '1 porsi', false, 16, 68, 20, 0],
    ['mie-goreng-jawa', 'Mie goreng Jawa', '🍜', 'nusantara', '1 porsi', false, 14, 65, 18, 0],
    ['sate-padang', 'Sate Padang', '🍢', 'nusantara', '1 porsi', false, 20, 22, 18, 0],
    ['sate-kambing', 'Sate kambing', '🍢', 'nusantara', '10 tusuk', false, 28, 6, 24, 0],
    ['nasi-goreng-gila', 'Nasi goreng gila', '🍛', 'nusantara', '1 porsi', false, 22, 75, 24, 0],
    ['nasi-goreng-seafood', 'Nasi goreng seafood', '🍤', 'nusantara', '1 porsi', false, 20, 72, 20, 0],
    ['nasi-goreng-pete', 'Nasi goreng pete', '🍛', 'nusantara', '1 porsi', false, 16, 72, 20, 0],
    ['nasi-goreng-jancuk', 'Nasi goreng pedas', '🌶️', 'nusantara', '1 porsi', false, 18, 74, 22, 0],
    ['mie-aceh', 'Mie Aceh', '🍜', 'nusantara', '1 porsi', false, 18, 70, 22, 0],
    ['mie-kocok', 'Mie kocok Bandung', '🍜', 'nusantara', '1 mangkuk', false, 16, 48, 16, 0],
    ['mie-celor', 'Mie celor Palembang', '🍜', 'nusantara', '1 mangkuk', false, 18, 50, 20, 0],
    ['mie-koclok', 'Mie koclok Cirebon', '🍜', 'nusantara', '1 mangkuk', false, 16, 50, 16, 0],
    ['laksa', 'Laksa', '🍜', 'nusantara', '1 mangkuk', false, 15, 48, 20, 0],
    ['empal-gentong', 'Empal gentong', '🍲', 'nusantara', '1 mangkuk', false, 20, 10, 22, 0],
    ['pempek', 'Pempek + cuko', '🐟', 'nusantara', '1 porsi', false, 12, 40, 8, 0],
    ['pempek-kapal-selam', 'Pempek kapal selam', '🐟', 'nusantara', '1 buah + cuko', false, 14, 35, 12, 0],
    ['pempek-lenjer', 'Pempek lenjer', '🐟', 'nusantara', '1 buah + cuko', false, 8, 28, 5, 0],
    ['pempek-adaan', 'Pempek adaan (goreng)', '🐟', 'nusantara', '2 buah + cuko', false, 9, 22, 12, 0],
    ['cuko', 'Cuko pempek', '🥣', 'nusantara', '3 sdm', false, 1, 12, 0, 0],
    ['cimol', 'Cimol', '⚪', 'nusantara', '1 porsi', false, 3, 30, 12, 0],
    ['cuanki-nus', 'Cuanki', '🍜', 'nusantara', '1 mangkuk', false, 14, 32, 14, 0],
    ['cilok-bumbu', 'Cilok bumbu kacang', '⚪', 'nusantara', '1 porsi', false, 5, 30, 10, 0],
    ['tekwan', 'Tekwan', '🍲', 'nusantara', '1 mangkuk', false, 12, 25, 6, 0],
    ['tongseng', 'Tongseng kambing', '🍲', 'nusantara', '1 mangkuk', false, 20, 12, 24, 0],
    ['garang-asem', 'Garang asem ayam', '🍲', 'nusantara', '1 porsi', false, 22, 6, 12, 0],
  ];
  const FOOD_SEED = FOOD_ROWS.map(([id, name, icon, cat, unit, grams, p, c, f, fav]) =>
    ({ id, name, icon, cat, unit, grams: !!grams, p, c, f, kcal: kc(p, c, f), fav: !!fav, addon: cat === 'bumbu', seed: true }));

  /* Health tags for LDL (saturated fat / cholesterol) and uric acid (purine).
     Scores are per-portion "load points"; daily sums cross a soft limit → warning.
     General-guidance only — not medical advice. */
  const HEALTH = {
    'gulai-otak': { purine: 3 }, 'gulai-tunjang': { purine: 2, ldl: 2 }, 'kikil-gulai': { purine: 2, ldl: 2 },
    'paru-goreng': { purine: 3, ldl: 2 }, 'babat-goreng': { purine: 3, ldl: 2 }, 'ati-ampela': { purine: 3, ldl: 2 },
    'rendang': { purine: 2, ldl: 3 }, 'dendeng': { purine: 2, ldl: 1 }, 'dendeng-batokok': { purine: 2, ldl: 1 },
    'sate-kambing': { purine: 3, ldl: 3 }, 'gulai-kambing': { purine: 3, ldl: 3 }, 'tongseng': { purine: 3, ldl: 3 }, 'rabeg': { purine: 3, ldl: 3 },
    'sop-buntut': { purine: 2, ldl: 2 }, 'coto-makassar': { purine: 3, ldl: 3 }, 'soto-betawi': { purine: 2, ldl: 3 }, 'empal-gentong': { purine: 2, ldl: 2 }, 'rawon': { purine: 2, ldl: 2 },
    'udang-goreng': { purine: 3 }, 'udang-rebus': { purine: 3 }, 'udang-bakar': { purine: 3 }, 'udang-saus-padang': { purine: 3 }, 'udang-telur-asin': { purine: 3 },
    'cumi-goreng': { purine: 3 }, 'cumi-saus-padang': { purine: 3 }, 'cumi-telur-asin': { purine: 3 }, 'kepiting-lada-hitam': { purine: 3, ldl: 1 }, 'kepiting-saus': { purine: 3 }, 'kepiting-soka': { purine: 3, ldl: 1 },
    'kerang-rebus': { purine: 3 }, 'kerang-hijau': { purine: 3 }, 'kerang-saus-padang': { purine: 3 }, 'scallop': { purine: 2 }, 'ikan-teri-goreng': { purine: 3 }, 'ikan-bilih': { purine: 3 }, 'ikan-asin': { purine: 3 }, 'ikan-kembung-goreng': { purine: 2 }, 'bakso-malang': { purine: 2 },
    'telur-cheddar': { ldl: 1 }, 'telur-mata-sapi': { ldl: 1 }, 'kfc-crispy': { ldl: 2 }, 'kfc-original': { ldl: 2 },
    'kulit-ayam-goreng': { ldl: 3, purine: 1 }, 'paha-goreng': { ldl: 1 }, 'sayap-goreng': { ldl: 1 }, 'chicken-wings': { ldl: 1 },
    'opor-ayam': { ldl: 2 }, 'ayam-gulai': { ldl: 2 }, 'ayam-rendang-dada': { ldl: 2 }, 'gulai-ikan-padang': { ldl: 2 }, 'gulai-kepala-ikan': { ldl: 2, purine: 2 },
    'martabak-telur': { ldl: 2 }, 'martabak-manis': { ldl: 2 }, 'martabak-manis-keju': { ldl: 2 }, 'bigmac': { ldl: 3 }, 'mcd-burger': { ldl: 2 }, 'pizza-slice': { ldl: 2 }, 'pizza-hut-slice': { ldl: 2 },
    'keju-cheddar': { ldl: 1 }, 'butter': { ldl: 1 }, 'nangka-santan': { ldl: 1 }, 'gulai-cubadak': { ldl: 1 }, 'telur-asin': { ldl: 1 },
  };
  const HEALTH_LIMIT = { purine: 4, ldl: 4 };
  function healthLoad(db, dateStr) {
    const day = dateStr || new Date().toDateString();
    const log = ((db.nutrition && db.nutrition.log) || []).filter(e => new Date(e.at).toDateString() === day);
    let purine = 0, ldl = 0; const pFoods = [], lFoods = [];
    log.forEach(e => { const h = healthOf(e); if (!h.purine && !h.ldl) return; const mult = e.grams ? Math.max(1, (e.qty || 100) / 100) : (e.qty || 1);
      if (h.purine) { purine += h.purine * mult; pFoods.push(e.name); }
      if (h.ldl) { ldl += h.ldl * mult; lFoods.push(e.name); }
    });
    return {
      purine: +purine.toFixed(1), ldl: +ldl.toFixed(1),
      purineHigh: purine >= HEALTH_LIMIT.purine, purineNear: purine >= HEALTH_LIMIT.purine * 0.7 && purine < HEALTH_LIMIT.purine,
      ldlHigh: ldl >= HEALTH_LIMIT.ldl, ldlNear: ldl >= HEALTH_LIMIT.ldl * 0.7 && ldl < HEALTH_LIMIT.ldl,
      purineFoods: [...new Set(pFoods)], ldlFoods: [...new Set(lFoods)],
    };
  }
  function foodHealthWarn(foodId) { const h = HEALTH[foodId]; if (!h) return null; return { purine: h.purine || 0, ldl: h.ldl || 0 }; }
  // Explicit tags win; otherwise infer from the food name so the whole 350+ library is covered.
  const PURINE_KW = [[/jeroan|otak|hati|ampela|usus|babat|paru|limpa|kikil|tunjang/, 3], [/kambing|domba|rabeg|tengkleng|tongseng/, 3], [/udang|cumi|sotong|gurita|kerang|remis|tiram|kepiting|rajungan|lobster|teri|sarden|ikan asin|bilih|emping/, 3], [/kaldu|konro|coto|sop buntut|buntut|rawon|bebek/, 2], [/bakso|daging sapi|rendang|dendeng|empal|kornet|kembung|tongkol|makarel/, 1]];
  const LDL_KW = [[/jeroan|otak|hati|ampela|usus|babat|paru|kikil|tunjang|kulit|gajih/, 3], [/santan|gulai|opor|kari|rendang|lodeh|kalio|tongseng|rabeg|soto betawi|coto/, 2], [/goreng|crispy|krispi|gorengan|keripik|kerupuk|mendoan|bakwan|tahu isi|risol|pastel|cireng|martabak|fries/, 2], [/keju|cheese|mentega|butter|margarin|krim|cream|mayo|susu kental|bacon|sosis|burger|pizza|nugget|kornet|salami|es krim|magnum|cokelat|coklat|donat/, 1], [/telur asin|telur dadar|mata sapi|ceplok/, 1]];
  function healthOf(e) {
    if (!e) return { purine: 0, ldl: 0 };
    const h = HEALTH[e.foodId]; if (h) return { purine: h.purine || 0, ldl: h.ldl || 0 };
    const n = String(e.name || '').toLowerCase(); let purine = 0, ldl = 0;
    for (const [re, v] of PURINE_KW) if (re.test(n)) purine = Math.max(purine, v);
    for (const [re, v] of LDL_KW) if (re.test(n)) ldl = Math.max(ldl, v);
    if (/kukus|rebus|bening|tanpa kulit/.test(n)) ldl = Math.max(0, ldl - 1);
    return { purine, ldl };
  }
  const FOOD_CATS = [
    ['protein', 'Telur & Protein'], ['ayam', 'Ayam'], ['seafood', 'Ikan & Seafood'], ['nabati', 'Tahu & Tempe'],
    ['karbo', 'Nasi & Karbo'], ['nusantara', 'Masakan Nusantara'], ['padang', 'Lauk Padang'], ['kuah', 'Mie & Kuah'],
    ['gorengan', 'Gorengan & Jajanan'], ['dimsum', 'Dimsum & Snack'], ['steak', 'Steak & Pasta'],
    ['buah', 'Buah & Sayur'], ['minuman', 'Minuman'], ['dessert', 'Es & Dessert'],
    ['jajanan', 'Jajanan Pasar & Kue'], ['merk', 'Cepat Saji & Merk'], ['coklat', 'Coklat & Permen'],
    ['eskrim', 'Es Krim'], ['bumbu', 'Bumbu & Tambahan'],
  ];

  // TDEE via Mifflin–St Jeor (assume male; single-user). Activity from recent sessions.
  function nutritionTargets(db) {
    const n = db.nutrition || {};
    if (n.override && n.targets) { const g = goalOf(db); return { ...n.targets, source: 'manual', goal: g, goalLabel: GOALS[g].label, goalShort: GOALS[g].short }; }
    const w = (db.bodyMetrics.slice().sort((a, b) => new Date(b.measuredAt) - new Date(a.measuredAt))[0] || {}).weightKg || db.targets.weightKg || 70;
    const age = db.profile.age || 38;
    const height = db.profile.heightCm || 161;
    // Mifflin-St Jeor: +5 men, −161 women
    const female = db.profile && db.profile.sex === 'female';
    const bmr = Math.round(10 * w + 6.25 * height - 5 * age + (female ? -161 : 5));
    const sess7 = db.sessions.filter(s => daysSince(s.date) < 7).length;
    const activity = sess7 >= 5 ? 1.55 : sess7 >= 3 ? 1.45 : 1.35;
    const tdee = Math.round(bmr * activity);
    const goal = goalOf(db), G = GOALS[goal];
    const goalAdj = G.kcalAdj;
    /* Safety floor: never target below 1200 kkal (women) / 1500 kkal (men) without supervision (NIH/NHLBI guidance). */
    const floorKcal = female ? 1200 : 1500;
    const rawKcal = Math.round((tdee + goalAdj) / 10) * 10;
    const kcal = Math.max(floorKcal, rawKcal), floored = kcal > rawKcal;
    const protein = Math.round(w * G.proteinPerKg);
    const fat = Math.round(w * 0.9);               // ~0.9 g/kg
    const carbKcal = kcal - protein * 4 - fat * 9;
    const carb = Math.max(60, Math.round(carbKcal / 4));
    return { kcal, protein, carb, fat, tdee, bmr, source: 'auto', goal, goalAdj, floored, floorKcal, goalLabel: G.label, goalShort: G.short, proteinPerKg: G.proteinPerKg };
  }
  // Save custom macro targets (grams). kcal derived from macros (4/4/9). Pass null to clear → auto.
  function setMacroTargets(db, macros) {
    if (!db.nutrition) db.nutrition = { log: [], foods: [], override: false, targets: null };
    if (!macros) { db.nutrition.override = false; db.nutrition.targets = null; return db; }
    const protein = clamp(macros.protein, 0, 400, 0);
    const carb = clamp(macros.carb, 0, 800, 0);
    const fat = clamp(macros.fat, 0, 300, 0);
    const auto = nutritionTargets({ ...db, nutrition: { ...db.nutrition, override: false } });
    db.nutrition.override = true;
    db.nutrition.targets = { protein, carb, fat, kcal: Math.round(protein * 4 + carb * 4 + fat * 9), tdee: auto.tdee, bmr: auto.bmr };
    return db;
  }
  // Training-day bump: on a heavy strength / high cardio day, add back some calories.
  function nutritionDayTarget(db, dateStr) {
    const base = nutritionTargets(db);
    const day = dateStr || new Date().toDateString();
    const heavy = db.sessions.some(s => new Date(s.date).toDateString() === day && (s.sessionType === 'strength' || (s.cardio && s.cardio.intensity === 'berat')));
    const bump = heavy ? 250 : 0;
    return { ...base, kcal: base.kcal + bump, carb: base.carb + Math.round(bump / 4), bump, heavy };
  }
  const nutToday = (db) => (db.nutrition && db.nutrition.log || []).filter(e => new Date(e.at).toDateString() === new Date().toDateString());
  function nutritionTotals(entries) {
    return entries.reduce((a, e) => ({ kcal: a.kcal + (e.kcal || 0), p: a.p + (e.p || 0), c: a.c + (e.c || 0), f: a.f + (e.f || 0) }), { kcal: 0, p: 0, c: 0, f: 0 });
  }
  // 7-day protein adherence + streak (target met = ≥95% protein).
  function nutritionWeek(db) {
    const tgt = nutritionTargets(db).protein;
    const out = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * DAY);
      const ent = (db.nutrition && db.nutrition.log || []).filter(e => new Date(e.at).toDateString() === d.toDateString());
      const p = ent.reduce((a, e) => a + (e.p || 0), 0);
      out.push({ date: d, protein: p, target: tgt, hit: p >= tgt * 0.95, today: i === 0, logged: ent.length > 0 });
    }
    return out;
  }
  function nutritionProteinStreak(db) {
    const tgt = nutritionTargets(db).protein; let streak = 0;
    for (let i = 0; i < 60; i++) {
      const d = new Date(Date.now() - i * DAY);
      const ent = (db.nutrition && db.nutrition.log || []).filter(e => new Date(e.at).toDateString() === d.toDateString());
      const p = ent.reduce((a, e) => a + (e.p || 0), 0);
      if (i === 0 && p < tgt * 0.95) continue; // today still in progress — don't count or break
      if (p >= tgt * 0.95) streak++; else break;
    }
    return streak;
  }

  /* #4 — Actual vs planned energy balance. Compares planned deficit (TDEE − intake logged)
     against the deficit implied by real weight trend (1 kg body mass ≈ 7700 kcal).
     Needs ≥4 days with food logged AND a weight span ≥7 days to be meaningful. */
  function deficitInsight(db) {
    const tgt = nutritionTargets(db);
    const log = (db.nutrition && db.nutrition.log) || [];
    if (!log.length) return null;
    // daily intake over last 14 days (only days with entries)
    const byDay = {};
    log.forEach(e => { const k = new Date(e.at).toDateString(); const dd = daysSince(e.at); if (dd < 14) (byDay[k] = byDay[k] || 0), byDay[k] += (e.kcal || 0); });
    const loggedDays = Object.keys(byDay);
    if (loggedDays.length < 4) return { ready: false, loggedDays: loggedDays.length };
    const avgIntake = Math.round(loggedDays.reduce((a, k) => a + byDay[k], 0) / loggedDays.length);
    const plannedDeficit = tgt.tdee - avgIntake; // +ve = deficit
    // weight trend: earliest vs latest 7-day moving avg within 21 days
    const mets = db.bodyMetrics.filter(m => daysSince(m.measuredAt) <= 21 && m.weightKg).slice().sort((a, b) => new Date(a.measuredAt) - new Date(b.measuredAt));
    let actualDeficit = null, spanDays = 0, wChange = null;
    if (mets.length >= 2) {
      const first = mets[0], last = mets[mets.length - 1];
      spanDays = Math.max(1, Math.round((new Date(last.measuredAt) - new Date(first.measuredAt)) / DAY));
      wChange = +(last.weightKg - first.weightKg).toFixed(2);
      if (spanDays >= 7) actualDeficit = Math.round(-wChange * 7700 / spanDays); // +ve = losing
    }
    const plannedRate = +(plannedDeficit * 7 / 7700).toFixed(2); // kg/week planned loss
    const actualRate = actualDeficit != null ? +(actualDeficit * 7 / 7700).toFixed(2) : null;
    let verdict = 'tracking', note;
    if (actualDeficit == null) {
      verdict = 'no-weight'; note = 'Rencana defisit ≈' + plannedDeficit + ' kkal/hari (turun ≈' + plannedRate + ' kg/mgg). Timbang rutin ≥1 minggu untuk verifikasi laju aktual.';
    } else {
      const gap = actualDeficit - plannedDeficit;
      if (Math.abs(gap) <= 150) { verdict = 'on-track'; note = 'Laju aktual ≈ rencana (' + actualRate + ' vs ' + plannedRate + ' kg/mgg). Intake & estimasi TDEE akurat.'; }
      else if (actualDeficit < plannedDeficit) { verdict = 'slower'; note = 'Turun lebih lambat dari rencana (' + actualRate + ' vs ' + plannedRate + ' kg/mgg). Kemungkinan intake tercatat lebih rendah dari asli (kalori tersembunyi) atau TDEE ditaksir tinggi.'; }
      else { verdict = 'faster'; note = 'Turun lebih cepat dari rencana (' + actualRate + ' vs ' + plannedRate + ' kg/mgg). Pastikan tidak terlalu agresif — jaga protein & recovery.'; }
    }
    return { ready: true, avgIntake, tdee: tgt.tdee, plannedDeficit, actualDeficit, plannedRate, actualRate, wChange, spanDays, loggedDays: loggedDays.length, verdict, note };
  }

  /* #5 — protein adequacy signal for the recovery engine. Returns how many of the
     last N *logged* days fell short of protein target. Under-fueling slows recovery. */
  function proteinAdequacy(db, days) {
    const tgt = nutritionTargets(db).protein; const n = days || 3;
    let logged = 0, short = 0;
    for (let i = 1; i <= n; i++) { // skip today (in progress)
      const d = new Date(Date.now() - i * DAY);
      const ent = ((db.nutrition && db.nutrition.log) || []).filter(e => new Date(e.at).toDateString() === d.toDateString());
      if (!ent.length) continue;
      logged++;
      const p = ent.reduce((a, e) => a + (e.p || 0), 0);
      if (p < tgt * 0.8) short++;
    }
    return { logged, short, underfueled: logged >= 2 && short >= 2 };
  }

  /* #6 — nutrition stats for a given month (for the monthly report). */
  function nutritionMonth(db, y, mo) {
    const tgt = nutritionTargets(db);
    const log = ((db.nutrition && db.nutrition.log) || []).filter(e => { const x = new Date(e.at); return x.getFullYear() === y && x.getMonth() + 1 === mo; });
    if (!log.length) return { logged: 0 };
    const byDay = {};
    log.forEach(e => { const k = new Date(e.at).toDateString(); byDay[k] = byDay[k] || { kcal: 0, p: 0 }; byDay[k].kcal += (e.kcal || 0); byDay[k].p += (e.p || 0); });
    const days = Object.keys(byDay);
    const avgKcal = Math.round(days.reduce((a, k) => a + byDay[k].kcal, 0) / days.length);
    const avgP = Math.round(days.reduce((a, k) => a + byDay[k].p, 0) / days.length);
    const onTarget = days.filter(k => byDay[k].p >= tgt.protein * 0.95).length;
    return { logged: days.length, avgKcal, avgProtein: avgP, proteinTarget: tgt.protein, onTarget, kcalTarget: tgt.kcal };
  }

  /* Goals — energy adjustment vs TDEE and protein per kg body weight.
     recomp keeps v1.0 behaviour (−350 kkal, 2.1 g/kg). muscle surplus sits inside the ISSN diets & body
     composition position stand range (~+128…+544 kkal); fatloss protein at the high end for lean-mass retention. */
  const GOALS = {
    recomp:  { label: 'Body recomposition', short: 'recomposition', kcalAdj: -350, proteinPerKg: 2.1 },
    fatloss: { label: 'Turun berat', short: 'turun berat', kcalAdj: -500, proteinPerKg: 2.2 },
    muscle:  { label: 'Bangun otot', short: 'bangun otot', kcalAdj: 250, proteinPerKg: 1.8 },
    fit:     { label: 'Bugar & sehat', short: 'bugar', kcalAdj: 0, proteinPerKg: 1.6 },
  };
  const goalOf = (db) => { const g = db && db.settings && db.settings.goal; return GOALS[g] ? g : 'recomp'; };
  const LEVELS = { pemula: 'Pemula', menengah: 'Menengah', lanjut: 'Lanjut' };
  const levelOf = (db) => { const l = db && db.settings && db.settings.level; return LEVELS[l] ? l : 'menengah'; };
  /* Default targets by sex. Waist = WHO Western-Pacific / IDF Asian cut-offs (90 cm men, 80 cm women). */
  const TARGET_DEFAULTS = { male: { bodyFat: 18, waistCm: 90 }, female: { bodyFat: 25, waistCm: 80 } };

  function regress(pairs) {
    const n = pairs.length; if (n < 2) return null;
    const mw = pairs.reduce((a, p) => a + p.w, 0) / n, mb = pairs.reduce((a, p) => a + p.bf, 0) / n;
    let sxx = 0, sxy = 0;
    pairs.forEach(p => { sxx += (p.w - mw) * (p.w - mw); sxy += (p.w - mw) * (p.bf - mb); });
    let slope = sxx > 0.05 && n >= 3 ? sxy / sxx : 1.0;
    if (!isFinite(slope)) slope = 1.0;
    slope = Math.max(0.3, Math.min(1.6, slope)); // physiologic ~0.3–1.6 %BF/kg
    return { slope, mw, mb, n, solid: sxx > 0.05 && n >= 3 };
  }
  /* Estimate body fat % from a new weight.
     ≥3 own real (weight↔BF) pairs in 180 days → regression on the person's own trend (v1.0 behaviour).
     1–2 real measurements → Forbes body-composition model from the latest one: the fat share of a weight
     change = FM / (FM + 10.4) (Forbes 1987), so a leaner person loses/gains relatively more lean mass.
     No real BF measurement at all → null. Never fabricates without a real basis. */
  function estimateBodyFat(db, newWeight) {
    if (!newWeight) return null;
    const real = db.bodyMetrics.filter(m => m.weightKg != null && m.bodyFatPercentage != null && !m.bfEstimated);
    const own = real.filter(m => daysSince(m.measuredAt) <= 180).map(m => ({ w: m.weightKg, bf: m.bodyFatPercentage }));
    const last = real.slice().sort((a, b) => new Date(b.measuredAt) - new Date(a.measuredAt))[0];
    if (!last) return null;
    if (own.length >= 3) {
      const r = regress(own);
      if (r) {
        let est = last.bodyFatPercentage + r.slope * (newWeight - last.weightKg);
        est = Math.max(3, Math.min(60, est));
        return { bf: +est.toFixed(1), slope: +r.slope.toFixed(2), basedOn: own.length, method: 'regresi tren kamu' };
      }
    }
    const fm0 = last.weightKg * last.bodyFatPercentage / 100;
    const dW = newWeight - last.weightKg;
    const fatShare = fm0 / (fm0 + 10.4);
    let est = (fm0 + fatShare * dW) / newWeight * 100;
    est = Math.max(3, Math.min(60, est));
    return { bf: +est.toFixed(1), slope: null, basedOn: Math.max(1, own.length), method: 'model komposisi Forbes' };
  }

  /* ---------- Monthly report ---------- */
  function monthlyReport(db, ym) {
    const [y, mo] = ym.split('-').map(Number);
    const inM = d => { const x = new Date(d); return x.getFullYear() === y && x.getMonth() + 1 === mo; };
    const ss = db.sessions.filter(s => inM(s.date));
    const str = ss.filter(s => s.sessionType === 'strength');
    const car = ss.filter(s => s.cardio && s.sessionType !== 'muaythai');
    const mt = ss.filter(s => s.sessionType === 'muaythai');
    const rec = ss.filter(s => s.sessionType === 'recovery');
    const totalMin = ss.reduce((a, s) => a + (s.durationMin || 0), 0);
    const setCount = str.reduce((a, s) => a + (s.exercises || []).reduce((b, e) => b + e.sets.filter(x => x.type === 'working').length, 0), 0);
    const exFreq = {}; const exProg = {};
    str.forEach(s => (s.exercises || []).forEach(e => {
      exFreq[e.exId] = (exFreq[e.exId] || 0) + 1;
      const w = Math.max(...e.sets.filter(x => x.type === 'working').map(x => x.weight || 0), 0);
      if (!exProg[e.exId]) exProg[e.exId] = { first: w, last: w, firstD: s.date, lastD: s.date };
      else { const p = exProg[e.exId]; if (s.date < p.firstD) { p.first = w; p.firstD = s.date; } if (s.date > p.lastD) { p.last = w; p.lastD = s.date; } }
    }));
    const topEx = Object.entries(exFreq).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([id, n]) => {
      const p = exProg[id]; return { name: exById(id)?.name || id, count: n, first: p.first, last: p.last, delta: +(p.last - p.first).toFixed(1) };
    });
    const musDist = {}; str.forEach(s => (s.exercises || []).forEach(e => { const ex = exById(e.exId); if (ex) ex.mus.forEach(m => musDist[m] = (musDist[m] || 0) + e.sets.filter(x => x.type === 'working').length); }));
    const under = Object.keys(MUSCLE_LABEL).filter(m => m !== 'glute' && (musDist[m] || 0) < 4).map(m => MUSCLE_LABEL[m]);
    const carMin = car.reduce((a, s) => a + s.cardio.durationMinutes, 0) + mt.reduce((a, s) => a + s.cardio.durationMinutes, 0);
    const carKm = car.reduce((a, s) => a + (s.cardio.distanceKm || 0), 0);
    const intDist = { ringan: 0, sedang: 0, berat: 0 };
    [...car, ...mt].forEach(s => intDist[s.cardio.intensity] = (intDist[s.cardio.intensity] || 0) + 1);
    const bm = db.bodyMetrics.filter(m => inM(m.measuredAt)).sort((a, b) => new Date(a.measuredAt) - new Date(b.measuredAt));
    const wFirst = bm.slice(0, 7).map(m => m.weightKg); const wLast = bm.slice(-7).map(m => m.weightKg);
    const avg = a => a.length ? +(a.reduce((x, y) => x + y, 0) / a.length).toFixed(1) : null;
    const wm = db.waist.filter(w => inM(w.measuredAt)).sort((a, b) => new Date(a.measuredAt) - new Date(b.measuredAt));
    const readCount = { fit: 0, 'agak-lelah': 0, lelah: 0 };
    ss.forEach(s => { if (s.readiness) readCount[s.readiness] = (readCount[s.readiness] || 0) + 1; });
    const recs = [];
    if (topEx[0] && topEx[0].delta > 0) recs.push('Pertahankan progressive overload ' + topEx[0].name + ' (+' + topEx[0].delta + ' kg bulan ini).');
    if (under.length) recs.push('Tambah volume untuk: ' + under.slice(0, 3).join(', ') + '.');
    if (intDist.berat > car.length + mt.length - intDist.berat) recs.push('Kurangi hari high-intensity berturut-turut; tambah cardio recovery Zona 2.');
    else recs.push('Distribusi intensitas cardio sudah seimbang — pertahankan.');
    if (wm.length < 2) recs.push('Prioritaskan konsistensi pengukuran lingkar perut mingguan.');
    recs.push('Utamakan penimbangan pagi agar tren berat konsisten.');
    const nut = nutritionMonth(db, y, mo);
    if (nut.logged) {
      if (nut.avgProtein < nut.proteinTarget * 0.9) recs.push('Rata-rata protein ' + nut.avgProtein + 'g < target ' + nut.proteinTarget + 'g — naikkan untuk melindungi otot saat defisit.');
      else recs.push('Protein rata-rata ' + nut.avgProtein + 'g mendekati/di atas target — bagus untuk recomposition.');
    } else recs.push('Mulai catat nutrisi harian agar laporan bisa menghubungkan asupan dengan progres berat.');
    return {
      ym, label: new Date(y, mo - 1, 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
      sessions: ss.length, totalMin, strength: str.length, cardio: car.length, muaythai: mt.length, recovery: rec.length,
      setCount, topEx, under, carMin, carKm: +carKm.toFixed(1), intDist,
      wStart: avg(wFirst), wEnd: avg(wLast), waistStart: wm[0]?.waistCm ?? null, waistEnd: wm[wm.length - 1]?.waistCm ?? null,
      readCount, recs, nutrition: nut,
      summary: ss.length === 0 ? 'Belum ada sesi tercatat bulan ini.' :
        'Bulan ini ' + ss.length + ' sesi (' + str.length + ' strength, ' + (car.length + mt.length) + ' cardio/Muay Thai). ' +
        (avg(wFirst) && avg(wLast) ? 'Rata-rata berat bergerak dari ' + avg(wFirst) + ' → ' + avg(wLast) + ' kg. ' : '') +
        (wm.length >= 2 ? 'Lingkar perut ' + wm[0].waistCm + ' → ' + wm[wm.length - 1].waistCm + ' cm. ' : '') +
        (nut.logged ? 'Protein rata-rata ' + nut.avgProtein + 'g/hari (' + nut.onTarget + '/' + nut.logged + ' hari on-target). ' : '') +
        (topEx[0] && topEx[0].delta > 0 ? 'Strength naik (contoh: ' + topEx[0].name + ' +' + topEx[0].delta + ' kg) — indikasi body recomposition positif meski berat relatif stabil.' : ''),
    };
  }

  /* ---------- CSV ---------- */
  const csv = rows => rows.map(r => r.map(v => v == null ? '' : /[",\n]/.test(String(v)) ? '"' + String(v).replace(/"/g, '""') + '"' : v).join(',')).join('\n');
  function toCSVs(db) {
    const out = {};
    out['sessions.csv'] = csv([['id', 'date', 'type', 'title', 'location', 'durationMin', 'readiness', 'feedback', 'status'],
      ...db.sessions.map(s => [s.id, s.date, s.sessionType, s.title, s.locationId, s.durationMin, s.readiness, s.feedback, s.status])]);
    const sets = [['sessionId', 'date', 'exercise', 'setNumber', 'setType', 'weightKg', 'reps']];
    db.sessions.forEach(s => (s.exercises || []).forEach(e => e.sets.forEach((st, i) => sets.push([s.id, s.date, e.name, i + 1, st.type, st.weight, st.reps]))));
    out['strength_sets.csv'] = csv(sets);
    out['cardio.csv'] = csv([['sessionId', 'date', 'activityType', 'durationMin', 'distanceKm', 'avgHr', 'maxHr', 'intensity', 'load'],
      ...db.sessions.filter(s => s.cardio).map(s => [s.id, s.date, s.cardio.activityType, s.cardio.durationMinutes, s.cardio.distanceKm, s.cardio.averageHr, s.cardio.maximumHr, s.cardio.intensity, s.cardio.load])]);
    out['body_metrics.csv'] = csv([['measuredAt', 'weightKg', 'bodyFatPct', 'timeCategory'], ...db.bodyMetrics.map(m => [m.measuredAt, m.weightKg, m.bodyFatPercentage, m.timeCategory])]);
    out['waist_measurements.csv'] = csv([['measuredAt', 'waistCm'], ...db.waist.map(w => [w.measuredAt, w.waistCm])]);
    out['readiness.csv'] = csv([['date', 'readiness', 'soreness'], ...db.readinessLog.map(r => [r.date, r.readiness, (r.soreness || []).map(x => typeof x === 'string' ? x : (x.id + (x.level ? ':' + x.level : ''))).join('; ')])]);
    out['nutrition_log.csv'] = csv([['at', 'foodId', 'name', 'qty', 'unit', 'kcal', 'proteinG', 'carbG', 'fatG', 'purineLoad', 'ldlLoad'],
      ...((db.nutrition && db.nutrition.log) || []).map(e => { const h = healthOf(e); return [e.at, e.foodId, e.name, e.qty, e.unit, e.kcal, e.p, e.c, e.f, h.purine, h.ldl]; })]);
    return out;
  }

  /* ---------- Seed data ---------- */
  function emptyDb() {
    return {
      schema: 1, seeded: false,
      profile: { name: 'Saya', sex: 'male', dob: null, heightCm: 170, age: 30 },
      targets: { weightKg: 70, bodyFat: 18, waistCm: 90 },
      settings: { unit: 'kg', restingHr: 64, hrMaxOverride: null, lastBackup: null, goal: 'recomp', level: 'menengah', weeklyTarget: 3 },
      equipment: EQUIPMENT.map(e => ({ ...e })),
      sessions: [], bodyMetrics: [], waist: [], readinessLog: [],
      nutrition: { log: [], foods: FOOD_SEED.map(f => ({ ...f })), override: false, targets: null },
    };
  }
  /* Normalize any incoming db (fresh load, restore, or import) to the current schema.
     Fills every missing field with safe defaults so no screen can crash on undefined.
     Refreshes the seed food library to the categorized schema while keeping custom foods + log. */
  const clamp = (v, lo, hi, fallback) => {
    // B1/B2 fix: empty / null / whitespace input must return the fallback, never the lower bound.
    if (v == null || (typeof v === 'string' && v.trim() === '')) return fallback;
    const n = Number(v); return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : fallback; };
  function normalizeDb(raw) {
    const def = emptyDb();
    const db = (raw && typeof raw === 'object') ? raw : {};
    db.schema = 1;
    db.seeded = !!db.seeded;
    const rawGoalSet = !!(db.settings && db.settings.goal), rawWeeklySet = !!(db.settings && db.settings.weeklyTarget);
    db.profile = Object.assign({}, def.profile, db.profile || {});
    if (db.profile.sex !== 'female') db.profile.sex = 'male';   // v1.0 backups have no sex field → male (v1.0 BMR formula)
    if (db.profile.dob) {   // keep age current when a birth date is known
      const dob = new Date(db.profile.dob);
      if (!isNaN(dob)) db.profile.age = Math.floor((Date.now() - dob) / (365.25 * DAY));
    }
    if (!Number.isFinite(Number(db.profile.age)) || db.profile.age < 10 || db.profile.age > 100) db.profile.age = def.profile.age;
    if (!Number.isFinite(Number(db.profile.heightCm)) || db.profile.heightCm < 120 || db.profile.heightCm > 230) db.profile.heightCm = def.profile.heightCm;
    db.targets = Object.assign({}, def.targets, db.targets || {});
    db.settings = Object.assign({}, def.settings, db.settings || {});
    if (db.goal && !rawGoalSet) db.settings.goal = db.goal;   // v1.0 onboarding wrote db.goal
    delete db.goal;
    if (db.settings.targetDays && !rawWeeklySet) db.settings.weeklyTarget = db.settings.targetDays;
    delete db.settings.targetDays;
    if (!GOALS[db.settings.goal]) db.settings.goal = 'recomp';
    if (!LEVELS[db.settings.level]) db.settings.level = 'menengah';
    db.settings.weeklyTarget = clamp(db.settings.weeklyTarget, 1, 7, 3);
    db.settings.restingHr = clamp(db.settings.restingHr, 30, 120, def.settings.restingHr);
    if (db.settings.hrMaxOverride != null) db.settings.hrMaxOverride = clamp(db.settings.hrMaxOverride, 120, 230, null);
    if (!Array.isArray(db.equipment) || !db.equipment.length) db.equipment = EQUIPMENT.map(e => ({ ...e }));
    ['sessions', 'bodyMetrics', 'waist', 'readinessLog'].forEach(k => { if (!Array.isArray(db[k])) db[k] = []; });
    if (!db.nutrition || typeof db.nutrition !== 'object') db.nutrition = { log: [], foods: FOOD_SEED.map(f => ({ ...f })), override: false, targets: null };
    if (!Array.isArray(db.nutrition.log)) db.nutrition.log = [];
    // always re-sync the seed food library so new categories/items reach existing installs; keep custom foods
    {
      const custom = (Array.isArray(db.nutrition.foods) ? db.nutrition.foods : []).filter(f => f && !f.seed);
      db.nutrition.foods = FOOD_SEED.map(f => ({ ...f })).concat(custom);
    }
    if (db.nutrition.override == null) db.nutrition.override = false;
    // demo data ages in storage — slide every sample timestamp forward so the demo always looks "current".
    // Real anchor measurements (source:'anchor') are never moved.
    if (db.seeded) {
      // anchor on the newest sample session: the demo's latest activity should always be ~yesterday
      const newest = db.sessions.reduce((mx, s) => { const t = new Date(s.date).getTime(); return isNaN(t) ? mx : Math.max(mx, t); }, 0);
      const sod = t => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); };
      const shiftDays = newest ? Math.round((sod(Date.now()) - sod(newest)) / DAY) - 1 : 0;
      if (shiftDays >= 1) {
        const sh = (v) => { if (!v) return v; const t = new Date(v).getTime(); return isNaN(t) ? v : new Date(t + shiftDays * DAY).toISOString(); };
        db.sessions.forEach(s => { s.date = sh(s.date); });
        db.readinessLog.forEach(r => { r.date = sh(r.date); });
        db.waist.forEach(w => { w.measuredAt = sh(w.measuredAt); });
        db.bodyMetrics.forEach(m => { if (m.source !== 'anchor') m.measuredAt = sh(m.measuredAt); });   // v1.0 anchors (restored backups) never move
        db.nutrition.log.forEach(e => { e.at = sh(e.at); });
        if (db.settings.lastBackup) db.settings.lastBackup = sh(db.settings.lastBackup);
        if (db.activeSession && db.activeSession.startedAt) db.activeSession = null;
        db.seededAt = new Date().toISOString();
      }
    }
    return db;
  }
  function seedDb() {
    const db = emptyDb(); db.seeded = true; db.seededAt = new Date().toISOString();
    db.settings.lastBackup = iso(35);
    const S = (d, title, type, locId, dur, readiness, fb, exs, cardio) => {
      db.sessions.push({
        id: uid(), date: iso(d, 17, 30), title, sessionType: type, locationId: locId, durationMin: dur,
        readiness, feedback: fb, status: 'completed',
        exercises: (exs || []).map(([exId, w, reps]) => ({
          exId, name: exById(exId).name,
          sets: reps.map((r, i) => ({ type: i === 0 && exById(exId).kind === 'major' ? 'warmup' : 'working', weight: i === 0 && exById(exId).kind === 'major' ? Math.round(w * 0.5) : w, reps: r, done: true })),
        })),
        cardio: cardio || null,
      });
      if (readiness) db.readinessLog.push({ date: iso(d), readiness, soreness: [] });
    };
    const C = (type, dur, dist, avg, mx, intensity) => ({ activityType: type, durationMinutes: dur, distanceKm: dist, averageHr: avg, maximumHr: mx, intensity, load: cardioLoad(dur, intensity, type === 'muaythai' ? 'muaythai' : '') });

    S(1, 'Muay Thai', 'muaythai', 'home-muaythai', 52, 'fit', 'pas', [], C('muaythai', 52, null, 152, 178, 'berat'));
    S(2, 'Upper Push–Pull', 'strength', 'fithub', 58, 'fit', 'pas', [
      ['machine-chest-press', 40, [10, 12, 12, 11]], ['lat-pulldown', 50, [10, 10, 10, 9]],
      ['machine-shoulder-press', 30, [10, 11, 10, 9]], ['seated-cable-row', 45, [10, 12, 11, 10]], ['lateral-raise', 8, [15, 14, 12]]]);
    S(4, 'Treadmill Run', 'cardio', 'home-treadmill', 32, 'fit', 'pas', [], C('treadmill-run', 30, 4.2, 145, 174, 'sedang'));
    S(5, 'Lower Body', 'strength', 'fithub', 55, 'fit', 'pas', [
      ['leg-press', 100, [10, 12, 12, 12]], ['leg-extension', 40, [13, 12, 12]],
      ['seated-leg-curl', 35, [12, 12, 11]], ['calf-raise-machine', 50, [16, 15, 14]]]);
    S(7, 'Muay Thai', 'muaythai', 'home-muaythai', 60, 'fit', 'pas', [], C('muaythai', 60, null, 148, 176, 'berat'));
    S(8, 'Full Body (Rumah)', 'strength', 'home-strength', 48, 'agak-lelah', 'pas', [
      ['ft1-chest-press', 25, [10, 11, 11, 10]], ['ft1-row', 20, [10, 12, 11, 11]],
      ['goblet-squat', 22.5, [12, 12, 12]], ['db-curl', 10, [12, 12, 11]], ['plank', 0, [45, 40, 35]]]);
    S(10, 'Treadmill Walk', 'cardio', 'home-treadmill', 42, 'agak-lelah', 'pas', [], C('treadmill-walk', 40, 3.5, 112, 128, 'ringan'));
    S(11, 'Pull', 'strength', 'fithub', 50, 'fit', 'pas', [
      ['lat-pulldown', 47.5, [10, 12, 12, 12]], ['seated-cable-row', 42.5, [11, 12, 12, 12]],
      ['machine-row', 40, [11, 10, 10]], ['cable-curl', 15, [12, 12, 11]]]);
    S(13, 'Lower Body (Rumah)', 'strength', 'home-strength', 45, 'fit', 'pas', [
      ['goblet-squat', 20, [12, 15, 15, 15]], ['db-rdl', 16, [11, 12, 12]],
      ['bulgarian-split-squat', 10, [10, 10, 9]], ['db-calf-raise', 16, [18, 16, 15]]]);
    S(14, 'Muay Thai', 'muaythai', 'home-muaythai', 45, 'fit', 'pas', [], C('muaythai', 45, null, 143, 169, 'sedang'));
    S(16, 'Push', 'strength', 'fithub', 52, 'fit', 'terlalu-ringan', [
      ['machine-chest-press', 37.5, [10, 12, 12, 12]], ['incline-db-press', 14, [11, 11, 10]],
      ['machine-shoulder-press', 27.5, [11, 12, 12]], ['triceps-pushdown', 15, [13, 12, 12]], ['lateral-raise', 7.5, [16, 15, 14]]]);
    S(18, 'Treadmill Run', 'cardio', 'home-treadmill', 30, 'fit', 'pas', [], C('treadmill-run', 28, 3.8, 149, 171, 'sedang'));
    S(19, 'Full Body (Rumah)', 'strength', 'home-strength', 50, 'fit', 'pas', [
      ['ft1-chest-press', 22.5, [10, 12, 12, 12]], ['pull-up', 0, [7, 6, 5]],
      ['goblet-squat', 20, [12, 12, 12]], ['ft1-pulldown', 27.5, [11, 11, 10]], ['plank', 0, [40, 40, 30]]]);
    S(21, 'Lower Body', 'strength', 'fithub', 55, 'fit', 'pas', [
      ['leg-press', 95, [10, 12, 12, 12]], ['smith-squat', 40, [10, 10, 9]],
      ['seated-leg-curl', 32.5, [12, 12, 12]], ['calf-raise-machine', 45, [16, 16, 15]]]);

    /* DEMO body metrics: fictional sample person, 8 scale readings over ~60 days (source:'demo'),
       then a few recent weigh-ins whose BF is estimated by the app. Wiped by "Hapus data contoh". */
    db.profile = { ...db.profile, sex: 'male', dob: '1990-01-01', heightCm: 170 };
    db.targets = { weightKg: 68, bodyFat: 18, waistCm: 90 };
    [[60, 72.1, 24.6], [52, 71.8, 24.4], [45, 71.6, 24.5], [38, 71.3, 24.1], [30, 71.0, 23.9], [22, 70.9, 23.8], [15, 70.7, 23.6], [8, 70.5, 23.5]]
      .forEach(([d, w, bf]) => db.bodyMetrics.push({ id: uid(), measuredAt: iso(d, 6, 30), weightKg: w, bodyFatPercentage: bf, bfEstimated: false, source: 'demo', timeCategory: 'pagi' }));
    let seedRnd = 42; const rnd = () => { seedRnd = (seedRnd * 9301 + 49297) % 233280; return seedRnd / 233280; };
    for (let i = 6; i >= 1; i--) {
      if (rnd() < 0.25) continue;
      const w = +(70.4 - (6 - i) * 0.03 + (rnd() - 0.5) * 0.5).toFixed(2);
      const est = estimateBodyFat(db, w);
      db.bodyMetrics.push({ id: uid(), measuredAt: iso(i, 6, 45), weightKg: w, bodyFatPercentage: est ? est.bf : null, bfEstimated: true, timeCategory: 'pagi' });
    }
    db.waist = [
      { id: uid(), measuredAt: iso(29, 7), waistCm: 90 },
      { id: uid(), measuredAt: iso(20, 7), waistCm: 89.5 },
      { id: uid(), measuredAt: iso(8, 7), waistCm: 89 },
    ];
    /* seed nutrition log: last 6 days protein-focused + partial today */
    const F = id => FOOD_SEED.find(x => x.id === id);
    const meal = (dAgo, h, m, id, mult) => { const f = F(id); const k = mult || 1;
      db.nutrition.log.push({ id: uid(), at: iso(dAgo, h, m), foodId: id, name: f.name, icon: f.icon, kcal: Math.round(f.kcal * k), p: +(f.p * k).toFixed(0), c: +(f.c * k).toFixed(0), f: +(f.f * k).toFixed(0) }); };
    const dayFull = (dAgo) => { meal(dAgo, 7, 10, 'telur-dadar'); meal(dAgo, 7, 15, 'whey-truiso'); meal(dAgo, 13, 0, 'dada-ayam-nasi'); meal(dAgo, 16, 30, 'telur-rebus', 2); meal(dAgo, 19, 30, 'ayam-dada'); meal(dAgo, 19, 35, 'nasi-putih', 1.5); };
    [6, 5, 4, 3, 2, 1].forEach(dayFull);
    // today (partial)
    meal(0, 7, 10, 'telur-dadar'); meal(0, 7, 20, 'whey-truiso'); meal(0, 13, 0, 'dada-ayam-nasi'); meal(0, 16, 30, 'telur-rebus');
    return db;
  }

  return {
    DAY, uid, iso, daysSince, timeCategory, localDate, measuredAtFor,
    LOCATIONS, EQUIPMENT, EX, exById, MUSCLE_LABEL, PAT_LABEL, SORE_OPTIONS, CARDIO_TYPES,
    techniqueFor, warmupFor, COOLDOWN,
    hrMax, hrMaxSuggestion, classifyCardio, cardioLoad,
    muscleDays, patternDays, lastSession, progressionFor, deloadCheck, recoveryMap, BODY_GROUPS,
    e1rm, prMap, sessionPRs, weeklyTonnage, MUSCLE_GROUP, exerciseHistory, BW_RATIO, isBWmove, bodyKg, effLoad, setTonnage,
    streakInfo, achievementState, newlyUnlocked, totalTonnage, ACHIEVEMENTS,
    xpTotal, levelInfo, RANKS, CAREER_PATHS, CAREER_UNLOCK_LEVEL, rankForLevel, rankProgress, setCareerPath,
    recommend, previewNext, replaceOptions, alternatives,
    movAvg, sortedMetrics, estimateBodyFat, monthlyReport, toCSVs,
    FOOD_SEED, FOOD_CATS, nutritionTargets, nutritionDayTarget, setMacroTargets, nutToday, nutritionTotals, nutritionWeek, nutritionProteinStreak,
    deficitInsight, proteinAdequacy, nutritionMonth, healthLoad, foodHealthWarn, healthOf, HEALTH,
    emptyDb, seedDb, APP_VERSION, GOALS, LEVELS, TARGET_DEFAULTS, goalOf, levelOf, normalizeDb, clamp,
  };
})();
