import type { GridBoxOptions } from "./grid-box";

export const generateFlatWireframeGrid = (
  { minX, maxX, minZ, maxZ }: Omit<GridBoxOptions, "minY" | "maxY">,
  segments: number,
) => {
  // construct a wireframe grid from lines
  const vertices = [];
  const stepX = (maxX - minX) / segments;
  const stepZ = (maxZ - minZ) / segments;

  for (let x = minX; x <= maxX; x += stepX) {
    vertices.push(x, 0, minZ);
    vertices.push(x, 0, maxZ);
  }

  for (let z = minZ; z <= maxZ; z += stepZ) {
    vertices.push(minX, 0, z);
    vertices.push(maxX, 0, z);
  }

  const indices = [];

  for (let i = 0; i < vertices.length / 3; i += 2) {
    indices.push(i, i + 1);
  }

  return { vertices, indices };
};

export const generateGrid = (
  { minX, maxX, minY, maxY, minZ, maxZ }: GridBoxOptions,
  segments: number,
  fn: string | ((x: number, y: number) => number),
) => {
  const vertices = [];
  const stepX = (maxX - minX) / segments;
  const stepZ = (maxZ - minZ) / segments;
  let maxMeasuredY = minY;

  for (let x = minX; x <= maxX; x += stepX) {
    for (let z = minZ; z <= maxZ; z += stepZ) {
      let y;
      // TODO
      if (typeof fn === "string") throw new Error("Unimplemented");
      else y = fn(x, z);

      if (y > maxMeasuredY) {
        maxMeasuredY = Math.min(y, maxY);
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

  console.log(vertices, indices);

  return { vertices, indices, maxMeasuredY };
};
