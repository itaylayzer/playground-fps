import * as CANNON from "cannon-es";
import { Global } from "../store/Global";
import * as THREE from "three";
import { lerp } from "three/src/math/MathUtils.js";
import { OnGroundController } from "./OnGroundController";

const HORIZONTAL = 0;
const VERTICAL = 1;
const RAW_AXIS = 0;
const LERPED_AXIS = 1;

export class MovementController {
    private keysAxis: [[number, number], [number, number]];
    public onGroundController: OnGroundController;
    public jumped: boolean = false;

    constructor(private speed: number = 1, private body: CANNON.Body) {
        this.onGroundController = new OnGroundController(this.body);

        this.keysAxis = [[0, 0], [0, 0]];
    }

    update(group: THREE.Group) {
        this.jumped = false;
        const onGround = this.onGroundController.onGround;
        // const airControl = 0.01;

        if (
            (Global.keyboardController.isKeyPressed("Space") ||
                Global.keyboardController.isKeyDown("Space")) &&
            onGround
        ) {
            onGround && ((this.body.velocity.y = 11), (this.jumped = true));
            this.onGroundController.off();
        }

        this.keysAxis[RAW_AXIS][VERTICAL] =
            +Global.keyboardController.isKeyPressed("KeyW") +
            -Global.keyboardController.isKeyPressed("KeyS");
        this.keysAxis[RAW_AXIS][HORIZONTAL] =
            -Global.keyboardController.isKeyPressed("KeyD") +
            +Global.keyboardController.isKeyPressed("KeyA");

        const isShifting = Global.keyboardController.isKeyPressed("ShiftLeft");
        const isControling = Global.keyboardController.isKeyPressed(
            "ControlLeft"
        );

        for (let index = 0; index < 2; index++) {
            this.keysAxis[LERPED_AXIS][index] = lerp(
                this.keysAxis[LERPED_AXIS][index],
                this.keysAxis[RAW_AXIS][index],
                Global.deltaTime * 8
            );
        }

        const yRotation =
            Global.cameraController.rotation.x * THREE.MathUtils.DEG2RAD;

        group.rotation.set(0, 0, 0);
        group.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), yRotation);

        const forwardVector = new CANNON.Vec3(
            Math.sin(yRotation),
            0,
            Math.cos(yRotation)
        );
        const rightVector = new CANNON.Quaternion()
            .setFromEuler(0, Math.PI / 2, 0)
            .vmult(
                new CANNON.Vec3(Math.sin(yRotation), 0, Math.cos(yRotation))
            );

        forwardVector.scale(
            this.keysAxis[LERPED_AXIS][VERTICAL],
            forwardVector
        );
        rightVector.scale(this.keysAxis[LERPED_AXIS][HORIZONTAL], rightVector);

        //@ts-ignore
        this.body.quaternion.copy(group.quaternion);
        const direction = forwardVector.vadd(
            new CANNON.Vec3().copy(rightVector)
        );

        if (!direction.isZero() && direction.length() > 1) {
            direction.normalize();
        }

        direction.scale(
            this.speed * (0.5 + 0.5 * +(!isShifting && !isControling)),
            direction
        );
        // const airDirection = new CANNON.Vec3(direction.x, 0, direction.z).scale(airControl);

        // if (onGround) {
        this.body.velocity.set(direction.x, this.body.velocity.y, direction.z);
        // }
        // else {
        //     this.body.velocity.vadd(airDirection, this.body.velocity);
        // }
    }
}
