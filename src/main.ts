import * as THREE from "three";
import "./style.css";
import { generateGrid } from "./solids/grid";
import GridBox from "./solids/grid-box";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { functionVisualizer } from "./solids/function";
import {
  type FunctionValues,
  DEFAULT_VALUES,
  init as initForm,
  enableForm,
  disableForm,
} from "./utils/form";
import { evaluate } from "mathjs";

const ANIMATION_DURATION = 3000;

let oldFunctionVertices: number[] = [];
let visualizedFunction: THREE.Object3D;
let controls: OrbitControls;
let gridBox: GridBox;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;

function init() {
  // Initialize scene
  scene = new THREE.Scene();

  // Initialize renderer, set size, and append to DOM
  renderer = new THREE.WebGLRenderer();
  renderer.localClippingEnabled = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Initialize camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );

  camera.position.x = 3;
  camera.position.y = 2.75;
  camera.position.z = 2.75;
  camera.lookAt(0, 0, 0);

  // Initialize controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.screenSpacePanning = false;
  controls.enablePan = false;
  controls.minDistance = 2;
  controls.maxDistance = 300;
  controls.maxPolarAngle = Math.PI / 2;

  const { vertices, indices, minMeasuredY, maxMeasuredY } = generateGrid(
    DEFAULT_VALUES,
    DEFAULT_VALUES.segmentsX,
    DEFAULT_VALUES.segmentsZ,
    (x: number, y: number) => evaluate(DEFAULT_VALUES.fn, { x, y }),
  );

  oldFunctionVertices = vertices;

  visualizedFunction = functionVisualizer(
    vertices,
    indices,
    minMeasuredY,
    maxMeasuredY,
    DEFAULT_VALUES.minY,
    DEFAULT_VALUES.maxY,
  );

  scene.add(visualizedFunction);

  gridBox = new GridBox(
    DEFAULT_VALUES,
    DEFAULT_VALUES.segmentsX,
    DEFAULT_VALUES.segmentsZ,
  );

  scene.add(gridBox.getGridBox());

  // Initialize animation loop
  animate();

  // Initialize form
  initForm((...args) => {
    const [visualizedFunction, gridBox] = newSceneState(...args);

    clearScene();
    scene.add(gridBox);
    scene.add(visualizedFunction);
  }, startAnimationVisualization);
}

function clearScene() {
  const n = scene.children.length - 1;
  for (let i = n; i > -1; i--) {
    scene.remove(scene.children[i]);
  }
}

function startAnimationVisualization({
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
  // Animation has started, disable the form
  disableForm();

  const { vertices, indices, minMeasuredY, maxMeasuredY } = generateGrid(
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

  clearScene();
  scene.add(gridBox.getGridBox());
  const start = performance.now();

  animationTick(
    start,
    vertices,
    indices,
    minMeasuredY,
    maxMeasuredY,
    minY,
    maxY,
  );
}

function animationTick(
  start: number,
  newVertices: number[],
  newIndices: number[],
  newMinMeasuredY: number,
  newMaxMeasuredY: number,
  minY: number,
  maxY: number,
) {
  // interpolate between old and new vertices Y coordinate
  const now = performance.now();
  let lastTick = false;
  let vertices: number[] = [];

  if (now >= start + ANIMATION_DURATION) {
    // Stop the animation and set the new vertices
    oldFunctionVertices = newVertices;
    // Animation has ended, enable the form
    lastTick = true;
    vertices = newVertices;
    enableForm();
  }

  const progress = (now - start) / ANIMATION_DURATION;
  const progressEased = Math.sin((progress * Math.PI) / 2);

  let minMeasuredY = lastTick ? newMinMeasuredY : maxY;
  let maxMeasuredY = lastTick ? newMaxMeasuredY : minY;

  for (let i = 0; i < oldFunctionVertices.length && !lastTick; i += 3) {
    let oldY = oldFunctionVertices[i + 1];
    let newY = newVertices[i + 1];

    let y = oldY + (newY - oldY) * progressEased;
    if (isNaN(y)) y = 0.01;

    if (y < minMeasuredY && isFinite(y)) {
      minMeasuredY = Math.max(y, minY);
    } else if (y > maxMeasuredY && isFinite(y)) {
      maxMeasuredY = Math.min(y, maxY);
    }

    vertices.push(oldFunctionVertices[i], y, oldFunctionVertices[i + 2]);
  }

  const newVisualizedFunction = functionVisualizer(
    vertices,
    newIndices,
    minMeasuredY,
    maxMeasuredY,
    minY,
    maxY,
  );

  scene.remove(visualizedFunction);
  scene.add(newVisualizedFunction);

  visualizedFunction = newVisualizedFunction;

  if (lastTick) return;

  requestAnimationFrame(() =>
    animationTick(
      start,
      newVertices,
      newIndices,
      newMinMeasuredY,
      newMaxMeasuredY,
      minY,
      maxY,
    ),
  );
}

function newSceneState({
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
  const { vertices, indices, minMeasuredY, maxMeasuredY } = generateGrid(
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

  oldFunctionVertices = vertices;

  const newVisualizedFunction = functionVisualizer(
    vertices,
    indices,
    minMeasuredY,
    maxMeasuredY,
    minY,
    maxY,
  );

  gridBox.setDimensions({
    minX,
    maxX,
    minY,
    maxY,
    minZ,
    maxZ,
  });

  gridBox.setSegments({ segmentsX, segmentsZ });

  return [newVisualizedFunction, gridBox.getGridBox()];
}

// Initialize the scene and render
init();

// Event listener for window resizing
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
