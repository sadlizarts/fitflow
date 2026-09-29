#!/usr/bin/env python3
"""FitFlow release helper — run from the repo root after editing files:  python tools/release.py

Regenerates sw.js: the precache list (every served file) and the CACHE name
('fitflow-v<APP_VERSION>-<content hash>'), so installed apps pick up the new release.
APP_VERSION is read from engine.js. No dependencies beyond Python 3.
"""
import hashlib, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP_DIRS = {'.git', 'tools', 'tests', 'node_modules', '.github'}
SKIP_FILES = {'sw.js', 'README.md', 'CHANGELOG.md', '.gitignore', '.nojekyll'}

eng = open(os.path.join(ROOT, 'engine.js'), encoding='utf-8').read()
m = re.search(r"const APP_VERSION = '([^']+)'", eng)
if not m: sys.exit('APP_VERSION not found in engine.js')
version = m.group(1)

files = []
for base, dirs, fs in os.walk(ROOT):
    dirs[:] = sorted(d for d in dirs if d not in SKIP_DIRS)
    for f in sorted(fs):
        rel = os.path.relpath(os.path.join(base, f), ROOT).replace('\\', '/')
        if rel in SKIP_FILES: continue
        files.append('./' + rel)
h = hashlib.sha1()
for p in files: h.update(p.encode()); h.update(open(os.path.join(ROOT, p), 'rb').read())
cache = f'fitflow-v{version}-{h.hexdigest()[:8]}'

sw_path = os.path.join(ROOT, 'sw.js')
sw = open(sw_path, encoding='utf-8').read()
sw = re.sub(r"const CACHE = '[^']*';", f"const CACHE = '{cache}';", sw, count=1)
sw = re.sub(r"const ASSETS = \[.*?\];", 'const ASSETS = ' + json.dumps(files, indent=2) + ';', sw, count=1, flags=re.S)
open(sw_path, 'w', encoding='utf-8', newline='\n').write(sw)
print(f'sw.js → {cache} · {len(files)} files precached')
