# THREE.Interactive

[![NPM Package](https://img.shields.io/npm/v/three.interactive.svg?style=flat)](https://www.npmjs.com/package/three.interactive)

Fast and simple interaction manager for [THREE.js](https://github.com/mrdoob/three.js/) for enabling mouse and touch events on 3D objects


### Examples ####

* [Demo](https://www.markuslerner.com/github/three.interactive/examples/index.html): Showcase of most of the features

### Usage ####

* Include script
* Create an InteractionManager instance
* Call InteractionManager.update() on each render
* Add objects to InteractionManager

```
import { InteractionManager } from "three.interaction";

const container = document.createElement("div");
container.setAttribute("id", "container");
document.body.appendChild(container);

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0.0, 0.0, 10.0);

const interactionManager = new InteractionManager(
  renderer,
  camera,
  renderer.domElement
);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial();

const cube = new Mesh(geometry, material);
cube.addEventListener("mouseover", (event) => {
  console.log(event);
  document.body.style.cursor = "pointer";
});
cube.addEventListener("mouseout", (event) => {
  console.log(event);
  document.body.style.cursor = "default";
});
scene.add(cube);
interactionManager.add(cube);

animate = (time) => {
  requestAnimationFrame(animate);

  interactionManager.update();

  renderer.render(scene, camera);
};
```


#### Including the script ####

Include script after THREE is included:

```js
<script src="src/BlurredLine.js"></script>
```

or include directly from unpkg.com:

```js
<script src="https://unpkg.com/three.blurredline@1.0.0/src/BlurredLine.js"></script>
```

or use npm to install it:

```
npm i three.interactive
```

and include it in your code:
```js
import * as THREE from 'three';
import { InteractionManager } from 'three.interactive';
```



#### License ####

MIT licensed

Copyright (C) 2020 Markus Lerner, http://www.markuslerner.com
