# THREE.Interactive

[![NPM Package](https://img.shields.io/npm/v/three.interactive.svg?style=flat)](https://www.npmjs.com/package/three.interactive)

Fast and simple interaction manager for [THREE.js](https://github.com/mrdoob/three.js/) for enabling pointer, mouse and touch events on 3D objects.

_Note: When using ReactJS I can highly recommend [react-three-fiber](https://github.com/pmndrs/react-three-fiber), which has built-in interaction support. For pure THREE.js projects, this little library can be very useful though._

_ESM only. Currently no CJS version is built._

### How it works:

- Interactive Objects (THREE.Object3D) are added to the InteractionManager, which fires instances of InteractiveEvent.

- Differenciates between mouseover/mouseout (closest objects) and mouseenter/mouseleave (all objects) events.

- Intersections are sorted by distance to the camera and the events are dispatched in that order (closest first). If InteractiveEvent.stopPropagation() is called, the event won't fire again on other objects.

Alternative to [three.interaction](https://github.com/jasonChen1982/three.interaction.js).

Collaborations and improvements are welcome.

### Examples

- [Simple](https://dev.markuslerner.com/three.interactive/examples/simple.html): Basic example
- [Auto Add](https://dev.markuslerner.com/three.interactive/examples/auto-add.html): Auto-add example, still beta
- [Depth](https://dev.markuslerner.com/three.interactive/examples/depth.html): Overlapping objects example
- [glTF](https://dev.markuslerner.com/three.interactive/examples/gltf.html): Hover/click gltf objects example

### Usage

```console
yarn add three.interactive
```

or

```console
npm install three.interactive
```

1. Include script:

```js
import { InteractionManager } from 'three.interactive';
```

2. Create an InteractionManager instance

```js
const interactionManager = new InteractionManager(
  renderer,
  camera,
  renderer.domElement
);
```

3. Add object to InteractionManager

```js
interactionManager.add(cube);
```

4. Add event listener to object

```js
cube.addEventListener('click', (event) => {});
```

5. Call InteractionManager.update() on each render

```jsjs
interactionManager.update();
```

### Simple example

```js
import * as THREE from 'three';
import { InteractionManager } from 'three.interactive';

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

const cube = new THREE.Mesh(geometry, material);
cube.addEventListener('mouseover', (event) => {
  event.target.material.color.set(0xff0000);
  document.body.style.cursor = 'pointer';
});
cube.addEventListener('mouseout', (event) => {
  event.target.material.color.set(0xffffff);
  document.body.style.cursor = 'default';
});
cube.addEventListener('mousedown', (event) => {
  event.target.scale.set(1.1, 1.1, 1.1);
});
cube.addEventListener('click', (event) => {
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

### API

#### InteractionManager class

`new InteractionManager(renderer, camera, renderer.domElement [, { autoAdd: false, scene, bindEventsOnBodyElement: true } ])`

Constructor of InteractionManager instance; if the autoAdd option (still beta) is used, there is no need for adding objects to InteractionManager manually and calling interactionManager.update(); In this mode, the scene needs to be provided in the options.

**Members:**

| Member                          | Type    |  Default |  Description                                     |
| :------------------------------ | :------ | :------- | :----------------------------------------------- |
| `treatTouchEventsAsMouseEvents` | boolean | true     | Whether touch events should fire as mouse events |

**Methods:**

| Method                            | Description                                                                  |
| :-------------------------------- | :--------------------------------------------------------------------------- |
| `add(object, childNames = [])`    | Add object(s), optionally select only children of `object` by their names    |
| `remove(object, childNames = [])` | Remove object(s), optionally select only children of `object` by their names |
| `update()`                        | Update InteractionManager on each render                                     |
| `dispose()`                       | Dispose InteractionManager                                                   |

#### InteractionManagerOptions class

`new InteractionManagerOptions({ autoAdd: false, scene, bindEventsOnBodyElement: true })`

Constructor of InteractionManagerOptions instance

#### InteractiveEvent class

**Members:**

| Member                      | Type           |  Default |  Description                                                                                                                                                                                    |
| :-------------------------- | :------------- | :------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cancelBubble`              | boolean        | false    | Whether events should continue to bubble                                                                                                                                                        |
| `coords`                    | THREE.Vector2  |          | Mouse/touch coords                                                                                                                                                                              |
| `distance`                  | Number         |          | Distance of intersected point from camera                                                                                                                                                       |
| `intersected`               | boolean        |          | Whether object is still intersected                                                                                                                                                             |
| `wasIntersected`            | boolean        |          | Whether object was intersected during the last event or last render                                                                                                                             |
| `wasIntersectedOnMouseDown` | boolean        |          | Whether object was intersected during mousedown event                                                                                                                                           |
| `originalEvent`             | Event object   |          | Original event, if available (MouseEvent, TouchEvent or PointerEvent)                                                                                                                           |
| `target`                    | THREE.Object3D |          | Target object                                                                                                                                                                                   |
| `type`                      | string         |          | event type: 'click', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave', 'mousedown', 'mousemove', 'mouseup', 'touchstart', 'touchmove', 'touchend', 'pointerdown', 'pointerup', 'pointermove' |

**Methods:**

| Method            | Description                                                                                                         |
| :---------------- | :------------------------------------------------------------------------------------------------------------------ |
| `stopPropagation` | Stop bubbling of event (cancelBubble), e.g. when only the object closest to the camera is supposed to fire an event |

### Editing source

In order to edit the source code, run:

```console
yarn start
```

And open http://127.0.0.1:8000/ in your browers.

The files in the `build` folder will automatically be rebuilt when the files in the `src` folder are modified.

### License

MIT licensed

Created by [Markus Lerner](http://www.markuslerner.com) & contributors
