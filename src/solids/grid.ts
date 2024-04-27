import type { GridBoxOptions } from "./grid-box";
import * as THREE from "three";

const EPSILON = 0.001;

const generateFlatWireframeGrid = (
  { minX, maxX, minZ, maxZ }: Omit<GridBoxOptions, "minY" | "maxY">,
  segmentsX: number,
  segmentsZ: number,
) => {
  // construct a wireframe grid from lines
  const vertices = [];
  const stepX = (maxX - minX) / segmentsX;
  const stepZ = (maxZ - minZ) / segmentsZ;

  for (let x = minX - EPSILON; x <= maxX + EPSILON; x += stepX) {
    // Leave out, the axis will be drawn separately
    if (Math.abs(x) < EPSILON) continue;
    vertices.push(x, 0, minZ);
    vertices.push(x, 0, maxZ);
  }

  for (let z = minZ - EPSILON; z <= maxZ + EPSILON; z += stepZ) {
    // Leave out, the axis will be drawn separately
    if (Math.abs(z) < EPSILON) continue;
    vertices.push(minX, 0, z);
    vertices.push(maxX, 0, z);
  }

  const indices = [];

  for (let i = 0; i < vertices.length / 3; i += 2) {
    indices.push(i, i + 1);
  }

  return { vertices, indices };
};

export const getFlatGridObject = (
  dimensions: Omit<GridBoxOptions, "minY" | "maxY">,
  segmentsX: number,
  segmentsZ: number,
  color: number,
) => {
  const { vertices, indices } = generateFlatWireframeGrid(
    dimensions,
    segmentsX,
    segmentsZ,
  );

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3),
  );
  geometry.setIndex(indices);

  const material = new THREE.LineBasicMaterial({ color: color });
  return new THREE.LineSegments(geometry, material);
};

export const generateGrid = (
  { minX, maxX, minY, maxY, minZ, maxZ }: GridBoxOptions,
  segmentsX: number,
  segmentsZ: number,
  fn: (x: number, y: number) => number,
) => {
  const vertices = [];

  const stepX = (maxX - minX) / segmentsX;
  const stepZ = (maxZ - minZ) / segmentsZ;

  let maxMeasuredY = minY;

  for (let i = 0; i <= segmentsX; i++) {
    let x = minX + i * stepX;
    for (let j = 0; j <= segmentsZ; j++) {
      let z = minZ + j * stepZ;
      let y = fn(x, z);

      if (y > maxMeasuredY) {
        maxMeasuredY = Math.min(y, maxY);
      }
      vertices.push(x, y, z);
    }
  }

  const indices = [];
  for (let i = 0; i < segmentsX; i++) {
    for (let j = 0; j < segmentsZ; j++) {
      const a = i * (segmentsZ + 1) + j;
      const b = a + (segmentsZ + 1);
      indices.push(a, b, a + 1);
      indices.push(b, b + 1, a + 1);
    }
  }

  return { vertices, indices, maxMeasuredY };
};
