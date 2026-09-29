/* FitFlow app logic — Component class for dc-runtime. Loaded as a plain script; dc-runtime calls window.__dcDefineLogic(DCLogic, React). */
window.__dcDefineLogic = function (DCLogic, React) {
class Component extends DCLogic {
  state = { tab: 'home', db: null, ctx: this.loadCtx(),
    qw: '', qbf: '', qDate: '', wIn: '', wDate: '', hW: '', hBf: '', hDate: '', cardioFormOpen: false, cf: { type: 'treadmill-run', dur: '', dist: '', avg: '', max: '', attach: null, date: '' },
    fbOpen: false, replFor: null, sdId: null, techId: null, riData: null,
    calYm: null, pTab: 'body', eqLoc: 'home', reportYm: null, rest: this.loadRest(), tick: 0, saveErr: null,
    ctxDone: this.ctxSetToday(), remindersOpen: false, reasonsOpen: false, altOpen: false,
    celebration: null, toast: null, confirmReq: null, onboard: this.needsOnboard() ? 0 : null, ob: { goal: 'recomp', level: 'menengah', place: 'both', days: 4, sex: 'male', year: '', height: '', weight: '', bf: '', rhr: '' } };

  needsOnboard() { try { return !localStorage.getItem('fitflow.onboarded'); } catch (e) { return false; } }

  buildShareCard(p, cb) {
    const W = 1080, H = 1350, c = document.createElement('canvas'); c.width = W; c.height = H;
    const x = c.getContext('2d');
    const g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#241a0e'); g.addColorStop(0.5, '#16120c'); g.addColorStop(1, '#0a0a0b');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    // radial glow
    const rg = x.createRadialGradient(W * 0.7, 180, 20, W * 0.7, 180, 620); rg.addColorStop(0, 'rgba(232,161,60,0.28)'); rg.addColorStop(1, 'rgba(232,161,60,0)');
    x.fillStyle = rg; x.fillRect(0, 0, W, H);
    // grid
    x.strokeStyle = 'rgba(255,255,255,0.04)'; x.lineWidth = 1;
    for (let i = 68; i < W; i += 68) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, H); x.stroke(); }
    for (let i = 68; i < H; i += 68) { x.beginPath(); x.moveTo(0, i); x.lineTo(W, i); x.stroke(); }
    x.textBaseline = 'alphabetic';
    // brand
    x.fillStyle = '#e8a13c'; x.font = '600 34px ui-monospace, monospace'; x.fillText('◆ FITFLOW', 80, 120);
    x.fillStyle = 'rgba(246,243,237,0.55)'; x.font = '28px ui-monospace, monospace';
    x.fillText(new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase(), 80, 165);
    // headline
    const kindLabel = { strength: 'SESI STRENGTH', cardio: 'SESI CARDIO', muaythai: 'MUAY THAI', streak: 'STREAK AKTIF' }[p.kind] || 'SESI SELESAI';
    x.fillStyle = 'rgba(246,243,237,0.6)'; x.font = '30px ui-monospace, monospace'; x.fillText(p.streakCard ? 'KONSISTENSI · FITFLOW' : kindLabel + ' · SELESAI', 80, 330);
    x.fillStyle = '#f6f3ed'; x.font = '600 96px Georgia, serif';
    const title = p.title.length > 18 ? p.title.slice(0, 17) + '…' : p.title;
    x.fillText(title, 80, 430);
    if (p.streakCard) {
      x.font = '160px serif'; x.fillText('🔥', 80, 720);
      x.fillStyle = '#f3e6cd'; x.font = '600 200px Georgia, serif'; x.fillText(String(p.streak), 320, 760);
      x.fillStyle = 'rgba(232,161,60,0.85)'; x.font = '34px ui-monospace, monospace'; x.fillText('HARI BERUNTUN', 324, 820);
      x.fillStyle = 'rgba(246,243,237,0.7)'; x.font = '38px Georgia, serif';
      x.fillText('Streak terbaik ' + p.setsN + ' hari · ' + p.exCount + ' sesi total', 80, 980);
      x.fillStyle = 'rgba(246,243,237,0.4)'; x.font = '26px ui-monospace, monospace'; x.fillText('adaptive training tracker', 80, 1290);
      c.toBlob(b => cb(b, c.toDataURL('image/png')), 'image/png'); return;
    }
    // big metrics
    const metrics = p.kind === 'strength'
      ? [[String(p.exCount), 'GERAKAN'], [String(p.setsN), 'SET'], [p.dur + '′', 'DURASI'], [(p.tonnage >= 1000 ? (p.tonnage / 1000).toFixed(1) + 't' : Math.round(p.tonnage) + 'kg'), 'TONNAGE']]
      : [[p.dur + '′', 'DURASI'], [p.distKm ? p.distKm + 'km' : '—', 'JARAK'], [p.avgHr ? p.avgHr : '—', 'AVG HR'], [(p.intensity || '').toUpperCase() || '—', 'INTENSITAS']];
    let mx = 80, my = 620;
    metrics.forEach((m, i) => {
      const col = i % 2, row = Math.floor(i / 2);
      const px = 80 + col * 500, py = 600 + row * 220;
      x.fillStyle = 'rgba(255,255,255,0.03)'; this.roundRect(x, px, py, 460, 190, 28); x.fill();
      x.strokeStyle = 'rgba(232,161,60,0.18)'; x.lineWidth = 2; this.roundRect(x, px, py, 460, 190, 28); x.stroke();
      x.fillStyle = '#f3e6cd'; x.font = '600 84px Georgia, serif'; x.fillText(m[0], px + 34, py + 110);
      x.fillStyle = 'rgba(232,161,60,0.85)'; x.font = '26px ui-monospace, monospace'; x.fillText(m[1], px + 36, py + 156);
    });
    // streak + PR banner
    let by = 1120;
    if (p.streak >= 2) { x.fillStyle = '#e8a13c'; x.font = '600 40px Georgia, serif'; x.fillText('🔥 ' + p.streak + ' hari beruntun', 80, by); by += 60; }
    if (p.prs && p.prs.length) { x.fillStyle = '#17b573'; x.font = '600 40px Georgia, serif'; x.fillText('⚡ ' + p.prs.length + ' rekor baru!', 80, by); by += 60; }
    x.fillStyle = 'rgba(246,243,237,0.4)'; x.font = '26px ui-monospace, monospace'; x.fillText('adaptive training tracker', 80, 1290);
    c.toBlob(b => cb(b, c.toDataURL('image/png')), 'image/png');
  }
  roundRect(x, X, Y, w, h, r) { x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + w, Y, X + w, Y + h, r); x.arcTo(X + w, Y + h, X, Y + h, r); x.arcTo(X, Y + h, X, Y, r); x.arcTo(X, Y, X + w, Y, r); x.closePath(); }
  shareCard(p) {
    this.buildShareCard(p, async (blob, dataUrl) => {
      const file = new File([blob], 'fitflow-' + Date.now() + '.png', { type: 'image/png' });
      try {
        if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: 'FitFlow', text: 'Sesi ' + p.title + ' selesai 💪 #FitFlow' }); return; }
      } catch (e) {}
      const a = document.createElement('a'); a.href = dataUrl; a.download = file.name; a.click();
    });
  }

  celebrationVals(set) {
    const p = this.state.celebration;
    if (!p) return { celOpen: false };
    const confetti = Array.from({ length: 26 }, (_, i) => {
      const cols = ['#e8a13c', '#d9a343', '#17b573', '#4d90c8', '#f6f3ed'];
      const left = (i * 37 + 7) % 100, delay = (i % 6) * 120, dur = 1400 + (i % 5) * 300, size = 7 + (i % 4) * 3;
      return { style: 'position:absolute; top:-20px; left:' + left + '%; width:' + size + 'px; height:' + (size + 3) + 'px; background:' + cols[i % 5] + '; border-radius:2px; opacity:0; animation:ffconfetti ' + dur + 'ms ' + delay + 'ms ease-in forwards;' };
    });
    const stats = p.kind === 'strength'
      ? [{ value: p.exCount, label: 'gerakan' }, { value: p.setsN, label: 'set' }, { value: p.dur + '′', label: 'durasi' }, { value: p.tonnage >= 1000 ? (p.tonnage / 1000).toFixed(1) + 't' : Math.round(p.tonnage) + ' kg', label: 'tonnage' }]
      : [{ value: p.dur + '′', label: 'durasi' }, { value: p.distKm ? p.distKm + ' km' : '—', label: 'jarak' }, { value: p.avgHr || '—', label: 'avg hr' }, { value: (p.intensity || '—'), label: 'intensitas' }];
    const subs = [];
    if (p.streak >= 2) subs.push('🔥 ' + p.streak + ' hari beruntun');
    if (p.prs && p.prs.length) subs.push('⚡ ' + p.prs.length + ' rekor baru');
    return {
      celOpen: true,
      celIcon: p.prs && p.prs.length ? '⚡' : p.kind === 'muaythai' ? '🥊' : p.kind === 'cardio' ? '🏃' : '💪',
      celTitle: p.title, celSubtitle: subs.length ? subs.join('  ·  ') : 'Kerja bagus — tetap konsisten!',
      celStats: stats,
      celHasBadges: p.fresh && p.fresh.length > 0, celBadges: (p.fresh || []).map(b => ({ icon: b.icon, name: b.name, desc: b.desc })),
      celShare: () => this.shareCard(p),
      celDone: () => set({ celebration: null, tab: 'history' }),
    };
  }

  streakVals(set) {
    const st = FF.streakInfo(this.db());
    return {
      streakCurrent: st.current, streakLongest: st.longest, streakWeek: st.week, streakTotal: st.total,
      streakWeekStreak: st.weekStreak, streakWeekHit: st.weekHit, streakWeekTarget: st.weekTarget,
      streakSub: st.doneToday ? 'Sudah latihan hari ini 💪' : st.alive ? 'Latihan hari ini untuk menjaga streak!' : st.total ? 'Mulai lagi hari ini' : 'Selesaikan sesi pertamamu',
      streakFlameFilter: st.alive ? 'none' : 'grayscale(1) opacity(0.5)',
      goBadges: () => set({ tab: 'progress', pTab: 'badge' }),
      shareStreak: () => this.shareCard({ kind: 'streak', title: st.current + ' Hari Beruntun', dur: 0, streak: st.current, prs: [], exCount: st.total, setsN: st.longest, tonnage: 0, streakCard: true }),
    };
  }
  achievementVals(set) {
    const db = this.db();
    const list = FF.achievementState(db);
    const unlocked = list.filter(a => a.unlocked).length;
    const rp = FF.rankProgress(db);
    const PIP = { chevron: '⌃', 'chevron-bar': '⌃', wave: '≈', 'wave-star': '★', bar: '▬', rose: '✦', star: '★' };
    const pipsFor = (r) => Array.from({ length: r.n }, () => ({ g: PIP[r.ins] || '★' }));
    return {
      achUnlocked: unlocked, achTotal: list.length,
      achBarStyle: 'height:100%; width:' + Math.round(unlocked / list.length * 100) + '%; background:linear-gradient(90deg, var(--gold-500), var(--gold-400));',
      achievements: list.map(a => ({
        icon: a.icon, glyph: a.glyph, name: a.name, desc: a.desc, unlocked: a.unlocked,
        nameColor: a.unlocked ? 'var(--text-primary)' : 'var(--text-faint)',
        cardStyle: 'display:flex; align-items:center; gap:12px; background:var(--surface-warm-card); border:1px solid ' + (a.unlocked ? 'var(--border-warm)' : 'var(--border-subtle)') + '; border-radius:var(--radius-md); padding:12px 14px;' + (a.unlocked ? '' : 'opacity:0.55;'),
        frameFill: a.unlocked ? 'rgba(232,161,60,0.14)' : 'var(--surface-warm-raised)',
        frameStroke: a.unlocked ? 'var(--gold-500)' : 'var(--border-default)',
        glyphStroke: a.unlocked ? 'var(--gold-300)' : 'var(--text-faint)',
      })),
      // rank hero
      rankLevel: rp.level, rankName: rp.rank.name, rankTier: rp.rank.tier, rankPips: pipsFor(rp.rank),
      rankNextLabel: rp.max ? 'Pangkat tertinggi tercapai' : (rp.nextRank ? 'Menuju ' + rp.nextRank.abbr + ' · ' + rp.levelsToNext + ' level lagi' : ''),
      rankXpLabel: rp.max ? 'MAX' : rp.inLevel + ' / ' + rp.span + ' XP', rankPctLabel: rp.pct + '%',
      rankBarStyle: 'height:100%; width:' + rp.pct + '%; background:linear-gradient(90deg, var(--gold-500), var(--gold-400)); transition:width 300ms;',
      rankXpTotal: rp.xp >= 1000 ? (rp.xp / 1000).toFixed(1) + 'k' : String(rp.xp),
      rankCareerTag: rp.careerPath ? rp.careerPath.tag : '',
      // career picker
      careerPickable: rp.careerEligible && !rp.career,
      careerOptions: FF.CAREER_PATHS.map(c => ({ name: c.name, tag: c.tag, desc: c.desc, onPick: () => { this.mut(d => FF.setCareerPath(d, c.id)); } })),
      // rank ladder
      ladder: FF.RANKS.map((r, i) => {
        const reached = rp.level >= r.min; const current = r.min === rp.rank.min;
        return {
          name: r.name, tier: r.tier, min: r.min, pips: pipsFor(r),
          rowStyle: 'display:flex; align-items:center; gap:12px; padding:10px 12px; border-radius:var(--radius-md); border:1px solid ' + (current ? 'var(--border-warm)' : 'var(--border-subtle)') + '; background:' + (current ? 'var(--interactive-warm-soft)' : 'var(--surface-warm-card)') + ';' + (reached ? '' : 'opacity:0.5;'),
          insBg: reached ? 'background:var(--gold-500);' : 'background:var(--surface-warm-raised);',
          insColor: reached ? 'color:var(--interactive-warm-ink);' : 'color:var(--text-faint);',
          nameColor: reached ? 'var(--text-primary)' : 'var(--text-faint)',
          badge: current ? 'SEKARANG' : reached ? '✓' : 'Lv ' + r.min,
          badgeStyle: 'flex:none; font-family:var(--font-mono); font-size:9px; letter-spacing:0.08em; text-transform:uppercase; color:' + (current ? 'var(--gold-300)' : reached ? 'var(--data-positive)' : 'var(--text-faint)') + ';',
        };
      }),
    };
  }
  /* ---------- Onboarding (Fase 3): goal · level · place · days · profile · summary ---------- */
  obProfileErrors(ob) {
    const nowY = new Date().getFullYear(); const num = (v) => { const t = String(v).trim().replace(',', '.'); return t === '' ? null : Number(t); };
    const y = num(ob.year), h = num(ob.height), w = num(ob.weight), bf = num(ob.bf), rhr = num(ob.rhr);
    const err = [];
    if (y == null || !Number.isInteger(y) || y < nowY - 100 || y > nowY - 10) err.push('Tahun lahir ' + (nowY - 100) + '–' + (nowY - 10));
    if (h == null || !(h >= 120 && h <= 230)) err.push('Tinggi 120–230 cm');
    if (w == null || !(w >= 30 && w <= 250)) err.push('Berat 30–250 kg');
    if (bf != null && !(bf >= 3 && bf <= 60)) err.push('Body fat 3–60% (atau kosongkan)');
    if (rhr != null && !(rhr >= 35 && rhr <= 110)) err.push('HR istirahat 35–110 (atau kosongkan)');
    return { err, y, h, w, bf, rhr };
  }
  obPreviewDb() {
    const ob = this.state.ob; const p = this.obProfileErrors(ob);
    const d = FF.emptyDb();
    d.profile.sex = ob.sex === 'female' ? 'female' : 'male';
    if (p.y) { d.profile.dob = p.y + '-07-01'; d.profile.age = new Date().getFullYear() - p.y; }
    if (p.h) d.profile.heightCm = Math.round(p.h);
    if (p.rhr) d.settings.restingHr = Math.round(p.rhr);
    d.settings.goal = ob.goal; d.settings.level = ob.level; d.settings.weeklyTarget = ob.days;
    if (p.w) d.bodyMetrics.push({ id: FF.uid(), measuredAt: new Date().toISOString(), weightKg: +p.w.toFixed(1), bodyFatPercentage: p.bf != null ? +p.bf.toFixed(1) : null, bfEstimated: false, source: 'onboarding', timeCategory: FF.timeCategory(new Date()) });
    const td = FF.TARGET_DEFAULTS[d.profile.sex];
    d.targets = { weightKg: p.w ? Math.round((ob.goal === 'fatloss' ? p.w * 0.95 : p.w) * 2) / 2 : d.targets.weightKg, bodyFat: td.bodyFat, waistCm: td.waistCm };
    return d;
  }
  finishOnboarding(skipped) {
    try { localStorage.setItem('fitflow.onboarded', '1'); localStorage.setItem('fitflow.profile', JSON.stringify({ ...this.state.ob, at: new Date().toISOString() })); } catch (e) {}
    const ob = this.state.ob;
    try {
      const cur = this.db();
      const pv = this.obPreviewDb();
      const hasData = cur && ((cur.sessions || []).length || (cur.bodyMetrics || []).length);
      // settings always follow the user's choices; profile/body only when this is a fresh install (never overwrite restored data)
      this.mut(d => {
        d.settings.goal = ob.goal; d.settings.level = ob.level; d.settings.weeklyTarget = ob.days;
        if (!hasData && !skipped) {
          d.profile = { ...d.profile, ...pv.profile }; d.targets = pv.targets;
          d.settings.restingHr = pv.settings.restingHr;
          d.bodyMetrics = pv.bodyMetrics.concat(d.bodyMetrics || []);
        }
      });
    } catch (e) {}
    const locId = ob.place === 'gym' ? 'fithub' : ob.place === 'home' ? 'home-strength' : this.state.ctx.locationId;
    this.setState({ onboard: null, ctx: { ...this.state.ctx, locationId: locId } }, () => this.saveCtx());
  }
  obRestoreFile(e) {
    const f = e.target.files && e.target.files[0]; if (!f) return;
    const rd = new FileReader();
    rd.onload = () => {
      try {
        const d = JSON.parse(rd.result);
        if (!(d && typeof d === 'object' && (Array.isArray(d.sessions) || Array.isArray(d.bodyMetrics) || d.nutrition))) { this.toast('File tidak valid: bukan backup FitFlow.'); return; }
        this.state.db = FF.normalizeDb(d); this.persist();
        try { localStorage.setItem('fitflow.onboarded', '1'); } catch (err) {}
        this.setState({ onboard: null });
        this.toast('Backup dipulihkan: ' + (d.sessions || []).length + ' sesi, ' + (d.bodyMetrics || []).length + ' catatan berat.', 4500);
      } catch (err) { this.toast('File JSON tidak bisa dibaca.'); }
    };
    rd.readAsText(f);
  }
  onboardingVals(set) {
    const step = this.state.onboard;
    if (step == null) return { obOpen: false };
    const ob = this.state.ob;
    const steps = [
      { kicker: 'selamat datang', title: 'FitFlow menyesuaikan\nlatihan dengan tubuhmu', body: 'Bukan sekadar catatan. Engine adaptif memilih sesi terbaik tiap hari dari kesiapan, nyeri otot, waktu & alat yang kamu punya.', key: 'goal',
        options: [['recomp', 'Body recomposition', 'Turun lemak + jaga otot · defisit ringan'], ['muscle', 'Bangun otot', 'Hipertrofi & kekuatan · surplus kecil'], ['fit', 'Bugar & sehat', 'Konsisten bergerak · maintenance'], ['fatloss', 'Turun berat', 'Fokus defisit & cardio']] },
      { kicker: 'level kamu', title: 'Seberapa berpengalaman\nkamu berlatih?', body: 'Ini menyetel volume awal: jumlah set per gerakan dan kapan compound naik ke 4 set.', key: 'level',
        options: [['pemula', 'Pemula', '< 6 bulan rutin · 3 set compound, 2 set isolasi'], ['menengah', 'Menengah', '6 bulan – 2 tahun · 3 set'], ['lanjut', 'Lanjut', '> 2 tahun konsisten · compound 4 set']] },
      { kicker: 'tempat latihan', title: 'Di mana kamu\npaling sering latihan?', body: 'Jadi lokasi default di Home. Engine hanya merekomendasikan gerakan yang alatnya tersedia.', key: 'place',
        options: [['home', 'Rumah', 'FT1, dumbbell, bodyweight'], ['gym', 'Gym (FitHub)', 'Alat lengkap'], ['both', 'Keduanya', 'Rumah & gym bergantian']] },
      { kicker: 'target frekuensi', title: 'Berapa hari per minggu\nkamu ingin latihan?', body: 'Jadi target streak mingguan. Bisa diubah kapan saja di More.', key: 'days',
        options: [[3, '3 hari', 'Padat & efisien'], [4, '4 hari', 'Seimbang'], [5, '5 hari', 'Serius'], [6, '6 hari', 'Atlet']] },
      { kicker: 'profil tubuh', title: 'Sedikit data untuk\nmenghitung targetmu', body: 'Dipakai untuk BMR/TDEE (Mifflin-St Jeor), target protein, dan zona HR. Tersimpan hanya di HP ini.', key: 'profile' },
      { kicker: 'siap mulai', title: 'Target awalmu', body: '', key: 'summary' },
    ];
    const s = steps[step];
    const isProfile = s.key === 'profile', isSummary = s.key === 'summary';
    const cur = ob[s.key];
    const inp = (k) => (ev) => set({ ob: { ...this.state.ob, [k]: ev.target.value } });
    let summary = {};
    if (isSummary) {
      const pv = this.obPreviewDb(); const t = FF.nutritionTargets(pv);
      const adj = t.goalAdj || 0;
      summary = {
        obSumKcal: String(t.kcal), obSumProtein: t.protein + ' g', obSumDays: ob.days + '× / mgg',
        obSumLine: 'BMR ' + t.bmr + ' · TDEE ' + t.tdee + ' kkal · ' + (adj < 0 ? 'defisit ' + Math.abs(adj) : adj > 0 ? 'surplus ' + adj : 'maintenance') + (adj ? ' kkal' : '') + ' · protein ' + t.proteinPerKg + ' g/kg',
        obSumNote: (t.floored ? 'Target dinaikkan ke batas aman ' + t.floorKcal + ' kkal/hari (defisit penuh akan terlalu rendah). ' : '') + 'Goal: ' + t.goalLabel + ' · level ' + FF.LEVELS[ob.level].toLowerCase() + '. TDEE akan menyesuaikan otomatis dari jumlah sesi per minggu. Semua bisa diubah di More.',
      };
    }
    const next = () => {
      if (isProfile) { const p = this.obProfileErrors(ob); if (p.err.length) { this.toast('Periksa: ' + p.err.join(' · ') + '.', 4500); return; } }
      step < steps.length - 1 ? set({ onboard: step + 1 }) : this.finishOnboarding(false);
    };
    return {
      obOpen: true, obKey: 'ob' + step, obIntro: step === 0,
      obKicker: s.kicker, obTitle: s.title, obBody: s.body, obHasBody: !!s.body,
      obHasOptions: !!s.options, obIsProfile: isProfile, obIsSummary: isSummary,
      obDots: steps.map((_, i) => ({ style: 'flex:1; height:4px; border-radius:99px; background:' + (i <= step ? 'var(--gold-500)' : 'var(--border-subtle)') + '; transition:background 200ms;' })),
      obOptions: (s.options || []).map(([val, label, sub]) => ({
        label, sub,
        onTap: () => set({ ob: { ...ob, [s.key]: val } }),
        style: 'display:flex; align-items:center; gap:12px; width:100%; padding:15px 16px; border-radius:var(--radius-md); cursor:pointer; text-align:left; transition:all 140ms; color:var(--text-primary); border:1px solid ' + (cur === val ? 'var(--border-warm)' : 'var(--border-subtle)') + '; background:' + (cur === val ? 'var(--interactive-warm-soft)' : 'var(--surface-warm-card)') + ';',
        check: 'width:24px; height:24px; flex:none; border-radius:99px; display:flex; align-items:center; justify-content:center; font-size:13px;' + (cur === val ? 'background:var(--gold-500); color:var(--interactive-warm-ink);' : 'border:1px solid var(--border-default); color:transparent;'),
      })),
      obSexOpts: [['male', 'Pria'], ['female', 'Wanita']].map(([v, l]) => ({ label: l, onTap: () => set({ ob: { ...ob, sex: v } }),
        style: 'flex:1; height:44px; border-radius:999px; cursor:pointer; font-size:14px; font-weight:600; border:1px solid ' + (ob.sex === v ? 'var(--border-warm)' : 'var(--border-subtle)') + '; background:' + (ob.sex === v ? 'var(--interactive-warm-soft)' : 'var(--surface-warm-card)') + '; color:' + (ob.sex === v ? 'var(--gold-300)' : 'var(--text-secondary)') + ';' })),
      obYear: ob.year, obHeight: ob.height, obWeight: ob.weight, obBf: ob.bf, obRhr: ob.rhr,
      obSetYear: inp('year'), obSetHeight: inp('height'), obSetWeight: inp('weight'), obSetBf: inp('bf'), obSetRhr: inp('rhr'),
      ...summary,
      obCanBack: step > 0, obBack: () => set({ onboard: step - 1 }),
      obNext: next,
      obCta: step < steps.length - 1 ? 'Lanjut' : 'Mulai latihan →',
      obSkip: () => this.finishOnboarding(true),
      obRestore: (ev) => this.obRestoreFile(ev),
    };
  }

  loadCtx() {
    const def = { readiness: 'fit', soreness: [], locationId: 'home-strength', minutes: 60 };
    try { const raw = JSON.parse(localStorage.getItem('fitflow.ctx'));
      if (raw && raw.date === new Date().toDateString()) return { ...def, ...raw.ctx };
      if (raw && raw.ctx) return { ...def, locationId: raw.ctx.locationId, minutes: raw.ctx.minutes };
    } catch (e) {}
    return def;
  }
  ctxSetToday() { try { const raw = JSON.parse(localStorage.getItem('fitflow.ctx')); return !!(raw && raw.date === new Date().toDateString()); } catch (e) { return false; } }
  saveCtx() { try { localStorage.setItem('fitflow.ctx', JSON.stringify({ date: new Date().toDateString(), ctx: this.state.ctx })); } catch (e) {} }

  toast(text, ms) { clearTimeout(this._toastT); this.setState({ toast: String(text) }); this._toastT = setTimeout(() => this.setState({ toast: null }), ms || 3200); }
  blurNum(lo, hi, getCur, apply, msg, dec) {
    return (e) => { const raw = String(e.target.value).trim().replace(',', '.'); const n = Number(raw); const cur = getCur();
      if (raw === '' || !Number.isFinite(n) || n < lo || n > hi) { e.target.value = cur == null ? '' : String(cur); this.toast(msg); return; }
      const f = Math.pow(10, dec || 0); const v = Math.round(n * f) / f; e.target.value = String(v); this.mut(d => apply(d, v)); };
  }
  optChip(label, on, onTap) {
    return { label, onTap, style: 'height:36px; padding:0 14px; border-radius:999px; cursor:pointer; font-size:13px; font-weight:600; white-space:nowrap; border:1px solid ' + (on ? 'var(--border-warm)' : 'var(--border-subtle)') + '; background:' + (on ? 'var(--interactive-warm-soft)' : 'transparent') + '; color:' + (on ? 'var(--gold-300)' : 'var(--text-secondary)') + ';' };
  }
  /* "Mulai dari nol": wipe every copy (main, 10-min autosave, safety backup, IndexedDB mirror, onboarding/ctx keys)
     so nothing can be auto-recovered afterwards. keepProfile = removing demo data but keeping the user's own settings. */
  wipeAll(keepProfile) {
    clearTimeout(this._idbT);
    const keep = this.state.db;
    const fresh = FF.emptyDb();
    if (keepProfile && keep && keep.userProfile) { fresh.profile = keep.userProfile.profile; fresh.targets = keep.userProfile.targets; fresh.settings = { ...fresh.settings, ...keep.userProfile.settings }; fresh.equipment = keep.equipment; }
    fresh.resetAt = new Date().toISOString();
    this.state.db = FF.normalizeDb(fresh);
    try {
      ['fitflow.autosave', 'fitflow.safety-backup', 'fitflow.rest', 'fitflow.bkNudgeAt'].forEach(k => localStorage.removeItem(k));
      if (!keepProfile) ['fitflow.ctx', 'fitflow.profile', 'fitflow.onboarded'].forEach(k => localStorage.removeItem(k));
      localStorage.setItem('fitflow.v1', JSON.stringify(this.state.db));
    } catch (e) {}
    this._lastSnap = Date.now();   // no autosave snapshot right away
    this.idbPut(this.state.db);    // overwrite the mirror immediately (no debounce)
    if (keepProfile) { this.forceUpdate(); this.toast('Data contoh dihapus.'); return; }
    this.setState({ onboard: 0, rest: null, undo: null, tab: 'home', ctx: this.loadCtx(), ctxDone: false,
      ob: { goal: 'recomp', level: 'menengah', place: 'both', days: 4, sex: 'male', year: '', height: '', weight: '', bf: '', rhr: '' } });
  }
  /* One path for every weight/BF entry (Home + Progress). ymd '' = today. */
  saveBodyEntry(wRaw, bfRaw, ymd, done) {
    const w = FF.clamp(String(wRaw).replace(',', '.'), 20, 400, null); if (!w) { this.toast('Isi berat badan yang wajar (20–400 kg).'); return; }
    const today = FF.localDate(); if (ymd && ymd > today) { this.toast('Tanggal tidak boleh di masa depan.'); return; }
    const bfTxt = String(bfRaw || '').trim().replace(',', '.');
    const typed = bfTxt === '' ? null : FF.clamp(bfTxt, 3, 70, null);
    if (bfTxt !== '' && typed == null) { this.toast('Body fat 3–70%, atau kosongkan.'); return; }
    const past = !!ymd && ymd < today;
    const est = typed == null && !past ? FF.estimateBodyFat(this.state.db, w) : null;   // only today's weight gets an estimate
    const at = FF.measuredAtFor(ymd);
    this.mut(d => d.bodyMetrics.push({ id: FF.uid(), measuredAt: at, weightKg: +w.toFixed(2), bodyFatPercentage: typed != null ? typed : (est ? est.bf : null), bfEstimated: typed == null && !!est, source: 'manual', timeCategory: FF.timeCategory(new Date(at)) }));
    if (done) done();
    this.toast('Tersimpan: ' + w + ' kg' + (typed != null ? ' · ' + typed + '%' : est ? ' · ≈' + est.bf + '% (estimasi)' : '') + ' · ' + new Date(at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }), 2600);
  }
  ask(text, label, onYes) { this.setState({ confirmReq: { text, label: label || 'Ya', onYes } }); }
  isStandalone() { try { return window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true; } catch (e) { return false; } }
  installApp() { const p = window.__ffInstallPrompt; if (!p) return; p.prompt(); p.userChoice.then(() => { window.__ffInstallPrompt = null; this.forceUpdate(); }).catch(() => {}); }
  componentDidMount() {
    this._onInstallReady = () => this.forceUpdate(); window.addEventListener('ff-install-ready', this._onInstallReady);
    const hideSplash = () => { const s = document.getElementById('ff-splash'); if (s) { s.classList.add('ff-hide'); setTimeout(() => { if (s.parentNode) s.parentNode.removeChild(s); }, 500); } };
    if (window.FF) setTimeout(hideSplash, 220); else { let n = 0; const w = setInterval(() => { if (window.FF || ++n > 60) { clearInterval(w); hideSplash(); } }, 50); }
    if (!window.FF) { this.ffPoll = setInterval(() => { if (window.FF) { clearInterval(this.ffPoll); this.forceUpdate(); } }, 50); }
    // ask the browser to keep our storage persistent (not evicted under memory pressure)
    try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist().then(ok => { this._persistent = ok; this.forceUpdate(); }); } catch (e) {}
    // flush immediately when the app goes to background / is closed
    this._flush = () => { if (this.state.db) { try { localStorage.setItem('fitflow.v1', JSON.stringify(this.state.db)); } catch (e) {} this.idbPut(this.state.db); } };
    document.addEventListener('visibilitychange', () => { if (document.hidden) this._flush(); else this.syncWakeLock(); });
    window.addEventListener('pagehide', this._flush);
    // if localStorage was wiped (fresh seed) but the IndexedDB mirror has real data, recover it
    const wasFresh = this._freshSeed;
    const tryRecover = () => this.idbGet().then(rec => {
      if (!rec || !rec.db || !window.FF) return;
      const cur = this.state.db;
      if (cur && cur.resetAt && (!rec.at || new Date(rec.at) <= new Date(cur.resetAt))) return;   // data was deliberately wiped
      const recN = (rec.db.sessions || []).length + ((rec.db.nutrition && rec.db.nutrition.log) || []).length;
      const curN = cur ? (cur.sessions || []).length + ((cur.nutrition && cur.nutrition.log) || []).length : 0;
      if (wasFresh || (!rec.db.seeded && cur && cur.seeded && recN > 0) || recN > curN + 5) {
        this.state.db = FF.normalizeDb(rec.db); this.persist();
        this.setState({ undo: { label: 'Data dipulihkan dari cadangan otomatis (' + new Date(rec.at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) + ')', expireAt: Date.now() + 7000 } });
      }
    });
    setTimeout(tryRecover, 400);
    setTimeout(() => { if (window.FF && this.db()) { this._lastSnap = 0; this.persist(); } }, 1200);
    this.int = setInterval(() => {
      if (this.state.undo && Date.now() > this.state.undo.expireAt) { this.setState({ undo: null }); return; }
      if (this.state.rest) {
        const left = Math.ceil((this.state.rest.endAt - Date.now()) / 1000);
        if (left <= 0) { this.endRest(); } else this.setState({ tick: this.state.tick + 1 });
      } else if (this.state.undo || (this.db() && this.db().activeSession && this.state.tab === 'workout')) this.setState({ tick: this.state.tick + 1 });
    }, 1000);
  }
  componentWillUnmount() { clearInterval(this.int); clearInterval(this.ffPoll); clearTimeout(this._toastT); window.removeEventListener('ff-install-ready', this._onInstallReady); }

  db() {
    if (!this.state.db && window.FF) {
      let db = null;
      try { db = JSON.parse(localStorage.getItem('fitflow.v1')); } catch (e) {}
      // main copy missing/corrupt → fall back to the rolling auto-save snapshot before seeding
      if (!db || db.schema !== 1) { try { const snap = JSON.parse(localStorage.getItem('fitflow.autosave')); if (snap && snap.db && snap.db.schema === 1) { db = snap.db; this._restoredFrom = 'autosave'; } } catch (e) {} }
      if (!db || db.schema !== 1) { db = FF.emptyDb(); this._freshSeed = true; }
      db = FF.normalizeDb(db);
      localStorage.setItem('fitflow.v1', JSON.stringify(db));
      this.state.db = db;
    }
    return this.state.db;
  }
  persist() {
    let json;
    try { json = JSON.stringify(this.state.db); localStorage.setItem('fitflow.v1', json); this._lastSaved = Date.now();
      if (this.state.saveErr) this.setState({ saveErr: null });
    } catch (e) {
      const quota = e && (e.name === 'QuotaExceededError' || e.code === 22);
      this.setState({ saveErr: quota ? 'Penyimpanan HP penuh — data terbaru BELUM tersimpan. Hapus lampiran foto lama atau backup sekarang.' : 'Gagal menyimpan data. Segera backup JSON dari menu More.' });
    }
    // rolling auto-save snapshot (every 10 min) — second copy if the main key is lost/corrupted
    try { if (json && (!this._lastSnap || Date.now() - this._lastSnap > 600000)) { localStorage.setItem('fitflow.autosave', JSON.stringify({ at: new Date().toISOString(), db: this.state.db })); this._lastSnap = Date.now(); } } catch (e) {}
    // durable mirror in IndexedDB (debounced) — survives localStorage clears on most browsers
    clearTimeout(this._idbT); this._idbT = setTimeout(() => this.idbPut(this.state.db), 800);
  }
  idbOpen() { return new Promise((res, rej) => { try { const r = indexedDB.open('fitflow', 1); r.onupgradeneeded = () => r.result.createObjectStore('kv'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); } catch (e) { rej(e); } }); }
  idbPut(db) { this.idbOpen().then(d => { const tx = d.transaction('kv', 'readwrite'); tx.objectStore('kv').put({ at: new Date().toISOString(), db }, 'main'); }).catch(() => {}); }
  idbGet() { return this.idbOpen().then(d => new Promise(res => { const q = d.transaction('kv').objectStore('kv').get('main'); q.onsuccess = () => res(q.result || null); q.onerror = () => res(null); })).catch(() => null); }
  loadRest() { try { const r = JSON.parse(localStorage.getItem('fitflow.rest')); return r && r.endAt > Date.now() ? r : null; } catch (e) { return null; } }
  componentDidUpdate(pp, ps) {
    this.syncWakeLock();
    if (ps && ps.rest !== this.state.rest) { try { if (this.state.rest) localStorage.setItem('fitflow.rest', JSON.stringify(this.state.rest)); else localStorage.removeItem('fitflow.rest'); } catch (e) {} } }
  // keep the screen awake while a workout is in progress; release as soon as it ends
  syncWakeLock() {
    const want = !!(this.state.db && this.state.db.activeSession) && !document.hidden;
    if (want && !this._wl && !this._wlPending && navigator.wakeLock) {
      this._wlPending = true;
      navigator.wakeLock.request('screen').then(l => { this._wl = l; this._wlPending = false; l.addEventListener('release', () => { this._wl = null; }); }).catch(() => { this._wlPending = false; });
    } else if (!want && this._wl) { try { this._wl.release(); } catch (e) {} this._wl = null; }
  }
  mut(fn) { fn(this.state.db); this.persist(); this.forceUpdate(); }

  /* ---- rest timer ---- */
  startRest(sec, name, next) { this.setState({ rest: { endAt: Date.now() + sec * 1000, total: sec, name, next: next || '' } }); }
  endRest() {
    try { navigator.vibrate && navigator.vibrate([180, 80, 180]); } catch (e) {}
    if (this.props.restSound ?? true) { try {
      const ac = new (window.AudioContext || window.webkitAudioContext)(); const o = ac.createOscillator(); const g = ac.createGain();
      o.connect(g); g.connect(ac.destination); o.frequency.value = 880; g.gain.setValueAtTime(0.12, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.5); o.start(); o.stop(ac.currentTime + 0.5);
    } catch (e) {} }
    this.setState({ rest: null });
  }

  /* ---- session flow ---- */
  startSession() {
    const db = this.db(); const rec = this.rec();
    if (rec.kind === 'cardio') { this.setState({ tab: 'workout', cardioFormOpen: true, cf: { ...this.state.cf, type: 'treadmill-run', dur: String(rec.durationMin) } }); return; }
    if (rec.kind === 'muaythai') { this.setState({ tab: 'workout', cardioFormOpen: true, cf: { ...this.state.cf, type: 'muaythai', dur: String(rec.durationMin) } }); return; }
    if (rec.kind === 'recovery') { this.logRecoverySession(rec); return; }
    const active = {
      startedAt: Date.now(), title: rec.focus || rec.type, type: rec.type, locationId: this.state.ctx.locationId,
      readiness: this.state.ctx.readiness, phase: 'warmup', openIdx: 0, rec,
      warmup: (rec.warmup || []).map(w => ({ ...w, done: false })),
      exercises: rec.exercises.map(e => ({ ...e, skipped: false,
        sets: Array.from({ length: e.sets }, () => ({ type: 'working', weight: e.weight, reps: e.repHi, done: false })) })),
    };
    this.mut(db2 => db2.activeSession = active); this.setState({ tab: 'workout' });
  }
  startCustomSession(exIds) {
    const db = this.db();
    const exs = exIds.map(id => {
      const ex = FF.exById(id); if (!ex) return null;
      const prog = FF.progressionFor(db, id);
      return { exId: id, name: ex.name, equip: ex.equip, kind: ex.kind, pat: ex.pat, inc: ex.inc,
        sets: 3, weight: prog.weight, repLo: prog.repLo, repHi: prog.repHi, rest: ex.kind === 'major' ? 120 : 60, note: prog.note };
    }).filter(Boolean);
    if (!exs.length) return;
    const active = {
      startedAt: Date.now(), title: 'Sesi Custom', type: 'Custom', locationId: this.state.ctx.locationId,
      readiness: this.state.ctx.readiness, phase: 'warmup', openIdx: 0, custom: true,
      warmup: FF.warmupFor(exs.map(e => e.pat)).map(w => ({ ...w, done: false })),
      exercises: exs.map(e => ({ ...e, skipped: false,
        sets: Array.from({ length: e.sets }, () => ({ type: 'working', weight: e.weight, reps: e.repHi, done: false })) })),
    };
    this.mut(d => d.activeSession = active);
    this.setState({ tab: 'workout', builderOpen: false, builderPicks: [], builderSearch: '' });
  }
  addExercisesToSession(exIds) {
    const db = this.db();
    this.mut(d => {
      const a = d.activeSession; if (!a) return;
      exIds.forEach(id => {
        if (a.exercises.some(e => e.exId === id)) return;
        const ex = FF.exById(id); if (!ex) return;
        const prog = FF.progressionFor(db, id);
        a.exercises.push({ exId: id, name: ex.name, equip: ex.equip, kind: ex.kind, pat: ex.pat, inc: ex.inc, skipped: false,
          weight: prog.weight, repLo: prog.repLo, repHi: prog.repHi, rest: ex.kind === 'major' ? 120 : 60, note: prog.note,
          sets: Array.from({ length: 3 }, () => ({ type: 'working', weight: prog.weight, reps: prog.repHi, done: false })) });
      });
      a.phase = 'main';
    });
    this.setState({ builderOpen: false, builderPicks: [], builderSearch: '' });
  }
  logRecoverySession(rec) {
    this.mut(db => db.sessions.push({ id: FF.uid(), date: new Date().toISOString(), title: 'Mobility / Recovery', sessionType: 'recovery',
      locationId: this.state.ctx.locationId, durationMin: rec ? rec.durationMin : 25, readiness: this.state.ctx.readiness, feedback: 'pas', status: 'completed', exercises: [], cardio: null }));
    this.setState({ tab: 'history' });
  }
  finishSession(feedback) {
    const db = this.db(); const a = db.activeSession; if (!a) return;
    const raw = Math.round((Date.now() - a.startedAt) / 60000);
    const doneSets = a.exercises.reduce((n, e) => n + e.sets.filter(s => s.done).length, 0);
    // if the session was left open too long, estimate real duration from work done instead of wall-clock
    const dur = raw > 180 ? Math.max(15, Math.min(raw, doneSets * 3 + 10)) : Math.max(5, raw);
    const prevUnlocked = FF.achievementState(db).filter(x => x.unlocked).map(x => x.id);
    const sid = FF.uid();
    const savedEx = a.exercises.filter(e => !e.skipped && e.sets.some(s => s.done)).map(e => ({ exId: e.exId, name: e.name, fb: e.fb || null, sets: e.sets.filter(s => s.done) }));
    if (!savedEx.length) {
      this.ask('Belum ada set yang selesai. Buang sesi ini tanpa menyimpan?', 'Buang sesi', () => { this.mut(d => d.activeSession = null); this.setState({ fbOpen: false, rest: null, fbNote: '' }); }); return;
    }
    const note = (this.state.fbNote || '').trim().slice(0, 400);
    this.mut(d => {
      d.sessions.push({ id: sid, date: new Date().toISOString(), title: a.title, sessionType: 'strength', locationId: a.locationId,
        durationMin: dur, readiness: a.readiness, feedback, status: 'completed', note: note || null,
        exercises: savedEx, cardio: null });
      d.readinessLog.push({ date: new Date().toISOString(), readiness: a.readiness, soreness: this.state.ctx.soreness });
      d.activeSession = null;
    });
    // build celebration payload
    const db2 = this.state.db;
    const tonnage = savedEx.reduce((b, e) => b + FF.setTonnage(db2, e.exId, e.sets), 0);
    const setsN = savedEx.reduce((n, e) => n + e.sets.filter(x => x.type === 'working').length, 0);
    const prs = FF.sessionPRs(db2, sid);
    const un = FF.newlyUnlocked(db2, prevUnlocked);
    const st = FF.streakInfo(db2);
    this.celebrate({ sid, title: a.title, dur, tonnage, setsN, exCount: savedEx.length, prs, fresh: un.fresh, streak: st.current, kind: 'strength' });
    this.setState({ fbOpen: false, rest: null, fbNote: '' });
  }
  celebrate(payload) {
    this.setState({ celebration: payload });
    try { navigator.vibrate && navigator.vibrate([40, 60, 40, 60, 120]); } catch (e) {}
    if (this.props.restSound ?? true) { try {
      const ac = new (window.AudioContext || window.webkitAudioContext)();
      [523, 659, 784, 1047].forEach((f, i) => { const o = ac.createOscillator(); const g = ac.createGain(); o.connect(g); g.connect(ac.destination); o.frequency.value = f; const t = ac.currentTime + i * 0.11; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.14, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28); o.start(t); o.stop(t + 0.3); });
    } catch (e) {} }
  }

  /* ---- recommendation (cached per render inputs) ---- */
  rec() {
    const db = this.db(); const key = JSON.stringify([this.state.ctx, db.sessions.length, db.equipment.filter(e => !e.available).length]);
    if (this._recKey !== key) { this._rec = FF.recommend(db, this.state.ctx); this._recKey = key; this._recAlt = 0; }
    return this._rec;
  }
  pickAlternative(rec) {
    this._rec = rec;
    this._recKey = JSON.stringify([this.state.ctx, this.db().sessions.length, this.db().equipment.filter(e => !e.available).length]);
    this.setState({ altOpen: false });
  }

  printReport(rp) {
    const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const row = (k, v) => '<tr><td style="padding:6px 10px;border-bottom:1px solid #e3ddd2;color:#6b635a">' + esc(k) + '</td><td style="padding:6px 10px;border-bottom:1px solid #e3ddd2;text-align:right;font-weight:600">' + esc(v) + '</td></tr>';
    const li = a => a.map(x => '<li style="margin:4px 0;line-height:1.5">' + esc(x) + '</li>').join('');
    const top = rp.topEx.map(e => '<tr><td style="padding:5px 10px;border-bottom:1px solid #eee">' + esc(e.name) + ' ×' + e.count + '</td><td style="padding:5px 10px;border-bottom:1px solid #eee;text-align:right">' + e.first + ' → ' + e.last + ' kg</td></tr>').join('');
    const html = '<!doctype html><html><head><meta charset="utf-8"><title>FitFlow — Laporan ' + esc(rp.label) + '</title>' +
      '<style>@page{margin:18mm}body{font-family:Georgia,serif;color:#1a1712;max-width:720px;margin:0 auto;padding:24px}h1{font-size:26px;margin:0}h2{font-size:14px;letter-spacing:.12em;text-transform:uppercase;color:#8a7b5c;margin:26px 0 8px;border-bottom:2px solid #cbb787;padding-bottom:4px}.sub{color:#6b635a;font-size:13px}table{width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:13px}.sum{background:#f6f2e9;border-left:3px solid #cbb787;padding:14px 16px;line-height:1.7;font-size:14px;margin-top:10px}.disc{color:#8a8378;font-size:11px;margin-top:26px;line-height:1.5}ul{font-family:Arial,sans-serif;font-size:13px;padding-left:20px}</style></head><body>' +
      '<div style="display:flex;justify-content:space-between;align-items:baseline"><h1>Fit<span style="color:#b8912f">Flow</span></h1><span class="sub">Laporan bulanan · ' + esc(rp.label) + '</span></div>' +
      '<div class="sum">' + esc(rp.summary) + '</div>' +
      '<h2>Ringkasan</h2><table>' + row('Total sesi', rp.sessions + ' (' + rp.strength + ' strength · ' + rp.cardio + ' cardio · ' + rp.muaythai + ' Muay Thai · ' + rp.recovery + ' recovery)') +
      row('Total durasi', rp.totalMin + ' menit') + row('Working set', rp.setCount) +
      row('Berat (avg 7 hari)', (rp.wStart != null ? rp.wStart + ' → ' + rp.wEnd + ' kg' : '—')) +
      row('Lingkar perut', (rp.waistStart != null ? rp.waistStart + ' → ' + (rp.waistEnd ?? '—') + ' cm' : '—')) +
      row('Cardio', rp.carMin + ' menit · ' + rp.carKm + ' km') + '</table>' +
      (top ? '<h2>Progres kekuatan</h2><table>' + top + '</table>' : '') +
      '<h2>Rekomendasi bulan depan</h2><ul>' + li(rp.recs) + '</ul>' +
      '<p class="disc">Laporan ini merupakan ringkasan aktivitas kebugaran dan bukan diagnosis atau pengganti evaluasi dokter, fisioterapis, atau tenaga kesehatan.</p>' +
      '</body></html>';
    const w = window.open('', '_blank');
    if (!w) { this.toast('Popup diblokir. Izinkan popup untuk mencetak laporan.'); return; }
    w.document.write(html); w.document.close(); w.focus();
    setTimeout(() => { try { w.print(); } catch (e) {} }, 350);
  }

  /* ---- downloads ---- */
  download(name, content, mime) {
    const blob = new Blob([content], { type: mime || 'text/plain' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }

  hexA(hex, a) { const h = String(hex).replace('#', ''); if (h.length !== 6) return hex; return 'rgba(' + parseInt(h.slice(0, 2), 16) + ',' + parseInt(h.slice(2, 4), 16) + ',' + parseInt(h.slice(4, 6), 16) + ',' + a + ')'; }

  chip(active, color) {
    return 'min-height:44px; padding:10px 14px; border-radius:999px; font-size:13.5px; cursor:pointer; transition:all 140ms;' +
      (active ? 'border:1px solid ' + (color || 'var(--border-warm)') + '; background:var(--interactive-warm-soft); color:var(--gold-300); font-weight:600;'
              : 'border:1px solid var(--border-subtle); background:var(--surface-warm-card); color:var(--text-secondary);');
  }

  nutritionVals(set) {
    const db = this.db(); const now = new Date(); const S = this.state;
    const dayT = FF.nutritionDayTarget(db);
    const kcalTarget = dayT.kcal, pTarget = dayT.protein, cTarget = dayT.carb, fTarget = dayT.fat;
    const todayLog = FF.nutToday(db).slice().sort((a, b) => new Date(a.at) - new Date(b.at));
    const tot = FF.nutritionTotals(todayLog);
    const kcal = Math.round(tot.kcal), pSum = Math.round(tot.p), cSum = Math.round(tot.c), fSum = Math.round(tot.f);
    const kcalLeft = Math.max(0, kcalTarget - kcal);
    const over = kcal > kcalTarget;
    const pct = (v, t) => Math.min(100, Math.round(v / t * 100));
    const bar = (v, t, col) => 'display:block; height:100%; width:' + pct(v, t) + '%; background:' + col + '; border-radius:99px;';
    const macros = [
      { label: 'Protein', val: pSum, target: pTarget, color: 'var(--gold-300)', barStyle: bar(pSum, pTarget, 'var(--gold-500)') },
      { label: 'Karbo', val: cSum, target: cTarget, color: 'var(--cobalt-400)', barStyle: bar(cSum, cTarget, 'var(--cobalt-400)') },
      { label: 'Lemak', val: fSum, target: fTarget, color: '#c17a45', barStyle: bar(fSum, fTarget, '#c17a45') },
    ];
    const rWid = 33, cWid = 2 * Math.PI * rWid, fillW = Math.min(1, kcal / kcalTarget) * cWid;
    const rHero = 50, cHero = 2 * Math.PI * rHero, fillH = Math.min(1, kcal / kcalTarget) * cHero;

    const foods = (db.nutrition.foods || []);
    const foodById = id => foods.find(f => f.id === id);

    // ----- portion picker -----
    const pick = S.nutPick ? foodById(S.nutPick) || S.nutPick : null;
    const isGram = pick && pick.grams;
    const qty = S.nutPickQty != null ? S.nutPickQty : (isGram ? 100 : 1);
    const addonIds = S.nutPickAddons || [];
    const ADDON_BY_CAT = {
      dimsum: ['bumbu-kacang-sate', 'kecap-manis', 'chili-oil', 'mayo'],
      padang: ['sambal-minyak', 'sambal-hijau', 'kecap-manis', 'kerupuk'],
      ayam: ['sambal-minyak', 'kecap-manis', 'kerupuk', 'nasi-putih'],
      karbo: ['sambal-botol', 'kecap-manis', 'kerupuk', 'bawang-goreng'],
      kuah: ['sambal-botol', 'kecap-manis', 'kerupuk', 'chili-oil'],
      steak: ['butter', 'saus-tomat', 'mayo', 'kentang-goreng'],
      protein: ['sambal-botol', 'kecap-manis', 'minyak-sdt'],
      nabati: ['sambal-botol', 'kecap-manis', 'minyak-sdt'],
      steakpasta: ['butter', 'saus-tomat'],
    };
    const mult = isGram ? qty / 100 : qty;
    const addonFoods = addonIds.map(foodById).filter(Boolean);
    const pickKcal = pick ? Math.round(pick.kcal * mult + addonFoods.reduce((a, x) => a + x.kcal, 0)) : 0;
    const pickP = pick ? Math.round(pick.p * mult + addonFoods.reduce((a, x) => a + x.p, 0)) : 0;
    const pickC = pick ? Math.round(pick.c * mult + addonFoods.reduce((a, x) => a + x.c, 0)) : 0;
    const pickF = pick ? Math.round(pick.f * mult + addonFoods.reduce((a, x) => a + x.f, 0)) : 0;
    const openPicker = (f) => set({ nutPick: f.id, nutPickQty: f.grams ? 100 : 1, nutPickAddons: [], nutSearchOpen: false });
    const restaurantCat = pick && ['padang', 'kuah', 'dimsum', 'steak'].includes(pick.cat);

    const logFood = (f, m) => { const k = m || 1;
      this.mut(d => d.nutrition.log.push({ id: FF.uid(), at: new Date().toISOString(), foodId: f.id || null, name: f.name, icon: f.icon || '🍽️',
        kcal: Math.round((f.kcal || 0) * k), p: +((f.p || 0) * k).toFixed(0), c: +((f.c || 0) * k).toFixed(0), f: +((f.f || 0) * k).toFixed(0) }));
      set({ nutFlash: f.name }); setTimeout(() => { if (this.state.nutFlash === f.name) set({ nutFlash: null }); }, 1600);
    };

    // ----- recents (distinct foods from log) + category-scoped list -----
    const logHist = (db.nutrition.log || []).slice().sort((a, b) => new Date(b.at) - new Date(a.at));
    const seenR = {}; const recents = [];
    for (const e of logHist) { const f = foodById(e.foodId); if (f && !f.addon && !seenR[f.id]) { seenR[f.id] = 1; recents.push(f); } if (recents.length >= 6) break; }
    if (!recents.length) foods.filter(f => f.fav).slice(0, 6).forEach(f => recents.push(f));
    const nutRecents = recents.map(f => ({ icon: f.icon, name: f.name.replace(/ \(.*\)$/, ''), p: f.p, onTap: () => openPicker(f) }));

    const cat = S.nutCat || 'all';
    const q = (S.nutSearch || '').trim().toLowerCase();
    const catChips = [['all', 'Semua']].concat(FF.FOOD_CATS).map(([id, label]) => ({
      label, onTap: () => set({ nutCat: id }),
      style: 'min-height:34px; padding:7px 13px; border-radius:999px; font-size:12.5px; cursor:pointer; white-space:nowrap;' +
        (cat === id ? 'border:1px solid var(--border-warm); background:var(--interactive-warm-soft); color:var(--gold-300); font-weight:600;' : 'border:1px solid var(--border-subtle); background:var(--surface-warm-card); color:var(--text-secondary);'),
    }));
    let listFoods = foods.filter(f => !f.addon || cat === 'bumbu');
    if (q) listFoods = foods.filter(f => f.name.toLowerCase().includes(q));
    else if (cat !== 'all') listFoods = listFoods.filter(f => f.cat === cat);
    const nutFoodList = listFoods.slice(0, q ? 40 : 60).map(f => {
      const hh = FF.healthOf({ foodId: f.id, name: f.name });
      return {
        icon: f.icon, name: f.name, unit: f.unit || '1 porsi', kcal: f.kcal, p: f.p, onTap: () => openPicker(f),
        isCustom: !f.seed,
        onDelFood: (ev) => { if (ev && ev.stopPropagation) ev.stopPropagation(); const snap = { ...f }; this.mut(d => d.nutrition.foods = d.nutrition.foods.filter(x => x.id !== f.id)); set({ undo: { label: 'Makanan "' + f.name + '" dihapus', foodEntry: snap, expireAt: Date.now() + 6000 } }); },
        healthTag: (hh.purine >= 2 ? 'purin' : '') + (hh.purine >= 2 && hh.ldl >= 2 ? ' · ' : '') + (hh.ldl >= 2 ? 'LDL' : ''),
        hasHealthTag: hh.purine >= 2 || hh.ldl >= 2,
      };
    });

    const slotOf = (at) => { const h = new Date(at).getHours(); return h < 10 ? 0 : h < 15 ? 1 : h < 18 ? 2 : 3; };
    const SLOT_LABEL = ['sarapan', 'makan siang', 'snack sore', 'makan malam'];
    const sortedLog = todayLog.slice().sort((a, b) => new Date(a.at) - new Date(b.at));
    const slotSums = {}; sortedLog.forEach(e => { const s = slotOf(e.at); slotSums[s] = slotSums[s] || { k: 0, p: 0 }; slotSums[s].k += e.kcal || 0; slotSums[s].p += e.p || 0; });
    const entries = sortedLog.map((e, idx) => ({
      slotHead: idx === 0 || slotOf(sortedLog[idx - 1].at) !== slotOf(e.at),
      slotLabel: SLOT_LABEL[slotOf(e.at)], slotSum: Math.round(slotSums[slotOf(e.at)].k) + ' kkal · ' + Math.round(slotSums[slotOf(e.at)].p) + 'p',
      icon: e.icon, name: e.name, time: new Date(e.at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      kcal: e.kcal, p: e.p, c: e.c, f: e.f,
      time24: (() => { const t = new Date(e.at); return String(t.getHours()).padStart(2, '0') + ':' + String(t.getMinutes()).padStart(2, '0'); })(),
      onTime: (ev) => { const m = /^(\d{1,2}):(\d{2})$/.exec(ev.target.value || ''); if (!m) return; this.mut(d => { const x = d.nutrition.log.find(q => q.id === e.id); if (x) { const t = new Date(x.at); t.setHours(+m[1], +m[2], 0, 0); x.at = t.toISOString(); } }); },
      onDelete: () => { const snap = e; this.mut(d => d.nutrition.log = d.nutrition.log.filter(x => x.id !== snap.id));
        set({ undo: { label: snap.name + ' dihapus', nutEntry: snap, expireAt: Date.now() + 6000 } }); },
    }));

    const wk = FF.nutritionWeek(db);
    const wkDays = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'];
    const week = wk.map(d => {
      const h = Math.round(Math.min(100, d.protein / d.target * 100));
      const col = d.today ? 'var(--gold-400)' : !d.logged ? 'var(--surface-warm-raised)' : d.hit ? 'var(--data-positive)' : 'var(--warning)';
      return { day: wkDays[d.date.getDay()], barStyle: 'display:block; width:100%; height:' + Math.max(6, h) + '%; border-radius:8px 8px 0 0; background:' + col + ';' + (d.today ? ' opacity:0.75;' : ''),
        labelColor: d.today ? 'var(--gold-400)' : d.hit ? 'var(--data-positive)' : 'var(--text-faint)' };
    });
    const hitDays = wk.slice(0, 6).filter(d => d.hit).length;
    const pLeft = Math.max(0, pTarget - pSum);
    // insight: suggest protein sources to close the gap
    let insight;
    if (pLeft <= 0) insight = 'Target protein tercapai ✓';
    else { const whey = foods.find(f => f.id === 'whey-truiso'); const egg = foods.find(f => f.id === 'telur-rebus');
      const scoops = whey ? Math.round(pLeft / whey.p * 10) / 10 : 0;
      insight = 'Protein ' + pLeft + 'g lagi — ±' + (whey ? scoops + ' scoop whey' : (egg ? Math.ceil(pLeft / egg.p) + ' telur' : 'tambah sumber protein')) + '.';
    }

    return {
      goNutrition: () => set({ tab: 'nutrition' }), nutBack: () => set({ tab: 'home' }),
      nutTodayStr: now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' }),
      nutKcal: kcal, nutKcalTarget: kcalTarget, nutKcalLeft: over ? 0 : kcalLeft,
      nutRingDash: fillW.toFixed(0) + ' ' + (cWid - fillW).toFixed(0),
      nutHeroDash: fillH.toFixed(0) + ' ' + (cHero - fillH).toFixed(0),
      nutMacros: macros,
      nutInsight: this.state.nutFlash ? '✓ ' + this.state.nutFlash + ' ditambahkan' : (pLeft > 0 ? 'Protein ' + pLeft + 'g lagi ke target' : 'Target protein tercapai ✓'),
      nutDayNote: dayT.heavy ? 'Hari latihan berat — budget +' + dayT.bump + ' kkal dari engine.' : 'Hari istirahat — target ' + (dayT.goal === 'muscle' ? 'surplus kecil' : dayT.goal === 'fit' ? 'maintenance' : dayT.goal === 'fatloss' ? 'defisit' : 'defisit ringan') + ' untuk ' + (dayT.goalShort || 'recomposition') + '.',
      nutHasRecents: nutRecents.length > 0, nutRecents,
      nutSearchOpen: !!S.nutSearchOpen,
      nutOpenSearch: () => set({ nutSearchOpen: true, nutSearch: '', nutCat: 'all' }),
      nutCloseSearch: () => set({ nutSearchOpen: false }),
      nutRecentHint: nutRecents.length ? nutRecents.length + ' sering dipakai' : '',
      nutShowRecents: nutRecents.length > 0 && !q && (S.nutCat || 'all') === 'all',
      nutSearch: S.nutSearch || '', nutSetSearch: (e) => set({ nutSearch: e.target.value }),
      nutCatChips: catChips, nutFoodList, nutListEmpty: nutFoodList.length === 0,
      nutAddCustom: () => set({ nutFormOpen: true, nutSearchOpen: false }),
      nutPickOpen: !!pick, nutPickClose: () => set({ nutPick: null }),
      nutPickIcon: pick ? pick.icon : '', nutPickName: pick ? pick.name : '', nutPickUnit: pick ? (pick.unit || '1 porsi') : '',
      nutPickEstimate: restaurantCat,
      nutPickQty: isGram ? qty + ' g' : String(qty),
      nutPickQtyLabel: isGram ? 'Berat' : 'Jumlah porsi',
      nutQtyDown: () => set({ nutPickQty: Math.max(isGram ? 10 : 1, qty - (isGram ? 10 : 1)) }),
      nutQtyUp: () => set({ nutPickQty: qty + (isGram ? 10 : 1) }),
      nutQtyPresets: (isGram ? [50, 100, 150, 200] : [1, 2, 3, 5]).map(v => ({
        label: isGram ? v + 'g' : '×' + v, onTap: () => set({ nutPickQty: v }),
        style: 'flex:1; height:34px; border-radius:8px; font-size:12px; cursor:pointer; font-family:var(--font-mono);' +
          (qty === v ? 'border:1px solid var(--border-warm); background:var(--interactive-warm-soft); color:var(--gold-300);' : 'border:1px solid var(--border-subtle); background:transparent; color:var(--text-muted);'),
      })),
      nutHasAddons: pick && !pick.addon && (ADDON_BY_CAT[pick.cat] || []).length > 0,
      nutAddons: pick ? (ADDON_BY_CAT[pick.cat] || []).map(foodById).filter(Boolean).map(a => ({
        label: a.name, kcal: a.kcal,
        onTap: () => { const cur = S.nutPickAddons || []; set({ nutPickAddons: cur.includes(a.id) ? cur.filter(x => x !== a.id) : [...cur, a.id] }); },
        style: 'padding:8px 12px; border-radius:999px; font-size:12px; cursor:pointer;' +
          (addonIds.includes(a.id) ? 'border:1px solid var(--gold-500); background:var(--interactive-warm-soft); color:var(--gold-300);' : 'border:1px solid var(--border-subtle); background:var(--surface-warm-card); color:var(--text-secondary);'),
      })) : [],
      nutPickKcal: pickKcal, nutPickP: pickP, nutPickC: pickC, nutPickF: pickF,
      nutPickAdd: () => { if (!pick) return;
        this.mut(d => {
          const label = pick.name + (addonFoods.length ? ' +' + addonFoods.length : '') + (mult !== 1 ? (isGram ? ' (' + qty + 'g)' : ' ×' + qty) : '');
          d.nutrition.log.push({ id: FF.uid(), at: new Date().toISOString(), foodId: pick.id || null, name: label, icon: pick.icon || '🍽️',
            kcal: pickKcal, p: pickP, c: pickC, f: pickF });
        });
        set({ nutFlash: pick.name, nutPick: null });
        setTimeout(() => { if (this.state.nutFlash === pick.name) set({ nutFlash: null }); }, 1600); },
      nutEntries: entries, nutEntryCount: entries.length, nutHasEntries: entries.length > 0,
      ...(() => {
        // copy yesterday's meals (same foods, same clock times, dated today) — only offered when today is empty
        const yd = new Date(Date.now() - 864e5).toDateString();
        const yLog = (db.nutrition.log || []).filter(e => new Date(e.at).toDateString() === yd);
        const yK = Math.round(yLog.reduce((a, e) => a + (e.kcal || 0), 0));
        return {
          nutCanRepeat: todayLog.length === 0 && yLog.length > 0,
          nutRepeatLabel: 'Ulangi makanan kemarin (' + yLog.length + ' item · ' + yK + ' kkal)',
          nutRepeatYesterday: () => this.mut(d => { yLog.forEach(e => { const t = new Date(e.at); const n = new Date(); n.setHours(t.getHours(), t.getMinutes(), 0, 0); d.nutrition.log.push({ ...e, id: FF.uid(), at: n.toISOString() }); }); }),
        };
      })(),
      nutWeek: week, nutProteinStreak: FF.nutritionProteinStreak(db),
      ...(function () {
        const macro = (v, t, label, unit) => { const p = t > 0 ? v / t : 0; return { label, v, t, pct: Math.round(p * 100), over: v > t, near: p >= 0.85 && v <= t }; };
        const P = macro(pSum, pTarget, 'protein'), C = macro(cSum, cTarget, 'karbo'), F = macro(fSum, fTarget, 'lemak'), K = macro(kcal, kcalTarget, 'kalori');
        const flags = [];
        // avoid-guidance keyed by which macro is over/near
        if (F.over || F.near) flags.push({ tone: F.over ? 'over' : 'near', text: (F.over ? 'Lemak sudah lewat target' : 'Lemak hampir penuh') + ' (' + fSum + '/' + fTarget + 'g). Hindari gorengan, santan, kulit ayam, keju, mayo. Pilih rebus/bakar/kukus & protein tanpa lemak (dada ayam, putih telur, ikan kukus).' });
        if (C.over || C.near) flags.push({ tone: C.over ? 'over' : 'near', text: (C.over ? 'Karbo sudah lewat target' : 'Karbo hampir penuh') + ' (' + cSum + '/' + cTarget + 'g). Kurangi nasi, mie, roti, gula & minuman manis. Tambah protein & sayur.' });
        if (K.over) flags.push({ tone: 'over', text: 'Total kalori sudah lewat target (' + kcal + '/' + kcalTarget + '). Bila masih lapar, pilih tinggi-protein rendah-kalori: putih telur, dada ayam, yogurt plain, sayur.' });
        // protein still needed → positive nudge
        if (!P.over && P.pct < 85) flags.push({ tone: 'good', text: 'Protein masih kurang ' + Math.max(0, pTarget - pSum) + 'g. Prioritaskan dada ayam, telur, ikan, tempe, whey.' });
        return {
          nutFlags: flags.map(fl => ({ text: fl.text,
            boxStyle: 'display:flex; align-items:flex-start; gap:8px; font-size:12px; line-height:1.5; padding:9px 12px; border-radius:var(--radius-sm); border:1px solid ' + (fl.tone === 'over' ? 'rgba(199,68,54,0.4)' : fl.tone === 'near' ? 'rgba(232,161,60,0.4)' : fl.tone === 'good' ? 'rgba(23,181,115,0.35)' : 'var(--border-subtle)') + '; background:' + (fl.tone === 'over' ? 'rgba(199,68,54,0.07)' : fl.tone === 'near' ? 'rgba(232,161,60,0.07)' : fl.tone === 'good' ? 'rgba(23,181,115,0.06)' : 'transparent') + '; color:var(--text-secondary);',
            dotStyle: 'width:6px; height:6px; border-radius:99px; flex:none; margin-top:5px; background:' + (fl.tone === 'over' ? 'var(--data-negative)' : fl.tone === 'near' ? 'var(--warning)' : fl.tone === 'good' ? 'var(--data-positive)' : 'var(--text-faint)') + ';' })),
          nutHasFlags: flags.length > 0,
          nutMacroChips: [P, C, F].map(m => ({ label: m.label, txt: m.v + '/' + m.t + 'g',
            style: 'font-family:var(--font-mono); font-size:10px; padding:5px 10px; border-radius:999px; white-space:nowrap; border:1px solid ' + (m.over ? 'rgba(199,68,54,0.5)' : m.near ? 'rgba(232,161,60,0.5)' : 'var(--border-subtle)') + '; color:' + (m.over ? 'var(--data-negative)' : m.near ? 'var(--warning)' : 'var(--text-muted)') + '; background:' + (m.over ? 'rgba(199,68,54,0.08)' : m.near ? 'rgba(232,161,60,0.08)' : 'transparent') + ';' })),
        };
      })(),
      ...(function () {
        const h = FF.healthLoad(db);
        const hf = [];
        if (h.ldlHigh) hf.push({ tone: 'over', text: 'Asupan tinggi lemak jenuh/kolesterol hari ini sudah tinggi (' + h.ldlFoods.slice(0, 3).join(', ') + '). Untuk LDL: hindari gorengan, jeroan, santan kental, daging berlemak, kulit & keju. Pilih ikan, dada ayam tanpa kulit, tahu/tempe rebus, sayur.' });
        else if (h.ldlNear) hf.push({ tone: 'near', text: 'Lemak jenuh mulai menumpuk hari ini. Untuk LDL: batasi tambahan gorengan/santan/jeroan berikutnya.' });
        if (h.purineHigh) hf.push({ tone: 'over', text: 'Asupan tinggi purin hari ini sudah tinggi (' + h.purineFoods.slice(0, 3).join(', ') + '). Untuk asam urat: hindari jeroan, kaldu kental, kambing, seafood (udang/cumi/kerang), teri & emping. Perbanyak air putih.' });
        else if (h.purineNear) hf.push({ tone: 'near', text: 'Purin mulai menumpuk hari ini. Untuk asam urat: batasi tambahan seafood/jeroan/kambing & perbanyak air putih.' });
        return {
          nutHealthFlags: hf.map(fl => ({ text: fl.text,
            boxStyle: 'display:flex; align-items:flex-start; gap:8px; font-size:12px; line-height:1.5; padding:9px 12px; border-radius:var(--radius-sm); border:1px solid ' + (fl.tone === 'over' ? 'rgba(199,68,54,0.45)' : 'rgba(232,161,60,0.45)') + '; background:' + (fl.tone === 'over' ? 'rgba(199,68,54,0.09)' : 'rgba(232,161,60,0.08)') + '; color:var(--text-secondary);',
            dotStyle: 'width:6px; height:6px; border-radius:99px; flex:none; margin-top:5px; background:' + (fl.tone === 'over' ? 'var(--data-negative)' : 'var(--warning)') + ';' })),
          nutHasHealthFlags: hf.length > 0,
        };
      })(),
      nutWeekNote: (function () { const logged = wk.slice(0, 6).filter(d => d.logged).length;
        if (!logged) return 'Belum ada hari tercatat minggu ini. Catat makanan untuk melihat konsistensi protein (target ' + pTarget + 'g).';
        return hitDays + ' dari ' + logged + ' hari tercatat (6 hari terakhir) mencapai target protein ' + pTarget + 'g. ' + (hitDays >= Math.min(4, logged) ? 'Konsistensi bagus — pertahankan.' : 'Tingkatkan asupan protein harian.'); })(),
      ...(function () {
        const di = FF.deficitInsight(db);
        if (!di) return { defShow: false };
        const vColor = { 'on-track': 'var(--data-positive)', slower: 'var(--warning)', faster: 'var(--orange-500)', tracking: 'var(--gold-400)', 'no-weight': 'var(--text-secondary)' }[di.verdict] || 'var(--gold-400)';
        const vGlow = { 'on-track': 'rgba(23,181,115,0.18)', slower: 'rgba(232,161,60,0.18)', faster: 'rgba(214,109,79,0.18)' }[di.verdict] || 'rgba(232,161,60,0.14)';
        const vBorder = { 'on-track': 'rgba(23,181,115,0.35)', slower: 'rgba(232,161,60,0.35)', faster: 'rgba(214,109,79,0.35)' }[di.verdict] || 'var(--border-subtle)';
        if (!di.ready) return { defShow: true, defReady: false, defNote: 'Catat makanan minimal 4 hari untuk analisis laju defisit (' + (di.loggedDays || 0) + '/4 hari tercatat).', defMeta: '', defBorder: 'var(--border-subtle)', defGlow: 'rgba(232,161,60,0.1)' };
        return {
          defShow: true, defReady: di.actualDeficit != null, defColor: vColor, defBorder: vBorder, defGlow: vGlow,
          defPlanned: (di.plannedRate > 0 ? '−' : '+') + Math.abs(di.plannedRate).toFixed(2),
          defActual: di.actualRate == null ? '—' : (di.actualRate > 0 ? '−' : '+') + Math.abs(di.actualRate).toFixed(2),
          defNote: di.note,
          defMeta: 'intake ' + di.avgIntake + ' · TDEE ' + di.tdee + ' kkal · ' + di.loggedDays + ' hari tercatat' + (di.spanDays ? ' · berat ' + (di.wChange > 0 ? '+' : '') + di.wChange + ' kg/' + di.spanDays + 'h' : ''),
        };
      })(),
      nutTargetSource: dayT.source === 'manual' ? 'target manual' : 'target otomatis · TDEE ' + dayT.tdee + ' kkal',
      tgtBtnLabel: dayT.source === 'manual' ? 'Manual ·' : 'Otomatis ·',
      tgtEditOpen: !!S.tgtEditOpen,
      tgtOpen: () => { const t = FF.nutritionTargets(db); set({ tgtEditOpen: true, tgtP: String(t.protein), tgtC: String(t.carb), tgtF: String(t.fat) }); },
      tgtClose: () => set({ tgtEditOpen: false }),
      tgtP: S.tgtP ?? '', tgtC: S.tgtC ?? '', tgtF: S.tgtF ?? '',
      tgtSetP: (e) => set({ tgtP: e.target.value }), tgtSetC: (e) => set({ tgtC: e.target.value }), tgtSetF: (e) => set({ tgtF: e.target.value }),
      tgtKcal: Math.round((parseFloat(S.tgtP) || 0) * 4 + (parseFloat(S.tgtC) || 0) * 4 + (parseFloat(S.tgtF) || 0) * 9),
      tgtHint: (function () { const w = (db.bodyMetrics.slice().sort((a, b) => new Date(b.measuredAt) - new Date(a.measuredAt))[0] || {}).weightKg || db.targets.weightKg || 70; const p = parseFloat(S.tgtP) || 0; return 'Patokan: protein ' + (w * 1.6).toFixed(0) + '–' + (w * 2.2).toFixed(0) + ' g, lemak ≥ ' + (w * 0.6).toFixed(0) + ' g. Protein-mu kini ' + (p / w).toFixed(1) + ' g/kg.'; })(),
      tgtSave: () => { this.mut(d => FF.setMacroTargets(d, { protein: parseFloat(S.tgtP) || 0, carb: parseFloat(S.tgtC) || 0, fat: parseFloat(S.tgtF) || 0 })); set({ tgtEditOpen: false }); },
      tgtReset: () => { this.mut(d => FF.setMacroTargets(d, null)); set({ tgtEditOpen: false }); },
      ...(function () {
        const bmr = dayT.bmr, maint = dayT.tdee, target = dayT.kcal, intake = kcal;
        const scaleMax = Math.max(maint * 1.15, intake * 1.05, 1);
        const pctOf = v => Math.min(100, Math.max(0, v / scaleMax * 100));
        const mark = (v, color, tall) => 'position:absolute; left:' + pctOf(v).toFixed(1) + '%; top:' + (tall ? '8px' : '11px') + '; width:2px; height:' + (tall ? '18px' : '12px') + '; background:' + color + '; transform:translateX(-1px); border-radius:2px;';
        const def = maint - target;
        return {
          enBmr: bmr, enMaint: maint, enTarget: target, enDeficit: (def >= 0 ? '−' : '+') + Math.abs(def) + ' kkal', enDeficitLabel: def > 0 ? 'defisit −' + def + ' kkal' : def < 0 ? 'surplus +' + Math.abs(def) + ' kkal' : 'maintenance',
          enFillStyle: 'height:100%; width:' + pctOf(intake).toFixed(1) + '%; background:' + (intake > maint ? 'var(--data-negative)' : intake > target ? 'var(--warning)' : 'var(--data-positive)') + '; opacity:0.9;',
          enBmrMark: mark(bmr, 'var(--steel-400, #8a8f98)'), enTargetMark: mark(target, 'var(--gold-400)', true), enMaintMark: mark(maint, 'var(--cobalt-400)'),
          enIntakeMark: 'position:absolute; left:' + pctOf(intake).toFixed(1) + '%; top:0; width:2px; height:6px; background:#fff; transform:translateX(-1px); border-radius:2px;',
          enStatus: intake === 0 ? 'belum ada intake' : intake <= target ? 'di bawah target ✓' : intake <= Math.max(maint, target) ? 'di atas target' : 'di atas maintenance',
          enNote: 'BMR = kalori istirahat total. Maintenance (TDEE) = BMR + aktivitas. ' + (def > 0 ? 'Target = maintenance − defisit ' + def + ' kkal → turun ±' + (def * 7 / 7700).toFixed(2) + ' kg/minggu.' : def < 0 ? 'Target = maintenance + surplus ' + Math.abs(def) + ' kkal → naik ±' + (Math.abs(def) * 7 / 7700).toFixed(2) + ' kg/minggu (sebagian jadi otot bila latihan konsisten).' : 'Target = maintenance.'),
        };
      })(),
      nutEmpty: entries.length === 0,
      nutFormOpen: !!S.nutFormOpen, nutFormClose: () => set({ nutFormOpen: false }), nutFormStop: (e) => e.stopPropagation(),
      nutFName: S.nutFName || '', nutFP: S.nutFP || '', nutFC: S.nutFC || '', nutFF: S.nutFF || '',
      nutFSetName: (e) => set({ nutFName: e.target.value }), nutFSetP: (e) => set({ nutFP: e.target.value }),
      nutFSetC: (e) => set({ nutFC: e.target.value }), nutFSetF: (e) => set({ nutFF: e.target.value }),
      nutFKcal: Math.round((parseFloat(S.nutFP) || 0) * 4 + (parseFloat(S.nutFC) || 0) * 4 + (parseFloat(S.nutFF) || 0) * 9),
      nutFSave: () => { const name = (S.nutFName || '').trim().slice(0, 60);
        const p = FF.clamp(S.nutFP, 0, 400, 0), c = FF.clamp(S.nutFC, 0, 600, 0), f = FF.clamp(S.nutFF, 0, 300, 0);
        if (!name || (p + c + f) === 0) { set({ nutFlash: null }); return; }
        const food = { id: FF.uid(), name, icon: '🍽️', cat: 'protein', unit: '1 porsi', grams: false, p: Math.round(p), c: Math.round(c), f: Math.round(f), kcal: Math.round(p * 4 + c * 4 + f * 9), fav: true, seed: false };
        this.mut(d => { d.nutrition.foods.push(food); d.nutrition.log.push({ id: FF.uid(), at: new Date().toISOString(), foodId: food.id, name: food.name, icon: food.icon, kcal: food.kcal, p: food.p, c: food.c, f: food.f }); });
        set({ nutFormOpen: false, nutFName: '', nutFP: '', nutFC: '', nutFF: '' }); },
    };
  }

  renderVals() {
    if (!window.FF) return { ready: false };
    const db = this.db(); if (!db) return { ready: false };
    const S = this.state; const set = (o) => this.setState(o);
    const hexA = (h, a) => this.hexA(h, a);
    const ctx = S.ctx;
    const rec = this.rec();
    const now = new Date();

    /* ---------- HOME ---------- */
    const latest = f => { const m = db.bodyMetrics.slice().sort((a, b) => new Date(b.measuredAt) - new Date(a.measuredAt)).find(x => x[f] != null); return m ? m[f] : null; };
    const bw = latest('weightKg'), bf = latest('bodyFatPercentage');
    const qwNum = parseFloat(String(S.qw).replace(',', '.'));
    const bfEst = FF.estimateBodyFat(db, (qwNum || bw));
    const lastWaist = db.waist.slice().sort((a, b) => new Date(b.measuredAt) - new Date(a.measuredAt))[0];
    const ma7 = FF.movAvg(db, 7, 'weightKg'), ma30 = FF.movAvg(db, 30, 'weightKg');
    const todayKey = now.toDateString();
    const loggedToday = db.bodyMetrics.find(m => new Date(m.measuredAt).toDateString() === todayKey);
    const reminders = [];
    const deloadInfo = FF.deloadCheck(db);
    if (deloadInfo.due) reminders.push('Fatigue akumulatif terdeteksi (' + deloadInfo.reason + ') — pertimbangkan minggu deload / recovery.');
    const waistDays = lastWaist ? FF.daysSince(lastWaist.measuredAt) : 99;
    if (waistDays >= 7) reminders.push('Sudah ' + waistDays + ' hari belum mengisi lingkar perut — ukur lagi hari ini.');
    if (!loggedToday) reminders.push('Berat badan belum dicatat hari ini.');
    if (!db.settings.lastBackup || FF.daysSince(db.settings.lastBackup) > 14) reminders.push('Backup terakhir sudah lama — download backup JSON di menu More agar data aman.');

    const readinessOpts = [['fit', 'Fit'], ['agak-lelah', 'Agak lelah'], ['lelah', 'Lelah']].map(([id, label]) => ({
      label, onTap: () => set({ ctx: { ...ctx, readiness: id } }),
      style: this.chip(ctx.readiness === id) + 'text-align:center;',
    }));
    const soreOf = id => { const e = ctx.soreness.find(x => (x.id || x) === id); return e ? (e.level || 'berat') : null; };
    const soreOpts = FF.SORE_OPTIONS.map(o => {
      const lvl = soreOf(o.id);
      return {
        label: o.label + (lvl === 'ringan' ? ' · ringan' : lvl === 'berat' ? ' · berat' : ''),
        onTap: () => { const rest = ctx.soreness.filter(x => (x.id || x) !== o.id);
          const next = lvl === null ? [...rest, { id: o.id, level: 'ringan' }] : lvl === 'ringan' ? [...rest, { id: o.id, level: 'berat' }] : rest;
          set({ ctx: { ...ctx, soreness: next } }); },
        style: this.chip(!!lvl, lvl === 'berat' ? 'rgba(199,68,54,0.6)' : undefined) + (lvl === 'berat' ? 'color:var(--danger);' : ''),
      };
    }).concat([{ label: 'Tidak ada nyeri', onTap: () => set({ ctx: { ...ctx, soreness: [] } }), style: this.chip(ctx.soreness.length === 0) }]);
    const locOpts = FF.LOCATIONS.map(l => ({ label: l.short || l.label, onTap: () => set({ ctx: { ...ctx, locationId: l.id } }), style: this.chip(ctx.locationId === l.id) }));
    const minOpts = [20, 30, 45, 60].map(v => ({ label: v + "'", onTap: () => set({ ctx: { ...ctx, minutes: v } }), style: this.chip(ctx.minutes === v) + 'text-align:center;' }));

    const recExList = (rec.exercises || []).map((e, i) => {
      const ex = FF.exById(e.exId);
      const isBW = ex && /bodyweight|pull-up bar|dip station/i.test(ex.equip);
      const primary = i === 0 && e.kind === 'major';
      const tag = (ex ? ex.mus.slice(0, 2).map(m => FF.MUSCLE_LABEL[m] || m).join(' · ') : '') + (e.kind === 'major' ? '' : ' · isolasi');
      return {
        num: String(i + 1).padStart(2, '0'), name: e.name, tag,
        primary, numColor: primary ? 'var(--gold-400)' : 'var(--text-faint)',
        load: e.weight ? (isBW ? 'BW+' + e.weight : e.weight + ' kg') : (isBW ? 'BW' : '—'),
        loadColor: e.weight ? 'var(--gold-300)' : 'var(--text-muted)',
        reps: e.sets + ' × ' + e.repLo + '–' + e.repHi,
        rowStyle: 'display:flex; align-items:flex-start; gap:10px; padding:11px 6px; border-bottom:1px solid var(--border-subtle);' + (primary ? ' background:linear-gradient(90deg, rgba(232,161,60,0.06), transparent 70%); border-left:2px solid var(--gold-500); padding-left:10px; border-radius:2px;' : ''),
      };
    });
    const previewAccent = (t) => /Cardio|Treadmill|Easy|Run/i.test(t) ? 'var(--cobalt-400)' : /Muay/i.test(t) ? 'var(--orange-500)' : /Recovery|Mobility/i.test(t) ? 'var(--data-positive)' : 'var(--gold-500)';
    const preview = FF.previewNext(db, ctx, rec).map(p => {
      const acc = previewAccent(p.title);
      return { ...p, accent: acc, dayShort: (p.day || '').slice(0, 3),
        badgeStyle: 'flex:none; width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-family:var(--font-mono); font-size:11px; letter-spacing:0.04em; text-transform:uppercase; color:' + acc + '; background:' + this.hexA(acc.includes('cobalt') ? '#4d90c8' : acc.includes('orange') ? '#d66d4f' : acc.includes('positive') ? '#17b573' : '#d99b3e', 0.12) + '; border:1px solid ' + this.hexA(acc.includes('cobalt') ? '#4d90c8' : acc.includes('orange') ? '#d66d4f' : acc.includes('positive') ? '#17b573' : '#d99b3e', 0.3) + ';' };
    });
    // body progress tiles with progress-to-target bar + trend
    const bfWaist = db.waist.slice().sort((a, b) => new Date(a.measuredAt) - new Date(b.measuredAt));
    const ms30 = FF.sortedMetrics(db).filter(m => FF.daysSince(m.measuredAt) <= 30);
    const clampPct = (v) => Math.max(4, Math.min(100, v));
    const toTargetBar = (cur, start, target) => cur == null ? 0 : clampPct(Math.round((1 - Math.abs(cur - target) / Math.max(0.1, Math.abs(start - target))) * 100));
    const wStart = ms30.length ? ms30[0].weightKg : bw;
    const bfSeries = ms30.filter(m => m.bodyFatPercentage != null);
    const bfStart = bfSeries.length ? bfSeries[0].bodyFatPercentage : bf;
    const waistStart = bfWaist.length ? bfWaist[0].waistCm : (lastWaist ? lastWaist.waistCm : null);
    const trend = (cur, start, target, unit) => {
      if (cur == null || start == null) return { arrow: '', delta: '—', color: 'var(--text-muted)' };
      const toward = Math.abs(cur - target) <= Math.abs(start - target);
      const d = (cur - start);
      return { arrow: d < 0 ? '↓' : d > 0 ? '↑' : '→', delta: (d > 0 ? '+' : '') + d.toFixed(1) + unit, color: toward ? 'var(--data-positive)' : 'var(--text-muted)' };
    };
    const wTr = trend(bw, wStart, db.targets.weightKg, '');
    const bfTr = trend(bf, bfStart, db.targets.bodyFat, '');
    const waistCur = lastWaist ? lastWaist.waistCm : null;
    const waistTr = trend(waistCur, waistStart, db.targets.waistCm, '');
    const bodyTiles = [
      { label: 'berat', value: bw != null ? bw.toFixed(1) : '—', glow: 'rgba(217,155,62,0.16)', arrow: wTr.arrow, delta: bw != null ? wTr.delta + ' → ' + db.targets.weightKg : 'target ' + db.targets.weightKg, deltaColor: wTr.color, barStyle: 'display:block; height:100%; width:' + toTargetBar(bw, wStart, db.targets.weightKg) + '%; background:var(--gold-500);' },
      { label: 'body fat', value: bf != null ? bf.toFixed(1) + '%' : '—', glow: 'rgba(193,122,69,0.16)', arrow: bfTr.arrow, delta: bf != null ? bfTr.delta + '% → ' + db.targets.bodyFat : 'target ' + db.targets.bodyFat + '%', deltaColor: bfTr.color, barStyle: 'display:block; height:100%; width:' + toTargetBar(bf, bfStart, db.targets.bodyFat) + '%; background:var(--cat-4, #c17a45);' },
      { label: 'perut', value: waistCur != null ? waistCur + ' cm' : '—', glow: 'rgba(77,144,200,0.16)', arrow: waistTr.arrow, delta: waistCur != null ? waistTr.delta + 'cm → ' + db.targets.waistCm : 'target ' + db.targets.waistCm, deltaColor: waistTr.color, barStyle: 'display:block; height:100%; width:' + toTargetBar(waistCur, waistStart, db.targets.waistCm) + '%; background:var(--cobalt-400);' },
    ];
    const active = db.activeSession;
    const rmap = FF.recoveryMap(db);
    const statusColor = { ready: 'var(--data-positive)', partial: 'var(--warning)', sore: 'var(--data-negative)', nodata: 'var(--data-neutral, #8a8f98)' };
    const statusHex = { ready: '#17b573', partial: '#e8a13c', sore: '#c74436', nodata: '#8a8f98' };
    const rmSel = S.rmSel;
    const rmColors = {};
    ['shoulders', 'chest', 'core', 'arms', 'quads', 'calves', 'back', 'hamglutes'].forEach(g => {
      const base = statusHex[rmap[g]] || statusHex.nodata;
      const dim = rmap[g] === 'nodata';
      // selected muscle gets full opacity + subtle inner strength; unselected slightly translucent so the blueprint reads through
      rmColors[g + 'Fill'] = rmSel && rmSel !== g ? hexA(base, dim ? 0.14 : 0.4) : hexA(base, dim ? 0.28 : 0.82);
    });
    const rmReady = ['shoulders', 'chest', 'core', 'arms', 'quads', 'calves', 'back', 'hamglutes'].filter(g => rmap[g] === 'ready').length;
    const recoveryRows = [['chest', 'Dada'], ['shoulders', 'Bahu'], ['back', 'Punggung'], ['arms', 'Lengan'], ['core', 'Core'], ['quads', 'Quads'], ['hamglutes', 'Ham/Glute'], ['calves', 'Betis']].map(([g, label]) => {
      const pct = rmap[g + 'Pct'];
      const col = statusColor[rmap[g]] || statusColor.nodata;
      return {
        label, color: col, glow: rmap[g] === 'nodata' ? 'transparent' : hexA(statusHex[rmap[g]], 0.6),
        status: rmap[g] === 'nodata' ? '—' : pct + '%',
        barStyle: 'display:block; height:100%; width:' + (pct || 0) + '%; background:' + col + ';',
        rowStyle: 'display:flex; align-items:center; gap:8px; width:100%; background:' + (rmSel === g ? 'rgba(77,144,200,0.08)' : 'transparent') + '; border:none; border-radius:8px; padding:5px 6px; cursor:pointer;',
        onTap: () => set({ rmSel: rmSel === g ? null : g }),
      };
    });

    /* ---------- WORKOUT / ACTIVE ---------- */
    let asVals = {};
    const fmtElapsed = (mins) => mins >= 90 ? Math.floor(mins / 60) + 'j ' + (mins % 60) + 'm' : mins + ' menit';
    if (active) {
      const elapsed = Math.floor((Date.now() - active.startedAt) / 60000);
      const liveEx = active.exercises.filter(e => !e.skipped);
      const exDone = liveEx.filter(e => e.sets.length && e.sets.every(s => s.done)).length;
      const setsDoneTotal = liveEx.reduce((n, e) => n + e.sets.filter(s => s.done).length, 0);
      const firstUndone = active.exercises.findIndex(e => !e.skipped && e.sets.some(s => !s.done));
      asVals = {
        asTitle: active.title, asElapsed: fmtElapsed(elapsed),
        asDoneCount: exDone, asTotalCount: liveEx.length, asSetsDone: setsDoneTotal,
        asProgressStyle: 'height:100%; width:' + (liveEx.length ? Math.round(exDone / liveEx.length * 100) : 0) + '%; background:linear-gradient(90deg, var(--gold-500), var(--gold-400)); transition:width 260ms;',
        asStarted: new Date(active.startedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        asStale: elapsed > 180,
        asWarmupPhase: active.phase === 'warmup', asMainPhase: active.phase === 'main',
        asWarmup: active.warmup.map((w, i) => {
          const icons = { General: 'M13 4 L9 13 H12 L11 20 L15 11 H12 Z', Mobility: 'M4 12 A8 8 0 1 1 12 20 M4 12 L4 8 M4 12 L8 12', Activation: 'M12 3 V7 M12 17 V21 M3 12 H7 M17 12 H21 M12 9 A3 3 0 1 0 12 15 A3 3 0 0 0 12 9', Specific: 'M6.5 8.5 V15.5 M17.5 8.5 V15.5 M4 10 V14 M20 10 V14 M6.5 12 H17.5' };
          const last = i === active.warmup.length - 1;
          return {
            t: w.t, dur: w.dur, goal: w.goal, items: w.items || [], icon: icons[w.t] || icons.General, notLast: !last,
            onToggle: () => this.mut(d => d.activeSession.warmup[i].done = !d.activeSession.warmup[i].done),
            checkGlyph: w.done ? '✓' : String(i + 1),
            checkStyle: 'flex:none; width:30px; height:30px; border-radius:99px; display:flex; align-items:center; justify-content:center; font-family:var(--font-mono); font-size:12px; cursor:pointer;' + (w.done ? 'background:var(--data-positive); color:#08090b; border:none;' : 'background:var(--surface-warm-raised); color:var(--text-muted); border:1px solid var(--border-default);'),
            lineStyle: 'width:2px; flex:1; min-height:14px; margin:3px 0; background:' + (w.done ? 'var(--data-positive)' : 'var(--border-subtle)') + ';',
            iconStyle: 'flex:none; width:24px; height:24px; border-radius:7px; display:flex; align-items:center; justify-content:center; color:' + (w.done ? 'var(--data-positive)' : 'var(--gold-400)') + '; background:' + (w.done ? 'rgba(23,181,115,0.12)' : 'var(--interactive-warm-soft)') + ';',
            labelColor: w.done ? 'var(--data-positive)' : 'var(--gold-300)',
            itemColor: w.done ? 'var(--text-faint)' : 'var(--text-secondary)', bulletColor: w.done ? 'var(--data-positive)' : 'var(--gold-500)',
            cardStyle: 'flex:1; min-width:0; text-align:left; background:transparent; border:none; border-bottom:1px solid var(--border-subtle); padding:2px 0 14px; margin-bottom:12px; cursor:pointer; color:var(--text-primary);' + (w.done ? ' opacity:0.6;' : ''),
          };
        }),
        warmupDone: active.warmup.filter(w => w.done).length, warmupTotal: active.warmup.length,
        warmupTime: active.warmup.length >= 4 ? '10–14 mnt' : '8–10 mnt',
        warmupBarStyle: 'display:block; height:100%; width:' + Math.round(active.warmup.filter(w => w.done).length / active.warmup.length * 100) + '%; background:var(--data-positive); transition:width 220ms;',
        startMain: () => this.mut(d => d.activeSession.phase = 'main'),
        discardSession: () => { const snap = active; this.mut(d => d.activeSession = null);
          this.setState({ undo: { label: 'Sesi aktif "' + snap.title + '" dibuang', active: snap, expireAt: Date.now() + 6000 } }); },
        asExercises: active.exercises.map((e, i) => {
          const doneSets = e.sets.filter(s => s.done).length;
          const allDone = doneSets === e.sets.length;
          const isTime = e.exId === 'plank';
          const exMeta = FF.exById(e.exId);
          const isBW = exMeta && /bodyweight|pull-up bar|dip station/i.test(exMeta.equip);
          const isActiveEx = i === firstUndone;
          const bwW = (w) => isBW ? (w > 0 ? 'BW+' + (w % 1 ? w.toFixed(1) : w) : 'BW') : (w % 1 ? w.toFixed(1) : String(w));
          const nextSetIdx = e.sets.findIndex(s => !s.done);
          return {
            num: String(i + 1), name: e.name, sub: e.equip + (e.skipped ? ' · dilewati' : ''), note: e.note || '',
            allDone: allDone && !e.skipped,
            fbOpts: [['terlalu-ringan', 'Ringan'], ['pas', 'Pas'], ['berat', 'Berat']].map(([id, label]) => ({ label, onTap: () => this.mut(d => { const x = d.activeSession.exercises[i]; x.fb = x.fb === id ? null : id; }),
              style: 'height:30px; padding:0 12px; border-radius:999px; font-size:12px; cursor:pointer;' + (e.fb === id ? 'border:1px solid var(--border-warm); background:var(--interactive-warm-soft); color:var(--gold-300); font-weight:700;' : 'border:1px solid var(--border-subtle); background:transparent; color:var(--text-secondary);') })),
            target: e.repLo + '–' + e.repHi + (isTime ? ' dtk' : ' reps'), restLabel: e.rest + ' dtk',
            wUnit: (active.locationId === 'home-strength' && exMeta && (exMeta.cats || []).includes('dumbbell')) ? 'kg (≈' + Math.round((e.sets[nextSetIdx >= 0 ? nextSetIdx : 0] || {}).weight * 2.2046 || 0) + ' lb)' : 'kg', rUnit: isTime ? 'detik' : 'reps',
            open: S['exOpen' + i] ?? active.openIdx === i, progress: e.skipped ? '—' : doneSets + '/' + e.sets.length,
            doneColor: allDone ? 'var(--data-positive)' : 'var(--text-faint)',
            cardStyle: 'background:var(--surface-warm-card); border:1px solid ' + (allDone ? 'rgba(23,181,115,0.35)' : (isActiveEx ? 'var(--border-warm)' : 'var(--border-subtle)')) + '; border-radius:var(--radius-lg); overflow:hidden;' + (e.skipped ? 'opacity:0.45;' : '') + (isActiveEx && !e.skipped ? ' box-shadow:0 0 0 1px var(--border-warm), 0 8px 30px -18px var(--gold-500);' : ''),
            numStyle: 'flex:none; width:30px; height:30px; border-radius:99px; display:flex; align-items:center; justify-content:center; font-family:var(--font-mono); font-size:12px;' + (allDone ? 'background:var(--data-positive); color:#08090b;' : isActiveEx ? 'background:var(--interactive-warm); color:var(--interactive-warm-ink); font-weight:700;' : 'border:1px solid var(--border-default); color:var(--text-muted);'),
            onOpen: () => this.mut(d => d.activeSession.openIdx = d.activeSession.openIdx === i ? -1 : i),
            onCopy: () => this.mut(d => { const sets = d.activeSession.exercises[i].sets; const li = sets.map(s => s.done).lastIndexOf(true); if (li >= 0 && li + 1 < sets.length) { sets[li + 1].weight = sets[li].weight; sets[li + 1].reps = sets[li].reps; } }),
            onAddSet: () => this.mut(d => { const sets = d.activeSession.exercises[i].sets; sets.push({ ...sets[sets.length - 1], done: false }); }),
            onReplace: () => set({ replFor: i }),
            onTechnique: () => set({ techId: e.exId, techTab: 'teknik' }),
            onSkip: () => this.mut(d => d.activeSession.exercises[i].skipped = !d.activeSession.exercises[i].skipped),
            skipLabel: e.skipped ? 'Batal lewati' : 'Lewati',
            moreOpen: S['exMore' + i] || false, moreGlyph: S['exMore' + i] ? '×' : '⋯',
            onToggleMore: () => set({ ['exMore' + i]: !S['exMore' + i] }),
            sets: e.sets.map((st, j) => ({
              label: st.type === 'warmup' ? 'W' : st.type === 'drop' ? 'D' + (j + 1) : 'S' + (j + 1), w: bwW(st.weight), r: String(st.reps),
              typeBorder: st.type === 'warmup' ? 'rgba(77,144,200,0.5)' : st.type === 'drop' ? 'rgba(214,109,79,0.5)' : 'var(--border-subtle)',
              onType: () => this.mut(d => { const x = d.activeSession.exercises[i].sets[j]; x.type = x.type === 'working' ? 'warmup' : x.type === 'warmup' ? 'drop' : 'working'; }),
              numColor: st.done ? 'var(--data-positive)' : st.type === 'warmup' ? 'var(--cobalt-400)' : st.type === 'drop' ? 'var(--orange-500)' : 'var(--text-faint)',
              rowStyle: 'display:grid; grid-template-columns:30px 1fr 1fr 48px; gap:8px; align-items:center; padding:3px; border-radius:8px;' + (j === nextSetIdx && !st.done ? 'background:rgba(232,161,60,0.06);' : ''),
              wUp: () => this.mut(d => d.activeSession.exercises[i].sets[j].weight = Math.min(500, +(st.weight + (e.inc || 2.5)).toFixed(1))),
              wDown: () => this.mut(d => d.activeSession.exercises[i].sets[j].weight = Math.max(0, +(st.weight - (e.inc || 2.5)).toFixed(1))),
              wSet: (ev) => { const v = FF.clamp(String(ev.target.value).replace(',', '.'), 0, 500, null); if (v != null) this.mut(d => d.activeSession.exercises[i].sets[j].weight = v); },
              rSet: (ev) => { const v = FF.clamp(ev.target.value, 0, isTime ? 900 : 100, null); if (v != null) this.mut(d => d.activeSession.exercises[i].sets[j].reps = Math.round(v)); },
              rUp: () => this.mut(d => d.activeSession.exercises[i].sets[j].reps = Math.min(isTime ? 900 : 100, st.reps + (isTime ? 5 : 1))),
              rDown: () => this.mut(d => d.activeSession.exercises[i].sets[j].reps = Math.max(0, st.reps - (isTime ? 5 : 1))),
              onDone: () => { const wasDone = st.done;
                this.mut(d => { const a = d.activeSession; a.exercises[i].sets[j].done = !wasDone;
                  if (!wasDone && a.exercises[i].sets.every(s => s.done)) {
                    const ni = a.exercises.findIndex((x, k) => k !== i && !x.skipped && x.sets.some(s => !s.done));
                    if (ni >= 0) a.openIdx = ni;
                  } });
                if (!wasDone && !(j === e.sets.length - 1 && i === active.exercises.length - 1)) {
                  let next;
                  if (j + 1 < e.sets.length) { const ns = e.sets[j + 1]; next = 'Selanjutnya: Set ' + (j + 2) + ' · ' + ns.weight + ' kg × ' + ns.reps; }
                  else { const ne = active.exercises.slice(i + 1).find(x => !x.skipped && x.sets.some(s => !s.done)); next = ne ? 'Selanjutnya: ' + ne.name : ''; }
                  this.startRest(e.rest, e.name, next);
                } },
              doneStyle: 'height:46px; border-radius:var(--radius-sm); font-size:17px; cursor:pointer; font-weight:700;' + (st.done ? 'background:var(--data-positive); border:none; color:#08090b;' : 'background:var(--surface-warm-raised); border:1px solid var(--border-default); color:var(--text-muted);'),
            })),
          };
        }),
        openFeedback: () => set({ fbOpen: true }),
      };
    }
    const replFor = S.replFor;
    const replOpts = replFor != null && active ? FF.replaceOptions(db, ctx, active.exercises[replFor].exId, active.exercises.map(e => e.exId)).map(o => ({
      name: o.name, equip: o.equip,
      onPick: () => { const prog = FF.progressionFor(db, o.id); this.mut(d => { const ex = d.activeSession.exercises; const e = ex[replFor];
        const doneSets = e.sets.filter(s => s.done); const remaining = Math.max(1, e.sets.length - doneSets.length);
        const nu = { exId: o.id, name: o.name, equip: o.equip, kind: o.kind, pat: o.pat, weight: prog.weight, repLo: prog.repLo, repHi: prog.repHi, inc: o.inc, note: prog.note, rest: o.kind === 'major' ? 120 : 60, skipped: false,
          sets: Array.from({ length: remaining }, () => ({ type: 'working', weight: prog.weight, reps: prog.repHi, done: false })) };
        if (doneSets.length) { e.sets = doneSets; ex.splice(replFor + 1, 0, nu); d.activeSession.openIdx = replFor + 1; }
        else { ex[replFor] = nu; } }); set({ replFor: null }); },
    })) : [];

    /* ---------- CARDIO FORM ---------- */
    const cf = S.cf;
    const cfInt = cf.type === 'muaythai' && !cf.avg ? 'sedang' : FF.classifyCardio(db, +cf.avg || 0, +cf.dur || 0);
    const intColor = { ringan: 'var(--data-positive)', sedang: 'var(--cobalt-400)', berat: 'var(--orange-500)' }[cfInt];
    const cardioVals = {
      cardioFormOpen: S.cardioFormOpen, noActive: !active, hasActive: !!active,
      openCardioForm: () => set({ cardioFormOpen: true, cf: { ...cf, type: 'treadmill-run' } }),
      openMuayThaiForm: () => set({ cardioFormOpen: true, cf: { ...cf, type: 'muaythai' } }),
      closeCardioForm: () => set({ cardioFormOpen: false }),
      openBuilderAdd: () => set({ builderOpen: true, builderMode: 'add', builderPicks: [], builderSearch: '' }),
      ...(() => {
        const mode = S.builderMode || 'new';
        const picks = S.builderPicks || [];
        const q = (S.builderSearch || '').trim().toLowerCase();
        const locFilter = S.builderLoc || 'all';
        const already = (mode === 'add' && active) ? active.exercises.map(e => e.exId) : [];
        const list = FF.EX.filter(e => {
          if (already.includes(e.id)) return false;
          if (locFilter !== 'all' && !e.loc.includes(locFilter)) return false;
          if (!q) return true;
          return e.name.toLowerCase().includes(q) || (FF.PAT_LABEL[e.pat] || '').toLowerCase().includes(q) ||
            e.equip.toLowerCase().includes(q) || e.mus.some(m => (FF.MUSCLE_LABEL[m] || '').toLowerCase().includes(q));
        });
        const groups = Object.keys(FF.PAT_LABEL).map(pat => ({
          label: FF.PAT_LABEL[pat],
          items: list.filter(e => e.pat === pat).map(e => {
            const on = picks.includes(e.id);
            const prog = FF.progressionFor(db, e.id);
            const isBW = /bodyweight|pull-up bar|dip/i.test(e.equip);
            return {
              name: e.name, sub: e.equip,
              plan: '3×' + prog.repLo + '–' + prog.repHi + (prog.weight > 0 ? ' @ ' + prog.weight + 'kg' : isBW ? ' BW' : ''),
              onTap: () => set({ builderPicks: on ? picks.filter(x => x !== e.id) : [...picks, e.id] }),
              rowStyle: 'display:flex; align-items:center; gap:11px; width:100%; text-align:left; border:none; border-bottom:1px solid var(--border-subtle); padding:11px 12px; cursor:pointer; color:var(--text-primary); background:' + (on ? 'var(--interactive-warm-soft)' : 'transparent') + ';',
              checkStyle: 'flex:none; width:24px; height:24px; border-radius:7px; display:flex; align-items:center; justify-content:center; font-size:12px;' + (on ? 'background:var(--gold-500); color:var(--interactive-warm-ink);' : 'border:1px solid var(--border-default); color:transparent;'),
            };
          }),
        })).filter(g => g.items.length);
        return {
          builderOpen: !!S.builderOpen,
          builderKicker: mode === 'add' ? 'tambah ke sesi aktif' : 'susun sendiri',
          builderTitle: mode === 'add' ? 'Tambah gerakan' : 'Sesi custom',
          builderSearch: S.builderSearch || '', onBuilderSearch: (e) => set({ builderSearch: e.target.value }),
          builderLocChips: [['all', 'Semua'], ['home', 'Rumah'], ['gym', 'FitHub']].map(([id, label]) => ({
            label, onTap: () => set({ builderLoc: id }),
            style: 'min-height:32px; padding:6px 13px; border-radius:999px; font-size:12.5px; cursor:pointer; white-space:nowrap;' +
              (locFilter === id ? 'border:1px solid var(--border-warm); background:var(--interactive-warm-soft); color:var(--gold-300); font-weight:600;' : 'border:1px solid var(--border-subtle); background:var(--surface-warm-card); color:var(--text-secondary);'),
          })),
          builderGroups: groups, builderEmpty: groups.length === 0,
          builderHasPicks: picks.length > 0,
          builderCountLabel: picks.length ? picks.length + ' gerakan dipilih' : 'Belum ada gerakan dipilih',
          builderCta: mode === 'add' ? (picks.length ? 'Tambahkan ' + picks.length + ' gerakan' : 'Pilih gerakan dulu') : (picks.length ? 'Mulai sesi · ' + picks.length + ' gerakan' : 'Pilih gerakan dulu'),
          builderCtaStyle: 'width:100%; height:52px; border:none; border-radius:999px; font-size:15px; font-weight:700; cursor:' + (picks.length ? 'pointer' : 'default') + ';' +
            (picks.length ? 'background:var(--interactive-warm); color:var(--interactive-warm-ink);' : 'background:var(--surface-warm-raised); color:var(--text-faint);'),
          startBuilder: () => { if (!picks.length) return; if (mode === 'add') this.addExercisesToSession(picks); else this.startCustomSession(picks); },
          clearBuilder: () => set({ builderPicks: [] }),
          closeBuilder: () => set({ builderOpen: false }),
        };
      })(),
      logRecovery: () => this.logRecoverySession(null),
      workoutActions: [
        { kicker: 'custom', title: 'Susun sesi sendiri', sub: 'Pilih gerakanmu — engine tetap belajar dari hasilnya', accent: 'var(--gold-400)', accHex: '#e0a54a', icon: 'M4 6 H20 M4 12 H14 M4 18 H10 M17 15 V21 M14 18 H20', onTap: () => set({ builderOpen: true, builderMode: 'new', builderPicks: [], builderSearch: '' }) },
        { kicker: 'cardio / treadmill', title: 'Log aktivitas cardio', sub: 'Durasi, jarak, HR — plus screenshot Garmin', accent: 'var(--cobalt-400)', accHex: '#4d90c8', icon: 'M3 12 H6 L8 6 L11 18 L14 9 L16 12 H21', onTap: () => set({ cardioFormOpen: true, cf: { ...cf, type: 'treadmill-run' } }) },
        { kicker: 'muay thai', title: 'Log sesi Muay Thai', sub: 'Dihitung cardio + beban bahu, lengan, core, lower', accent: 'var(--orange-500)', accHex: '#d66d4f', icon: 'M8 11 V7 A2 2 0 0 1 12 7 V11 M12 8 A2 2 0 0 1 16 8 V13 A5 5 0 0 1 6 13 V10 A2 2 0 0 1 10 10', onTap: () => set({ cardioFormOpen: true, cf: { ...cf, type: 'muaythai' } }) },
        { kicker: 'recovery', title: 'Catat hari recovery / mobility', sub: 'Jalan santai, mobility, stretching', accent: 'var(--data-positive)', accHex: '#17b573', icon: 'M12 21 C7 17 4 13 4 9 A4 4 0 0 1 12 7 A4 4 0 0 1 20 9 C20 13 17 17 12 21 Z', onTap: () => this.logRecoverySession(null) },
      ].map(a => ({ ...a,
        cardStyle: 'position:relative; overflow:hidden; display:flex; align-items:flex-start; gap:13px; text-align:left; background:var(--surface-warm-card); border:1px solid var(--border-subtle); border-left:3px solid ' + a.accent + '; border-radius:var(--radius-lg); padding:15px 15px 15px 14px; cursor:pointer; color:var(--text-primary);',
        iconStyle: 'flex:none; width:42px; height:42px; border-radius:11px; display:flex; align-items:center; justify-content:center; color:' + a.accent + '; background:' + this.hexA(a.accHex, 0.12) + '; border:1px solid ' + this.hexA(a.accHex, 0.3) + ';' })),
      cardioTypes: FF.CARDIO_TYPES, cfType: cf.type,
      onCfType: e => set({ cf: { ...cf, type: e.target.value } }),
      cfDur: cf.dur, onCfDur: e => set({ cf: { ...cf, dur: e.target.value } }),
      cfDate: cf.date || FF.localDate(), onCfDate: e => set({ cf: { ...cf, date: e.target.value } }),
      cfDateMax: FF.localDate(),
      cfDist: cf.dist, onCfDist: e => set({ cf: { ...cf, dist: e.target.value } }),
      cfAvg: cf.avg, onCfAvg: e => set({ cf: { ...cf, avg: e.target.value } }),
      cfMax: cf.max, onCfMax: e => set({ cf: { ...cf, max: e.target.value } }),
      cfIntensity: cfInt, cfIntStyle: 'padding:5px 12px; border-radius:999px; font-size:12.5px; font-weight:600; border:1px solid ' + intColor + '; color:' + intColor + ';',
      hasAttach: !!cf.attach,
      cfAttachStyle: cf.attach ? 'width:100%; aspect-ratio:4/5; background-image:url(' + cf.attach + '); background-size:contain; background-repeat:no-repeat; background-position:center; border-radius:var(--radius-sm); border:1px solid var(--border-subtle); background-color:var(--surface-warm-raised);' : 'display:none;',
      attachLabel: cf.attach ? 'Ganti screenshot Garmin' : 'Lampirkan screenshot Garmin (opsional)',
      onAttach: e => { const f = e.target.files && e.target.files[0]; if (!f) return;
        const rd = new FileReader(); rd.onload = () => { const img = new Image(); img.onload = () => {
          const sc = Math.min(1, 800 / img.width); const cv = document.createElement('canvas');
          cv.width = img.width * sc; cv.height = img.height * sc; cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
          set({ cf: { ...this.state.cf, attach: cv.toDataURL('image/jpeg', 0.7) } }); }; img.src = rd.result; }; rd.readAsDataURL(f); },
      saveCardio: () => { const d = FF.clamp(cf.dur, 1, 600, 0); if (!d) { this.toast('Isi durasi yang wajar (1–600 menit).'); return; }
        const isMt = cf.type === 'muaythai';
        const dist = cf.dist ? FF.clamp(cf.dist, 0, 300, null) : null;
        let avg = cf.avg ? FF.clamp(cf.avg, 30, 230, null) : null;
        let mx = cf.max ? FF.clamp(cf.max, 30, 230, null) : null;
        if (avg && mx && avg > mx) { this.toast('Avg HR (' + avg + ') tidak boleh lebih tinggi dari Max HR (' + mx + '). Periksa kembali angkanya.'); return; }
        const prevUnlocked = FF.achievementState(this.state.db).filter(x => x.unlocked).map(x => x.id);
        const sid = FF.uid();
        const load = FF.cardioLoad(d, cfInt, isMt ? 'muaythai' : '');
        // backdate: use chosen date at a fixed midday time; guard against future dates
        let when = new Date();
        if (cf.date) { const picked = new Date(cf.date + 'T12:00:00'); if (!isNaN(picked) && picked <= new Date()) when = picked; }
        this.mut(dbx => dbx.sessions.push({ id: sid, date: when.toISOString(),
          title: FF.CARDIO_TYPES.find(t => t.id === cf.type).label, sessionType: isMt ? 'muaythai' : 'cardio', locationId: ctx.locationId,
          durationMin: d, readiness: ctx.readiness, feedback: 'pas', status: 'completed', exercises: [],
          cardio: { activityType: cf.type, durationMinutes: d, distanceKm: dist, averageHr: avg, maximumHr: mx,
            intensity: cfInt, load, attachment: cf.attach || null } }));
        const un = FF.newlyUnlocked(this.state.db, prevUnlocked); const stk = FF.streakInfo(this.state.db);
        set({ cardioFormOpen: false, cf: { type: 'treadmill-run', dur: '', dist: '', avg: '', max: '', attach: null, date: '' } });
        this.celebrate({ sid, title: FF.CARDIO_TYPES.find(t => t.id === cf.type).label, dur: d, distKm: dist, avgHr: avg, intensity: cfInt, prs: [], fresh: un.fresh, streak: stk.current, kind: isMt ? 'muaythai' : 'cardio' }); },
    };

    /* ---------- HISTORY ---------- */
    const calYm = S.calYm || (now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0'));
    const [cy, cm] = calYm.split('-').map(Number);
    const first = new Date(cy, cm - 1, 1); const offset = (first.getDay() + 6) % 7; const dim = new Date(cy, cm, 0).getDate();
    const typeColor = { strength: 'var(--gold-500)', cardio: 'var(--cobalt-400)', muaythai: 'var(--orange-500)', recovery: 'var(--data-positive)' };
    const byDay = {};
    db.sessions.forEach(s => { const d = new Date(s.date); if (d.getFullYear() === cy && d.getMonth() + 1 === cm) (byDay[d.getDate()] = byDay[d.getDate()] || []).push(s.sessionType); });
    const calCells = [];
    for (let i = 0; i < offset; i++) calCells.push({ d: '', dots: [], style: 'min-height:44px;' });
    for (let d = 1; d <= dim; d++) {
      const isToday = d === now.getDate() && cm === now.getMonth() + 1 && cy === now.getFullYear();
      const hasS = !!byDay[d]; const isSel = S.dayFilter === d;
      calCells.push({ d: String(d), dots: (byDay[d] || []).slice(0, 3).map(t => ({ style: 'width:5px; height:5px; border-radius:99px; background:' + typeColor[t] + ';' })),
        onTap: hasS ? () => set({ dayFilter: S.dayFilter === d ? null : d }) : null,
        style: 'min-height:44px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:3px; font-size:13px; border-radius:var(--radius-sm);' + (hasS ? 'cursor:pointer;' : '') + (isSel ? 'background:var(--interactive-warm); color:var(--interactive-warm-ink); font-weight:700;' : isToday ? 'border:1px solid var(--border-warm); color:var(--gold-300); font-weight:700;' : 'color:var(--text-secondary);') });
    }
    const monthSessions = db.sessions.filter(s => { const d = new Date(s.date); return d.getFullYear() === cy && d.getMonth() + 1 === cm && (!S.dayFilter || d.getDate() === S.dayFilter); })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    const fbLabel = { pas: 'Pas', berat: 'Berat', 'terlalu-ringan': 'Ringan' };
    const badgeStyle = (c) => 'font-family:var(--font-mono); font-size:8.5px; letter-spacing:0.08em; text-transform:uppercase; padding:2px 7px; border-radius:4px; background:' + c.bg + '; color:' + c.fg + '; border:1px solid ' + c.bd + ';';
    const allRuns = db.sessions.filter(x => x.cardio && /run/.test(x.cardio.activityType) && x.cardio.distanceKm).map(x => x.cardio.distanceKm);
    const maxRun = allRuns.length ? Math.max(...allRuns) : 0;
    const histCards = monthSessions.map(s => {
      const sets = (s.exercises || []).reduce((a, e) => a + e.sets.filter(x => x.type === 'working').length, 0);
      const meta = (FF.LOCATIONS.find(l => l.id === s.locationId)?.label || '') + ' · ' + s.durationMin + ' mnt' +
        (s.cardio ? ' · ' + (s.cardio.averageHr ? 'avg ' + s.cardio.averageHr + ' bpm' : '') + (s.cardio.distanceKm ? ' · ' + s.cardio.distanceKm + ' km' : '') : sets ? ' · ' + (s.exercises || []).length + ' gerakan · ' + sets + ' set' : '');
      const badges = [];
      if (s.sessionType === 'recovery') badges.push({ label: 'Recovery day', style: badgeStyle({ bg: 'rgba(23,181,115,0.1)', fg: 'var(--data-positive)', bd: 'rgba(23,181,115,0.35)' }) });
      if (s.cardio && s.cardio.intensity === 'berat') badges.push({ label: s.sessionType === 'muaythai' ? 'Muay Thai intens' : 'Heavy cardio', style: badgeStyle({ bg: 'rgba(214,109,79,0.1)', fg: 'var(--orange-500)', bd: 'rgba(214,109,79,0.35)' }) });
      if (s.cardio && s.cardio.distanceKm && s.cardio.distanceKm >= maxRun && maxRun > 0 && /run/.test(s.cardio.activityType)) badges.push({ label: 'Lari terjauh', style: badgeStyle({ bg: 'rgba(77,144,200,0.1)', fg: 'var(--cobalt-400)', bd: 'rgba(77,144,200,0.35)' }) });
      return { title: s.title, meta, dateStr: new Date(s.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }), fb: fbLabel[s.feedback] || '',
        isPR: FF.sessionPRs(db, s.id).length > 0, hasBadges: badges.length > 0, badges,
        dotStyle: 'flex:none; width:8px; height:8px; border-radius:99px; background:' + (typeColor[s.sessionType] || 'var(--steel-400)') + ';',
        onOpen: () => set({ sdId: s.id }) };
    });
    const sd = db.sessions.find(s => s.id === S.sdId);
    const sdVals = sd ? {
      sdOpen: true, sdTitle: sd.title, sdDate: new Date(sd.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
      sdMeta: (FF.LOCATIONS.find(l => l.id === sd.locationId)?.label || '') + ' · ' + sd.durationMin + ' menit',
      sdHasEx: (sd.exercises || []).length > 0,
      sdEditing: S.sdEdit, sdNotEditing: !S.sdEdit,
      sdEditLabel: S.sdEdit ? 'Simpan' : 'Edit', sdEditColor: S.sdEdit ? 'var(--gold-300)' : 'var(--text-secondary)',
      sdToggleEdit: () => set({ sdEdit: !S.sdEdit }),
      sdExercises: (sd.exercises || []).map((e, ei) => ({ name: e.name,
        setsStr: e.sets.map(st => (st.type === 'warmup' ? 'W:' : '') + (st.weight ? st.weight + ' kg × ' : '') + st.reps).join(' · '),
        editSets: e.sets.map((st, si) => {
          const inc = FF.exById(e.exId)?.inc || 2.5; const isTime = e.exId === 'plank';
          return { label: st.type === 'warmup' ? 'W' : 'S' + (si + 1), w: st.weight % 1 ? st.weight.toFixed(1) : String(st.weight), r: String(st.reps),
            wUp: () => this.mut(d => { const s = d.sessions.find(x => x.id === sd.id); s.exercises[ei].sets[si].weight = Math.min(500, +(st.weight + inc).toFixed(1)); }),
            wDown: () => this.mut(d => { const s = d.sessions.find(x => x.id === sd.id); s.exercises[ei].sets[si].weight = Math.max(0, +(st.weight - inc).toFixed(1)); }),
            rUp: () => this.mut(d => { const s = d.sessions.find(x => x.id === sd.id); s.exercises[ei].sets[si].reps = Math.min(isTime ? 900 : 100, st.reps + (isTime ? 5 : 1)); }),
            rDown: () => this.mut(d => { const s = d.sessions.find(x => x.id === sd.id); s.exercises[ei].sets[si].reps = Math.max(0, st.reps - (isTime ? 5 : 1)); }) };
        }) })),
      sdHasPR: FF.sessionPRs(db, sd.id).length > 0,
      sdPRText: 'Personal record: ' + FF.sessionPRs(db, sd.id).map(p => p.name + ' (est 1RM ' + p.e1rm + ' kg)').join(', '),
      sdHasCardio: !!sd.cardio,
      sdCardioStr: sd.cardio ? [sd.cardio.durationMinutes + ' menit', sd.cardio.distanceKm ? sd.cardio.distanceKm + ' km' : null,
        sd.cardio.averageHr ? 'avg HR ' + sd.cardio.averageHr : null, sd.cardio.maximumHr ? 'max HR ' + sd.cardio.maximumHr : null,
        'intensitas ' + sd.cardio.intensity, 'load ' + sd.cardio.load].filter(Boolean).join(' · ') : '',
      sdHasAttach: !!(sd.cardio && sd.cardio.attachment),
      sdAttachStyle: sd.cardio && sd.cardio.attachment ? 'width:100%; aspect-ratio:4/5; margin-top:10px; background-image:url(' + sd.cardio.attachment + '); background-size:contain; background-repeat:no-repeat; background-position:center; border-radius:var(--radius-sm); border:1px solid var(--border-subtle); background-color:var(--surface-warm-raised);' : 'display:none;',
      sdReadiness: ({ fit: 'Fit', 'agak-lelah': 'Agak lelah', lelah: 'Lelah' }[sd.readiness]) || '—', sdFb: fbLabel[sd.feedback] || '—',
      sdNote: sd.note || '',
      sdDateTime: (() => { const t = new Date(sd.startedAt || sd.date); const p = n => String(n).padStart(2, '0'); return t.getFullYear() + '-' + p(t.getMonth() + 1) + '-' + p(t.getDate()) + 'T' + p(t.getHours()) + ':' + p(t.getMinutes()); })(),
      sdDateMax: (() => { const t = new Date(); const p = n => String(n).padStart(2, '0'); return t.getFullYear() + '-' + p(t.getMonth() + 1) + '-' + p(t.getDate()) + 'T23:59'; })(),
      sdSetDateTime: (e) => { const t = new Date(e.target.value); if (isNaN(t) || t > new Date()) return; this.mut(d => { const s = d.sessions.find(x => x.id === sd.id); if (s) { s.date = t.toISOString(); s.startedAt = t.toISOString(); } }); },
      sdDurVal: String(sd.durationMin || ''),
      sdSetDur: (e) => { const v = FF.clamp(e.target.value, 1, 600, null); if (v != null) this.mut(d => { const s = d.sessions.find(x => x.id === sd.id); if (s) { s.durationMin = Math.round(v); if (s.cardio) s.cardio.durationMinutes = Math.round(v); } }); },
      sdSetNote: (e) => { const v = e.target.value.slice(0, 400); this.mut(d => { const s = d.sessions.find(x => x.id === sd.id); if (s) s.note = v || null; }); },
      sdClose: () => set({ sdId: null, sdEdit: false }),
      sdDelete: () => { const snap = sd; this.mut(d => d.sessions = d.sessions.filter(x => x.id !== snap.id));
        set({ sdId: null, undo: { label: 'Sesi "' + snap.title + '" dihapus', session: snap, expireAt: Date.now() + 6000 } }); },
    } : { sdOpen: false };

    /* ---------- PROGRESS ---------- */
    const pTabs = [['body', 'Body'], ['strength', 'Strength'], ['cardio', 'Cardio'], ['report', 'Report'], ['badge', 'Badge']].map(([id, label]) => ({
      label, onTap: () => set({ pTab: id }),
      style: 'flex:1; min-width:0; height:38px; padding:0; border:none; border-radius:999px; font-size:12px; cursor:pointer; white-space:nowrap;' + (S.pTab === id ? 'background:var(--interactive-warm); color:var(--interactive-warm-ink); font-weight:700;' : 'background:transparent; color:var(--text-muted);'),
    }));
    const ms = FF.sortedMetrics(db).filter(m => FF.daysSince(m.measuredAt) <= 30);
    const path = (vals, W, H) => { if (vals.length < 2) return { line: '', area: '', min: '', max: '' };
      const mn = Math.min(...vals), mx = Math.max(...vals), rng = (mx - mn) || 1;
      const pts = vals.map((v, i) => [(i / (vals.length - 1)) * W, H - 8 - ((v - mn) / rng) * (H - 16)]);
      const line = 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L');
      return { line, area: line + ' L' + W + ',' + H + ' L0,' + H + ' Z', min: mn.toFixed(1), max: mx.toFixed(1) }; };
    // weight chart: shared scale spanning data + target so all layers align
    const wVals = ms.map(m => m.weightKg);
    const wMa = wVals.map((_, i) => { const win = wVals.slice(Math.max(0, i - 6), i + 1); return win.reduce((a, b) => a + b, 0) / win.length; });
    const tgt = db.targets.weightKg;
    let wpx = { line: '', area: '', min: '', max: '', maPath: '', targetY: 0, lastX: 0, lastY: 0, hasTarget: false };
    if (wVals.length >= 2) { const W = 340, H = 108;
      const lo = Math.min(...wVals, tgt), hi = Math.max(...wVals, tgt), rng = (hi - lo) || 1;
      const Y = v => H - 8 - ((v - lo) / rng) * (H - 24);
      const X = i => (i / (wVals.length - 1)) * W;
      const linePts = wVals.map((v, i) => [X(i), Y(v)]);
      const line = 'M' + linePts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L');
      wpx = { line, area: line + ' L' + W + ',' + H + ' L0,' + H + ' Z',
        maPath: 'M' + wMa.map((v, i) => X(i).toFixed(1) + ',' + Y(v).toFixed(1)).join(' L'),
        min: Math.min(...wVals).toFixed(1), max: Math.max(...wVals).toFixed(1),
        targetY: Y(tgt).toFixed(1), lastX: X(wVals.length - 1).toFixed(1), lastY: Y(wVals[wVals.length - 1]).toFixed(1), hasTarget: true }; }
    const wp = wpx;
    const bfVals = ms.filter(m => m.bodyFatPercentage != null).map(m => m.bodyFatPercentage);
    const bfp = path(bfVals, 340, 64);
    let bfx = { lastX: 0, lastY: 0, min: '—', max: '—' };
    if (bfVals.length >= 2) { const W = 340, H = 64, mn = Math.min(...bfVals), mx = Math.max(...bfVals), rng = (mx - mn) || 1;
      const Y = v => H - 8 - ((v - mn) / rng) * (H - 16);
      const tgtClamp = Math.max(mn, Math.min(mx, db.targets.bodyFat));
      bfx = { lastX: W.toFixed(1), lastY: Y(bfVals[bfVals.length - 1]).toFixed(1), min: mn.toFixed(1), max: mx.toFixed(1), hasTarget: true, targetY: Y(tgtClamp).toFixed(1) }; }
    // delta badges (30d change) + waist trend
    const mkBadge = (delta, unit, towardDown) => {
      if (delta == null) return { text: '—', style: 'display:none;' };
      const good = towardDown ? delta < 0 : delta > 0;
      const col = delta === 0 ? 'var(--text-muted)' : good ? '#17b573' : '#c74436';
      return { text: (delta > 0 ? '↑ +' : delta < 0 ? '↓ ' : '→ ') + Math.abs(delta).toFixed(1) + unit,
        style: 'font-family:var(--font-mono); font-size:10px; padding:3px 8px; border-radius:999px; white-space:nowrap; color:' + col + '; background:' + this.hexA(col === 'var(--text-muted)' ? '#8a8f98' : good ? '#17b573' : '#c74436', 0.12) + '; border:1px solid ' + this.hexA(col === 'var(--text-muted)' ? '#8a8f98' : good ? '#17b573' : '#c74436', 0.32) + ';' };
    };
    const bwBadgeO = mkBadge(bw != null && wStart != null ? +(bw - wStart).toFixed(1) : null, ' kg', true);
    const bfBadgeO = mkBadge(bf != null && bfStart != null ? +(bf - bfStart).toFixed(1) : null, '%', true);
    const wRowsRaw = db.waist.slice().sort((a, b) => new Date(b.measuredAt) - new Date(a.measuredAt)).slice(0, 4);
    const waistToBar = waistCur != null && waistStart != null ? clampPct(Math.round((1 - Math.abs(waistCur - db.targets.waistCm) / Math.max(0.1, Math.abs(waistStart - db.targets.waistCm))) * 100)) : 0;
    const exStats = {};
    db.sessions.slice().sort((a, b) => new Date(a.date) - new Date(b.date)).forEach(s => (s.exercises || []).forEach(e => {
      const ws = e.sets.filter(x => x.type === 'working');
      const w = Math.max(...ws.map(x => x.weight || 0), 0);
      const reps = ws.map(x => x.reps);
      const repStr = reps.length && reps.every(r => r === reps[0]) ? reps.length + '×' + reps[0] : reps.join('·');
      if (!exStats[e.exId]) exStats[e.exId] = { exId: e.exId, name: e.name, first: w, last: w, lastReps: repStr, n: 1, series: [w] };
      else { const x = exStats[e.exId]; x.last = w; x.lastReps = repStr; x.n++; x.series.push(w); }
    }));
    const prm = FF.prMap(db);
    const recentPRIds = new Set(db.sessions.filter(s => FF.daysSince(s.date) <= 14).flatMap(s => FF.sessionPRs(db, s.id).map(p => p.exId)));
    const spark = (vals, W, H) => {
      if (!vals || vals.length < 2) return { line: '', area: '', x: W, y: H / 2 };
      const mn = Math.min(...vals), mx = Math.max(...vals), rng = (mx - mn) || 1;
      const pts = vals.map((v, i) => [(i / (vals.length - 1)) * W, H - 3 - ((v - mn) / rng) * (H - 6)]);
      const line = 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L');
      return { line, area: line + ' L' + W + ',' + H + ' L0,' + H + ' Z', x: pts[pts.length - 1][0].toFixed(1), y: pts[pts.length - 1][1].toFixed(1) };
    };
    const strengthRows = Object.values(exStats).filter(s => s.n >= 1).sort((a, b) => b.n - a.n).slice(0, 12).map(s => {
      const d = +(s.last - s.first).toFixed(1);
      const ex = FF.exById(s.exId);
      const isPR = recentPRIds.has(s.exId);
      const up = d > 0, down = d < 0;
      const sk = spark(s.series, 60, 22);
      const skCol = up ? 'var(--data-positive)' : down ? 'var(--data-negative)' : 'var(--text-faint)';
      return { name: s.name, isPR,
        tag: ex ? ex.mus.slice(0, 2).map(m => FF.MUSCLE_LABEL[m] || m).join(' · ') + (ex.kind === 'major' ? '' : ' · isolasi') : '',
        lastStr: (s.last ? s.last + ' kg × ' + s.lastReps : s.lastReps) + ' · ' + s.n + ' sesi',
        e1rm: (prm[s.exId] ? prm[s.exId].e1rm : '—') + ' kg',
        deltaStr: d > 0 ? '+' + d + ' kg' : d < 0 ? d + ' kg' : 'stabil',
        deltaStyle: 'font-family:var(--font-mono); font-size:11px; padding:3px 8px; border-radius:999px; white-space:nowrap; color:' + skCol + '; background:' + this.hexA(up ? '#17b573' : down ? '#c74436' : '#8a8f98', 0.12) + '; border:1px solid ' + this.hexA(up ? '#17b573' : down ? '#c74436' : '#8a8f98', 0.3) + ';',
        cardStyle: 'position:relative; overflow:hidden; display:flex; align-items:center; gap:12px; background:var(--surface-warm-card); border:1px solid ' + (isPR ? 'var(--border-warm)' : 'var(--border-subtle)') + '; border-radius:var(--radius-md); padding:13px 15px;' + (isPR ? ' box-shadow:inset 0 0 30px -18px var(--gold-500);' : ''),
        spark: sk.line, sparkArea: sk.area, sparkX: sk.x, sparkY: sk.y, sparkStroke: skCol, sparkFill: this.hexA(up ? '#17b573' : down ? '#c74436' : '#8a8f98', 0.12) };
    });
    const tw = FF.weeklyTonnage(db, 4);
    const twChrono = tw.slice().reverse();
    const maxTon = Math.max(...tw.map(t => t.total), 1);
    const tonNow = twChrono[twChrono.length - 1] ? twChrono[twChrono.length - 1].total : 0;
    const tonPrev = twChrono[twChrono.length - 2] ? twChrono[twChrono.length - 2].total : 0;
    const tonDelta = tonPrev ? Math.round((tonNow - tonPrev) / tonPrev * 100) : null;
    const tonnageWeeks = twChrono.map((t, i) => {
      const isNow = i === twChrono.length - 1;
      return { label: t.label, current: isNow ? 'var(--gold-300)' : 'var(--text-faint)',
        labelColor: t.total ? (isNow ? 'var(--gold-300)' : 'var(--text-secondary)') : 'var(--text-faint)',
        totalK: t.total >= 1000 ? (t.total / 1000).toFixed(1) + 't' : t.total ? Math.round(t.total) + '' : '—',
        barStyle: t.total > 0 ? 'display:block; height:' + Math.max(6, t.total / maxTon * 74).toFixed(1) + 'px; border-radius:6px 6px 3px 3px; background:' + (isNow ? 'linear-gradient(180deg, var(--gold-400), var(--gold-500))' : 'var(--gold-500)') + ';' + (isNow ? ' box-shadow:0 0 16px -4px var(--gold-500);' : ' opacity:0.6;') : 'display:none;' };
    });
    const tonTrend = tonDelta == null ? '' : (tonDelta > 0 ? '↑ +' + tonDelta + '% vs minggu lalu' : tonDelta < 0 ? '↓ ' + tonDelta + '% vs minggu lalu' : '→ stabil');
    const tonTrendColor = tonDelta == null ? 'var(--text-faint)' : tonDelta >= 0 ? 'var(--data-positive)' : 'var(--warning)';
    // muscle distribution over 28d
    const md = { push: 0, pull: 0, legs: 0, core: 0 };
    tw.forEach(t => { md.push += t.push; md.pull += t.pull; md.legs += t.legs; md.core += t.core; });
    const mdTotal = md.push + md.pull + md.legs + md.core;
    const mdPct = (v) => mdTotal ? Math.round(v / mdTotal * 100) : 0;
    const mdSeg = (v, c) => v > 0 ? 'display:block; width:' + (v / (mdTotal || 1) * 100) + '%; background:' + c + ';' : 'display:none;';
    const muscleDistLegend = [['Push', md.push, 'var(--gold-500)'], ['Pull', md.pull, 'var(--cobalt-400)'], ['Legs', md.legs, 'var(--cat-4, #c17a45)'], ['Core', md.core, 'var(--data-neutral, #8a8f98)']].map(([label, v, color]) => ({ label, color, pct: mdPct(v) + '%' }));
    const weeks = [0, 1, 2, 3].map(k => {
      const mins = { ringan: 0, sedang: 0, berat: 0 };
      db.sessions.filter(s => s.cardio).forEach(s => { const d = FF.daysSince(s.date); if (d >= k * 7 && d < (k + 1) * 7) mins[s.cardio.intensity] += s.cardio.durationMinutes; });
      return { label: k === 0 ? 'Minggu ini' : k + ' minggu lalu', ...mins, total: mins.ringan + mins.sedang + mins.berat };
    });
    const maxWk = Math.max(...weeks.map(w => w.total), 1);
    const seg = v => v > 0 ? 'display:block; min-width:3px; width:' + (v / maxWk * 100) + '%;' : 'display:none;';
    const cardioWeeks = weeks.map((w, i) => {
      const isNow = i === 0;
      const segs = [];
      if (w.ringan) segs.push({ color: 'var(--data-positive)', label: 'Ringan ' + w.ringan + ' mnt' });
      if (w.sedang) segs.push({ color: 'var(--cobalt-400)', label: 'Sedang ' + w.sedang + ' mnt' });
      if (w.berat) segs.push({ color: 'var(--orange-500)', label: 'Berat ' + w.berat + ' mnt' });
      return { label: w.label, total: w.total,
        labelColor: isNow ? 'var(--gold-300)' : 'var(--text-muted)', totalColor: w.total ? (isNow ? 'var(--gold-300)' : 'var(--text-secondary)') : 'var(--text-faint)',
        s1: seg(w.ringan) + 'background:var(--data-positive);',
        s2: seg(w.sedang) + 'background:var(--cobalt-400);',
        s3: seg(w.berat) + 'background:var(--orange-500);',
        hasBreakdown: w.total > 0, segs };
    });
    const carRecent = db.sessions.filter(s => s.cardio && FF.daysSince(s.date) <= 28);
    const avgHrs = carRecent.filter(s => s.cardio.averageHr).map(s => s.cardio.averageHr);
    // HR zone distribution (time-weighted by session minutes, bucketed by avg HR / HRmax)
    const hrmax = FF.hrMax(db); const restHr = db.settings.restingHr;
    const zoneDefs = [
      { zn: 'Z1', name: 'Recovery', lo: 0.50, color: 'var(--data-positive)', hex: '#17b573' },
      { zn: 'Z2', name: 'Aerobik', lo: 0.60, color: '#6fae5a', hex: '#6fae5a' },
      { zn: 'Z3', name: 'Tempo', lo: 0.70, color: 'var(--cobalt-400)', hex: '#4d90c8' },
      { zn: 'Z4', name: 'Ambang', lo: 0.80, color: 'var(--warning)', hex: '#e8a13c' },
      { zn: 'Z5', name: 'Maksimal', lo: 0.90, color: 'var(--orange-500)', hex: '#d66d4f' },
    ];
    const zoneMin = [0, 0, 0, 0, 0];
    carRecent.forEach(s => {
      const hr = s.cardio.averageHr; if (!hr) return;
      const pct = (hr - restHr) / (hrmax - restHr);
      let zi = 0; for (let i = zoneDefs.length - 1; i >= 0; i--) { if (pct >= zoneDefs[i].lo - 0.10) { zi = i; break; } }
      zoneMin[zi] += s.cardio.durationMinutes;
    });
    const zoneTotal = zoneMin.reduce((a, b) => a + b, 0);
    const hrZones = zoneDefs.map((z, i) => ({ zn: z.zn, name: z.name, color: z.color,
      pct: zoneTotal ? Math.round(zoneMin[i] / zoneTotal * 100) + '%' : '0%',
      pctColor: zoneMin[i] > 0 ? z.color : 'var(--text-faint)',
      barStyle: 'display:block; height:100%; width:' + (zoneTotal ? zoneMin[i] / zoneTotal * 100 : 0) + '%; background:' + z.color + ';' }));
    const domZ = zoneMin.indexOf(Math.max(...zoneMin));
    const zoneInsight = zoneTotal ? 'Mayoritas waktu di ' + zoneDefs[domZ].zn + ' (' + zoneDefs[domZ].name + '). ' +
      (domZ <= 1 ? 'Basis aerobik bagus — sesekali tambah interval Z4 untuk naikkan ambang.' : domZ >= 3 ? 'Intensitas tinggi dominan — pastikan cukup sesi Z1–Z2 untuk pemulihan.' : 'Distribusi tempo seimbang.') : '';
    const cardioSummary = '';

    // Strength KPIs (last 28 days)
    const strSess28 = db.sessions.filter(s => s.sessionType === 'strength' && FF.daysSince(s.date) <= 28);
    const tonnage28 = strSess28.reduce((a, s) => a + (s.exercises || []).reduce((b, e) => b + FF.setTonnage(db, e.exId, e.sets), 0), 0);
    const prCount14 = new Set(db.sessions.filter(s => FF.daysSince(s.date) <= 14).flatMap(s => FF.sessionPRs(db, s.id).map(p => p.exId + ':' + s.id))).size;
    const strengthKpis = [
      { label: 'sesi · 28h', value: String(strSess28.length), sub: 'strength', color: 'var(--text-primary)' },
      { label: 'total tonnage', value: tonnage28 >= 1000 ? (tonnage28 / 1000).toFixed(1) + 't' : Math.round(tonnage28) + '', sub: 'kg diangkat · 28h', color: 'var(--gold-300)' },
      { label: 'PR · 14h', value: String(prCount14), sub: prCount14 ? 'rekor baru' : 'belum ada', color: prCount14 ? 'var(--data-positive)' : 'var(--text-muted)' },
    ];
    // Cardio KPIs (last 28 days)
    const carDist = carRecent.reduce((a, s) => a + (s.cardio.distanceKm || 0), 0);
    const carAvgHr = avgHrs.length ? Math.round(avgHrs.reduce((a, b) => a + b, 0) / avgHrs.length) : null;
    const weeksWithCardio = [0, 1, 2, 3].filter(k => db.sessions.some(s => s.cardio && FF.daysSince(s.date) >= k * 7 && FF.daysSince(s.date) < (k + 1) * 7)).length;
    const carMin28 = carRecent.reduce((a, s) => a + s.cardio.durationMinutes, 0);
    const carMinPrev = db.sessions.filter(s => s.cardio && FF.daysSince(s.date) >= 7 && FF.daysSince(s.date) < 14).reduce((a, s) => a + s.cardio.durationMinutes, 0);
    const carMinNow = weeks[0].total;
    const carTrend = carMinPrev ? Math.round((carMinNow - carMinPrev) / carMinPrev * 100) : null;
    const cardioKpis = [
      { label: 'jarak · 28h', value: carDist ? carDist.toFixed(1) : '—', sub: 'km total', color: 'var(--cobalt-400)', glow: 'rgba(77,144,200,0.16)', icon: 'M12 21 C7 17 4 13 4 9 A4 4 0 0 1 12 7 A4 4 0 0 1 20 9 C20 13 17 17 12 21 Z' },
      { label: 'rata-rata HR', value: carAvgHr ? String(carAvgHr) : '—', sub: carAvgHr ? 'bpm' : 'belum ada', color: 'var(--orange-500)', glow: 'rgba(214,109,79,0.16)', icon: 'M3 12 H6 L8 6 L11 18 L14 9 L16 12 H21' },
      { label: 'konsistensi', value: weeksWithCardio + '/4', sub: 'minggu aktif', color: weeksWithCardio >= 3 ? 'var(--data-positive)' : 'var(--warning)', glow: 'rgba(23,181,115,0.16)', icon: 'M20 6 L9 17 L4 12' },
    ];
    const cardioSummaryTiles = [
      { label: 'total sesi', value: String(carRecent.length), sub: 'cardio + Muay Thai', color: 'var(--text-primary)' },
      { label: 'total menit', value: String(carMin28), sub: carDist ? carDist.toFixed(1) + ' km' : 'durasi 28h', color: 'var(--cobalt-400)' },
      { label: 'menit minggu ini', value: String(carMinNow), sub: carTrend == null ? 'belum ada pembanding' : (carTrend >= 0 ? '↑ +' : '↓ ') + Math.abs(carTrend) + '% vs lalu', color: carTrend == null ? 'var(--text-primary)' : carTrend >= 0 ? 'var(--data-positive)' : 'var(--warning)' },
      { label: 'rata-rata HR', value: carAvgHr ? carAvgHr + '' : '—', sub: carAvgHr ? 'bpm · zona ' + (hrZones.findIndex(z => z.pct !== '0%') >= 0 ? 'tercatat' : '—') : 'belum ada', color: 'var(--orange-500)' },
    ];
    const cardioGuideline = 'Pedoman umum: aktivitas aerobik rutin + strength otot utama ≥2 hari/minggu (referensi evaluasi, bukan jadwal wajib).';

    const repYm = S.reportYm || calYm;
    const rp = FF.monthlyReport(db, repYm);
    // report deltas, ring, grade
    const delBadge = (from, to, downGood) => {
      if (from == null || to == null) return { has: false };
      const d = +(to - from).toFixed(1);
      const good = d === 0 ? null : (downGood ? d < 0 : d > 0);
      const col = good === null ? '#8a8f98' : good ? '#17b573' : '#c74436';
      return { has: true, text: (d > 0 ? '↑ +' : d < 0 ? '↓ ' : '→ ') + (d === 0 ? '0' : Math.abs(d)), col };
    };
    const [ry, rmo] = repYm.split('-').map(Number);
    const daysInMonth = new Date(ry, rmo, 0).getDate();
    const activeDaySet = new Set(db.sessions.filter(s => { const d = new Date(s.date); return d.getFullYear() === ry && d.getMonth() + 1 === rmo; }).map(s => new Date(s.date).getDate()));
    const rpActiveDays = activeDaySet.size;
    const monthElapsed = (ry === now.getFullYear() && rmo === now.getMonth() + 1) ? now.getDate() : daysInMonth;
    const ringPct = monthElapsed ? Math.min(1, rpActiveDays / (monthElapsed * 0.5)) : 0; // 50% of days = full ring
    const ringCirc = 2 * Math.PI * 36;
    const ringDash = (ringPct * ringCirc).toFixed(1) + ' ' + ringCirc.toFixed(1);
    const grade = rpActiveDays >= monthElapsed * 0.5 ? { t: 'SANGAT KONSISTEN', c: '#17b573' } : rpActiveDays >= monthElapsed * 0.33 ? { t: 'AKTIF · BAIK', c: '#e8a13c' } : { t: 'PERLU DITINGKATKAN', c: '#c74436' };
    const wDel = delBadge(rp.wStart, rp.wEnd, true);
    const waistDel = delBadge(rp.waistStart, rp.waistEnd, true);
    const rpKpis = [
      { label: 'sesi', value: String(rp.sessions), sub: rp.strength + ' str · ' + rp.cardio + ' cardio · ' + rp.muaythai + ' MT · ' + rp.recovery + ' rec', glow: 'rgba(217,155,62,0.14)', hasDelta: false },
      { label: 'total durasi', value: String(rp.totalMin), sub: 'menit · ' + rp.setCount + ' working set', glow: 'rgba(77,144,200,0.14)', hasDelta: false },
      { label: 'berat (avg 7d)', value: rp.wEnd != null ? rp.wEnd + '' : '—', sub: rp.wStart != null ? 'dari ' + rp.wStart + ' kg' : 'kg', glow: 'rgba(217,155,62,0.14)', hasDelta: wDel.has, delta: wDel.text, deltaStyle: 'font-family:var(--font-mono); font-size:11px; padding:2px 7px; border-radius:999px; white-space:nowrap; color:' + wDel.col + '; background:' + this.hexA(wDel.col, 0.12) + '; border:1px solid ' + this.hexA(wDel.col, 0.3) + ';' },
      { label: 'lingkar perut', value: rp.waistEnd != null ? rp.waistEnd + '' : '—', sub: rp.waistStart != null ? 'dari ' + rp.waistStart + ' cm' : 'cm', glow: 'rgba(77,144,200,0.14)', hasDelta: waistDel.has, delta: waistDel.text, deltaStyle: 'font-family:var(--font-mono); font-size:11px; padding:2px 7px; border-radius:999px; white-space:nowrap; color:' + waistDel.col + '; background:' + this.hexA(waistDel.col, 0.12) + '; border:1px solid ' + this.hexA(waistDel.col, 0.3) + ';' },
    ];
    const reportMonths = [0, 1, 2].map(k => { const d = new Date(now.getFullYear(), now.getMonth() - k, 1);
      const ym = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
      return { label: d.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }), onTap: () => set({ reportYm: ym }), style: this.chip(repYm === ym) + 'white-space:nowrap;' }; });

    /* ---------- MORE ---------- */
    const eqRows = db.equipment.filter(e => e.loc === S.eqLoc).map(e => ({
      name: e.name, incStr: e.inc ? '· inc ' + e.inc + ' kg' : '', color: e.available ? 'var(--text-primary)' : 'var(--text-faint)',
      pillLabel: e.available ? 'Tersedia' : 'Tidak ada',
      pillStyle: 'flex:none; padding:6px 12px; border-radius:999px; font-size:11.5px; font-weight:600;' + (e.available ? 'background:rgba(23,181,115,0.12); color:var(--data-positive); border:1px solid rgba(23,181,115,0.35);' : 'background:transparent; color:var(--text-faint); border:1px solid var(--border-subtle);'),
      onToggle: () => this.mut(d => { const x = d.equipment.find(q => q.id === e.id); x.available = !x.available; }),
    }));
    const exQ = (S.exSearch || '').trim().toLowerCase();
    const exMatch = FF.EX.filter(e => !exQ || e.name.toLowerCase().includes(exQ) || (FF.PAT_LABEL[e.pat] || '').toLowerCase().includes(exQ) || e.equip.toLowerCase().includes(exQ) || e.mus.some(m => (FF.MUSCLE_LABEL[m] || '').toLowerCase().includes(exQ)));
    const exGroups = Object.keys(FF.PAT_LABEL).map(pat => ({
      label: FF.PAT_LABEL[pat], count: exMatch.filter(e => e.pat === pat).length,
      items: exMatch.filter(e => e.pat === pat).map(e => ({ name: e.name, equip: e.equip, onOpen: () => set({ techId: e.id, techTab: 'teknik' }) })),
    })).filter(g => g.count > 0);
    const tech = S.techId ? FF.techniqueFor(S.techId) : null;
    const patAccent = { 'Horizontal Push': '#e0954a', 'Vertical Push': '#e0954a', 'Horizontal Pull': '#4d90c8', 'Vertical Pull': '#4d90c8', 'Squat / Knee-dominant': '#c17a45', 'Hinge / Hip-dominant': '#c17a45', 'Shoulder Abduction': '#d9a343', 'Elbow Flexion': '#4d90c8', 'Elbow Extension': '#e0954a', 'Calf Plantar Flexion': '#c17a45', 'Core Stability': '#8a8f98' };
    const tAcc = tech ? (patAccent[tech.pattern] || 'var(--gold-400)') : 'var(--gold-400)';
    const plainCard = 'background:var(--surface-warm-card); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:14px 16px;';
    const sec = (t, d, o) => ({ t, d, icon: o.icon, cardStyle: o.cardStyle || plainCard, labelColor: o.labelColor || 'var(--text-muted)',
      iconStyle: 'width:22px; height:22px; border-radius:6px; display:inline-flex; align-items:center; justify-content:center; font-size:11px; font-family:var(--font-mono); flex:none; ' + (o.iconStyle || 'background:var(--surface-warm-raised); color:var(--text-muted);') });
    const techVals = tech ? {
      tOpen: true, tName: tech.name, tPattern: tech.pattern, tTarget: tech.target, tSupport: tech.support, tEquip: tech.equip,
      tTabTeknik: (S.techTab || 'teknik') === 'teknik', tTabHistori: S.techTab === 'histori',
      tShowTeknik: () => set({ techTab: 'teknik' }), tShowHistori: () => set({ techTab: 'histori' }),
      tTeknikStyle: 'flex:1; height:34px; border:none; border-radius:999px; font-size:12.5px; cursor:pointer;' + ((S.techTab || 'teknik') === 'teknik' ? 'background:var(--interactive-warm); color:var(--interactive-warm-ink); font-weight:700;' : 'background:transparent; color:var(--text-muted);'),
      tHistoriStyle: 'flex:1; height:34px; border:none; border-radius:999px; font-size:12.5px; cursor:pointer;' + (S.techTab === 'histori' ? 'background:var(--interactive-warm); color:var(--interactive-warm-ink); font-weight:700;' : 'background:transparent; color:var(--text-muted);'),
      ...(function () {
        const h = FF.exerciseHistory(db, S.techId);
        if (!h.count) return { thHasData: false, thEmpty: true };
        const W = 320, H = 90, e = h.rows.map(r => r.e1rm), mn = Math.min(...e), mx = Math.max(...e), rng = (mx - mn) || 1;
        const X = i => h.rows.length < 2 ? W / 2 : (i / (h.rows.length - 1)) * W;
        const Y = v => H - 8 - ((v - mn) / rng) * (H - 16);
        const pts = h.rows.map((r, i) => [X(i), Y(r.e1rm)]);
        const line = 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L');
        return {
          thHasData: true, thEmpty: false,
          thPR: h.pr + ' kg', thPRDate: h.prDate ? new Date(h.prDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '—',
          thDelta: (h.delta > 0 ? '+' : '') + h.delta + ' kg', thDeltaColor: h.delta > 0 ? 'var(--data-positive)' : h.delta < 0 ? 'var(--data-negative)' : 'var(--text-faint)',
          thCount: h.count, thSets: h.totalSets, thVol: (h.totalVol >= 1000 ? (h.totalVol / 1000).toFixed(1) + 't' : h.totalVol) + ' total',
          thMin: h.min, thMax: h.max, thPath: line, thArea: line + ' L' + W + ',' + H + ' L0,' + H + ' Z',
          thLastX: pts[pts.length - 1][0].toFixed(1), thLastY: pts[pts.length - 1][1].toFixed(1),
          thRows: h.rows.slice().reverse().slice(0, 10).map(r => ({
            date: new Date(r.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
            best: (r.bestW ? r.bestW + '×' : '') + r.bestReps, e1rm: r.e1rm + '', sets: r.sets + '', isPR: r.e1rm === h.pr,
          })),
        };
      })(),
      tAccent: tAcc, tAccentSoft: hexA(tAcc.startsWith('#') ? tAcc : '#d9a343', 0.1), tAccentBorder: hexA(tAcc.startsWith('#') ? tAcc : '#d9a343', 0.4), tAccentGlow: hexA(tAcc.startsWith('#') ? tAcc : '#d9a343', 0.22),
      tSections: [
        sec('equipment setup', tech.setup, { icon: '⚙' }),
        sec('starting position', tech.startpos, { icon: '⌖' }),
        sec('execution steps', tech.steps.map((s, i) => (i + 1) + '.  ' + s).join('\n'), { icon: '▶', cardStyle: 'background:var(--surface-warm-hi); border:1px solid var(--border-warm); border-radius:var(--radius-md); padding:14px 16px;', labelColor: 'var(--gold-300)', iconStyle: 'background:var(--interactive-warm-soft); color:var(--gold-300);' }),
        sec('breathing', tech.breathing, { icon: '≈' }),
        sec('tempo & range of motion', tech.tempo + '\n' + tech.rom, { icon: '◔' }),
        sec('mind-muscle connection', tech.cues, { icon: '◈', cardStyle: 'background:var(--interactive-warm-soft); border:1px solid var(--border-warm); border-radius:var(--radius-md); padding:14px 16px;', labelColor: 'var(--gold-300)', iconStyle: 'background:var(--gold-500); color:var(--interactive-warm-ink);' }),
        sec('common mistakes', tech.mistakes.map(m => '✕  ' + m).join('\n'), { icon: '!', cardStyle: 'background:rgba(199,68,54,0.06); border:1px solid rgba(199,68,54,0.3); border-left:3px solid var(--danger); border-radius:var(--radius-md); padding:14px 16px;', labelColor: 'var(--danger)', iconStyle: 'background:rgba(199,68,54,0.2); color:var(--danger);' }),
        sec('safety', tech.safety, { icon: '✚', cardStyle: 'background:rgba(232,161,60,0.06); border:1px solid rgba(232,161,60,0.28); border-radius:var(--radius-md); padding:14px 16px;', labelColor: 'var(--warning)', iconStyle: 'background:rgba(232,161,60,0.18); color:var(--warning);' }),
        sec('alternatives', tech.alternatives.join('  ·  '), { icon: '⇄' }),
        sec('references', tech.refs, { icon: '§' }),
      ],
      tClose: () => set({ techId: null }),
    } : { tOpen: false };
    const zones = [0.6, 0.7, 0.8].map((z, i) => 'Z' + (i + 2) + ' ±' + Math.round(z * (FF.hrMax(db) - db.settings.restingHr) + db.settings.restingHr));
    const csvBtns = Object.keys(FF.toCSVs(db)).map(name => ({ label: name, onTap: () => this.download(name, FF.toCSVs(this.state.db)[name], 'text/csv') }));

    const riVals = S.riData ? {
      riOpen: true,
      riSummary: 'File berisi:\n· ' + (S.riData.sessions || []).length + ' sesi latihan\n· ' + (S.riData.bodyMetrics || []).length + ' catatan berat\n· ' + (S.riData.waist || []).length + ' ukuran lingkar perut\n· ' + (S.riData.equipment || []).length + ' equipment',
      riConfirm: () => { try { localStorage.setItem('fitflow.safety-backup', JSON.stringify(this.state.db)); } catch (e) {}
        this.state.db = FF.normalizeDb(S.riData); this.persist(); set({ riData: null }); },
      riCancel: () => set({ riData: null }),
    } : { riOpen: false };

    /* ---------- shared ---------- */
    const nutNeedsLog = (() => { const t = FF.nutToday(db); return (t && t.length ? t : []).length === 0; })();
    const rest = S.rest;
    const restLeft = rest ? Math.max(0, Math.ceil((rest.endAt - Date.now()) / 1000)) : 0;
    const icons = {
      home: 'M4 11.2 L12 4.5 L20 11.2 M6.2 9.6 V19.5 H10 V14.5 H14 V19.5 H17.8 V9.6',
      workout: 'M4.5 9.5 V14.5 M7 8 V16 M7 12 H17 M17 8 V16 M19.5 9.5 V14.5',
      history: 'M12 3.5 A8.5 8.5 0 1 0 12 20.5 A8.5 8.5 0 0 0 12 3.5 M12 7.5 V12 L15.2 14.2',
      progress: 'M4 19.5 H20 M8 19.5 V12.5 H10.5 V19.5 M12 19.5 V6.5 H14.5 V19.5 M16 19.5 V10 H18.5 V19.5',
      more: 'M6 7.5 H19 M5 12 H17 M7 16.5 H15',
      nutrition: 'M12 3 C9 3 7 6 7 10 C7 15 9.5 21 12 21 C14.5 21 17 15 17 10 C17 6 15 3 12 3 Z M12 3 C12 7 14 8 14.5 11',
    };
    const navItems = [['home', 'Home'], ['workout', 'Latihan'], ['nutrition', 'Nutrisi'], ['history', 'History'], ['progress', 'Progress'], ['more', 'More']].map(([id, label]) => ({
      label, icon: icons[id], onTap: () => set({ tab: id, cardioFormOpen: false }),
      dotStyle: 'position:absolute; top:-3px; right:-5px; width:7px; height:7px; border-radius:99px; background:var(--gold-500); box-shadow:0 0 6px var(--gold-500);' + ((id === 'workout' && active) || (id === 'nutrition' && nutNeedsLog) ? '' : 'display:none;'),
      style: 'display:flex; flex-direction:column; align-items:center; gap:4px; padding:7px 0 6px; background:transparent; border:none; cursor:pointer; border-radius:14px; transition:color 160ms, background 160ms; color:' + (S.tab === id ? 'var(--gold-300)' : 'var(--text-faint)') + ';' + (S.tab === id ? 'background:rgba(232,161,60,0.12);' : ''),
    }));

    return {
      ready: true,
      tabHome: S.tab === 'home', tabWorkout: S.tab === 'workout', tabHistory: S.tab === 'history', tabProgress: S.tab === 'progress', tabMore: S.tab === 'more', tabNutrition: S.tab === 'nutrition',
      todayStr: now.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' }),
      hasReminders: reminders.length > 0, reminders,
      readinessOpts, soreOpts, locOpts, minOpts,
      recType: rec.type, recFocus: rec.focus, recDur: rec.durationMin, recIntensity: rec.intensity,
      recVisible: !active, recHidden: !!active, recHasWhy: !!rec.why, recWhy: rec.why || '',
      recMeta: rec.kind === 'strength' ? rec.exercises.length + ' gerakan · ' + rec.workingSets + ' set' : rec.location,
      recHasItems: (rec.items || []).length > 0, recItems: rec.items || [],
      recHasExercises: (rec.exercises || []).length > 0, recExList,
      startPrimary: () => this.startSession(),
      startLabel: rec.kind === 'strength' ? 'Mulai sesi' : rec.kind === 'recovery' ? 'Catat recovery' : 'Log sesi ini',
      refreshRec: () => set({ altOpen: !S.altOpen }),
      altOpen: S.altOpen,
      altOpts: S.altOpen ? FF.alternatives(db, ctx, rec.type).map(a => ({ title: a.title, sub: a.sub, onPick: () => this.pickAlternative(a.rec) })) : [],
      showReasons: (this.props.showEngineReasons ?? true) && S.tab === 'home', recReasons: rec.reasons,
      reasonsOpen: S.reasonsOpen, reasonsChevron: S.reasonsOpen ? '▲' : '▼',
      toggleReasons: () => set({ reasonsOpen: !S.reasonsOpen }),
      ctxCollapsed: S.ctxDone, ctxOpen: !S.ctxDone,
      ctxSummary: ({ fit: 'Fit', 'agak-lelah': 'Agak lelah', lelah: 'Lelah' }[ctx.readiness]) + ' · ' +
        (FF.LOCATIONS.find(l => l.id === ctx.locationId)?.short || '') + ' · ' + ctx.minutes + '′' +
        (ctx.soreness.length ? ' · nyeri ' + ctx.soreness.length + ' area' : ''),
      openCtx: () => set({ ctxDone: false }),
      closeCtx: () => { this.saveCtx(); set({ ctxDone: true }); },
      remindersOpen: S.remindersOpen,
      reminderSummary: reminders.length === 1 ? reminders[0] : reminders.length + ' pengingat hari ini',
      reminderChevron: reminders.length === 1 ? '' : S.remindersOpen ? '▲' : '▼',
      toggleReminders: () => set({ remindersOpen: !S.remindersOpen }),
      preview, bodyTiles,
      rm: rmColors, recoveryRows, rmReadyCount: rmReady,
      recapTiles: (() => {
        const wkSess = db.sessions.filter(s => s.status === 'completed' && FF.daysSince(s.date) < 7).length;
        const wkTon = db.sessions.filter(s => s.sessionType === 'strength' && FF.daysSince(s.date) < 7)
          .reduce((a, s) => a + (s.exercises || []).reduce((b, e) => b + FF.setTonnage(db, e.exId, e.sets), 0), 0);
        const stk = FF.streakInfo(db);
        const pStreak = FF.nutritionProteinStreak(db);
        return [
          { value: String(wkSess), label: 'sesi · 7h', color: 'var(--text-primary)' },
          { value: wkTon >= 1000 ? (wkTon / 1000).toFixed(1) + 't' : (wkTon ? Math.round(wkTon) + '' : '—'), label: 'tonnage', color: 'var(--gold-300)' },
          { value: stk.weekStreak + '', label: 'minggu konsisten', color: stk.weekStreak > 0 ? 'var(--data-positive)' : 'var(--text-faint)' },
          { value: pStreak + '', label: 'streak protein', color: pStreak > 0 ? 'var(--cobalt-400)' : 'var(--text-faint)' },
        ];
      })(),
      ...this.streakVals(set), ...this.achievementVals(set),
      ...this.celebrationVals(set), ...this.onboardingVals(set), ...this.nutritionVals(set),
      rmFront: (S.rmView || 'front') === 'front', rmBack: S.rmView === 'back',
      rmShowFront: () => set({ rmView: 'front' }), rmShowBack: () => set({ rmView: 'back' }),
      rmFrontStyle: 'min-height:30px; padding:5px 14px; border:none; border-radius:999px; font-size:11.5px; cursor:pointer;' + ((S.rmView || 'front') === 'front' ? 'background:var(--cobalt-500,#2f6db0); color:#fff; font-weight:600;' : 'background:transparent; color:var(--text-muted);'),
      rmBackStyle: 'min-height:30px; padding:5px 14px; border:none; border-radius:999px; font-size:11.5px; cursor:pointer;' + (S.rmView === 'back' ? 'background:var(--cobalt-500,#2f6db0); color:#fff; font-weight:600;' : 'background:transparent; color:var(--text-muted);'),
      bwLatest: bw != null ? bw.toFixed(1) : '—', bfLatest: bf != null ? bf.toFixed(1) + '%' : '—',
      waistLatest: lastWaist ? lastWaist.waistCm + ' cm' : '—',
      bwDelta: bw != null ? (bw - db.targets.weightKg).toFixed(1) + ' kg ke target' : '',
      bwDeltaColor: bw != null && bw - db.targets.weightKg <= 0 ? 'var(--data-positive)' : 'var(--text-muted)',
      toTarget: bw != null ? (bw - db.targets.weightKg).toFixed(1) + ' kg' : '—',
      qw: S.qw, qbf: S.qbf, onQw: e => set({ qw: e.target.value }), onQbf: e => set({ qbf: e.target.value }),
      bfPlaceholder: bfEst ? '≈' + bfEst.bf : 'BF %',
      bfEstimateHint: !!(bfEst && !String(S.qbf).trim()),
      bfEstimateText: bfEst ? 'Tanpa timbangan BF? Akan diisi ≈' + bfEst.bf + '% (' + bfEst.method + ', ' + bfEst.basedOn + ' data). Ditandai estimasi.' : '',
      saveBody: () => this.saveBodyEntry(S.qw, S.qbf, S.qDate, () => set({ qw: '', qbf: '' })),
      qDate: S.qDate || FF.localDate(), qDateMax: FF.localDate(), onQDate: e => set({ qDate: e.target.value }), qDateIsPast: !!S.qDate && S.qDate < FF.localDate(),
      bodyLoggedToday: !!loggedToday, timeCat: loggedToday ? loggedToday.timeCategory : '',
      abTitle: active ? active.title : '', abElapsed: active ? fmtElapsed(Math.floor((Date.now() - active.startedAt) / 60000)) : '',
      abStarted: active ? new Date(active.startedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '',
      goWorkout: () => set({ tab: 'workout' }),
      ...cardioVals, ...asVals,
      hasActive: !!active, noActive: !active,
      asWarmupPhase: active ? active.phase === 'warmup' : false, asMainPhase: active ? active.phase === 'main' : false,
      cooldown: FF.COOLDOWN,
      replOpen: replFor != null, replOpts, closeRepl: () => set({ replFor: null }),
      fbOpen: S.fbOpen, fbNote: S.fbNote || '', fbSetNote: (e) => set({ fbNote: e.target.value }),
      fbRingan: () => this.finishSession('terlalu-ringan'), fbPas: () => this.finishSession('pas'), fbBerat: () => this.finishSession('berat'), fbCancel: () => set({ fbOpen: false }),
      calLabel: first.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
      calPrev: () => set({ dayFilter: null, calYm: new Date(cy, cm - 2, 1).getFullYear() + '-' + String(new Date(cy, cm - 2, 1).getMonth() + 1).padStart(2, '0') }),
      calNext: () => set({ dayFilter: null, calYm: new Date(cy, cm, 1).getFullYear() + '-' + String(new Date(cy, cm, 1).getMonth() + 1).padStart(2, '0') }),
      calCells, histCards, ...sdVals,
      histEmpty: histCards.length === 0, histEmptyTitle: db.sessions.length ? 'Tidak ada sesi di bulan ini' : 'Belum ada sesi tercatat',
      histEmptyText: db.sessions.length ? 'Geser ke bulan lain dengan tombol ‹ ›, atau mulai sesi baru dari Home.' : 'Sesi pertamamu akan muncul di kalender dan timeline ini. Mulai dari rekomendasi di Home, atau catat cardio/Muay Thai dari tab Latihan.',
      histGoHome: () => set({ tab: 'home' }),
      dayFilterOn: !!S.dayFilter, dayFilterLabel: S.dayFilter ? S.dayFilter + ' ' + first.toLocaleDateString('id-ID', { month: 'short' }) : '',
      clearDayFilter: () => set({ dayFilter: null }),
      pTabs, pBody: S.pTab === 'body', pStrength: S.pTab === 'strength', pCardio: S.pTab === 'cardio', pReport: S.pTab === 'report', pBadge: S.pTab === 'badge',
      ma7: ma7 != null ? ma7 : '—', ma30: ma30 != null ? ma30 : '—',
      wPath: wp.line, wArea: wp.area, wMin: wp.min + ' kg', wMax: wp.max + ' kg', bfPath: bfp.line,
      wHasData: !!wp.hasTarget, wNoData: !wp.hasTarget, waistTargetCm: db.targets.waistCm,
      bfArea: bfp.area, bfLastX: bfx.lastX, bfLastY: bfx.lastY, bfMin: bfx.min, bfMax: bfx.max, bfTarget: db.targets.bodyFat,
      bfHasTarget: !!bfx.hasTarget, bfTargetY: bfx.targetY,
      bwBadge: bwBadgeO.text, bwBadgeStyle: bwBadgeO.style, bfBadge: bfBadgeO.text, bfHasTrend: ms.filter(m => m.bodyFatPercentage != null).length >= 2, bfNoTrend: ms.filter(m => m.bodyFatPercentage != null).length < 2, bfBadgeStyle: bfBadgeO.style,
      waistHasBar: waistToBar > 0, waistBarStyle: 'display:block; height:100%; width:' + waistToBar + '%; background:var(--cobalt-400);',
      wMaPath: wp.maPath, wHasTarget: wp.hasTarget, wTargetY: wp.targetY,
      wTargetLabelY: wp.hasTarget ? Math.max(9, +wp.targetY - 3) : 0, wTargetVal: tgt + ' kg',
      wLastX: wp.lastX, wLastY: wp.lastY,
      waistRows: wRowsRaw.map((w, i) => {
        const prev = wRowsRaw[i + 1];
        const d = prev ? +(w.waistCm - prev.waistCm).toFixed(1) : null;
        return { date: new Date(w.measuredAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }), v: w.waistCm,
          trend: d == null ? '' : (d < 0 ? '↓ ' + Math.abs(d) : d > 0 ? '↑ ' + d : '→'),
          trendColor: d == null ? 'var(--text-faint)' : d < 0 ? 'var(--data-positive)' : d > 0 ? 'var(--data-negative)' : 'var(--text-faint)',
          onDel: () => { const snap = { ...w }; this.mut(dd => dd.waist = dd.waist.filter(x => x.id !== w.id)); set({ undo: { label: 'Lingkar perut ' + w.waistCm + ' cm dihapus', waistEntry: snap, expireAt: Date.now() + 6000 } }); } };
      }),
      bmOpen: !!S.bmOpen, bmToggle: () => set({ bmOpen: !S.bmOpen }),
      hW: S.hW, hBf: S.hBf, hDate: S.hDate || FF.localDate(), hDateMax: FF.localDate(),
      onHW: e => set({ hW: e.target.value }), onHBf: e => set({ hBf: e.target.value }), onHDate: e => set({ hDate: e.target.value }),
      hSave: () => this.saveBodyEntry(S.hW, S.hBf, S.hDate, () => set({ hW: '', hBf: '' })),
      bmCount: db.bodyMetrics.length,
      bmToggleLabel: S.bmOpen ? 'Tutup riwayat pengukuran' : 'Tambah (tanggal bebas) / edit riwayat berat & body fat',
      bmRows: db.bodyMetrics.slice().sort((a, b) => new Date(b.measuredAt) - new Date(a.measuredAt)).slice(0, 60).map(m => ({ key: m.id,
        date: new Date(m.measuredAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: '2-digit' }) + (m.bfEstimated ? ' · est' : ''),
        w: m.weightKg != null ? String(m.weightKg) : '', bf: m.bodyFatPercentage != null ? String(m.bodyFatPercentage) : '',
        onW: (e) => { const raw = String(e.target.value).trim().replace(',', '.'); const n = Number(raw); if (raw === '' || !Number.isFinite(n) || n < 20 || n > 400) { e.target.value = m.weightKg != null ? String(m.weightKg) : ''; this.toast('Berat 20–400 kg.'); return; } this.mut(dd => { const x = dd.bodyMetrics.find(q => q.id === m.id); if (x) x.weightKg = +n.toFixed(2); }); },
        onBf: (e) => { const raw = String(e.target.value).trim().replace(',', '.'); if (raw === '') { this.mut(dd => { const x = dd.bodyMetrics.find(q => q.id === m.id); if (x) { x.bodyFatPercentage = null; x.bfEstimated = false; } }); return; } const n = Number(raw); if (!Number.isFinite(n) || n < 3 || n > 70) { e.target.value = m.bodyFatPercentage != null ? String(m.bodyFatPercentage) : ''; this.toast('Body fat 3–70%, atau kosongkan.'); return; } this.mut(dd => { const x = dd.bodyMetrics.find(q => q.id === m.id); if (x) { x.bodyFatPercentage = n; x.bfEstimated = false; } }); },
        onDel: () => { const snap = { ...m }; this.mut(dd => dd.bodyMetrics = dd.bodyMetrics.filter(q => q.id !== m.id)); set({ undo: { label: 'Pengukuran ' + (m.weightKg || '') + ' kg dihapus', metricEntry: snap, expireAt: Date.now() + 6000 } }); },
      })),
      wIn: S.wIn, onWIn: e => set({ wIn: e.target.value }),
      wDate: S.wDate || FF.localDate(), wDateMax: FF.localDate(), onWDate: e => set({ wDate: e.target.value }),
      saveWaist: () => { const v = FF.clamp(String(S.wIn).replace(',', '.'), 40, 200, null); if (!v) { this.toast('Isi lingkar perut yang wajar (40–200 cm).'); return; }
        if (S.wDate && S.wDate > FF.localDate()) { this.toast('Tanggal tidak boleh di masa depan.'); return; }
        const at = FF.measuredAtFor(S.wDate);
        this.mut(d => d.waist.push({ id: FF.uid(), measuredAt: at, waistCm: v })); set({ wIn: '' });
        this.toast('Tersimpan: perut ' + v + ' cm · ' + new Date(at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }), 2400); },
      strengthRows, tonnageWeeks, cardioWeeks, cardioSummary, strengthKpis, cardioKpis,
      hrZones, hasZones: zoneTotal > 0, noZones: zoneTotal === 0, hrMaxVal: hrmax, zoneInsight,
      cardioSummaryTiles, cardioGuideline,
      tonTrend, tonTrendColor, muscleDistLegend,
      hasMuscleDist: mdTotal > 0, noMuscleDist: mdTotal === 0,
      mdPush: mdSeg(md.push, 'var(--gold-500)'), mdPull: mdSeg(md.pull, 'var(--cobalt-400)'), mdLegs: mdSeg(md.legs, 'var(--cat-4, #c17a45)'), mdCore: mdSeg(md.core, 'var(--data-neutral, #8a8f98)'),
      reportMonths, rpLabel: rp.label, rpSummary: rp.summary,
      rpActiveDays, ringDash, rpGrade: grade.t, gradeColor: grade.c, gradeBg: this.hexA(grade.c, 0.1), gradeBorder: this.hexA(grade.c, 0.35), rpKpis,
      rpTopEx: rp.topEx.map(e => ({ name: e.name, count: e.count, str: e.first + ' → ' + e.last + ' kg',
        badge: e.delta > 0 ? '↑ +' + e.delta : e.delta < 0 ? '↓ ' + Math.abs(e.delta) : 'stabil',
        badgeStyle: 'font-family:var(--font-mono); font-size:10px; padding:2px 7px; border-radius:999px; white-space:nowrap; color:' + (e.delta > 0 ? '#17b573' : e.delta < 0 ? '#c74436' : '#8a8f98') + '; background:' + this.hexA(e.delta > 0 ? '#17b573' : e.delta < 0 ? '#c74436' : '#8a8f98', 0.12) + '; border:1px solid ' + this.hexA(e.delta > 0 ? '#17b573' : e.delta < 0 ? '#c74436' : '#8a8f98', 0.3) + ';' })),
      rpUnder: rp.under.length ? rp.under.join(', ') : 'tidak ada — coverage merata',
      rpCardio: 'Cardio: ' + rp.carMin + ' menit total, ' + rp.carKm + ' km · intensitas ringan ' + (rp.intDist.ringan || 0) + ' / sedang ' + (rp.intDist.sedang || 0) + ' / berat ' + (rp.intDist.berat || 0) + ' sesi.',
      rpCardioTiles: [
        { isValue: true, isBar: false, label: 'menit cardio', value: String(rp.carMin), sub: rp.carKm + ' km total', color: 'var(--cobalt-400)' },
        { isValue: false, isBar: true, label: 'distribusi intensitas',
          s1: ((rp.intDist.ringan || 0) ? 'display:block; min-width:4px; width:' + ((rp.intDist.ringan || 0) / Math.max(1, (rp.intDist.ringan || 0) + (rp.intDist.sedang || 0) + (rp.intDist.berat || 0)) * 100) + '%; background:var(--data-positive);' : 'display:none;'),
          s2: ((rp.intDist.sedang || 0) ? 'display:block; min-width:4px; width:' + ((rp.intDist.sedang || 0) / Math.max(1, (rp.intDist.ringan || 0) + (rp.intDist.sedang || 0) + (rp.intDist.berat || 0)) * 100) + '%; background:var(--cobalt-400);' : 'display:none;'),
          s3: ((rp.intDist.berat || 0) ? 'display:block; min-width:4px; width:' + ((rp.intDist.berat || 0) / Math.max(1, (rp.intDist.ringan || 0) + (rp.intDist.sedang || 0) + (rp.intDist.berat || 0)) * 100) + '%; background:var(--orange-500);' : 'display:none;'),
          legend: [{ color: 'var(--data-positive)', label: 'Ringan ' + (rp.intDist.ringan || 0) }, { color: 'var(--cobalt-400)', label: 'Sedang ' + (rp.intDist.sedang || 0) }, { color: 'var(--orange-500)', label: 'Berat ' + (rp.intDist.berat || 0) }] },
        { isValue: true, isBar: false, label: 'readiness fit', value: (rp.readCount.fit || 0) + '×', sub: 'sesi kondisi fit', color: 'var(--data-positive)' },
        { isValue: true, isBar: false, label: 'readiness lelah', value: ((rp.readCount['agak-lelah'] || 0) + (rp.readCount.lelah || 0)) + '×', sub: 'agak lelah + lelah', color: (rp.readCount.lelah || 0) > 2 ? 'var(--warning)' : 'var(--text-primary)' },
      ],
      rpRecovery: 'Readiness: Fit ' + (rp.readCount.fit || 0) + ' · Agak lelah ' + (rp.readCount['agak-lelah'] || 0) + ' · Lelah ' + (rp.readCount.lelah || 0) + ' sesi.',
      rpRecs: rp.recs.map((r, i) => ({ n: String(i + 1), text: r })), printReport: () => this.printReport(rp),
      rpNutShow: !!(rp.nutrition && rp.nutrition.logged),
      rpNutTiles: (rp.nutrition && rp.nutrition.logged) ? [
        { label: 'protein rata-rata', value: rp.nutrition.avgProtein + 'g', sub: 'target ' + rp.nutrition.proteinTarget + 'g', color: rp.nutrition.avgProtein >= rp.nutrition.proteinTarget * 0.95 ? 'var(--data-positive)' : 'var(--warning)' },
        { label: 'kalori rata-rata', value: String(rp.nutrition.avgKcal), sub: 'target ' + rp.nutrition.kcalTarget + ' kkal', color: 'var(--gold-300)' },
        { label: 'hari on-target', value: rp.nutrition.onTarget + '/' + rp.nutrition.logged, sub: 'protein ≥95%', color: 'var(--text-primary)' },
        { label: 'hari tercatat', value: String(rp.nutrition.logged), sub: 'konsistensi log', color: 'var(--cobalt-400)' },
      ] : [],
      profAge: db.profile.age, unitLabel: db.settings.unit,
      profGoalLine: (function () { const t = FF.nutritionTargets(db); return t.source === 'manual' ? 'Target makro manual aktif — goal hanya mengubah catatan & laporan.' : (t.goalAdj < 0 ? 'Defisit ' + Math.abs(t.goalAdj) : t.goalAdj > 0 ? 'Surplus ' + t.goalAdj : 'Maintenance') + (t.goalAdj ? ' kkal' : '') + ' dari TDEE · protein ' + t.proteinPerKg + ' g/kg → ' + t.kcal + ' kkal, ' + t.protein + ' g protein.' + (t.floored ? ' Target dinaikkan ke batas aman ' + t.floorKcal + ' kkal.' : ''); })(),
      profGoalChips: Object.keys(FF.GOALS).map(k => this.optChip(FF.GOALS[k].label, db.settings.goal === k, () => this.mut(d => d.settings.goal = k))),
      profLevelChips: Object.keys(FF.LEVELS).map(k => this.optChip(FF.LEVELS[k], db.settings.level === k, () => this.mut(d => d.settings.level = k))),
      profSexChips: [['male', 'Pria'], ['female', 'Wanita']].map(([k, l]) => this.optChip(l, db.profile.sex === k, () => this.mut(d => d.profile.sex = k))),
      pHeight: String(db.profile.heightCm || 161), onPHeight: e => { const cur = db.profile.heightCm || 161; const raw = String(e.target.value).trim().replace(',', '.'); const n = Number(raw); const v = raw && Number.isFinite(n) && n >= 120 && n <= 230 ? Math.round(n) : null; if (v == null) { e.target.value = String(cur); this.toast('Tinggi harus 120–230 cm.'); return; } e.target.value = String(v); this.mut(d => d.profile.heightCm = v); },
      pAge: String(db.profile.age || 38), onPAge: e => { const cur = db.profile.age || 38; const raw = String(e.target.value).trim(); const n = Number(raw); const v = raw && Number.isFinite(n) && n >= 10 && n <= 100 ? Math.round(n) : null; if (v == null) { e.target.value = String(cur); this.toast('Usia harus 10–100 tahun.'); return; } e.target.value = String(v); this.mut(d => d.profile.age = v); },
      tW: String(db.targets.weightKg), tBf: String(db.targets.bodyFat), tWaist: String(db.targets.waistCm),
      ...(() => {
        const lastBf = db.bodyMetrics.filter(m => m.bodyFatPercentage != null && !m.bfEstimated).sort((a, b) => new Date(b.measuredAt) - new Date(a.measuredAt))[0];
        const lastW = db.bodyMetrics.filter(m => m.weightKg).sort((a, b) => new Date(b.measuredAt) - new Date(a.measuredAt))[0];
        if (!lastBf || !lastW) return { tgtWarn: false, tgtWarnText: '' };
        const leanNow = lastW.weightKg * (1 - lastBf.bodyFatPercentage / 100);
        const leanTgt = db.targets.weightKg * (1 - db.targets.bodyFat / 100);
        const loss = +(leanNow - leanTgt).toFixed(1);
        const fairW = +(leanNow / (1 - db.targets.bodyFat / 100)).toFixed(1);
        return { tgtWarn: loss > 1, tgtWarnText: 'Target ' + db.targets.weightKg + ' kg @ ' + db.targets.bodyFat + '% berarti massa bebas-lemak turun ±' + loss + ' kg (' + leanNow.toFixed(1) + ' → ' + leanTgt.toFixed(1) + ' kg). Kalau ingin mempertahankan otot, target berat yang konsisten ≈ ' + fairW + ' kg.' };
      })(),
      wkTgt: (db.settings.weeklyTarget || 3),
      wkTgtUp: () => this.mut(d => d.settings.weeklyTarget = Math.min(7, (d.settings.weeklyTarget || 3) + 1)),
      wkTgtDown: () => this.mut(d => d.settings.weeklyTarget = Math.max(1, (d.settings.weeklyTarget || 3) - 1)),
      onTW: this.blurNum(30, 250, () => db.targets.weightKg, (d, v) => d.targets.weightKg = v, 'Target berat 30–250 kg.', 1),
      onTBf: this.blurNum(3, 60, () => db.targets.bodyFat, (d, v) => d.targets.bodyFat = v, 'Target BF 3–60%.', 1),
      onTWaist: this.blurNum(40, 200, () => db.targets.waistCm, (d, v) => d.targets.waistCm = v, 'Target perut 40–200 cm.', 1),
      rhr: String(db.settings.restingHr), onRhr: this.blurNum(35, 110, () => db.settings.restingHr, (d, v) => d.settings.restingHr = Math.round(v), 'HR istirahat 35–110 bpm.', 0),
      hrmaxIn: db.settings.hrMaxOverride ? String(db.settings.hrMaxOverride) : '',
      onHrmaxIn: e => { const raw = String(e.target.value).trim(); if (raw === '') { this.mut(d => d.settings.hrMaxOverride = null); return; }
        const v = Number(raw); if (!(Number.isFinite(v) && v >= 120 && v <= 230)) { e.target.value = db.settings.hrMaxOverride ? String(db.settings.hrMaxOverride) : ''; this.toast('HRmax 120–230 bpm, atau kosongkan untuk otomatis.'); return; }
        this.mut(d => d.settings.hrMaxOverride = Math.round(v)); },
      hrmaxEst: String(Math.round(208 - 0.7 * db.profile.age)), hrmaxNow: FF.hrMax(db), zonesStr: zones.join(' · '),
      hrmaxSuggest: !!(this._hrSug = FF.hrMaxSuggestion(db)), hrmaxSuggestVal: this._hrSug ? this._hrSug.suggested : '',
      hrmaxSuggestText: this._hrSug ? this._hrSug.count + ' sesi mencatat max HR hingga ' + this._hrSug.suggested + ' bpm — di atas HRmax aktif (' + this._hrSug.current + '). Kalibrasi?' : '',
      applyHrmax: () => { const v = this._hrSug && this._hrSug.suggested; if (v) this.mut(d => d.settings.hrMaxOverride = v); },
      eqHome: () => set({ eqLoc: 'home' }), eqGym: () => set({ eqLoc: 'gym' }),
      eqHomeStyle: this.chip(S.eqLoc === 'home') + 'min-height:36px; padding:6px 14px;',
      eqGymStyle: this.chip(S.eqLoc === 'gym') + 'min-height:36px; padding:6px 14px;',
      eqRows, exGroups, exEmpty: exMatch.length === 0, exSearch: S.exSearch || '',
      onExSearch: e => set({ exSearch: e.target.value }), ...techVals,
      lastBackupStr: db.settings.lastBackup ? FF.daysSince(db.settings.lastBackup) + ' hari lalu' : 'belum pernah',
      ...(function () {
        const days = db.settings.lastBackup ? FF.daysSince(db.settings.lastBackup) : null;
        let color, bg, border, status, hint;
        if (days === null) { color = 'var(--warning)'; status = 'Belum pernah backup'; hint = 'Data hanya ada di perangkat ini. Download backup pertamamu.'; }
        else if (days <= 7) { color = 'var(--data-positive)'; status = 'Aman · backup ' + (days === 0 ? 'hari ini' : days + ' hari lalu'); hint = 'Data terlindungi. Backup lagi setelah beberapa sesi penting.'; }
        else if (days <= 14) { color = 'var(--warning)'; status = 'Backup ' + days + ' hari lalu'; hint = 'Sudah lebih dari seminggu — download lagi untuk mengamankan data terbaru.'; }
        else { color = 'var(--danger)'; status = 'Rawan · backup ' + days + ' hari lalu'; hint = 'Data terbaru berisiko hilang bila cache terhapus. Backup sekarang.'; }
        const rgb = { 'var(--data-positive)': '23,181,115', 'var(--warning)': '232,161,60', 'var(--danger)': '199,68,54' }[color] || '232,161,60';
        return { bkColor: color, bkBg: 'rgba(' + rgb + ',0.07)', bkBorder: 'rgba(' + rgb + ',0.35)', bkStatus: status, bkHint: hint };
      })(),
      exportJson: () => { this.mut(d => d.settings.lastBackup = new Date().toISOString());
        this.download('fitflow-backup-' + new Date().toISOString().slice(0, 10) + '.json', JSON.stringify(this.state.db, null, 2), 'application/json'); this.setState({ bkNudge: false }); },
      bkNudgeOpen: (() => {
        if (S.bkNudge === false) return false;
        if (this._bkNudgeSeen) return this._bkNudgeShow;
        this._bkNudgeSeen = true;
        const days = db.settings.lastBackup ? FF.daysSince(db.settings.lastBackup) : 999;
        let lastNudge = 0; try { lastNudge = +localStorage.getItem('fitflow.bkNudgeAt') || 0; } catch (e) {}
        this._bkNudgeShow = days > 10 && db.sessions.length >= 3 && (Date.now() - lastNudge > 3 * 864e5) && !db.seeded;
        if (this._bkNudgeShow) { try { localStorage.setItem('fitflow.bkNudgeAt', String(Date.now())); } catch (e) {} }
        return this._bkNudgeShow && S.tab === 'home';
      })(),
      bkNudgeTitle: db.settings.lastBackup ? 'Backup terakhirmu sudah ' + FF.daysSince(db.settings.lastBackup) + ' hari lalu' : 'Kamu belum pernah backup',
      bkNudgeBackup: () => { this.mut(d => d.settings.lastBackup = new Date().toISOString());
        this.download('fitflow-backup-' + new Date().toISOString().slice(0, 10) + '.json', JSON.stringify(this.state.db, null, 2), 'application/json'); this._bkNudgeShow = false; this.setState({ bkNudge: false }); },
      bkNudgeDismiss: () => { this._bkNudgeShow = false; this.setState({ bkNudge: false }); },
      onImportFile: e => { const f = e.target.files && e.target.files[0]; if (!f) return;
        const rd = new FileReader(); rd.onload = () => { try { const d = JSON.parse(rd.result);
          if (d && typeof d === 'object' && (Array.isArray(d.sessions) || Array.isArray(d.bodyMetrics) || d.nutrition)) set({ riData: d }); else this.toast('File tidak valid: bukan backup FitFlow.');
        } catch (err) { this.toast('File JSON tidak bisa dibaca.'); } }; rd.readAsText(f); },
      ...riVals, csvBtns,
      isSeeded: !!db.seeded, notSeeded: !db.seeded,
      resetLabel: db.seeded ? 'Hapus data contoh' : 'Hapus semua data',
      resetData: () => this.ask(db.seeded ? 'Hapus semua data contoh? Profil, target, dan pengaturanmu tetap.' : 'Hapus SEMUA data dan mulai dari nol? Onboarding diulang. Pastikan sudah backup bila masih perlu.', db.seeded ? 'Hapus' : 'Hapus semua', () => this.wipeAll(db.seeded)),
      reseed: () => this.ask('Isi dengan data contoh (orang fiktif) untuk mencoba fitur? Data saat ini ditimpa — backup dulu bila perlu.', 'Isi contoh', () => {
        const cur = this.state.db; const demo = FF.seedDb();
        demo.userProfile = { profile: cur.profile, targets: cur.targets, settings: { goal: cur.settings.goal, level: cur.settings.level, weeklyTarget: cur.settings.weeklyTarget, restingHr: cur.settings.restingHr, hrMaxOverride: cur.settings.hrMaxOverride } };
        demo.equipment = cur.equipment; this.state.db = demo; this.persist(); this.forceUpdate(); }),
      saveErrOpen: !!S.saveErr, saveErrText: S.saveErr || '',
      saveErrBackup: () => { try { this.download('fitflow-backup-' + new Date().toISOString().slice(0, 10) + '.json', JSON.stringify(this.state.db, null, 2), 'application/json'); } catch (e) {} },
      autoSaveNote: 'Auto-save aktif: tiap perubahan langsung tersimpan, disalin ke cadangan internal (IndexedDB) & snapshot 10 menit, serta di-flush saat app ditutup.' + (this._persistent ? ' Penyimpanan permanen diizinkan browser.' : ' Browser belum mengizinkan penyimpanan permanen — tetap rutin backup JSON.'),
      undoOpen: !!S.undo, undoLabel: S.undo ? S.undo.label : '', undoBottom: rest ? '184px' : '88px',
      toastOpen: !!S.toast, toastText: S.toast || '',
      confirmOpen: !!S.confirmReq, confirmText: S.confirmReq ? S.confirmReq.text : '', confirmLabel: S.confirmReq ? S.confirmReq.label : 'Ya',
      confirmYes: () => { const r = S.confirmReq; this.setState({ confirmReq: null }); if (r && r.onYes) r.onYes(); },
      confirmNo: () => this.setState({ confirmReq: null }),
      installOpen: !!window.__ffInstallPrompt && !this.isStandalone(), installApp: () => this.installApp(),
      appVersion: FF.APP_VERSION || '1.1.0',
      undoAction: () => { const u = S.undo;
        if (u && u.session) this.mut(d => d.sessions.push(u.session));
        if (u && u.waistEntry) this.mut(d => d.waist.push(u.waistEntry));
        if (u && u.foodEntry) this.mut(d => d.nutrition.foods.push(u.foodEntry));
        if (u && u.metricEntry) this.mut(d => d.bodyMetrics.push(u.metricEntry));
        if (u && u.nutEntry) this.mut(d => d.nutrition.log.push(u.nutEntry));
        if (u && u.active) { this.mut(d => d.activeSession = u.active); set({ undo: null, tab: 'workout' }); return; }
        set({ undo: null }); },
      restOpen: !!rest, restExName: rest ? rest.name : '', restNext: rest ? rest.next || '' : '',
      restClock: Math.floor(restLeft / 60) + ':' + String(restLeft % 60).padStart(2, '0'),
      restBarStyle: rest ? 'height:100%; width:' + (restLeft / rest.total * 100) + '%; background:var(--gold-500); transition:width 1s linear;' : '',
      restAdd30: () => set({ rest: { ...rest, endAt: rest.endAt + 30000, total: rest.total + 30 } }),
      restSkip: () => set({ rest: null }),
      navItems,
    };
  }
}
  return Component;
};
