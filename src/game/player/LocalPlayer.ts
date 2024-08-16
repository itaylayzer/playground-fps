import * as THREE from "three";
import { MovementController } from "../controller/MovementController";
import { ShooterController } from "../controller/ShooterController";
import { Global } from "../store/Global";
import { Player } from "./Player";
import { PlayerModel } from "./PlayerModel";
import { ThrowController } from "../controller/ThrowController";

export class LocalPlayer extends Player {
    private static instance: LocalPlayer;
    static getInstance() {
        return this.instance;
    }
    constructor() {
        const group = new THREE.Group();
        super(group);
        LocalPlayer.instance = this;

        const movementController = new MovementController(5, this);
        const shooterController = new ShooterController({
            collisionFilterGroup: 2,
            collisionFilterMask: ~1,
            shootForce: 250,
            deltaTime: 125
        });

        const model = new PlayerModel(this);

        const throwController = new ThrowController(
            model.getBone("mixamorigRightHand")!
        );

        const update = () => {
            let isShooting = false;
            Global.lockController.isLocked &&
                Global.cameraController.updateMouseMovement(
                    Global.mouseController.movement[0] * Global.deltaTime,
                    Global.mouseController.movement[1] * Global.deltaTime
                );
             movementController.update(group);

            Global.cameraController.update();

            if (
                Global.lockController.isLocked &&
                Global.mouseController.isMousePressed(0)
            )
                isShooting = shooterController.shoot();
            if (
                Global.lockController.isLocked &&
                Global.keyboardController.isKeyUp("KeyE")
            ) {
                throwController.throw();
                Global.audioManager.play("throw");
            }

            Global.lockController.isLocked && shooterController.update();

            model.update(
                movementController.jumped,
                movementController.onGroundController.onGround,
                isShooting
            );
        };

        this.update.push(update);

        Global.world.addBody(this);
    }
}
