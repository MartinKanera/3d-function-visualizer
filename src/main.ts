import * as THREE from "three";
import "./style.css";
import { generateGrid } from "./solids/grid";
import GridBox, { type GridBoxOptions } from "./solids/grid-box";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { functionVisualizer } from "./solids/function";

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
  minX: -5,
  maxX: 5,
  minY: -5,
  maxY: 15,
  minZ: -5,
  maxZ: 5,
};

const segments = 20;
const gridBox = new GridBox(defaultGridBoxSize, segments);

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
controls.maxDistance = 100;

controls.maxPolarAngle = Math.PI / 2;

const { vertices, indices, maxMeasuredY } = generateGrid(
  defaultGridBoxSize,
  segments,
  (x: number, y: number) => x ** 2 + y ** 2 - 10,
);

const visualizer = functionVisualizer(
  vertices,
  indices,
  maxMeasuredY,
  defaultGridBoxSize.minY,
  defaultGridBoxSize.maxY,
);

scene.add(await visualizer);

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
