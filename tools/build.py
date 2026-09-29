#!/usr/bin/env python3
# LEGACY one-time unbundler of the v1.0 Claude Design bundle (needs ff/release/FitFlow-v1.0.html). Since v1.2 the repo files are the source of truth; use tools/release.py.
"""Unbundle FitFlow-v1.0.html (Claude Design bundle) into a static PWA project + apply Fase 1-2 patches."""
import re, json, base64, zlib, os, shutil, hashlib, sys
from PIL import Image

SRC = 'ff/release/FitFlow-v1.0.html'
OUT = 'dist'
VERSION = '1.1.0'

s = open(SRC, encoding='utf-8').read()
template = json.loads(re.search(r'<script type="__bundler/template">(.*?)</script>', s, re.S).group(1))
manifest = json.loads(re.search(r'<script type="__bundler/manifest">(.*?)</script>', s, re.S).group(1))

def blob(uuid):
    v = manifest[uuid]; d = base64.b64decode(v['data'])
    if v.get('compressed'): d = zlib.decompress(d, 31)
    return d

def must_patch(text, old, new, count=1, label=''):
    n = text.count(old)
    if n != count:
        sys.exit(f'PATCH FAIL [{label}]: expected {count} occurrence(s), found {n}: {old[:80]!r}')
    return text.replace(old, new)

if os.path.exists(OUT): shutil.rmtree(OUT)
for d in ['vendor', 'fonts', 'assets', 'icons']: os.makedirs(f'{OUT}/{d}')

# ---------- 1. fonts ----------
# only the <helmet> styles are page CSS; a <style> inside the x-dc script belongs to the printable report popup
css_blocks = re.findall(r'<style>(.*?)</style>', template[:template.index('</helmet>')], re.S)
css = '\n'.join(css_blocks)
font_map = {}
subset = 'latin'
for line in css.split('\n'):
    m = re.match(r'/\* ([a-z-]+) \*/', line.strip())
    if m: subset = m.group(1)
for block in list(re.finditer(r'(/\* ([a-z-]+) \*/\s*)?@font-face \{(.*?)\}', css, re.S)):
    body = block.group(3); sub = block.group(2) or 'latin'
    fam = re.search(r"font-family: '([^']+)'", body).group(1)
    sty = re.search(r'font-style: (\w+)', body).group(1)
    wt = re.search(r'font-weight: (\d+)', body).group(1)
    uuid = re.search(r'url\("([0-9a-f-]{36})"\)', body).group(1)
    if uuid in font_map: continue   # variable fonts: one file serves several @font-face weights
    name = f"{fam.replace(' ', '')}{'-italic' if sty == 'italic' else ''}-{sub}.woff2"
    if sub != 'latin':   # Indonesian UI needs the latin subset only; drop latin-ext/cyrillic/greek/vietnamese faces
        css = css.replace(block.group(0), '')
        continue
    font_map[uuid] = name
    open(f'{OUT}/fonts/{name}', 'wb').write(blob(uuid))
print('fonts:', len(font_map))
for uuid, name in font_map.items():
    css = css.replace(f'url("{uuid}")', f'url("./fonts/{name}")')
assert not re.search(r'url\("[0-9a-f-]{36}"\)', css), 'unmapped font url'

# ---------- 2. images ----------
IMG = {'b1c21f18-9f7a-48b9-a7db-1ae91483c8ae': 'assets/logo-wordmark.png',
       '53ea64ef-581e-4c6e-b83a-049cb1e1489e': 'assets/logo-mark.png'}
for uuid, p in IMG.items(): open(f'{OUT}/{p}', 'wb').write(blob(uuid))

# ---------- 3. scripts ----------
RUNTIME = 'c6e63405-bf40-4497-a342-59ea63e49920'
LUCENT = '12ef8f7d-e76e-49fd-b553-ab9ebe3430d3'
ENGINE = '9071139b-62e6-4516-baa7-bd49d7afdd8c'
REACT = '134f2e09-68a3-446a-b788-33b820261e1f'
REACTDOM = '2c6e7bed-abdd-4ca6-8527-edce0ae84acb'
open(f'{OUT}/vendor/react.production.min.js', 'wb').write(blob(REACT))
open(f'{OUT}/vendor/react-dom.production.min.js', 'wb').write(blob(REACTDOM))
open(f'{OUT}/vendor/lucent-ds.js', 'wb').write(blob(LUCENT))

rt = blob(RUNTIME).decode('utf-8')
rt = must_patch(rt, 'js: scriptEl ? scriptEl.textContent || "" : "",',
                'js: scriptEl ? scriptEl.textContent || (typeof window.__dcDefineLogic === "function" ? "/* external app.js */" : "") : "",', 2, 'runtime js src')
rt = must_patch(rt, '''  function parseDcDocument(doc) {
    const dc = doc.querySelector("x-dc");''', '''  function parseDcDocument(doc) {
    // FitFlow patch: the x-dc markup ships inside an inert <template id="ff-dc"> so the browser never parses {{ }} bindings as live SVG attributes.
    const ffTpl = doc.getElementById("ff-dc");
    const dc = doc.querySelector("x-dc") || (ffTpl && ffTpl.content ? ffTpl.content.querySelector("x-dc") : null);''', 1, 'runtime parse template')
rt = must_patch(rt, '''    const dc = doc.querySelector("x-dc");
    const hostEl = doc.createElement("div");''', '''    const dc = doc.querySelector("x-dc") || doc.getElementById("ff-dc");
    const hostEl = doc.createElement("div");''', 1, 'runtime boot host')
rt = must_patch(rt, '''  function evalDcLogic(src) {
    //! nosemgrep: eval-and-function-constructor''',
'''  function evalDcLogic(src) {
    // FitFlow patch: logic class comes from ./app.js (window.__dcDefineLogic) instead of an inline script.
    if (typeof window.__dcDefineLogic === "function" && !/\\S/.test(src.replace(/\\/\\*[\\s\\S]*?\\*\\//g, ""))) return window.__dcDefineLogic(StreamableLogic, getReact());
    //! nosemgrep: eval-and-function-constructor''', 1, 'runtime evalDcLogic')
open(f'{OUT}/vendor/dc-runtime.js', 'w', encoding='utf-8').write('/* dc-runtime (Claude Design) — FitFlow patch: external app.js support, see build.py */\n' + rt)

# ---------- 4. engine.js (Fase 1: B1/B2 clamp fix) ----------
eng = blob(ENGINE).decode('utf-8')
eng = must_patch(eng,
    "const clamp = (v, lo, hi, fallback) => { const n = Number(v); return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : fallback; };",
    "const clamp = (v, lo, hi, fallback) => {\n    // B1/B2 fix: empty / null / whitespace input must return the fallback, never the lower bound.\n    if (v == null || (typeof v === 'string' && v.trim() === '')) return fallback;\n    const n = Number(v); return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : fallback; };",
    1, 'engine clamp')
eng = must_patch(eng, "window.FF = (function () {", f"window.FF = (function () {{\n  const APP_VERSION = '{VERSION}';", 1, 'engine version')
eng = must_patch(eng, "    emptyDb, seedDb", "    emptyDb, seedDb, APP_VERSION", 1, 'engine export')
open(f'{OUT}/engine.js', 'w', encoding='utf-8').write(eng)

# ---------- 5. app.js ----------
m = re.search(r'<script type="text/x-dc"([^>]*)>(.*?)</script>', template, re.S)
dc_attrs, app = m.group(1), m.group(2)

# B3: profile height/age — clamp on blur, not per keystroke
app = must_patch(app,
    "pHeight: String(db.profile.heightCm || 161), onPHeight: e => this.mut(d => d.profile.heightCm = FF.clamp(e.target.value, 120, 230, d.profile.heightCm || 161)),",
    "pHeight: String(db.profile.heightCm || 161), onPHeight: e => { const cur = db.profile.heightCm || 161; const raw = String(e.target.value).trim().replace(',', '.'); const n = Number(raw); const v = raw && Number.isFinite(n) && n >= 120 && n <= 230 ? Math.round(n) : null; if (v == null) { e.target.value = String(cur); this.toast('Tinggi harus 120–230 cm.'); return; } e.target.value = String(v); this.mut(d => d.profile.heightCm = v); },",
    1, 'B3 height')
app = must_patch(app,
    "pAge: String(db.profile.age || 38), onPAge: e => this.mut(d => d.profile.age = FF.clamp(e.target.value, 10, 100, d.profile.age || 38)),",
    "pAge: String(db.profile.age || 38), onPAge: e => { const cur = db.profile.age || 38; const raw = String(e.target.value).trim(); const n = Number(raw); const v = raw && Number.isFinite(n) && n >= 10 && n <= 100 ? Math.round(n) : null; if (v == null) { e.target.value = String(cur); this.toast('Usia harus 10–100 tahun.'); return; } e.target.value = String(v); this.mut(d => d.profile.age = v); },",
    1, 'B3 age')

# B8: alert() -> toast, confirm() -> in-app confirm sheet
n_alert = app.count('alert(')
app = app.replace('alert(', 'this.toast(')
app = must_patch(app,
    "if (!confirm('Belum ada set yang selesai. Buang sesi ini tanpa menyimpan?')) return;\n      this.mut(d => d.activeSession = null); this.setState({ fbOpen: false, rest: null, fbNote: '' }); return;",
    "this.ask('Belum ada set yang selesai. Buang sesi ini tanpa menyimpan?', 'Buang sesi', () => { this.mut(d => d.activeSession = null); this.setState({ fbOpen: false, rest: null, fbNote: '' }); }); return;",
    1, 'B8 discard')
app = must_patch(app,
    "resetData: () => { if (confirm(db.seeded ? 'Hapus semua data contoh dan mulai dari nol?' : 'Hapus SEMUA data? Pastikan sudah backup.')) {\n        this.state.db = FF.emptyDb(); this.persist(); this.forceUpdate(); } },",
    "resetData: () => this.ask(db.seeded ? 'Hapus semua data contoh dan mulai dari nol?' : 'Hapus SEMUA data? Pastikan sudah backup.', 'Hapus', () => { this.state.db = FF.emptyDb(); this.persist(); this.forceUpdate(); }),",
    1, 'B8 reset')
app = must_patch(app,
    "reseed: () => { if (confirm('Isi ulang dengan data contoh? Data saat ini ditimpa.')) { this.state.db = FF.seedDb(); this.persist(); this.forceUpdate(); } },",
    "reseed: () => this.ask('Isi ulang dengan data contoh? Data saat ini ditimpa.', 'Isi ulang', () => { this.state.db = FF.seedDb(); this.persist(); this.forceUpdate(); }),",
    1, 'B8 reseed')
assert 'confirm(' not in app and ' alert(' not in app

# toast / ask helpers + install prompt + render vals
app = must_patch(app, "  componentDidMount() {",
'''  toast(text, ms) { clearTimeout(this._toastT); this.setState({ toast: String(text) }); this._toastT = setTimeout(() => this.setState({ toast: null }), ms || 3200); }
  ask(text, label, onYes) { this.setState({ confirmReq: { text, label: label || 'Ya', onYes } }); }
  isStandalone() { try { return window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true; } catch (e) { return false; } }
  installApp() { const p = window.__ffInstallPrompt; if (!p) return; p.prompt(); p.userChoice.then(() => { window.__ffInstallPrompt = null; this.forceUpdate(); }).catch(() => {}); }
  componentDidMount() {
    this._onInstallReady = () => this.forceUpdate(); window.addEventListener('ff-install-ready', this._onInstallReady);''', 1, 'helpers')
app = must_patch(app, "componentWillUnmount() { clearInterval(this.int); clearInterval(this.ffPoll); }",
    "componentWillUnmount() { clearInterval(this.int); clearInterval(this.ffPoll); clearTimeout(this._toastT); window.removeEventListener('ff-install-ready', this._onInstallReady); }", 1, 'unmount')
app = must_patch(app, "undoOpen: !!S.undo, undoLabel: S.undo ? S.undo.label : '', undoBottom: rest ? '184px' : '88px',",
'''undoOpen: !!S.undo, undoLabel: S.undo ? S.undo.label : '', undoBottom: rest ? '184px' : '88px',
      toastOpen: !!S.toast, toastText: S.toast || '',
      confirmOpen: !!S.confirmReq, confirmText: S.confirmReq ? S.confirmReq.text : '', confirmLabel: S.confirmReq ? S.confirmReq.label : 'Ya',
      confirmYes: () => { const r = S.confirmReq; this.setState({ confirmReq: null }); if (r && r.onYes) r.onYes(); },
      confirmNo: () => this.setState({ confirmReq: null }),
      installOpen: !!window.__ffInstallPrompt && !this.isStandalone(), installApp: () => this.installApp(),
      appVersion: FF.APP_VERSION || '1.1.0',''', 1, 'render vals')
app = must_patch(app, "celebration: null, onboard:", "celebration: null, toast: null, confirmReq: null, onboard:", 1, 'state')

app_js = ('/* FitFlow app logic — Component class for dc-runtime. Loaded as a plain script; dc-runtime calls window.__dcDefineLogic(DCLogic, React). */\n'
          'window.__dcDefineLogic = function (DCLogic, React) {\n' + app.strip('\n') + '\n  return Component;\n};\n')
open(f'{OUT}/app.js', 'w', encoding='utf-8').write(app_js)

# ---------- 6. styles.css ----------
open(f'{OUT}/styles.css', 'w', encoding='utf-8').write(css)

# ---------- 7. index.html ----------
body = template[template.index('<x-dc>'):template.index('</x-dc>') + len('</x-dc>')]
body = re.sub(r'<helmet>.*?</helmet>', '<helmet></helmet>', body, flags=re.S)
for uuid, p in IMG.items(): body = body.replace(f'src="{uuid}"', f'src="./{p}"')
assert not re.search(r'[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}', body), 'uuid left in body'

# Toast + confirm sheet + install card markup
overlay = '''
<!-- Toast (replaces native alert) -->
<sc-if value="{{ toastOpen }}" hint-placeholder-val="{{ false }}">
  <div style="position:fixed; top:14px; left:50%; transform:translateX(-50%); width:calc(100% - 24px); max-width:406px; z-index:96; background:var(--surface-warm-raised); border:1px solid var(--border-default); border-radius:var(--radius-md); padding:12px 16px; box-shadow:var(--shadow-lg); font-family:var(--font-sans); font-size:13.5px; color:var(--text-primary); line-height:1.5; animation:fftab 200ms var(--ease-out, ease-out);">{{ toastText }}</div>
</sc-if>
<!-- Confirm sheet (replaces native confirm) -->
<sc-if value="{{ confirmOpen }}" hint-placeholder-val="{{ false }}">
  <div sc-camel-on-click="{{ confirmNo }}" style="position:fixed; inset:0; z-index:97; background:rgba(0,0,0,0.55);"></div>
  <div style="position:fixed; left:50%; bottom:0; transform:translateX(-50%); width:100%; max-width:430px; z-index:98; background:var(--surface-warm-card); border:1px solid var(--border-default); border-bottom:none; border-radius:var(--radius-lg) var(--radius-lg) 0 0; padding:20px 18px calc(18px + env(safe-area-inset-bottom)); box-shadow:var(--shadow-lg); font-family:var(--font-sans); animation:fftab 200ms var(--ease-out, ease-out);">
    <div style="font-size:15px; color:var(--text-primary); line-height:1.5;">{{ confirmText }}</div>
    <div style="display:flex; gap:10px; margin-top:18px;">
      <button sc-camel-on-click="{{ confirmNo }}" style="flex:1; height:46px; border:1px solid var(--border-default); border-radius:999px; background:transparent; color:var(--text-secondary); font-weight:600; font-size:14px; cursor:pointer;">Batal</button>
      <button sc-camel-on-click="{{ confirmYes }}" style="flex:1; height:46px; border:none; border-radius:999px; background:var(--interactive-warm); color:var(--interactive-warm-ink); font-weight:700; font-size:14px; cursor:pointer;">{{ confirmLabel }}</button>
    </div>
  </div>
</sc-if>
'''
# B3: uncontrolled inputs, validate on blur
body = must_patch(body, '<input value="{{ pHeight }}" sc-camel-on-change="{{ onPHeight }}"', '<input sc-camel-default-value="{{ pHeight }}" sc-camel-on-blur="{{ onPHeight }}"', 1, 'B3 tpl height')
body = must_patch(body, '<input value="{{ pAge }}" sc-camel-on-change="{{ onPAge }}"', '<input sc-camel-default-value="{{ pAge }}" sc-camel-on-blur="{{ onPAge }}"', 1, 'B3 tpl age')
# version labels -> {{ appVersion }}
body = must_patch(body, 'white-space:nowrap;">Release 1.0</span>', 'white-space:nowrap;">v{{ appVersion }} · PWA</span>', 1, 'ver home')
body = must_patch(body, 'v1.0 · release</span>', 'v{{ appVersion }} · pwa</span>', 1, 'ver more badge')
body = must_patch(body, 'line-height:1.2;">FitFlow 1.0</div>', 'line-height:1.2;">FitFlow {{ appVersion }}</div>', 1, 'ver more title')
body = must_patch(body, '<span>Rilis · 29 Sep 2026</span>', '<span>Rilis · 30 Sep 2026</span>', 1, 'ver date')
body = must_patch(body, '<!-- Undo snackbar -->', overlay + '\n<!-- Undo snackbar -->', 1, 'overlay')

install_card = '''
  <sc-if value="{{ installOpen }}" hint-placeholder-val="{{ false }}">
  <div style="margin-top:16px; background:linear-gradient(135deg, rgba(232,161,60,0.16), rgba(232,161,60,0.04)); border:1px solid rgba(232,161,60,0.45); border-radius:var(--radius-lg); padding:16px; display:flex; align-items:center; gap:14px;">
    <img src="./assets/logo-mark.png" alt="" style="width:44px; height:auto; flex:none;">
    <div style="flex:1;">
      <div style="font-weight:700; font-size:14.5px; color:var(--text-primary);">Pasang FitFlow di HP</div>
      <div style="font-size:12px; color:var(--text-secondary); line-height:1.45; margin-top:2px;">Buka dari layar utama, layar penuh, dan tetap jalan offline.</div>
    </div>
    <button sc-camel-on-click="{{ installApp }}" style="flex:none; height:38px; padding:0 16px; border:none; border-radius:999px; background:var(--interactive-warm); color:var(--interactive-warm-ink); font-weight:700; font-size:13px; cursor:pointer;">Pasang</button>
  </div>
  </sc-if>
'''
body = must_patch(body, '''  <div style="font-family:var(--font-serif); font-size:26px;">Pengaturan</div>
''', '''  <div style="font-family:var(--font-serif); font-size:26px;">Pengaturan</div>
''' + install_card, 1, 'install card')

REACT_URL = 'https://unpkg.com/react@18.3.1/umd/react.production.min.js'
REACT_DOM_URL = 'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js'
index = f'''<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>FitFlow</title>
<meta name="description" content="FitFlow — personal adaptive training tracker. Offline, satu pengguna.">
<meta name="theme-color" content="#0f0d0a">
<meta name="color-scheme" content="dark">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="FitFlow">
<link rel="manifest" href="./manifest.webmanifest">
<link rel="icon" href="./icons/icon-192.png" type="image/png">
<link rel="apple-touch-icon" href="./icons/apple-touch-icon.png">
<link rel="stylesheet" href="./styles.css">
<script>
  // dc-runtime resolves React through this map instead of the CDN (offline-first).
  window.__resources = {{ {json.dumps(REACT_URL)}: './vendor/react.production.min.js', {json.dumps(REACT_DOM_URL)}: './vendor/react-dom.production.min.js' }};
  // PWA install prompt (Chrome Android): keep the event, the app shows a "Pasang" card in More.
  window.__ffInstallPrompt = null;
  window.addEventListener('beforeinstallprompt', function (e) {{ e.preventDefault(); window.__ffInstallPrompt = e; window.dispatchEvent(new Event('ff-install-ready')); }});
  window.addEventListener('appinstalled', function () {{ window.__ffInstallPrompt = null; window.dispatchEvent(new Event('ff-install-ready')); }});
</script>
<script src="./vendor/lucent-ds.js"></script>
<script src="./engine.js"></script>
<script src="./app.js"></script>
<script src="./vendor/dc-runtime.js"></script>
</head>
<body>
<template id="ff-dc">
{body}
</template>
<script type="text/x-dc"{dc_attrs}></script>
<div id="ff-update" hidden style="position:fixed; left:50%; bottom:calc(96px + env(safe-area-inset-bottom)); transform:translateX(-50%); width:calc(100% - 24px); max-width:406px; z-index:60; background:#1d1810; border:1px solid rgba(232,161,60,0.5); border-radius:999px; padding:10px 10px 10px 18px; box-shadow:0 12px 40px rgba(0,0,0,0.5); display:flex; align-items:center; gap:12px; font-family:Manrope, system-ui, sans-serif;">
  <span style="flex:1; font-size:13.5px; color:#f6f3ed;">Versi baru FitFlow tersedia.</span>
  <button id="ff-update-btn" style="height:38px; padding:0 18px; border:none; border-radius:999px; background:#e8a13c; color:#1a1408; font-weight:700; font-size:13px; cursor:pointer;">Muat ulang</button>
</div>
<script>
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {{
    window.addEventListener('load', function () {{
      navigator.serviceWorker.register('./sw.js').then(function (reg) {{
        function offer(worker) {{
          var bar = document.getElementById('ff-update'); if (!bar) return;
          bar.hidden = false;
          document.getElementById('ff-update-btn').onclick = function () {{ worker.postMessage({{ type: 'SKIP_WAITING' }}); }};
        }}
        if (reg.waiting && navigator.serviceWorker.controller) offer(reg.waiting);
        reg.addEventListener('updatefound', function () {{
          var nw = reg.installing; if (!nw) return;
          nw.addEventListener('statechange', function () {{ if (nw.state === 'installed' && navigator.serviceWorker.controller) offer(nw); }});
        }});
      }}).catch(function (e) {{ console.warn('[FitFlow] service worker gagal:', e); }});
      var refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', function () {{ if (refreshing) return; refreshing = true; location.reload(); }});
    }});
  }}
</script>
</body>
</html>
'''
open(f'{OUT}/index.html', 'w', encoding='utf-8').write(index)

# ---------- 8. icons ----------
mark = Image.open(f'{OUT}/assets/logo-mark.png').convert('RGBA')
BG = (15, 13, 10, 255)
def icon(size, scale, path, radius=None):
    im = Image.new('RGBA', (size, size), BG)
    w = int(size * scale); h = int(mark.height * w / mark.width)
    if h > w: h = w; w = int(mark.width * h / mark.height)
    logo = mark.resize((w, h), Image.LANCZOS)
    im.alpha_composite(logo, ((size - w) // 2, (size - h) // 2))
    im.convert('RGB').save(path, optimize=True)
icon(192, 0.72, f'{OUT}/icons/icon-192.png')
icon(512, 0.72, f'{OUT}/icons/icon-512.png')
icon(512, 0.52, f'{OUT}/icons/icon-512-maskable.png')   # safe zone: inner 80% circle
icon(180, 0.72, f'{OUT}/icons/apple-touch-icon.png')

manifest_json = {
    "name": "FitFlow", "short_name": "FitFlow",
    "description": "Personal adaptive training tracker — strength, cardio, Muay Thai, body composition, nutrisi. Offline.",
    "lang": "id", "start_url": "./", "scope": "./", "id": "./",
    "display": "standalone", "orientation": "portrait",
    "background_color": "#0f0d0a", "theme_color": "#0f0d0a",
    "icons": [
        {"src": "./icons/icon-192.png", "sizes": "192x192", "type": "image/png"},
        {"src": "./icons/icon-512.png", "sizes": "512x512", "type": "image/png"},
        {"src": "./icons/icon-512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"}
    ]
}
open(f'{OUT}/manifest.webmanifest', 'w', encoding='utf-8').write(json.dumps(manifest_json, indent=2, ensure_ascii=False))

# ---------- 9. service worker ----------
files = []
for root, _, fs in os.walk(OUT):
    for f in fs:
        p = os.path.relpath(os.path.join(root, f), OUT).replace('\\', '/')
        if p in ('sw.js',): continue
        files.append('./' + p)
files.sort()
h = hashlib.sha1()
for p in files: h.update(open(os.path.join(OUT, p), 'rb').read())
build_id = h.hexdigest()[:8]
sw = f'''/* FitFlow service worker — precache all assets, cache-first for assets, network-first for index.html.
   Bump CACHE on every release (build.py does it from the content hash). */
const CACHE = 'fitflow-v{VERSION}-{build_id}';
const ASSETS = {json.dumps(files, indent=2)};

self.addEventListener('install', (e) => {{
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
}});
self.addEventListener('activate', (e) => {{
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
}});
self.addEventListener('message', (e) => {{ if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting(); }});
self.addEventListener('fetch', (e) => {{
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  const isNav = req.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('/index.html');
  if (isNav) {{
    // network-first so a new release is picked up; fall back to cache when offline
    e.respondWith(fetch(req).then((res) => {{ const copy = res.clone(); caches.open(CACHE).then((c) => c.put('./index.html', copy)); return res; }})
      .catch(() => caches.match('./index.html')));
    return;
  }}
  e.respondWith(caches.match(req, {{ ignoreSearch: true }}).then((hit) => hit || fetch(req).then((res) => {{
    if (res && res.ok) {{ const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }}
    return res;
  }})));
}});
'''
open(f'{OUT}/sw.js', 'w', encoding='utf-8').write(sw)
print('build', build_id, 'files', len(files), 'alerts replaced', n_alert)
