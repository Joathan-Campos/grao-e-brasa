import * as THREE from "three";

/**
 * Grão de café gerado em código: um elipsoide achatado de um lado,
 * com o sulco em "S" característico na face plana e leve irregularidade orgânica.
 */
export function createBeanGeometry(detail = 96): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(1, detail, Math.round(detail * 0.75));
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);

    // proporções do grão
    let x = v.x * 0.78;
    let y = v.y * 1.08;
    let z = v.z * 0.62;

    // face plana (z > 0): achata e arredonda as bordas
    if (z > 0) z *= 0.5;

    // sulco central em S na face plana
    const center = 0.09 * Math.sin(y * 2.6);
    const d = x - center;
    const groove = Math.exp(-(d * d) / 0.0035) * Math.max(0, 1 - Math.pow(Math.abs(y) / 1.02, 4));
    if (v.z > 0) z -= groove * 0.22 * Math.min(1, v.z * 3);

    // irregularidade orgânica suave
    const n = 0.018 * Math.sin(x * 7.1 + y * 3.3) + 0.012 * Math.sin(y * 9.7 - z * 4.1);
    const len = Math.hypot(x, y, z) || 1;
    x += (x / len) * n;
    y += (y / len) * n;
    z += (z / len) * n;

    pos.setXYZ(i, x, y, z);
  }

  geo.computeVertexNormals();
  return geo;
}
