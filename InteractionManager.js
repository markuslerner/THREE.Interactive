import * as THREE from "three";

class InteractiveObject {
  constructor(target, name) {
    this.target = target;
    this.name = name;
    this.intersected = false;
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

    domElement.addEventListener("mousemove", this.onDocumentMouseMove, false);
    domElement.addEventListener("click", this.onDocumentMouseClick, false);
    domElement.addEventListener("mousedown", this.onDocumentMouseDown, false);
    domElement.ownerDocument.addEventListener(
      "mouseup",
      this.onDocumentMouseUp,
      false
    );

    domElement.addEventListener("touchstart", this.onDocumentTouchStart, false);
    domElement.addEventListener("touchmove", this.onDocumentTouchMove, false);
    domElement.addEventListener("touchend", this.onDocumentTouchEnd, false);

    this.treatTouchEventsAsMouseEvents = true;
  }

  dispose = () => {
    domElement.removeEventListener("mousemove", this.onDocumentMouseMove);
    domElement.removeEventListener("click", this.onDocumentMouseClick);
    domElement.removeEventListener("mousedown", this.onDocumentMouseDown);
    domElement.ownerDocument.removeEventListener(
      "mouseup",
      this.onDocumentMouseUp
    );

    domElement.removeEventListener("touchstart", this.onDocumentTouchStart);
    domElement.removeEventListener("touchmove", this.onDocumentTouchMove);
    domElement.removeEventListener("touchend", this.onDocumentTouchEnd);
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
  };

  checkIntersection = (object) => {
    var intersects = this.raycaster.intersectObjects([object.target], true);

    // console.log(intersects.length);

    if (intersects.length > 0) {
      if (!object.intersected) {
        object.intersected = true;
        this.dispatch(object, "mouseover");
      }

      // if ( object.intersectedObject != intersects[ 0 ].object ) {
      //   if ( object.intersectedObject ) object.intersectedObject.material.emissive.setHex( object.intersectedObject.currentHex );
      //   object.intersectedObject = intersects[ 0 ].object;
      //   object.intersectedObject.currentHex = object.intersectedObject.material.emissive.getHex();
      //   object.intersectedObject.material.emissive.setHex( 0xff0000 );
      // }
    } else {
      if (object.intersected) {
        object.intersected = false;
        this.dispatch(object, "mouseout");
      }

      // if ( object.intersectedObject ) object.intersectedObject.material.emissive.setHex( object.intersectedObject.currentHex );
      // object.intersectedObject = null;
    }
  };

  onDocumentMouseMove = (event) => {
    // event.preventDefault();

    this.mapPositionToPoint(this.mouse, event.clientX, event.clientY);

    this.interactiveObjects.forEach((object) => {
      this.dispatch(object, "mousemove", event);
    });
  };

  onDocumentTouchMove = (event) => {
    // event.preventDefault();

    this.mapPositionToPoint(
      this.mouse,
      event.touches[0].clientX,
      event.touches[0].clientY
    );

    this.interactiveObjects.forEach((object) => {
      this.dispatch(
        object,
        this.treatTouchEventsAsMouseEvents ? "mousemove" : "touchmove",
        event
      );
    });
  };

  onDocumentMouseClick = (event) => {
    this.update();

    this.interactiveObjects.forEach((object) => {
      if (object.intersected) {
        this.dispatch(object, "click", event);
      }
    });
  };

  onDocumentMouseDown = (event) => {
    this.update();

    this.interactiveObjects.forEach((object) => {
      if (object.intersected) {
        this.dispatch(object, "mousedown", event);
      }
    });
  };

  onDocumentTouchStart = (event) => {
    this.mapPositionToPoint(
      this.mouse,
      event.touches[0].clientX,
      event.touches[0].clientY
    );

    this.update();

    this.interactiveObjects.forEach((object) => {
      if (object.intersected) {
        this.dispatch(
          object,
          this.treatTouchEventsAsMouseEvents ? "mousedown" : "touchstart",
          event
        );
      }
    });
  };

  onDocumentMouseUp = (event) => {
    this.interactiveObjects.forEach((object) => {
      this.dispatch(object, "mouseup", event);
    });
  };

  onDocumentTouchEnd = (event) => {
    this.mapPositionToPoint(
      this.mouse,
      event.touches[0].clientX,
      event.touches[0].clientY
    );

    this.update();

    this.interactiveObjects.forEach((object) => {
      this.dispatch(
        object,
        this.treatTouchEventsAsMouseEvents ? "mouseup" : "touchend",
        event
      );
    });
  };

  dispatch = (object, type, event = null) => {
    if (object.target) {
      object.target.dispatchEvent({
        type,
        name: object.name,
        mouse: this.mouse,
        originalEvent: event,
        intersected: object.intersected,
      });
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
