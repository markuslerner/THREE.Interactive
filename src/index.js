import * as THREE from 'three';

export class InteractiveObject {
  constructor(target, name) {
    this.target = target;
    this.name = name;
    this.intersected = false;
    this.distance = 0;
  }
}

export class InteractiveEvent {
  constructor(type, originalEvent = null) {
    this.cancelBubble = false;
    this.type = type;
    this.originalEvent = originalEvent;
  }
  stopPropagation() {
    this.cancelBubble = true;
  }
}

export default class InteractionManager {
  constructor(renderer, camera, domElement) {
    this.renderer = renderer;
    this.camera = camera;
    this.domElement = domElement;

    this.mouse = new THREE.Vector2();

    this.interactiveObjects = [];

    this.raycaster = new THREE.Raycaster();

    domElement.addEventListener('mousemove', this.onDocumentMouseMove, false);
    domElement.addEventListener('click', this.onDocumentMouseClick, false);
    domElement.addEventListener('mousedown', this.onDocumentMouseDown, false);
    domElement.ownerDocument.addEventListener(
      'mouseup',
      this.onDocumentMouseUp,
      false
    );

    domElement.addEventListener('touchstart', this.onDocumentTouchStart, false);
    domElement.addEventListener('touchmove', this.onDocumentTouchMove, false);
    domElement.addEventListener('touchend', this.onDocumentTouchEnd, false);

    this.treatTouchEventsAsMouseEvents = true;
  }

  dispose = () => {
    domElement.removeEventListener('mousemove', this.onDocumentMouseMove);
    domElement.removeEventListener('click', this.onDocumentMouseClick);
    domElement.removeEventListener('mousedown', this.onDocumentMouseDown);
    domElement.ownerDocument.removeEventListener(
      'mouseup',
      this.onDocumentMouseUp
    );

    domElement.removeEventListener('touchstart', this.onDocumentTouchStart);
    domElement.removeEventListener('touchmove', this.onDocumentTouchMove);
    domElement.removeEventListener('touchend', this.onDocumentTouchEnd);
  };

  add = (model, names = []) => {
    if (names.length > 0) {
      names.forEach((name) => {
        const modelObject = model.getObjectByName(name);
        if (modelObject) {
          const interactiveObject = new InteractiveObject(modelObject, name);
          this.interactiveObjects.push(interactiveObject);
        }
      });
    } else {
      if (model) {
        const interactiveObject = new InteractiveObject(model, model.name);
        this.interactiveObjects.push(interactiveObject);
      }
    }
  };

  remove = (model, names = []) => {
    if (names.length > 0) {
      const interactiveObjectsNew = [];
      this.interactiveObjects.forEach((object) => {
        if (!names.includes(object.name)) {
          interactiveObjectsNew.push(object);
        }
      });
      this.interactiveObjects = interactiveObjectsNew;
    } else {
      if (model) {
        const interactiveObjectsNew = [];
        this.interactiveObjects.forEach((object) => {
          if (object.name !== model.name) {
            interactiveObjectsNew.push(object);
          }
        });
        this.interactiveObjects = interactiveObjectsNew;
      }
    }
  };

  update = () => {
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // console.log( scene.children );

    this.interactiveObjects.forEach((object) => {
      if (object.target) this.checkIntersection(object);
    });

    this.interactiveObjects.sort(function (a, b) {
      return a.distance - b.distance;
    });

    const eventOut = new InteractiveEvent('mouseout');
    this.interactiveObjects.forEach((object) => {
      if (!object.intersected && object.wasIntersected) {
        this.dispatch(object, eventOut);
      }
    });
    const eventOver = new InteractiveEvent('mouseover');
    this.interactiveObjects.forEach((object) => {
      if (object.intersected && !object.wasIntersected) {
        this.dispatch(object, eventOver);
      }
    });
  };

  checkIntersection = (object) => {
    var intersects = this.raycaster.intersectObjects([object.target], true);

    object.wasIntersected = object.intersected;

    if (intersects.length > 0) {
      let distance = intersects[0].distance;
      intersects.forEach((i) => {
        if (i.distance < distance) {
          distance = i.distance;
        }
      });
      object.intersected = true;
      object.distance = distance;
    } else {
      object.intersected = false;
    }
  };

  onDocumentMouseMove = (mouseEvent) => {
    // event.preventDefault();

    this.mapPositionToPoint(this.mouse, mouseEvent.clientX, mouseEvent.clientY);

    const event = new InteractiveEvent('mousemove', mouseEvent);

    this.interactiveObjects.forEach((object) => {
      this.dispatch(object, event);
    });
  };

  onDocumentTouchMove = (touchEvent) => {
    // event.preventDefault();

    this.mapPositionToPoint(
      this.mouse,
      touchEvent.touches[0].clientX,
      touchEvent.touches[0].clientY
    );

    const event = new InteractiveEvent(
      this.treatTouchEventsAsMouseEvents ? 'mousemove' : 'touchmove',
      touchEvent
    );

    this.interactiveObjects.forEach((object) => {
      this.dispatch(object, event);
    });
  };

  onDocumentMouseClick = (mouseEvent) => {
    this.update();

    const event = new InteractiveEvent('click', mouseEvent);

    this.interactiveObjects.forEach((object) => {
      if (object.intersected) {
        this.dispatch(object, event);
      }
    });
  };

  onDocumentMouseDown = (mouseEvent) => {
    this.update();

    const event = new InteractiveEvent('mousedown', mouseEvent);

    this.interactiveObjects.forEach((object) => {
      if (object.intersected) {
        this.dispatch(object, event);
      }
    });
  };

  onDocumentTouchStart = (touchEvent) => {
    this.mapPositionToPoint(
      this.mouse,
      touchEvent.touches[0].clientX,
      touchEvent.touches[0].clientY
    );

    this.update();

    const event = new InteractiveEvent(
      this.treatTouchEventsAsMouseEvents ? 'mousedown' : 'touchstart',
      touchEvent
    );

    this.interactiveObjects.forEach((object) => {
      if (object.intersected) {
        this.dispatch(object, event);
      }
    });
  };

  onDocumentMouseUp = (mouseEvent) => {
    const event = new InteractiveEvent('mouseup', mouseEvent);

    this.interactiveObjects.forEach((object) => {
      this.dispatch(object, event);
    });
  };

  onDocumentTouchEnd = (touchEvent) => {
    this.mapPositionToPoint(
      this.mouse,
      touchEvent.touches[0].clientX,
      touchEvent.touches[0].clientY
    );

    this.update();

    const event = new InteractiveEvent(
      this.treatTouchEventsAsMouseEvents ? 'mouseup' : 'touchend',
      touchEvent
    );

    this.interactiveObjects.forEach((object) => {
      this.dispatch(object, event);
    });
  };

  dispatch = (object, event) => {
    if (object.target && !event.cancelBubble) {
      event.coords = this.mouse;
      event.distance = object.distance;
      event.intersected = object.intersected;
      object.target.dispatchEvent(event);
    }
  };

  mapPositionToPoint = (point, x, y) => {
    let rect;

    // IE 11 fix
    if (!this.renderer.domElement.parentElement) {
      rect = {
        x: 0,
        y: 0,
        left: 0,
        top: 0,
        width: 0,
        height: 0,
      };
    } else {
      rect = this.renderer.domElement.getBoundingClientRect();
    }

    point.x = ((x - rect.left) / rect.width) * 2 - 1;
    point.y = -((y - rect.top) / rect.height) * 2 + 1;
  };
}
