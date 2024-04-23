import * as THREE from "three";
import { axis } from "./axis";
import { getFlatGridObject } from "./grid";
import { generateWireframeBox } from "./box";
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
const SECONDARY_BOX_COLOR = 0x757575;

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
  private box: THREE.LineSegments;

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
    this.grid = getFlatGridObject(
      this.dimensions,
      this.segments,
      SECONDARY_BOX_COLOR,
    );

    const { minX, maxX, minY, maxY, minZ, maxZ } = this.dimensions;

    this.axis = [
      axis({ min: minX, max: maxX }, AxisDirection.X, PRIMARY_BOX_COLOR),
      axis({ min: minY, max: maxY }, AxisDirection.Y, PRIMARY_BOX_COLOR),
      axis({ min: minZ, max: maxZ }, AxisDirection.Z, PRIMARY_BOX_COLOR),
    ];
    this.box = generateWireframeBox(this.dimensions, PRIMARY_BOX_COLOR);
  }

  public getGridBox() {
    const group = new THREE.Group();
    group.add(this.grid, this.box, ...this.axis);
    return group;
  }
}
