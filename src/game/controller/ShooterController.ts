import { Vector3 } from "three";
import * as CANNON from "cannon-es";
import { Global } from "../store/Global";

export class ShooterController {
    private raycastResult: CANNON.RaycastResult;
    private shootForce: number;
    private collisionFilterGroup: number;
    private collisionFilterMask: number;
    private deltaTime: number;
    private time: number;
    private ammo: number;
    constructor(
        {
            collisionFilterGroup,
            collisionFilterMask,
            shootForce,
            deltaTime
        }: {
            shootForce: number;
            collisionFilterMask: number;
            collisionFilterGroup: number;
            deltaTime: number;
        },
        private max: number = 30
    ) {
        this.ammo = this.max;
        this.collisionFilterGroup = collisionFilterGroup;
        this.collisionFilterMask = collisionFilterMask;
        this.deltaTime = deltaTime;
        this.time = deltaTime;
        this.raycastResult = new CANNON.RaycastResult();
        this.shootForce = shootForce;
    }

    public reload() {
        this.ammo = this.max;
    }

    public shoot() {
        if (this.time < this.deltaTime || this.ammo <= 0) return false;

        this.ammo--;
        Global.audioManager.play("shoot");
        this.time = 0;

        // Get the camera direction in world space
        const cameraDirection = new Vector3();
        Global.camera.getWorldDirection(cameraDirection);

        // Convert THREE.js vectors to Cannon.js Vec3
        const from = new CANNON.Vec3(
            Global.camera.position.x,
            Global.camera.position.y,
            Global.camera.position.z
        );

        const to = new CANNON.Vec3(
            Global.camera.position.x + cameraDirection.x * 1000, // Large distance to ensure ray hits something
            Global.camera.position.y + cameraDirection.y * 1000,
            Global.camera.position.z + cameraDirection.z * 1000
        );

        // Perform raycast
        Global.world.raycastClosest(
            from,
            to,
            {
                collisionFilterMask: this.collisionFilterMask,
                collisionFilterGroup: this.collisionFilterGroup
            },
            this.raycastResult
        );

        // Check if the ray hit something
        if (this.raycastResult.hasHit) {
            const hitBody = this.raycastResult.body;

            // Ensure the hit body has mass (i.e., is not static)
            if (!!hitBody && hitBody.mass > 0) {
                // Calculate the direction of the impulse
                const impulseDirection = new CANNON.Vec3(
                    cameraDirection.x * this.shootForce,
                    cameraDirection.y * this.shootForce,
                    cameraDirection.z * this.shootForce
                );

                // Apply the impulse to the hit body at the hit point
                hitBody.applyImpulse(
                    impulseDirection,
                    this.raycastResult.hitPointWorld
                );
            }
        }
        return true;
    }
    public update() {
        this.time += Global.deltaTime * 1000;
        const ammoGun = document.getElementById("ammo-gun")!;
        const ammoClip = document.getElementById("ammo-clip")!;

        ammoGun.innerHTML = this.ammo.toString();
        ammoClip.innerHTML = `| ${this.max}`;
    }
}
