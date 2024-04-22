import * as THREE from "three";
import AxisDirection from "../model/axis-direction";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { Font } from "three/examples/jsm/Addons.js";
import fontJson from "three/examples/fonts/helvetiker_regular.typeface.json";

const DIRECTION_LABEL = {
  [AxisDirection.X]: "X",
  [AxisDirection.Y]: "Z",
  [AxisDirection.Z]: "Y",
};

export function axis(
  { min, max }: { min: number; max: number },
  direction: AxisDirection,
  color: number,
) {
  // Load the font
  // @ts-ignore
  const font = new Font(fontJson);

  const size = 0.5;

  const textGeometry = new TextGeometry(DIRECTION_LABEL[direction], {
    font,
    size,
    depth: 0.1,
    height: 0.1,
  });

  // Compute the bounding box so we can center the text
  textGeometry.computeBoundingBox();

  const textMesh = new THREE.Mesh(
    textGeometry,
    new THREE.MeshBasicMaterial({ color }),
  );

  // Points for the line
  const points = [];
  points.push(new THREE.Vector3(min, 0, 0));
  points.push(new THREE.Vector3(max, 0, 0));

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const lineMaterial = new THREE.LineBasicMaterial({ color });

  const line = new THREE.Line(lineGeometry, lineMaterial);

  const bboxMin = textGeometry.boundingBox?.min;
  const bboxMax = textGeometry.boundingBox?.max;

  switch (direction) {
    case AxisDirection.X:
      textMesh.position.x = max;
      if (bboxMin && bboxMax) {
        textMesh.position.z = -0.5 * (bboxMax.z - bboxMin.z);
      }
      break;
    // Flip Y and Z axes
    case AxisDirection.Z:
      line.rotation.y = -Math.PI / 2;
      textMesh.position.z = min;
      textMesh.rotateY(Math.PI / 2);
      if (bboxMin && bboxMax) {
        textMesh.position.x = -0.5 * (bboxMax.z - bboxMin.z);
      }
      break;
    case AxisDirection.Y:
      line.rotateZ(Math.PI / 2);
      textMesh.position.y = max;
      if (bboxMin && bboxMax) {
        textMesh.position.z = -0.5 * (bboxMax.z - bboxMin.z);
        textMesh.position.x = -0.5 * (bboxMax.x - bboxMin.x);
      }
      break;
  }

  const group = new THREE.Group();
  group.add(line);
  group.add(textMesh);

  return group;
}
