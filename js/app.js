import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import ModuleFactory from 'manifold';
import { computePlan, buildTray } from './geometry.js';
import { buildBinarySTL } from './stl.js';
import { buildStep } from './step.js';
import { PACKAGE_GROUPS, findPackage } from './packages.js';
import { LATTICE_PITCH } from './constants.js';

// ---------- engine init ----------
const mod = await ModuleFactory(); mod.setup();
document.getElementById('loading').remove();

// ---------- DOM refs ----------
const $ = (id) => document.getElementById(id);
const els = {
  screw: $('screw'),
  pkg: $('pkg'), px: $('px'), py: $('py'), pz: $('pz'),
  clearance: $('clearance'), cols: $('cols'), rows: $('rows'),
  twoParts: $('twoParts'), partBWrap: $('partBWrap'), split: $('split'), splitLabel: $('splitLabel'),
  pkgB: $('pkgB'), pxB: $('pxB'), pyB: $('pyB'), pzB: $('pzB'), colsB: $('colsB'), rowsB: $('rowsB'),
  hud: $('hud'),
  dlStl: $('dlStl'), dlStep: $('dlStep'),
};

// ---------- package dropdowns (presets only, no Custom) ----------
function fillPackageSelect(sel) {
  for (const g of PACKAGE_GROUPS) {
    const og = document.createElement('optgroup');
    og.label = g.group;
    for (const p of g.items) {
      const o = document.createElement('option');
      o.value = p.id; o.textContent = `${p.name} — ${p.x} x ${p.y} x ${p.z}`;
      og.appendChild(o);
    }
    sel.appendChild(og);
  }
}
fillPackageSelect(els.pkg);
fillPackageSelect(els.pkgB);

function selectPackage(sel, id, dims) {
  sel.value = id;
  const p = findPackage(id);
  if (p) { dims.x.value = p.x; dims.y.value = p.y; dims.z.value = p.z; }
}
const dimsA = { x: els.px, y: els.py, z: els.pz };
const dimsB = { x: els.pxB, y: els.pyB, z: els.pzB };

// ---------- URL hash state ----------
function applyHash() {
  if (!location.hash || location.hash.length < 2) return;
  try {
    const q = new URLSearchParams(location.hash.slice(1));
    if (q.get('s') === 'M3' || q.get('s') === 'M4') els.screw.value = q.get('s');
    if (q.get('pkg')) els.pkg.value = q.get('pkg');
    if (q.get('x')) els.px.value = q.get('x');
    if (q.get('y')) els.py.value = q.get('y');
    if (q.get('z')) els.pz.value = q.get('z');
    if (q.get('c')) els.clearance.value = q.get('c');
    if (q.get('cols')) els.cols.value = q.get('cols');
    if (q.get('rows')) els.rows.value = q.get('rows');
    if (q.get('t') === '1') els.twoParts.checked = true;
    if (q.get('split')) els.split.value = q.get('split');
    if (q.get('pkgB')) els.pkgB.value = q.get('pkgB');
    if (q.get('xb')) els.pxB.value = q.get('xb');
    if (q.get('yb')) els.pyB.value = q.get('yb');
    if (q.get('zb')) els.pzB.value = q.get('zb');
    if (q.get('colsB')) els.colsB.value = q.get('colsB');
    if (q.get('rowsB')) els.rowsB.value = q.get('rowsB');
  } catch { /* ignore malformed hash */ }
}
function writeHash() {
  const q = new URLSearchParams({
    s: els.screw.value,
    pkg: els.pkg.value, x: els.px.value, y: els.py.value, z: els.pz.value,
    c: els.clearance.value, cols: els.cols.value, rows: els.rows.value,
    t: els.twoParts.checked ? '1' : '0', split: els.split.value,
    pkgB: els.pkgB.value, xb: els.pxB.value, yb: els.pyB.value, zb: els.pzB.value,
    colsB: els.colsB.value, rowsB: els.rowsB.value,
  });
  history.replaceState(null, '', '#' + q.toString());
}

// ---------- input ----------
function pkgName(sel) { const p = findPackage(sel.value); return p ? p.name : 'part'; }
function readInput() {
  const inp = {
    screw: els.screw.value,
    clearance: els.clearance.value === '' ? undefined : +els.clearance.value,
    part: { name: pkgName(els.pkg), x: +els.px.value, y: +els.py.value, z: +els.pz.value },
    cols: els.cols.value === '' ? null : +els.cols.value,
    rows: els.rows.value === '' ? null : +els.rows.value,
  };
  if (els.twoParts.checked) {
    inp.partB = { name: pkgName(els.pkgB), x: +els.pxB.value, y: +els.pyB.value, z: +els.pzB.value };
    inp.split = +els.split.value / 100;
    inp.colsB = els.colsB.value === '' ? null : +els.colsB.value;
    inp.rowsB = els.rowsB.value === '' ? null : +els.rowsB.value;
  }
  return inp;
}

// ---------- three.js scene ----------
const canvas = $('view');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf4f1ea);
const camera = new THREE.PerspectiveCamera(40, 1, 0.5, 5000);
camera.up.set(0, 0, 1);   // Z-up: do not rotate geometry data
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.08;

scene.add(new THREE.HemisphereLight(0xffffff, 0xd8d2c4, 0.75));
const key = new THREE.DirectionalLight(0xffffff, 1.5);
key.position.set(180, -120, 320);
scene.add(key);
const fill = new THREE.DirectionalLight(0xe8e2d4, 0.45);
fill.position.set(-220, 160, 180);
scene.add(fill);

const trayMat = new THREE.MeshStandardMaterial({ color: 0x9fb1bf, metalness: 0.12, roughness: 0.55, flatShading: true });
const trayGeo = new THREE.BufferGeometry();
const trayMesh = new THREE.Mesh(trayGeo, trayMat);
scene.add(trayMesh);
const edgeMat = new THREE.LineBasicMaterial({ color: 0x232a33, transparent: true, opacity: 0.85 });
let edgeLines = null;
function updateEdges() {
  if (edgeLines) { scene.remove(edgeLines); edgeLines.geometry.dispose(); edgeLines = null; }
  if (!trayMesh.geometry.index) return;
  edgeLines = new THREE.LineSegments(new THREE.EdgesGeometry(trayMesh.geometry, 25), edgeMat);
  scene.add(edgeLines);
}

// Ghost parts, always shown. A = slate, B = bronze.
const ghostMat = new THREE.MeshStandardMaterial({ color: 0x465361, transparent: true, opacity: 0.55, depthWrite: false });
const ghostMatB = new THREE.MeshStandardMaterial({ color: 0x8a6d3b, transparent: true, opacity: 0.55, depthWrite: false });
const unitBox = new THREE.BoxGeometry(1, 1, 1);
let ghostA = null, ghostB = null;
function updateGhostParts(plan) {
  for (const m of [ghostA, ghostB]) if (m) { scene.remove(m); m.dispose(); }
  ghostA = ghostB = null;
  const build = (key, mat) => {
    const ps = plan.pockets.filter(p => p.part === key);
    if (!ps.length) return null;
    const dims = key === 'A' ? plan.parts.A.part : plan.parts.B.part;
    const m = new THREE.InstancedMesh(unitBox, mat, ps.length);
    const m4 = new THREE.Matrix4();
    ps.forEach((p, i) => {
      m4.makeScale(dims.x, dims.y, dims.z);
      m4.setPosition(p.cx, p.cy, p.floorZ + dims.z / 2);
      m.setMatrixAt(i, m4);
    });
    m.instanceMatrix.needsUpdate = true;
    scene.add(m);
    return m;
  };
  ghostA = build('A', ghostMat);
  if (plan.twoParts) ghostB = build('B', ghostMatB);
}

// Plate lattice, always shown
const plateGroup = new THREE.Group();
scene.add(plateGroup);
const latticeMat = new THREE.MeshBasicMaterial({ color: 0xb9b2a2 });
const usedHoleMat = new THREE.MeshBasicMaterial({ color: 0xdaa520 });
const plateMat = new THREE.MeshStandardMaterial({ color: 0xe2dcd0, transparent: true, opacity: 0.5, roughness: 0.9 });
function updateLattice(plan) {
  plateGroup.clear();
  const W = plan.outline.x + 60, D = plan.outline.y + 60;
  const plateSlab = new THREE.Mesh(new THREE.BoxGeometry(W, D, 3), plateMat);
  plateSlab.position.set(0, 0, -1.5);
  plateGroup.add(plateSlab);

  const used = new Set(plan.holes.map(h => `${h.x},${h.y}`));
  const holeGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.15, 16);
  holeGeo.rotateX(Math.PI / 2); // align cylinder axis to +Z
  const inst = [];
  for (let i = -Math.ceil(W / 2 / LATTICE_PITCH); i <= Math.ceil(W / 2 / LATTICE_PITCH); i++) {
    for (let j = -Math.ceil(D / 2 / LATTICE_PITCH); j <= Math.ceil(D / 2 / LATTICE_PITCH); j++) {
      if (((i + j) % 2 + 2) % 2 !== 0) continue;  // even parity only
      const x = i * LATTICE_PITCH, y = j * LATTICE_PITCH;
      if (Math.abs(x) > W / 2 - 2 || Math.abs(y) > D / 2 - 2) continue;
      inst.push({ x, y, used: used.has(`${x},${y}`) });
    }
  }
  for (const mat of [latticeMat, usedHoleMat]) {
    const pts = inst.filter(p => (mat === usedHoleMat) === p.used);
    if (!pts.length) continue;
    const m = new THREE.InstancedMesh(holeGeo, mat, pts.length);
    const m4 = new THREE.Matrix4();
    pts.forEach((p, i) => { m4.makeTranslation(p.x, p.y, -0.05); m.setMatrixAt(i, m4); });
    m.instanceMatrix.needsUpdate = true;
    plateGroup.add(m);
  }
}

let framed = false;
function reframe(outline) {
  const r = Math.hypot(outline.x, outline.y) / 2 + 30;
  camera.position.set(r * 0.9, -r * 1.15, r * 0.95);
  controls.target.set(0, 0, 3);
  controls.update();
  needsRender = true;
}

function resize() {
  const w = canvas.clientWidth || 1, h = canvas.clientHeight || 1;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
resize();

let needsRender = true;
controls.addEventListener('change', () => { needsRender = true; });
window.addEventListener('resize', () => { resize(); needsRender = true; });
function tick() {
  requestAnimationFrame(tick);
  controls.update();
  if (needsRender) { renderer.render(scene, camera); needsRender = false; }
}
tick();

// ---------- panel divider (drag to resize) ----------
{
  const divider = $('divider');
  let dragging = false;
  divider.addEventListener('pointerdown', (e) => {
    dragging = true;
    divider.classList.add('dragging');
    try { divider.setPointerCapture(e.pointerId); } catch { /* synthetic events */ }
    e.preventDefault();
  });
  divider.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const w = Math.min(560, Math.max(240, e.clientX));
    document.documentElement.style.setProperty('--pw', w + 'px');
    needsRender = true;
  });
  const stop = (e) => {
    if (!dragging) return;
    dragging = false;
    divider.classList.remove('dragging');
    try { divider.releasePointerCapture(e.pointerId); } catch { /* ignore */ }
    resize(); needsRender = true;
  };
  divider.addEventListener('pointerup', stop);
  divider.addEventListener('pointercancel', stop);
  new ResizeObserver(() => { resize(); needsRender = true; }).observe(canvas);
}

// ---------- mesh handoff ----------
function geometryFromMesh(mesh) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(mesh.positions), 3));
  g.setIndex(new THREE.BufferAttribute(new Uint32Array(mesh.indices), 1));
  g.computeVertexNormals();
  return g;
}

// ---------- HUD ----------
function renderHud(plan) {
  if (!plan.ok) {
    els.hud.style.color = '#c0392b';
    els.hud.textContent = plan.errors.join(' · ');
  } else {
    els.hud.style.color = '#6e6a5e';
    els.hud.textContent = '';
  }
}

// ---------- rebuild ----------
let seq = 0, current = null;   // current = { plan, built }
async function rebuild() {
  const mySeq = ++seq;
  const plan = computePlan(readInput());
  renderHud(plan);
  if (!plan.ok) { setDownloadsEnabled(false); return; }
  await new Promise(r => setTimeout(r));          // let the HUD paint before the WASM call
  if (mySeq !== seq) return;
  let built;
  try { built = buildTray(mod, plan); } catch (e) { renderHud({ ...plan, ok: false, errors: [e.message] }); setDownloadsEnabled(false); return; }
  if (mySeq !== seq) { built.manifold.delete(); return; }
  if (current) { current.built.manifold.delete(); trayMesh.geometry.dispose(); }
  current = { plan, built };
  trayMesh.geometry = geometryFromMesh(built.mesh);
  updateEdges();
  updateGhostParts(plan); updateLattice(plan);
  if (!framed) { reframe(plan.outline); framed = true; }
  setDownloadsEnabled(true);
  window.__trayGen = { plan, mesh: built.mesh, rebuild, renderer, buildBinarySTL, buildStep };
  writeHash();
  needsRender = true;
}
function setDownloadsEnabled(on) {
  els.dlStl.disabled = !on;
  els.dlStep.disabled = !on;
}

let debounceT = null;
function scheduleRebuild() {
  clearTimeout(debounceT);
  debounceT = setTimeout(rebuild, 120);
}

// ---------- events ----------
els.pkg.addEventListener('change', () => { selectPackage(els.pkg, els.pkg.value, dimsA); scheduleRebuild(); });
els.pkgB.addEventListener('change', () => { selectPackage(els.pkgB, els.pkgB.value, dimsB); scheduleRebuild(); });
for (const e of [dimsA.x, dimsA.y, dimsA.z, dimsB.x, dimsB.y, dimsB.z]) {
  e.addEventListener('input', scheduleRebuild);
  e.addEventListener('change', scheduleRebuild);
}
function syncTwoParts() { els.partBWrap.hidden = !els.twoParts.checked; }
function syncSplitLabel() {
  const v = +els.split.value;
  els.splitLabel.textContent = `A ${v}% / B ${100 - v}%`;
}
els.twoParts.addEventListener('change', () => { syncTwoParts(); scheduleRebuild(); });
els.split.addEventListener('input', () => { syncSplitLabel(); scheduleRebuild(); });
for (const e of [els.screw, els.clearance, els.cols, els.rows, els.colsB, els.rowsB]) {
  e.addEventListener('input', scheduleRebuild);
  e.addEventListener('change', scheduleRebuild);
}

// ---------- downloads ----------
function safeName(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
function fileBase() {
  const p = current.plan, pt = p.input.part;
  let base = `lumen-tray_${safeName(pt.name)}_${pt.x}x${pt.y}x${pt.z}mm_${p.input.screw}`;
  if (p.twoParts) {
    const ptB = p.input.partB;
    base += `+${safeName(ptB.name)}`;
  }
  return base;
}
function download(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
els.dlStl.addEventListener('click', () => {
  if (!current || !current.built) return;
  download(new Blob([buildBinarySTL(current.built.mesh)], { type: 'model/stl' }), fileBase() + '.stl');
});
els.dlStep.addEventListener('click', () => {
  if (!current || !current.built) return;
  const text = buildStep(current.built.mesh, fileBase());
  download(new Blob([text], { type: 'application/step' }), fileBase() + '.step');
});

// ---------- boot ----------
applyHash();
if (els.px.value === '') selectPackage(els.pkg, 'lqfp48', dimsA);
if (els.pxB.value === '') selectPackage(els.pkgB, 'soic8', dimsB);
if (els.clearance.value === '') els.clearance.value = 0.3;
syncTwoParts();
syncSplitLabel();
resize();
rebuild();
