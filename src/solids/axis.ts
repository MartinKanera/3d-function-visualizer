import * as THREE from "three";
import AxisDirection from "../model/axis-direction";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { Font } from "three/examples/jsm/Addons.js";
import fontJson from "three/examples/fonts/helvetiker_regular.typeface.json";

export function axis(length: number, direction: AxisDirection, color: number) {
  // Load the font
  // @ts-ignore
  const font = new Font(fontJson);

  const size = length / 2 / 10;

  const textGeometry = new TextGeometry(direction, {
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

  const offset = length / 2;

  // Points for the line
  const points = [];
  points.push(new THREE.Vector3(-offset, 0, 0));
  points.push(new THREE.Vector3(offset, 0, 0));

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const lineMaterial = new THREE.LineBasicMaterial({ color });

  const line = new THREE.Line(lineGeometry, lineMaterial);

  const min = textGeometry.boundingBox?.min;
  const max = textGeometry.boundingBox?.max;

  switch (direction) {
    case AxisDirection.X:
      textMesh.position.x = offset;
      if (min && max) {
        textMesh.position.z = -0.5 * (max.z - min.z);
      }
      break;
    // Flip Y and Z axes
    case AxisDirection.Z:
      line.rotation.y = Math.PI / 2;
      textMesh.position.y = offset;
      if (min && max) {
        textMesh.position.z = -0.5 * (max.z - min.z);
        textMesh.position.x = -0.5 * (max.x - min.x);
      }
      break;
    case AxisDirection.Y:
      line.rotateZ(Math.PI / 2);
      textMesh.position.z = -offset;
      textMesh.rotateY(Math.PI / 2);
      if (min && max) {
        textMesh.position.x = -0.5 * (max.z - min.z);
      }
      break;
  }

  const group = new THREE.Group();
  group.add(line);
  group.add(textMesh);

  return group;
}
