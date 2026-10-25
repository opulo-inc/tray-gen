// All units mm. Coordinate system: origin at center of tray bottom face,
// +X along the long tray axis, +Y along the short axis, +Z up (away from plate).

export const VISION_Z = 10.0;      // top of IC must be here (above staging plate)
export const TRAY_H = 10.0;        // tray top is flush with the vision plane
export const MIN_FLOOR = 1.5;      // min material under a pocket floor
export const EDGE_WALL = 6.0;      // min material between pockets and the outer edge
export const PIN1_CHAMFER = 8.0;   // 45deg chamfer leg at the (-X,+Y) corner
export const CORNER_FILLET = 3.0;   // tight corner radius; pin-1 stays the chamfered corner
export const TOP_CHAMFER = 2.0;    // 45deg handling chamfer around the top rim
export const CB_FLOOR = 3.0;       // material left under the screw head
export const CB_DEPTH = TRAY_H - CB_FLOOR; // 7.0

export const MAX_PART_Z = TRAY_H - MIN_FLOOR; // 8.5

// A column is one line of the 30 mm mounting grid: the holes that sit one
// lattice step in from the top and bottom edges. 6 columns is the full
// 175 mm plate; 1 is a single column. The outline sits 12.5 mm outside the
// outer column. The outline is 118 mm tall, 1 mm short of the plate on each
// side, so trays can sit next to each other. Labels still say 120.
export const LATTICE_PITCH = 15;
export const COLUMN_PITCH = LATTICE_PITCH * 2;
export const PLATE_Y = 120;
export const TRAY_Y = 118;
export const COLUMN_MARGIN = 12.5;
export const MIN_SPAN = 1;
export const MAX_SPAN = 6;

export function spanOutline(span) {
  const n = Math.min(MAX_SPAN, Math.max(MIN_SPAN, Math.round(Number(span) || MAX_SPAN)));
  const x = (n - 1) * COLUMN_PITCH + 2 * COLUMN_MARGIN;
  return { span: n, x, y: TRAY_Y, label: `${x} x ${PLATE_Y} mm` };
}

export const TRAY = spanOutline(MAX_SPAN);

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
