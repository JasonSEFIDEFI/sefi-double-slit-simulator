export function runDoubleSlitStep(params, electron) {
  const {
    amplitude,
    wavelength,
    slitSeparation,
    slitWidth,
    electronInfluence,
    collapseThreshold,
  } = params;

  const width = 800;
  const height = 400;

  const field = [];
  let tension = 0;

  const k = (2 * Math.PI) / wavelength;
  const midX = width / 2;
  const slitOffset = slitSeparation / 2;
  const slitY = 90;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx1 = x - (midX - slitOffset);
      const dy1 = y - slitY;
      const r1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);

      const dx2 = x - (midX + slitOffset);
      const dy2 = y - slitY;
      const r2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

      const phase1 = k * r1;
      const phase2 = k * r2;

      const psi =
        amplitude *
        (Math.sin(phase1) + Math.sin(phase2)) /
        2;

      let intensity = psi * psi;

      const ex = electron.x;
      const ey = electron.y;
      const dxE = x - ex;
      const dyE = y - ey;
      const distE = Math.sqrt(dxE * dxE + dyE * dyE);

      if (distE < 40) {
        const proximity = (40 - distE) / 40;
        const localWarp = proximity * electronInfluence * 0.01;
        intensity += localWarp;
        tension += Math.abs(localWarp);
      }

      field.push({ x, y, intensity });
    }
  }

  const tensionPct = tension / 500;
  const collapsed = tensionPct > collapseThreshold / 100;

  return { field, tension: tensionPct, collapsed };
}
