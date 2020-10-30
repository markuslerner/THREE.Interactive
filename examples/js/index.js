import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';

import { InteractionManager } from 'three.interaction';

const container = document.createElement('div');
container.setAttribute('id', 'container');
document.body.appendChild(container);

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0.0, 0.0, 10.0);

const interactionManager = new InteractionManager(
  renderer,
  camera,
  renderer.domElement
);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial();

const cube = new Mesh(geometry, material);
cube.addEventListener('mouseover', (event) => {
  console.log(event);
  document.body.style.cursor = 'pointer';
});
cube.addEventListener('mouseout', (event) => {
  console.log(event);
  document.body.style.cursor = 'default';
});
scene.add(cube);
interactionManager.add(cube);

const animate = (time) => {
  requestAnimationFrame(animate);

  interactionManager.update();

  renderer.render(scene, camera);

  stats.update();
};

animate();

window.addEventListener('resize', handleWindowResize, false);

function handleWindowResize() {
  camera.left = window.innerWidth / -2;
  camera.right = window.innerWidth / 2;
  camera.top = window.innerHeight / 2;
  camera.bottom = window.innerHeight / -2;

  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}
