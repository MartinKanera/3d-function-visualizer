import * as THREE from "three";
import loadShader from "../utils/load-shader";

const COLOR_A = 0x15f5ba; // Extremes
const COLOR_B = 0x836fff; // Midpoint

export const functionVisualizer = async (
  min: number,
  max: number,
  step: number,
  fn: (x: number, y: number) => number,
) => {
  const vertices = [];
  const segments = (max - min) / step;
  let maxMeasuredY = min;

  for (let x = min; x <= max; x += step) {
    for (let z = min; z <= max; z += step) {
      const y = fn(x, z);
      if (y > maxMeasuredY) {
        maxMeasuredY = Math.min(y, max);
      }
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

  const material = new THREE.ShaderMaterial({
    vertexShader: await loadShader("shaders/y_coordinate_pass.vert"),
    fragmentShader: await loadShader("shaders/color_blend.frag"),
    uniforms: {
      maxY: { value: maxMeasuredY },
      colorA: { value: new THREE.Color(COLOR_A) },
      colorB: { value: new THREE.Color(COLOR_B) },
    },
    clipping: true,
    clippingPlanes: [
      new THREE.Plane(new THREE.Vector3(0, 1, 0), max),
      new THREE.Plane(new THREE.Vector3(0, -1, 0), max),
    ],
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
};
