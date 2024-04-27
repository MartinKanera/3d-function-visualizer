import * as THREE from "three";
import loadShader from "../utils/load-shader";

const COLOR_A = 0x15f5ba; // Extremes
const COLOR_B = 0x836fff; // Midpoint

const yCoordinatePassShader = await loadShader(
  "shaders/y_coordinate_pass.vert",
);
const colorBlendShader = await loadShader("shaders/color_blend.frag");

export const functionVisualizer = (
  vertices: number[],
  indices: number[],
  maxMeasuredY: number,
  minY: number,
  maxY: number,
) => {
  const geometry = new THREE.BufferGeometry();
  const positionAttribute = new THREE.Float32BufferAttribute(vertices, 3);
  geometry.setAttribute("position", positionAttribute);
  geometry.setIndex(indices);

  const material = new THREE.ShaderMaterial({
    vertexShader: yCoordinatePassShader,
    fragmentShader: colorBlendShader,
    uniforms: {
      maxY: { value: maxMeasuredY },
      colorA: { value: new THREE.Color(COLOR_A) },
      colorB: { value: new THREE.Color(COLOR_B) },
    },
    clipping: true,
    clippingPlanes: [
      new THREE.Plane(new THREE.Vector3(0, 1, 0), -minY),
      new THREE.Plane(new THREE.Vector3(0, -1, 0), maxY),
    ],
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
};
