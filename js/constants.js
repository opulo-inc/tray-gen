// All units mm. Coordinate system: origin at center of tray bottom face,
// +X along the long tray axis, +Y along the short axis, +Z up (away from plate).

export const VISION_Z = 10.0;      // top of IC must be here (above staging plate)
export const TRAY_H = 10.0;        // tray top is flush with the vision plane
export const MIN_FLOOR = 1.5;      // min material under a pocket floor
export const EDGE_WALL = 6.0;      // min material between pockets and the outer edge
export const PIN1_CHAMFER = 8.0;   // 45deg chamfer leg at the (-X,+Y) corner
export const CORNER_FILLET = 6.0;  // fillet radius on the other three corners
export const TOP_CHAMFER = 2.0;    // 45deg handling chamfer around the top rim
export const CB_FLOOR = 3.0;       // material left under the screw head
export const CB_DEPTH = TRAY_H - CB_FLOOR; // 7.0

export const MAX_PART_Z = TRAY_H - MIN_FLOOR; // 8.5

// Single tray size: 175 x 120 mm (sized to the 120 mm deep staging plate).
export const TRAY = { x: 175, y: 120, label: '175 x 120 mm' };

// Lattice holes relative to tray center, pushed to the corners. Tray center
// sits over a plate hole, so every entry must satisfy (x/15 + y/15) even.
// Tested in tools/sweep.mjs.
export const HOLES = {
  corners: [[-75, -45], [75, -45], [-75, 45], [75, 45]],
};

export const LATTICE_PITCH = 15;

// ISO 4762 socket head cap screws. thru = clearance hole, cbDia = counterbore dia.
export const SCREWS = {
  M3: { thru: 3.4, cbDia: 6.5, headH: 3.0, label: 'M3 socket head' },
  M4: { thru: 4.5, cbDia: 8.0, headH: 4.0, label: 'M4 socket head' },
};

export const DEFAULTS = {
  screw: 'M4',
  clearance: 0.30,   // per side
  cols: null,        // null = auto (as many as fit)
  rows: null,
};

export const WALL = 1.5;           // fixed wall thickness between pockets (mm)

export const LIMITS = {
  clearance: { min: 0, max: 1.5 },
};

export const CYL_SEGMENTS = 48;
