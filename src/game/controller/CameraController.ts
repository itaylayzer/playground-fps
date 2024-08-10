import * as THREE from "three";
import { Global } from "../store/Global";
import { degToRad, lerp } from "three/src/math/MathUtils.js";

function explodeFn(t: number) {
    return t < Math.PI * 4
        ? 100 * Math.sin(t + Math.PI) / Math.pow(t + Math.PI, 3)
        : 0;
}
function randomSign() {
    if (Math.random() > 0.66) return -1;
    if (Math.random() < 0.33) return 1;
    return 0;
}
export class CameraController {
    public camera: THREE.PerspectiveCamera;
    public rotation: THREE.Vector2;
    public mouseMovement: THREE.Vector2;
    public static sensitivity: number = 50;
    public side = 0;

    private time: number;
    private forceRotation: THREE.Vector3;
    constructor(camera: THREE.PerspectiveCamera) {
        this.camera = camera;
        camera.rotation.y = Math.PI;
        this.mouseMovement = new THREE.Vector2();
        this.rotation = new THREE.Vector2();
        this.time = Math.PI * 4;
        this.forceRotation = new THREE.Vector3();
    }

    public update() {
        this.rotation.add(this.mouseMovement.multiplyScalar(1));
        this.rotation.y = Math.max(Math.min(this.rotation.y, 70), -70);
        this.mouseMovement.x = 0;
        this.mouseMovement.y = 0;

        this.camera.quaternion.setFromEuler(
            new THREE.Euler(this.rotation.y * THREE.MathUtils.DEG2RAD, 0, 0)
        );
        const cameraUp = new THREE.Vector3(0, 1, 0);
        this.camera.rotateOnWorldAxis(
            cameraUp,
            this.rotation.x * THREE.MathUtils.DEG2RAD + Math.PI
        );

        this.mouseMovement.set(0, 0);

        this.time += Global.deltaTime * 13;
        this.camera.rotation.z += this.forceRotation.z * explodeFn(this.time);
        this.camera.rotation.x += this.forceRotation.x * explodeFn(this.time);
        this.camera.rotation.y += this.forceRotation.y * explodeFn(this.time);
        this.camera.rotation.z += this.side = lerp(
            this.side,
            (-Global.keyboardController.isKeyPressed("KeyE") +
                +Global.keyboardController.isKeyPressed("KeyQ")) *
                degToRad(15),
            Global.deltaTime * 7
        );
    }

    public updateMouseMovement(movementX: number, movementY: number) {
        this.mouseMovement = new THREE.Vector2(
            movementX,
            movementY
        ).multiplyScalar(-2 * CameraController.sensitivity / 10);
    }
    shake(distance: number) {
        this.time = 0; //0.93656;
        this.forceRotation.z = randomSign() / (distance * distance);
        this.forceRotation.x = randomSign() / distance;
        this.forceRotation.y = randomSign() / distance;
    }
}
