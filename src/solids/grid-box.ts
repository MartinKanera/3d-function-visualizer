import * as THREE from "three";
import { axis } from "./axis";
import { generateFlatWireframeGrid } from "./grid";
import AxisDirection from "../model/axis-direction";

export type GridBoxOptions = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
};

const PRIMARY_BOX_COLOR = 0xffffff;

const getGridObject = (vertices: number[], indices: number[]) => {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3),
  );
  geometry.setIndex(indices);

  const material = new THREE.LineBasicMaterial({ color: 0x757575 });
  return new THREE.LineSegments(geometry, material);
};

export default class GridBox {
  private dimensions: GridBoxOptions;
  private segments: number;
  // @ts-expect-error
  private grid: THREE.LineSegments;
  // @ts-expect-error
  private axis: [THREE.Group, THREE.Group, THREE.Group];
  // @ts-expect-error
  private box: THREE.Box3Helper;

  constructor(dimensions: GridBoxOptions, segments: number) {
    this.dimensions = dimensions;
    this.segments = segments;
    this.update();
  }

  public setDimensions(dimensions: GridBoxOptions) {
    this.dimensions = dimensions;
    this.update();
  }

  public setDivisions(segments: number) {
    this.segments = segments;
    return this;
  }

  private update() {
    const { vertices: wfVertices, indices: wfIndices } =
      generateFlatWireframeGrid(this.dimensions, this.segments);

    this.grid = getGridObject(wfVertices, wfIndices);

    const { minX, maxX, minY, maxY, minZ, maxZ } = this.dimensions;

    console.log();

    this.axis = [
      axis({ min: minX, max: maxX }, AxisDirection.X, PRIMARY_BOX_COLOR),
      axis({ min: minY, max: maxY }, AxisDirection.Y, PRIMARY_BOX_COLOR),
      axis({ min: minZ, max: maxZ }, AxisDirection.Z, PRIMARY_BOX_COLOR),
    ];
    // TODO box
  }

  public getGridBox() {
    const group = new THREE.Group();
    // group.add(this.grid, this.box, ...this.axis);
    group.add(this.grid, ...this.axis);
    return group;
  }
}
