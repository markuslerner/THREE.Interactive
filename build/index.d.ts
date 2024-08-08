import { Vector2 } from 'three';
export declare class InteractiveObject {
    target: THREE.Object3D;
    name: string;
    intersected: boolean;
    wasIntersected: boolean;
    wasIntersectedOnMouseDown: boolean;
    distance: number;
    constructor(target: THREE.Object3D, name: string);
}
export declare class InteractiveEvent {
    type: string;
    cancelBubble: boolean;
    originalEvent: Event | null;
    coords: Vector2;
    distance: number;
    intersected: boolean;
    wasIntersected: boolean;
    wasIntersectedOnMouseDown: boolean;
    constructor(type: string, originalEvent?: Event | null);
    stopPropagation(): void;
}
export declare class InteractionManagerOptions {
    bindEventsOnBodyElement: boolean;
    autoAdd: boolean;
    scene: THREE.Scene | null;
    constructor(options: {
        bindEventsOnBodyElement?: boolean | undefined;
        autoAdd?: boolean | undefined;
        scene?: THREE.Scene | undefined;
    });
}
export declare class InteractionManager {
    renderer: THREE.Renderer;
    camera: THREE.Camera;
    domElement: HTMLElement;
    bindEventsOnBodyElement: boolean;
    autoAdd: boolean;
    scene: THREE.Scene | null;
    mouse: Vector2;
    supportsPointerEvents: boolean;
    interactiveObjects: InteractiveObject[];
    closestObject: InteractiveObject | null;
    raycaster: THREE.Raycaster;
    treatTouchEventsAsMouseEvents: boolean;
    constructor(renderer: THREE.Renderer, camera: THREE.Camera, domElement: HTMLElement, options?: InteractionManagerOptions);
    dispose: () => void;
    add: (object: THREE.Object3D, childNames?: string[]) => void;
    remove: (object: THREE.Object3D, childNames?: string[]) => void;
    update: () => void;
    checkIntersection: (object: InteractiveObject) => void;
    onDocumentMouseMove: (mouseEvent: MouseEvent) => void;
    onDocumentPointerMove: (pointerEvent: PointerEvent) => void;
    onTouchMove: (touchEvent: TouchEvent) => void;
    onMouseClick: (mouseEvent: MouseEvent) => void;
    onMouseDown: (mouseEvent: MouseEvent) => void;
    onPointerDown: (pointerEvent: PointerEvent) => void;
    onTouchStart: (touchEvent: TouchEvent) => void;
    onMouseUp: (mouseEvent: MouseEvent) => void;
    onPointerUp: (pointerEvent: PointerEvent) => void;
    onTouchEnd: (touchEvent: TouchEvent) => void;
    dispatch: (object: InteractiveObject, event: InteractiveEvent) => void;
    mapPositionToPoint: (point: Vector2, x: number, y: number) => void;
}
