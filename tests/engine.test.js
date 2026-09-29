/* FitFlow engine tests — run: node tests/engine.test.js   (no dependencies) */
const assert = require('assert');
const fs = require('fs'), path = require('path');
global.window = {};
eval(fs.readFileSync(path.join(__dirname, '..', 'engine.js'), 'utf8'));
const FF = window.FF;
let pass = 0; const t = (name, fn) => { try { fn(); pass++; } catch (e) { console.error('✗ ' + name + '\n  ' + e.message); process.exitCode = 1; } };
const withWeight = (db, w, bf) => { db.bodyMetrics.push({ id: 'x' + Math.random(), measuredAt: new Date().toISOString(), weightKg: w, bodyFatPercentage: bf == null ? null : bf, bfEstimated: false }); return db; };

// ---- clamp (B1/B2) ----
t('clamp: empty string → fallback', () => assert.strictEqual(FF.clamp('', 20, 400, null), null));
t('clamp: whitespace → fallback', () => assert.strictEqual(FF.clamp('   ', 20, 400, null), null));
t('clamp: null → fallback', () => assert.strictEqual(FF.clamp(null, 1, 600, 0), 0));
t('clamp: undefined → fallback', () => assert.strictEqual(FF.clamp(undefined, 1, 600, 7), 7));
t('clamp: text → fallback', () => assert.strictEqual(FF.clamp('abc', 1, 10, 5), 5));
t('clamp: in range', () => assert.strictEqual(FF.clamp('70.5', 20, 400, null), 70.5));
t('clamp: below → lo', () => assert.strictEqual(FF.clamp(5, 20, 400, null), 20));
t('clamp: above → hi', () => assert.strictEqual(FF.clamp(999, 20, 400, null), 400));
t('clamp: zero is a value, not empty', () => assert.strictEqual(FF.clamp(0, 0, 10, 5), 0));
t('clamp: number input', () => assert.strictEqual(FF.clamp(64, 30, 120, 1), 64));

// ---- emptyDb: no personal data ----
t('emptyDb: no body metrics, no sessions', () => { const d = FF.emptyDb(); assert.strictEqual(d.bodyMetrics.length, 0); assert.strictEqual(d.sessions.length, 0); });
t('emptyDb: no personal DOB', () => assert.strictEqual(FF.emptyDb().profile.dob, null));
t('engine source: no personal reference history', () => { const src = fs.readFileSync(path.join(__dirname, '..', 'engine.js'), 'utf8'); assert(!/REFERENCE_HISTORY|1988-06-10|67\.50, 22\.2/.test(src)); });

// ---- nutritionTargets: goal + sex ----
const base = () => { const d = FF.emptyDb(); d.profile.heightCm = 170; d.profile.age = 35; return withWeight(d, 70); };
t('BMR male = Mifflin +5', () => { const r = FF.nutritionTargets(base()); assert.strictEqual(r.bmr, Math.round(10 * 70 + 6.25 * 170 - 5 * 35 + 5)); });
t('BMR female = Mifflin −161', () => { const d = base(); d.profile.sex = 'female'; assert.strictEqual(FF.nutritionTargets(d).bmr, Math.round(10 * 70 + 6.25 * 170 - 5 * 35 - 161)); });
const kcalFor = (g) => { const d = base(); d.settings.goal = g; return FF.nutritionTargets(d); };
t('goal recomp = −350, 2.1 g/kg (v1.0 behaviour)', () => { const r = kcalFor('recomp'); assert.strictEqual(r.goalAdj, -350); assert.strictEqual(r.protein, Math.round(70 * 2.1)); assert.strictEqual(r.kcal, Math.round((r.tdee - 350) / 10) * 10); });
t('goal fatloss = −500, 2.2 g/kg', () => { const r = kcalFor('fatloss'); assert.strictEqual(r.goalAdj, -500); assert.strictEqual(r.protein, 154); });
t('goal muscle = +250, 1.8 g/kg', () => { const r = kcalFor('muscle'); assert.strictEqual(r.goalAdj, 250); assert(r.kcal > r.tdee); assert.strictEqual(r.protein, 126); });
t('goal fit = maintenance, 1.6 g/kg', () => { const r = kcalFor('fit'); assert.strictEqual(r.goalAdj, 0); assert.strictEqual(r.protein, 112); });
t('changing goal changes kcal target (Fase 3 gate)', () => assert.notStrictEqual(kcalFor('recomp').kcal, kcalFor('muscle').kcal));
t('manual macro override wins over goal', () => { const d = base(); d.settings.goal = 'muscle'; FF.setMacroTargets(d, { protein: 150, carb: 200, fat: 60 }); const r = FF.nutritionTargets(d); assert.strictEqual(r.source, 'manual'); assert.strictEqual(r.protein, 150); });

// ---- normalizeDb: v1.0 backup migration ----
t('v1.0 backup → male, recomp, menengah; goal & targetDays migrated', () => {
  const old = { schema: 1, profile: { name: 'Saya', dob: '1988-06-10', heightCm: 161, age: 38 }, goal: 'muscle', settings: { unit: 'kg', restingHr: 64, targetDays: 5 }, sessions: [], bodyMetrics: [] };
  const d = FF.normalizeDb(JSON.parse(JSON.stringify(old)));
  assert.strictEqual(d.profile.sex, 'male'); assert.strictEqual(d.settings.goal, 'muscle'); assert.strictEqual(d.settings.weeklyTarget, 5);
  assert.strictEqual(d.settings.level, 'menengah'); assert.strictEqual(d.goal, undefined); assert.strictEqual(d.profile.heightCm, 161);
});
t('v1.0 backup without goal → recomp (same numbers as v1.0)', () => { const d = FF.normalizeDb({ schema: 1, profile: { dob: '1988-06-10', heightCm: 161 }, settings: {}, sessions: [], bodyMetrics: [] }); assert.strictEqual(d.settings.goal, 'recomp'); });
t('existing weeklyTarget is not overwritten by stale targetDays', () => { const d = FF.normalizeDb({ schema: 1, settings: { weeklyTarget: 2, targetDays: 5 }, sessions: [], bodyMetrics: [] }); assert.strictEqual(d.settings.weeklyTarget, 2); });
t('invalid goal/level → defaults', () => { const d = FF.normalizeDb({ schema: 1, settings: { goal: 'x', level: 'y' }, sessions: [], bodyMetrics: [] }); assert.strictEqual(d.settings.goal, 'recomp'); assert.strictEqual(d.settings.level, 'menengah'); });
t('age follows dob', () => { const d = FF.normalizeDb({ schema: 1, profile: { dob: '1990-07-01', age: 5 }, sessions: [], bodyMetrics: [] }); assert(d.profile.age >= 35 && d.profile.age <= 37); });
t('no dob, no age → default age 30 (not 56 from epoch)', () => { const d = FF.normalizeDb({ schema: 1, profile: {}, sessions: [], bodyMetrics: [] }); assert.strictEqual(d.profile.age, 30); });

// ---- estimateBodyFat ----
t('no real BF measurement → null (no fabrication)', () => assert.strictEqual(FF.estimateBodyFat(withWeight(FF.emptyDb(), 70), 69), null));
t('1 real BF → Forbes model, loss lowers BF', () => { const d = withWeight(FF.emptyDb(), 70, 24); const r = FF.estimateBodyFat(d, 68); assert.strictEqual(r.method, 'model komposisi Forbes'); assert(r.bf < 24 && r.bf > 22, 'bf=' + r.bf); });
t('Forbes: same weight → same BF', () => { const d = withWeight(FF.emptyDb(), 70, 24); assert.strictEqual(FF.estimateBodyFat(d, 70).bf, 24); });
t('≥3 real BF → own regression', () => { const d = FF.emptyDb(); [[72, 25], [71, 24.3], [70, 23.6]].forEach(([w, bf]) => withWeight(d, w, bf)); assert.strictEqual(FF.estimateBodyFat(d, 69).method, 'regresi tren kamu'); });
t('estimated readings are never used as a basis', () => { const d = FF.emptyDb(); d.bodyMetrics.push({ measuredAt: new Date().toISOString(), weightKg: 70, bodyFatPercentage: 22, bfEstimated: true }); assert.strictEqual(FF.estimateBodyFat(d, 69), null); });

// ---- recommend: level → volume ----
const rec = (lvl, minutes) => { const d = FF.emptyDb(); d.settings.level = lvl; withWeight(d, 70); return FF.recommend(d, { readiness: 'fit', soreness: [], locationId: 'fithub', minutes }); };
const setsOf = (r, kind) => (r.exercises || []).filter(e => e.kind === kind).map(e => e.sets);
t('pemula: isolation max 2 set, compound max 3', () => { const r = rec('pemula', 60); assert(setsOf(r, 'accessory').every(s => s <= 2)); assert(setsOf(r, 'major').every(s => s <= 3)); });
t('lanjut @60 min: at least one compound at 4 set', () => { const r = rec('lanjut', 60); assert(setsOf(r, 'major').some(s => s === 4), JSON.stringify(setsOf(r, 'major'))); });
// total sets are capped by time; lanjut spends that time on compound volume (longer rest), so compare compound sets
t('compound volume ordering pemula ≤ menengah ≤ lanjut (60 min)', () => { const m = l => setsOf(rec(l, 60), 'major').reduce((a, b) => a + b, 0); assert(m('pemula') <= m('menengah') && m('menengah') <= m('lanjut'), [m('pemula'), m('menengah'), m('lanjut')].join('/')); });
t('every level fits the time budget (±3 min)', () => ['pemula', 'menengah', 'lanjut'].forEach(l => [30, 45, 60].forEach(min => { const r = rec(l, min); assert(r.durationMin <= min + 3, l + '@' + min + ' → ' + r.durationMin); })));
t('Gate 5 reason mentions the level', () => assert(rec('lanjut', 45).reasons.some(x => /Level lanjut/.test(x.text))));
t('recommend never throws on an empty db', () => { const r = FF.recommend(FF.emptyDb(), { readiness: 'fit', soreness: [], locationId: 'home-strength', minutes: 30 }); assert(r && r.kind); });

// ---- seedDb: self-contained demo ----
t('seedDb demo has real BF points flagged demo', () => { const d = FF.seedDb(); assert(d.seeded); assert(d.bodyMetrics.some(m => m.source === 'demo' && !m.bfEstimated)); });

t('calorie floor: female never below 1200', () => { const d = FF.emptyDb(); d.profile.sex = 'female'; d.profile.heightCm = 150; d.profile.age = 50; d.settings.goal = 'fatloss'; withWeight(d, 45); const r = FF.nutritionTargets(d); assert(r.kcal >= 1200 && r.floored, r.kcal); });
t('calorie floor: male never below 1500', () => { const d = FF.emptyDb(); d.profile.heightCm = 155; d.profile.age = 60; d.settings.goal = 'fatloss'; withWeight(d, 50); const r = FF.nutritionTargets(d); assert(r.kcal >= 1500, r.kcal); });
t('calorie floor does not touch normal recomp targets', () => { const d = base(); const r = FF.nutritionTargets(d); assert(!r.floored); });
console.log((process.exitCode ? 'FAILED' : 'OK') + ' · ' + pass + ' passed');
