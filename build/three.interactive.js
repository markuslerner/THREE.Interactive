(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('three')) :
  typeof define === 'function' && define.amd ? define(['exports', 'three'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.THREE = global.THREE || {}, global.THREE));
}(this, (function (exports, three) { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var InteractiveObject = function InteractiveObject(target, name) {
    _classCallCheck(this, InteractiveObject);

    this.target = target;
    this.name = name;
    this.intersected = false;
    this.distance = 0;
  };
  var InteractiveEvent = /*#__PURE__*/function () {
    function InteractiveEvent(type) {
      var originalEvent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      _classCallCheck(this, InteractiveEvent);

      this.cancelBubble = false;
      this.type = type;
      this.originalEvent = originalEvent;
    }

    _createClass(InteractiveEvent, [{
      key: "stopPropagation",
      value: function stopPropagation() {
        this.cancelBubble = true;
      }
    }]);

    return InteractiveEvent;
  }();
  var InteractionManager = function InteractionManager(renderer, camera, domElement) {
    var _this = this;

    _classCallCheck(this, InteractionManager);

    this.dispose = function () {
      _this.domElement.removeEventListener('click', _this.onMouseClick);

      if (_this.supportsPointerEvents) {
        _this.domElement.ownerDocument.removeEventListener('pointermove', _this.onDocumentMouseMove);

        _this.domElement.removeEventListener('pointerdown', _this.onMouseDown);

        _this.domElement.removeEventListener('pointerup', _this.onMouseUp);
      } else {
        _this.domElement.ownerDocument.removeEventListener('mousemove', _this.onDocumentMouseMove);

        _this.domElement.removeEventListener('mousedown', _this.onMouseDown);

        _this.domElement.removeEventListener('mouseup', _this.onMouseUp);

        _this.domElement.removeEventListener('touchstart', _this.onTouchStart);

        _this.domElement.removeEventListener('touchmove', _this.onTouchMove);

        _this.domElement.removeEventListener('touchend', _this.onTouchEnd);
      }
    };

    this.add = function (object) {
      var childNames = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      if (object) {
        if (childNames.length > 0) {
          childNames.forEach(function (name) {
            var o = object.getObjectByName(name);

            if (o) {
              var interactiveObject = new InteractiveObject(o, name);

              _this.interactiveObjects.push(interactiveObject);
            }
          });
        } else {
          var interactiveObject = new InteractiveObject(object, object.name);

          _this.interactiveObjects.push(interactiveObject);
        }
      }
    };

    this.remove = function (object) {
      var childNames = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      if (object) {
        if (childNames.length > 0) {
          var interactiveObjectsNew = [];

          _this.interactiveObjects.forEach(function (o) {
            if (!childNames.includes(o.name)) {
              interactiveObjectsNew.push(o);
            }
          });

          _this.interactiveObjects = interactiveObjectsNew;
        } else {
          var _interactiveObjectsNew = [];

          _this.interactiveObjects.forEach(function (o) {
            if (o.name !== object.name) {
              _interactiveObjectsNew.push(o);
            }
          });

          _this.interactiveObjects = _interactiveObjectsNew;
        }
      }
    };

    this.update = function () {
      _this.raycaster.setFromCamera(_this.mouse, _this.camera); // console.log( scene.children );


      _this.interactiveObjects.forEach(function (object) {
        if (object.target) _this.checkIntersection(object);
      });

      _this.interactiveObjects.sort(function (a, b) {
        return a.distance - b.distance;
      });

      var eventOut = new InteractiveEvent('mouseout');

      _this.interactiveObjects.forEach(function (object) {
        if (!object.intersected && object.wasIntersected) {
          _this.dispatch(object, eventOut);
        }
      });

      var eventOver = new InteractiveEvent('mouseover');

      _this.interactiveObjects.forEach(function (object) {
        if (object.intersected && !object.wasIntersected) {
          _this.dispatch(object, eventOver);
        }
      });
    };

    this.checkIntersection = function (object) {
      var intersects = _this.raycaster.intersectObjects([object.target], true);

      object.wasIntersected = object.intersected;

      if (intersects.length > 0) {
        var distance = intersects[0].distance;
        intersects.forEach(function (i) {
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

    this.onDocumentMouseMove = function (mouseEvent) {
      // event.preventDefault();
      _this.mapPositionToPoint(_this.mouse, mouseEvent.clientX, mouseEvent.clientY);

      var event = new InteractiveEvent('mousemove', mouseEvent);

      _this.interactiveObjects.forEach(function (object) {
        _this.dispatch(object, event);
      });
    };

    this.onTouchMove = function (touchEvent) {
      // event.preventDefault();
      _this.mapPositionToPoint(_this.mouse, touchEvent.touches[0].clientX, touchEvent.touches[0].clientY);

      var event = new InteractiveEvent(_this.treatTouchEventsAsMouseEvents ? 'mousemove' : 'touchmove', touchEvent);

      _this.interactiveObjects.forEach(function (object) {
        _this.dispatch(object, event);
      });
    };

    this.onMouseClick = function (mouseEvent) {
      _this.update();

      var event = new InteractiveEvent('click', mouseEvent);

      _this.interactiveObjects.forEach(function (object) {
        if (object.intersected) {
          _this.dispatch(object, event);
        }
      });
    };

    this.onMouseDown = function (mouseEvent) {
      _this.mapPositionToPoint(_this.mouse, mouseEvent.clientX, mouseEvent.clientY);

      _this.update();

      var event = new InteractiveEvent('mousedown', mouseEvent);

      _this.interactiveObjects.forEach(function (object) {
        if (object.intersected) {
          _this.dispatch(object, event);
        }
      });
    };

    this.onTouchStart = function (touchEvent) {
      _this.mapPositionToPoint(_this.mouse, touchEvent.touches[0].clientX, touchEvent.touches[0].clientY);

      _this.update();

      var event = new InteractiveEvent(_this.treatTouchEventsAsMouseEvents ? 'mousedown' : 'touchstart', touchEvent);

      _this.interactiveObjects.forEach(function (object) {
        if (object.intersected) {
          _this.dispatch(object, event);
        }
      });
    };

    this.onMouseUp = function (mouseEvent) {
      var event = new InteractiveEvent('mouseup', mouseEvent);

      _this.interactiveObjects.forEach(function (object) {
        _this.dispatch(object, event);
      });
    };

    this.onTouchEnd = function (touchEvent) {
      _this.mapPositionToPoint(_this.mouse, touchEvent.touches[0].clientX, touchEvent.touches[0].clientY);

      _this.update();

      var event = new InteractiveEvent(_this.treatTouchEventsAsMouseEvents ? 'mouseup' : 'touchend', touchEvent);

      _this.interactiveObjects.forEach(function (object) {
        _this.dispatch(object, event);
      });
    };

    this.dispatch = function (object, event) {
      if (object.target && !event.cancelBubble) {
        event.coords = _this.mouse;
        event.distance = object.distance;
        event.intersected = object.intersected;
        object.target.dispatchEvent(event);
      }
    };

    this.mapPositionToPoint = function (point, x, y) {
      var rect; // IE 11 fix

      if (!_this.renderer.domElement.parentElement) {
        rect = {
          x: 0,
          y: 0,
          left: 0,
          top: 0,
          width: 0,
          height: 0
        };
      } else {
        rect = _this.renderer.domElement.getBoundingClientRect();
      }

      point.x = (x - rect.left) / rect.width * 2 - 1;
      point.y = -((y - rect.top) / rect.height) * 2 + 1;
    };

    this.renderer = renderer;
    this.camera = camera;
    this.domElement = domElement;
    this.mouse = new three.Vector2(-1, 1); // top left default position

    this.supportsPointerEvents = !!window.PointerEvent;
    this.interactiveObjects = [];
    this.raycaster = new three.Raycaster();
    domElement.addEventListener('click', this.onMouseClick);

    if (this.supportsPointerEvents) {
      domElement.ownerDocument.addEventListener('pointermove', this.onDocumentMouseMove);
      domElement.addEventListener('pointerdown', this.onMouseDown);
      domElement.addEventListener('pointerup', this.onMouseUp);
    } else {
      domElement.ownerDocument.addEventListener('mousemove', this.onDocumentMouseMove);
      domElement.addEventListener('mousedown', this.onMouseDown);
      domElement.addEventListener('mouseup', this.onMouseUp);
      domElement.addEventListener('touchstart', this.onTouchStart, {
        passive: true
      });
      domElement.addEventListener('touchmove', this.onTouchMove, {
        passive: true
      });
      domElement.addEventListener('touchend', this.onTouchEnd, {
        passive: true
      });
    }

    this.treatTouchEventsAsMouseEvents = true;
  };

  exports.InteractionManager = InteractionManager;
  exports.InteractiveEvent = InteractiveEvent;
  exports.InteractiveObject = InteractiveObject;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=three.interactive.js.map
