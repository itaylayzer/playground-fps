import * as THREE from "three";
import { MovementController } from "../controller/MovementController";
import { ShooterController } from "../controller/ShooterController";
import { Global } from "../store/Global";
import { Player } from "./Player";
import { PlayerModel } from "./PlayerModel";

export class LocalPlayer extends Player {
    constructor() {
        const group = new THREE.Group();
        super(group);

        const movementController = new MovementController(5, this);
        const shooterController = new ShooterController({
            collisionFilterGroup: 2,
            collisionFilterMask: ~1,
            shootForce: 50,
            deltaTime: 150
        });

        const model = new PlayerModel(this);

        // Global.assets.fbx.rigged.position = 10;

        const update = () => {
            Global.cameraController.updateMouseMovement(
                Global.mouseController.movement[0] * Global.deltaTime,
                Global.mouseController.movement[1] * Global.deltaTime
            );
            movementController.update(group);

            // .add(new THREE.Vector3(0, 1, 0));
            Global.cameraController.update();

            if (Global.mouseController.isMousePressed(0))
                shooterController.shoot();

            shooterController.update();

            model.update();
        };

        this.update.push(update);

        Global.world.addBody(this);
    }
}
