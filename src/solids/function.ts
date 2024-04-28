import * as THREE from "three";
import loadShader from "../utils/load-shader";

const COLOR_MAX = 0xff99cc; // Top
const COLOR_ZERO = 0xffff00; // Midpoint
const COLOR_MIN = 0x9966cc; // Bottom

const yCoordinatePassShader = await loadShader(
  "shaders/y_coordinate_pass.vert",
);
const colorBlendShader = await loadShader("shaders/color_blend.frag");

export const functionVisualizer = (
  vertices: number[],
  indices: number[],
  minMeasuredY: number,
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
      minY: { value: minMeasuredY },
      maxY: { value: maxMeasuredY },
      colorMaxY: { value: new THREE.Color(COLOR_MAX) },
      colorZero: { value: new THREE.Color(COLOR_ZERO) },
      colorMinY: { value: new THREE.Color(COLOR_MIN) },
    },
    clipping: true,
    clippingPlanes: [
      new THREE.Plane(new THREE.Vector3(0, 1, 0), -minY),
      new THREE.Plane(new THREE.Vector3(0, -1, 0), maxY),
    ],
    transparent: true,
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
};
