// x, y: overall outline incl. leads (mm). z: overall height, seating plane to top (mm).
// Values are nominal maximums from JEDEC outlines / typical datasheets. Verify per part.
export const PACKAGE_GROUPS = [
  { group: 'SOIC', items: [
    { id: 'soic8',   name: 'SOIC-8 (3.9 body)',   x: 6.0,  y: 4.9,  z: 1.75 },
    { id: 'soic14',  name: 'SOIC-14 (3.9 body)',  x: 6.0,  y: 8.65, z: 1.75 },
    { id: 'soic16',  name: 'SOIC-16 (3.9 body)',  x: 6.0,  y: 9.9,  z: 1.75 },
    { id: 'soic16w', name: 'SOIC-16W (7.5 body)', x: 10.3, y: 10.3, z: 2.65 },
    { id: 'soic20w', name: 'SOIC-20W (7.5 body)', x: 10.3, y: 12.8, z: 2.65 },
    { id: 'soic28w', name: 'SOIC-28W (7.5 body)', x: 10.3, y: 17.9, z: 2.65 },
  ]},
  { group: 'TSSOP / SSOP / MSOP', items: [
    { id: 'tssop8',  name: 'TSSOP-8',  x: 6.4, y: 3.0, z: 1.2 },
    { id: 'tssop14', name: 'TSSOP-14', x: 6.4, y: 5.0, z: 1.2 },
    { id: 'tssop16', name: 'TSSOP-16', x: 6.4, y: 5.0, z: 1.2 },
    { id: 'tssop20', name: 'TSSOP-20', x: 6.4, y: 6.5, z: 1.2 },
    { id: 'tssop24', name: 'TSSOP-24', x: 6.4, y: 7.8, z: 1.2 },
    { id: 'tssop28', name: 'TSSOP-28', x: 6.4, y: 9.7, z: 1.2 },
    { id: 'ssop28',  name: 'SSOP-28 (5.3 body)', x: 7.8, y: 10.2, z: 2.0 },
    { id: 'msop8',   name: 'MSOP-8',  x: 4.9, y: 3.0, z: 1.1 },
    { id: 'msop10',  name: 'MSOP-10', x: 4.9, y: 3.0, z: 1.1 },
  ]},
  { group: 'QFN / DFN', items: [
    { id: 'dfn8_3',   name: 'DFN-8 3x3',    x: 3.0,  y: 3.0,  z: 0.8 },
    { id: 'qfn16_3',  name: 'QFN-16 3x3',   x: 3.0,  y: 3.0,  z: 0.9 },
    { id: 'qfn20_4',  name: 'QFN-20 4x4',   x: 4.0,  y: 4.0,  z: 0.9 },
    { id: 'qfn24_4',  name: 'QFN-24 4x4',   x: 4.0,  y: 4.0,  z: 0.9 },
    { id: 'qfn32_5',  name: 'QFN-32 5x5',   x: 5.0,  y: 5.0,  z: 0.9 },
    { id: 'qfn40_6',  name: 'QFN-40 6x6',   x: 6.0,  y: 6.0,  z: 0.9 },
    { id: 'qfn48_7',  name: 'QFN-48 7x7',   x: 7.0,  y: 7.0,  z: 0.9 },
    { id: 'qfn56_8',  name: 'QFN-56 8x8',   x: 8.0,  y: 8.0,  z: 0.9 },
    { id: 'qfn64_9',  name: 'QFN-64 9x9',   x: 9.0,  y: 9.0,  z: 0.9 },
    { id: 'qfn68_10', name: 'QFN-68 10x10', x: 10.0, y: 10.0, z: 0.9 },
  ]},
  { group: 'LQFP / TQFP (lead-tip span)', items: [
    { id: 'lqfp32',  name: 'LQFP-32 (7x7 body)',    x: 9.0,  y: 9.0,  z: 1.6 },
    { id: 'lqfp44',  name: 'LQFP-44 (10x10 body)',  x: 12.0, y: 12.0, z: 1.6 },
    { id: 'lqfp48',  name: 'LQFP-48 (7x7 body)',    x: 9.0,  y: 9.0,  z: 1.6 },
    { id: 'lqfp64',  name: 'LQFP-64 (10x10 body)',  x: 12.0, y: 12.0, z: 1.6 },
    { id: 'lqfp80',  name: 'LQFP-80 (12x12 body)',  x: 14.0, y: 14.0, z: 1.6 },
    { id: 'lqfp100', name: 'LQFP-100 (14x14 body)', x: 16.0, y: 16.0, z: 1.6 },
    { id: 'lqfp128', name: 'LQFP-128 (14x20 body)', x: 22.0, y: 16.0, z: 1.6 },
    { id: 'lqfp144', name: 'LQFP-144 (20x20 body)', x: 22.0, y: 22.0, z: 1.6 },
    { id: 'lqfp176', name: 'LQFP-176 (24x24 body)', x: 26.0, y: 26.0, z: 1.6 },
    { id: 'tqfp32',  name: 'TQFP-32 (7x7 body)',    x: 9.0,  y: 9.0,  z: 1.2 },
    { id: 'tqfp44',  name: 'TQFP-44 (10x10 body)',  x: 12.0, y: 12.0, z: 1.2 },
    { id: 'tqfp64',  name: 'TQFP-64 (10x10 body)',  x: 12.0, y: 12.0, z: 1.2 },
    { id: 'tqfp100', name: 'TQFP-100 (14x14 body)', x: 16.0, y: 16.0, z: 1.2 },
  ]},
  { group: 'PLCC', items: [
    { id: 'plcc20', name: 'PLCC-20', x: 9.9,  y: 9.9,  z: 4.57 },
    { id: 'plcc28', name: 'PLCC-28', x: 12.45, y: 12.45, z: 4.57 },
    { id: 'plcc32', name: 'PLCC-32 (rect)', x: 14.0, y: 11.5, z: 3.56 },
    { id: 'plcc44', name: 'PLCC-44', x: 17.53, y: 17.53, z: 4.57 },
    { id: 'plcc52', name: 'PLCC-52', x: 20.07, y: 20.07, z: 4.57 },
    { id: 'plcc68', name: 'PLCC-68', x: 25.15, y: 25.15, z: 4.57 },
    { id: 'plcc84', name: 'PLCC-84', x: 30.23, y: 30.23, z: 4.57 },
  ]},
  { group: 'BGA (heights vary a lot; verify)', items: [
    { id: 'bga64_8',   name: 'BGA-64 8x8',     x: 8.0,  y: 8.0,  z: 1.4 },
    { id: 'bga100_10', name: 'BGA-100 10x10',  x: 10.0, y: 10.0, z: 1.4 },
    { id: 'bga144_13', name: 'BGA-144 13x13',  x: 13.0, y: 13.0, z: 1.5 },
    { id: 'bga256_17', name: 'BGA-256 17x17',  x: 17.0, y: 17.0, z: 1.7 },
    { id: 'bga484_23', name: 'BGA-484 23x23',  x: 23.0, y: 23.0, z: 2.0 },
    { id: 'bga676_27', name: 'BGA-676 27x27',  x: 27.0, y: 27.0, z: 2.3 },
  ]},
  { group: 'SOT / small power', items: [
    { id: 'sot23',   name: 'SOT-23',          x: 2.9, y: 2.4, z: 1.1 },
    { id: 'sot23_6', name: 'SOT-23-5/6',      x: 2.9, y: 2.8, z: 1.1 },
    { id: 'sot363',  name: 'SOT-363 (SC-70)', x: 2.0, y: 2.1, z: 1.0 },
    { id: 'sot89',   name: 'SOT-89',          x: 4.5, y: 4.0, z: 1.5 },
    { id: 'sot223',  name: 'SOT-223',         x: 6.5, y: 7.0, z: 1.7 },
    { id: 'to252',   name: 'TO-252 (DPAK)',   x: 6.6, y: 10.0, z: 2.4 },
    { id: 'to263',   name: 'TO-263 (D2PAK)',  x: 10.2, y: 15.3, z: 4.6 },
  ]},
  { group: 'Modules / crystals', items: [
    { id: 'esp32wroom', name: 'ESP32-WROOM-32',   x: 18.0, y: 25.5, z: 3.1 },
    { id: 'esp32c3mini', name: 'ESP32-C3-MINI-1', x: 13.2, y: 16.6, z: 2.4 },
    { id: 'esp12f',     name: 'ESP-12F',          x: 16.0, y: 24.0, z: 3.0 },
    { id: 'xtal3215',   name: 'Crystal 3215 (32k)', x: 3.2, y: 1.5, z: 0.9 },
    { id: 'xtal3225',   name: 'Crystal 3225',     x: 3.2, y: 2.5, z: 0.8 },
    { id: 'xtal5032',   name: 'Crystal 5032',     x: 5.0, y: 3.2, z: 1.3 },
    { id: 'xtal7050',   name: 'Crystal 7050',     x: 7.0, y: 5.0, z: 1.8 },
  ]},
];

export const CUSTOM_ID = 'custom';

export function findPackage(id) {
  for (const g of PACKAGE_GROUPS) for (const p of g.items) if (p.id === id) return p;
  return null;
}

export function allPackages() {
  return PACKAGE_GROUPS.flatMap(g => g.items);
}
