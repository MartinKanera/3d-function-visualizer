import * as THREE from "three";

export const functionVisualizer = (
  min: number,
  max: number,
  resolution: number,
  fn: (x: number, y: number) => number,
) => {
  const vertices = [];
  const segments = (max - min) / resolution;
  for (let x = min; x <= max; x += resolution) {
    for (let z = min; z <= max; z += resolution) {
      const y = fn(x, z);
      vertices.push(x, y, z);
    }
  }

  const indices = [];
  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < segments; j++) {
      const a = i * (segments + 1) + j;
      const b = a + (segments + 1);
      indices.push(a, b, a + 1);
      indices.push(b, b + 1, a + 1);
    }
  }

  const geometry = new THREE.BufferGeometry();
  const positionAttribute = new THREE.Float32BufferAttribute(vertices, 3);
  geometry.setAttribute("position", positionAttribute);
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  const material = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    color: 0x00ff00,
    specular: 0x555555,
    shininess: 30,
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
};
