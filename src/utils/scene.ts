import * as THREE from "three";
import GridBox from "../solids/grid-box";
import type { FunctionValues } from "../utils/form";
import { generateGrid } from "../solids/grid";
import { functionVisualizer } from "../solids/function";
import { evaluate } from "mathjs";

export function newSceneState({
  fn,
  minX,
  maxX,
  minY,
  maxY,
  minZ,
  maxZ,
  segmentsX,
  segmentsZ,
  ...colors
}: FunctionValues) {
  const dimensions = {
    minX,
    maxX,
    minY,
    maxY,
    minZ,
    maxZ,
  };

  const { vertices, indices, minMeasuredY, maxMeasuredY } = generateGrid(
    dimensions,
    segmentsX,
    segmentsZ,
    (x, y) => evaluate(fn, { x, y }),
  );

  const newVisualizedFunction = functionVisualizer(
    vertices,
    indices,
    minMeasuredY,
    maxMeasuredY,
    minY,
    maxY,
    colors,
  );

  const gridBox = new GridBox(dimensions, segmentsX, segmentsZ);

  return {
    vertices,
    newVisualizedFunction,
    gridBox: gridBox.getGridBox(),
  };
}

export function clearScene(scene: THREE.Scene) {
  const n = scene.children.length - 1;

  for (let i = n; i > -1; i--) {
    scene.remove(scene.children[i]);
  }
}
