import * as THREE from "three";
import "./style.css";
import { generateGrid } from "./solids/grid";
import GridBox, { type GridBoxOptions } from "./solids/grid-box";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { functionVisualizer } from "./solids/function";
import { init as initForm, type FunctionValues } from "./utils/form";
import { evaluate } from "mathjs";

function updateScene({
  fn,
  minX,
  maxX,
  minY,
  maxY,
  minZ,
  maxZ,
  segmentsX,
  segmentsZ,
}: FunctionValues) {
  const { vertices, indices, maxMeasuredY } = generateGrid(
    {
      minX,
      maxX,
      minY,
      maxY,
      minZ,
      maxZ,
    },
    segmentsX,
    segmentsZ,
    (x, y) => evaluate(fn, { x, y }),
  );

  scene.remove(visualizer);
  visualizer = functionVisualizer(vertices, indices, maxMeasuredY, minY, maxY);
  scene.add(visualizer);

  scene.remove(gridBox.getGridBox());

  gridBox.setDimensions({
    minX,
    maxX,
    minY,
    maxY,
    minZ,
    maxZ,
  });

  gridBox.setSegments({ segmentsX, segmentsZ });

  scene.add(gridBox.getGridBox());
}

initForm(updateScene);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

camera.position.x = 15;
camera.position.y = 15;
camera.position.z = -15;
camera.lookAt(0, 0, 0);

const defaultGridBoxSize: GridBoxOptions = {
  minX: -25,
  maxX: 25,
  minY: -25,
  maxY: 25,
  minZ: -25,
  maxZ: 25,
};

const segments = 100;
const gridBox = new GridBox(defaultGridBoxSize, segments, segments);

scene.add(gridBox.getGridBox());

// Initialize renderer, set size, and append to DOM
const renderer = new THREE.WebGLRenderer();
renderer.localClippingEnabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

controls.screenSpacePanning = false;
controls.enablePan = false;
// controls.autoRotate = true;
controls.minDistance = 10;
controls.maxDistance = 300;

controls.maxPolarAngle = Math.PI / 2;

const { vertices, indices, maxMeasuredY } = generateGrid(
  defaultGridBoxSize,
  segments,
  segments,
  (x: number, y: number) => x ** 2 + y ** 2 - 10,
);

let visualizer = functionVisualizer(
  vertices,
  indices,
  maxMeasuredY,
  defaultGridBoxSize.minY,
  defaultGridBoxSize.maxY,
);

scene.add(visualizer);

// Event listener for window resizing
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  // controls.update();
  renderer.render(scene, camera);
}

animate();
