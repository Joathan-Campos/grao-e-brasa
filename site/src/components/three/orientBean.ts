import * as THREE from "three";

/** autovetores de uma matriz simétrica 3x3 (método de Jacobi) */
function eigenSym3(m: number[][]) {
  const a = m.map((r) => r.slice());
  const v = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ];
  for (let sweep = 0; sweep < 50; sweep++) {
    let p = 0,
      q = 1,
      max = Math.abs(a[0][1]);
    if (Math.abs(a[0][2]) > max) [p, q, max] = [0, 2, Math.abs(a[0][2])];
    if (Math.abs(a[1][2]) > max) [p, q, max] = [1, 2, Math.abs(a[1][2])];
    if (max < 1e-12) break;
    const theta = (a[q][q] - a[p][p]) / (2 * a[p][q]);
    const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
    const c = 1 / Math.sqrt(t * t + 1),
      s = t * c;
    for (let k = 0; k < 3; k++) {
      const akp = a[k][p],
        akq = a[k][q];
      a[k][p] = c * akp - s * akq;
      a[k][q] = s * akp + c * akq;
    }
    for (let k = 0; k < 3; k++) {
      const apk = a[p][k],
        aqk = a[q][k];
      a[p][k] = c * apk - s * aqk;
      a[q][k] = s * apk + c * aqk;
    }
    for (let k = 0; k < 3; k++) {
      const vkp = v[k][p],
        vkq = v[k][q];
      v[k][p] = c * vkp - s * vkq;
      v[k][q] = s * vkp + c * vkq;
    }
  }
  return [0, 1, 2]
    .map((i) => ({ value: a[i][i], vector: new THREE.Vector3(v[0][i], v[1][i], v[2][i]).normalize() }))
    .sort((x, y) => y.value - x.value);
}

/**
 * Extrai a malha do grão escaneado, centraliza e alinha pelos eixos principais:
 * comprimento → Y, largura → X, espessura → Z (face do sulco virada para +Z).
 * Devolve geometria e material prontos, com altura normalizada para `height`.
 */
export function prepareScannedBean(root: THREE.Object3D, height = 2.16, flipFace = false) {
  root.updateMatrixWorld(true);
  let mesh: THREE.Mesh | null = null;
  root.traverse((o) => {
    if (!mesh && (o as THREE.Mesh).isMesh) mesh = o as THREE.Mesh;
  });
  if (!mesh) throw new Error("modelo sem malha");
  const m = mesh as THREE.Mesh;
  const geo = m.geometry.clone();
  // o arquivo comprimido guarda atributos como inteiros normalizados; converte para float antes de transformar
  for (const name of ["position", "normal", "tangent"]) {
    const attr = geo.getAttribute(name) as THREE.BufferAttribute | undefined;
    if (!attr) continue;
    const out = new Float32Array(attr.count * attr.itemSize);
    for (let i = 0; i < attr.count; i++)
      for (let k = 0; k < attr.itemSize; k++) out[i * attr.itemSize + k] = attr.getComponent(i, k);
    geo.setAttribute(name, new THREE.BufferAttribute(out, attr.itemSize));
  }
  geo.applyMatrix4(m.matrixWorld);

  const pos = geo.attributes.position as THREE.BufferAttribute;
  const c = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) c.add(new THREE.Vector3().fromBufferAttribute(pos, i));
  c.divideScalar(pos.count);
  geo.translate(-c.x, -c.y, -c.z);

  const cov = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  const p = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    p.fromBufferAttribute(pos, i);
    const arr = [p.x, p.y, p.z];
    for (let r = 0; r < 3; r++) for (let k = 0; k < 3; k++) cov[r][k] += arr[r] * arr[k];
  }
  const [long, mid] = eigenSym3(cov);
  const yAxis = long.vector;
  const xAxis = mid.vector;
  const zAxis = new THREE.Vector3().crossVectors(xAxis, yAxis).normalize();
  if (flipFace) {
    zAxis.negate();
    xAxis.negate();
  }
  const basis = new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis).invert();
  geo.applyMatrix4(basis);

  geo.computeBoundingBox();
  const size = geo.boundingBox!.getSize(new THREE.Vector3());
  const s = height / size.y;
  geo.scale(s, s, s);
  geo.computeBoundingBox();
  geo.computeBoundingSphere();
  if (!geo.attributes.normal) geo.computeVertexNormals();
  return { geometry: geo, material: m.material as THREE.MeshStandardMaterial };
}
