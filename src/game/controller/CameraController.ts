import * as THREE from "three";

export class CameraController {
    public camera: THREE.PerspectiveCamera;
    public rotation: THREE.Vector2;
    public mouseMovement: THREE.Vector2;
    public static sensitivity: number = 50;

    constructor(camera: THREE.PerspectiveCamera) {
        this.camera = camera;
        camera.rotation.y = Math.PI;
        this.mouseMovement = new THREE.Vector2();
        this.rotation = new THREE.Vector2();
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
    }

    public updateMouseMovement(movementX: number, movementY: number) {
        this.mouseMovement = new THREE.Vector2(
            movementX,
            movementY
        ).multiplyScalar(-2 * CameraController.sensitivity / 10);
    }
}
