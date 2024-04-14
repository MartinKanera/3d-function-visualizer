import * as THREE from "three";
import { axis } from "./axis";
import AxisDirection from "../model/axis-direction";

const PRIMARY_BOX_COLOR = 0xffffff;
const SECONDARY_BOX_COLOR = 0x757575;

export default class GridBox {
  private size: number;
  private divisions: number;
  // @ts-ignore
  private grid: THREE.GridHelper;
  // @ts-ignore
  private axis: [THREE.Group, THREE.Group, THREE.Group];
  // @ts-ignore
  private box: THREE.Box3Helper;

  constructor(size: number, divisions: number) {
    this.size = size;
    this.divisions = divisions;
    this.update();
  }

  public setSize(size: number) {
    this.size = size;
    return this;
  }

  public setDivisions(divisions: number) {
    this.divisions = divisions;
    return this;
  }

  public update() {
    this.grid = new THREE.GridHelper(
      this.size,
      this.divisions,
      PRIMARY_BOX_COLOR,
      SECONDARY_BOX_COLOR,
    );
    this.axis = [
      axis(this.size, AxisDirection.X, PRIMARY_BOX_COLOR),
      axis(this.size, AxisDirection.Y, PRIMARY_BOX_COLOR),
      axis(this.size, AxisDirection.Z, PRIMARY_BOX_COLOR),
    ];
    this.box = new THREE.Box3Helper(
      new THREE.Box3(
        new THREE.Vector3(-this.size / 2, -this.size / 2, -this.size / 2),
        new THREE.Vector3(this.size / 2, this.size / 2, this.size / 2),
      ),
      PRIMARY_BOX_COLOR,
    );
  }

  public getGridBox() {
    const group = new THREE.Group();
    group.add(this.grid, this.box, ...this.axis);
    return group;
  }
}
