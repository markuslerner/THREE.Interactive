# THREE.Interactive

[![NPM Package](https://img.shields.io/npm/v/three.interactive.svg?style=flat)](https://www.npmjs.com/package/three.interactive)

Fast and simple interaction manager for [THREE.js](https://github.com/mrdoob/three.js/) for enabling mouse and touch events on 3D objects.

Alternative to [three.interaction](https://github.com/jasonChen1982/three.interaction.js). I figured out that in some cases, the performance is better when using three.interactive instead of three.interaction.

Collaborations and improvements are welcome.


### Examples ####

* [Demo](https://www.markuslerner.com/github/three.interactive/examples/index.html): Showcase of most of the features


### Usage ####

1. Include script:

```
import { InteractionManager } from "three.interactive";
```

2. Create an InteractionManager instance

```
const interactionManager = new InteractionManager(
  renderer,
  camera,
  renderer.domElement
);
```

3. Add objects to InteractionManager

```
interactionManager.add(cube);
```

4. Call InteractionManager.update() on each render

```
interactionManager.update();
```


### Simple example ####

```
import * as THREE from "three";
import { InteractionManager } from "three.interactive";

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

const cube = new THREE.Mesh(geometry, material);
cube.addEventListener("mouseover", (event) => {
  event.target.material.color.set(0xff0000);
  document.body.style.cursor = "pointer";
});
cube.addEventListener("mouseout", (event) => {
  event.target.material.color.set(0xffffff);
  document.body.style.cursor = "default";
});
cube.addEventListener("mousedown", (event) => {
  event.target.scale.set(1.1, 1.1, 1.1);
});
cube.addEventListener("click", (event) => {
  event.target.scale.set(1.0, 1.0, 1.0);
});
scene.add(cube);
interactionManager.add(cube);

const animate = (time) => {
  requestAnimationFrame(animate);

  interactionManager.update();

  renderer.render(scene, camera);
};

animate();
```

### API ###

#### InteractionManager class ####


```new InteractionManager(renderer, camera, renderer.domElement)``` – constructor InteractionManager instance

**Methods:**

```interactionManager.add(object, childNames = [])``` – add object(s), optionally select only child objects by names

```interactionManager.remove(object, childNames = [])``` – remove object(s)

```interactionManager.update()``` – update InteractionManager on each render

```interactionManager.dispose()``` – dispose InteractionManager


#### InteractiveEvent class ####

**Members:**

```cancelBubble``` (boolean) – wether events should continue to bubble

```coords``` (THREE.Vector2) – Mouse/touch coords

```distance``` (number) – Distance of intersected point from camera

```intersected``` (boolean) – Whether object is still intersected

```originalEvent``` (Event object) – Original event, if available (mouse, touch)

```target``` (THREE.Object3D) – Target object

```type``` (string) – event type


**Methods:**

```stopPropagation``` – stop bubbling of event


#### License ####

MIT licensed

Copyright (C) 2020 Markus Lerner, http://www.markuslerner.com
