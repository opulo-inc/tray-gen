// Faceted B-rep STEP (AP214). One FACE_SURFACE + POLY_LOOP face per triangle on its own PLANE,
// wrapped in FACETED_BREP + CLOSED_SHELL. Imports as a solid in OCC-based CAD (verified with CadQuery).
// NOTE: OCC's strict reader requires AXIS2_PLACEMENT_3D to carry all 4 parameters (use $ for the
// optional ref_direction); a bare FACE without a surface is rejected, hence FACE_SURFACE + PLANE.
export function buildStep(mesh, name = 'lumen-tray') {
  const { positions: P, indices: I } = mesh;
  const lines = [];
  let id = 1; const nid = () => id++;
  const push = (s) => lines.push(s);
  const now = new Date().toISOString().slice(0, 19);

  push('ISO-10303-21;');
  push('HEADER;');
  push(`FILE_DESCRIPTION(('LumenPnP IC tray, faceted'),'2;1');`);
  push(`FILE_NAME('${name}.step','${now}',('tray-gen'),('Opulo'),'tray-gen','tray-gen','');`);
  push(`FILE_SCHEMA(('AUTOMOTIVE_DESIGN { 1 0 10303 214 1 1 1 1 }'));`);
  push('ENDSEC;');
  push('DATA;');

  const nVerts = P.length / 3;
  const pointIds = new Array(nVerts);
  for (let v = 0; v < nVerts; v++) {
    pointIds[v] = nid();
    push(`#${pointIds[v]}=CARTESIAN_POINT('',(${f(P[3*v])},${f(P[3*v+1])},${f(P[3*v+2])}));`);
  }
  const faceIds = [];
  for (let t = 0; t < I.length; t += 3) {
    const a = I[t] * 3, b = I[t + 1] * 3, c = I[t + 2] * 3;
    const ux = P[b] - P[a], uy = P[b + 1] - P[a + 1], uz = P[b + 2] - P[a + 2];
    const vx = P[c] - P[a], vy = P[c + 1] - P[a + 1], vz = P[c + 2] - P[a + 2];
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const L = Math.hypot(nx, ny, nz) || 1; nx /= L; ny /= L; nz /= L;
    const o = nid(); push(`#${o}=CARTESIAN_POINT('',(${f(P[a])},${f(P[a+1])},${f(P[a+2])}));`);
    const d = nid(); push(`#${d}=DIRECTION('',(${f(nx)},${f(ny)},${f(nz)}));`);
    const axp = nid(); push(`#${axp}=AXIS2_PLACEMENT_3D('',#${o},#${d},$);`);
    const pl = nid(); push(`#${pl}=PLANE('',#${axp});`);
    const loop = nid(); push(`#${loop}=POLY_LOOP('',(#${pointIds[I[t]]},#${pointIds[I[t+1]]},#${pointIds[I[t+2]]}));`);
    const bound = nid(); push(`#${bound}=FACE_OUTER_BOUND('',#${loop},.T.);`);
    const face = nid(); push(`#${face}=FACE_SURFACE('',(#${bound}),#${pl},.T.);`);
    faceIds.push(face);
  }
  const shell = nid(); push(`#${shell}=CLOSED_SHELL('',(${faceIds.map(i => '#' + i).join(',')}));`);
  const brep = nid(); push(`#${brep}=FACETED_BREP('${name}',#${shell});`);

  const origin = nid(); push(`#${origin}=CARTESIAN_POINT('',(0.,0.,0.));`);
  const dz = nid(); push(`#${dz}=DIRECTION('',(0.,0.,1.));`);
  const dx = nid(); push(`#${dx}=DIRECTION('',(1.,0.,0.));`);
  const axis = nid(); push(`#${axis}=AXIS2_PLACEMENT_3D('',#${origin},#${dz},#${dx});`);
  const lenUnit = nid(); push(`#${lenUnit}=(LENGTH_UNIT()NAMED_UNIT(*)SI_UNIT(.MILLI.,.METRE.));`);
  const angUnit = nid(); push(`#${angUnit}=(NAMED_UNIT(*)PLANE_ANGLE_UNIT()SI_UNIT($,.RADIAN.));`);
  const solUnit = nid(); push(`#${solUnit}=(NAMED_UNIT(*)SI_UNIT($,.STERADIAN.)SOLID_ANGLE_UNIT());`);
  const unc = nid(); push(`#${unc}=UNCERTAINTY_MEASURE_WITH_UNIT(LENGTH_MEASURE(1.E-05),#${lenUnit},'distance_accuracy_value','');`);
  const ctx = nid(); push(`#${ctx}=(GEOMETRIC_REPRESENTATION_CONTEXT(3)GLOBAL_UNCERTAINTY_ASSIGNED_CONTEXT((#${unc}))GLOBAL_UNIT_ASSIGNED_CONTEXT((#${lenUnit},#${angUnit},#${solUnit}))REPRESENTATION_CONTEXT('',''));`);
  const shapeRep = nid(); push(`#${shapeRep}=ADVANCED_BREP_SHAPE_REPRESENTATION('${name}',(#${axis},#${brep}),#${ctx});`);

  const appCtx = nid(); push(`#${appCtx}=APPLICATION_CONTEXT('automotive design');`);
  const prodCtx = nid(); push(`#${prodCtx}=PRODUCT_CONTEXT('',#${appCtx},'mechanical');`);
  const prod = nid(); push(`#${prod}=PRODUCT('${name}','${name}','',(#${prodCtx}));`);
  const pdfc = nid(); push(`#${pdfc}=PRODUCT_DEFINITION_CONTEXT('part definition',#${appCtx},'design');`);
  const pdf = nid(); push(`#${pdf}=PRODUCT_DEFINITION_FORMATION('','',#${prod});`);
  const pd = nid(); push(`#${pd}=PRODUCT_DEFINITION('design','',#${pdf},#${pdfc});`);
  const pds = nid(); push(`#${pds}=PRODUCT_DEFINITION_SHAPE('','',#${pd});`);
  const sdr = nid(); push(`#${sdr}=SHAPE_DEFINITION_REPRESENTATION(#${pds},#${shapeRep});`);
  push('ENDSEC;');
  push('END-ISO-10303-21;');
  return lines.join('\n');

  function f(v) { let s = (+v).toFixed(4).replace(/0+$/, '').replace(/\.$/, '.0'); if (!s.includes('.')) s += '.0'; return s; }
}
