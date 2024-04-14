import * as THREE from "three";
import "./style.css";
import GridBox from "./solids/grid-box";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { functionVisualizer } from "./solids/function";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

camera.position.x = 10;
camera.position.y = 10;
camera.position.z = -8;
camera.lookAt(0, 0, 0);

const topLight = new THREE.DirectionalLight(0xffffff, 1);
const bottomLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(10, 10, 10);
bottomLight.position.set(-10, -10, -10);
scene.add(topLight, bottomLight);

const gridBox = new GridBox(10, 20);
scene.add(gridBox.getGridBox());

// Initialize renderer, set size, and append to DOM
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

controls.screenSpacePanning = false;
controls.enablePan = false;
// controls.autoRotate = true;
controls.minDistance = 10;
controls.maxDistance = 100;

controls.maxPolarAngle = Math.PI / 2;

const fn = (x: number, y: number) => Math.sin(x) * Math.cos(y);

const visualizer = functionVisualizer(-5, 5, 0.1, fn);

scene.add(visualizer);

renderer.getContext().getExtension("OES_standard_derivatives");
renderer.capabilities.precision = "highp"; // or 'mediump' / 'lowp'

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  // controls.update();
  renderer.render(scene, camera);
}

animate();
