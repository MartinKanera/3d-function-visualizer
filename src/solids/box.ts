import type { GridBoxOptions } from "./grid-box";
import * as THREE from "three";

export const generateWireframeBox = (
  { minX, maxX, minY, maxY, minZ, maxZ }: GridBoxOptions,
  color: number,
) => {
  const vertices = [];
  const indices = [];

  // Front face
  vertices.push(minX, minY, minZ);
  vertices.push(maxX, minY, minZ);

  vertices.push(maxX, minY, minZ);
  vertices.push(maxX, maxY, minZ);

  vertices.push(maxX, maxY, minZ);
  vertices.push(minX, maxY, minZ);

  vertices.push(minX, maxY, minZ);
  vertices.push(minX, minY, minZ);

  // Back face
  vertices.push(minX, minY, maxZ);
  vertices.push(maxX, minY, maxZ);

  vertices.push(maxX, minY, maxZ);
  vertices.push(maxX, maxY, maxZ);

  vertices.push(maxX, maxY, maxZ);
  vertices.push(minX, maxY, maxZ);

  vertices.push(minX, maxY, maxZ);
  vertices.push(minX, minY, maxZ);

  // Connecting lines
  vertices.push(minX, minY, minZ);
  vertices.push(minX, minY, maxZ);

  vertices.push(maxX, minY, minZ);
  vertices.push(maxX, minY, maxZ);

  vertices.push(maxX, maxY, minZ);
  vertices.push(maxX, maxY, maxZ);

  vertices.push(minX, maxY, minZ);
  vertices.push(minX, maxY, maxZ);

  // Indices

  for (let i = 0; i < vertices.length / 3; i++) {
    indices.push(i);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3),
  );

  geometry.setIndex(indices);

  const material = new THREE.LineBasicMaterial({ color });
  return new THREE.LineSegments(geometry, material);
};
