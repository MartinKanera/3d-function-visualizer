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

export default class GridBox {
  private dimensions: GridBoxOptions;
  private segmentsX: number;
  private segmentsZ: number;
  // @ts-expect-error
  private grid: THREE.LineSegments;
  // @ts-expect-error
  private axis: [THREE.Group, THREE.Group, THREE.Group];
  // @ts-expect-error
  private box: THREE.LineSegments;

  constructor(
    dimensions: GridBoxOptions,
    segmentsX: number,
    segmentsZ: number,
  ) {
    this.dimensions = dimensions;
    this.segmentsX = segmentsX;
    this.segmentsZ = segmentsZ;
    this.update();
  }

  public setDimensions(dimensions: GridBoxOptions) {
    this.dimensions = dimensions;
    this.update();
  }

  public setSegments({
    segmentsX,
    segmentsZ,
  }: {
    segmentsX: number;
    segmentsZ: number;
  }) {
    this.segmentsX = segmentsX;
    this.segmentsZ = segmentsZ;
    this.update();
  }

  private update() {
    this.grid = getFlatGridObject(
      this.dimensions,
      this.segmentsX,
      this.segmentsZ,
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
