import * as THREE from "three";
import type { FunctionValues } from "../utils/form";
import loadShader from "../utils/load-shader";

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
  colors: Pick<FunctionValues, "colorMax" | "colorZero" | "colorMin">,
) => {
  const geometry = new THREE.BufferGeometry();
  const positionAttribute = new THREE.Float32BufferAttribute(vertices, 3);
  geometry.setAttribute("position", positionAttribute);
  geometry.setIndex(indices);

  const { colorMax, colorZero, colorMin } = colors;

  const material = new THREE.ShaderMaterial({
    vertexShader: yCoordinatePassShader,
    fragmentShader: colorBlendShader,
    uniforms: {
      minY: { value: minMeasuredY },
      maxY: { value: maxMeasuredY },
      colorMaxY: { value: new THREE.Color(colorMax) },
      colorZero: { value: new THREE.Color(colorZero) },
      colorMinY: { value: new THREE.Color(colorMin) },
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
