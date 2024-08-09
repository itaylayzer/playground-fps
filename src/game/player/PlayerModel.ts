import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { Global } from "../store/Global";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import { AnimationClipController } from "../controller/AnimationClipController";
export class PlayerModel {
    public update: () => void;

    private currentAnimation: null | {
        clip: AnimationClipController;
        afterTime: number;
        done: boolean;
    };
    constructor(body: CANNON.Body) {
        const mesh = clone(Global.assets.fbx.rigged);
        const skinnedMesh = mesh.children[1] as THREE.SkinnedMesh;

        console.log(mesh);
        const nose = skinnedMesh.skeleton.getBoneByName("Eyes")!;
        const spine = skinnedMesh.skeleton.getBoneByName("mixamorigSpine")!;

        mesh.scale.copy(new THREE.Vector3(0.004, 0.004, 0.004));
        const mixer = new THREE.AnimationMixer(skinnedMesh);

        const clipControllers = {
            idle: new AnimationClipController(
                mixer,
                Global.assets.fbx.idle.animations[0]
            ),
            walking: new AnimationClipController(
                mixer,
                Global.assets.fbx.walk.animations[0]
            ),
            fire: new AnimationClipController(
                mixer,
                Global.assets.fbx.fire.animations[0],
                1.5
            ),
            firewalk: new AnimationClipController(
                mixer,
                Global.assets.fbx.firewalk.animations[0],
                1.5
            ),
            throw: new AnimationClipController(
                mixer,
                Global.assets.fbx.throw.animations[0],
                1,
                false
            )
        };

        const rifle = Global.assets.fbx.rifle;
        Global.scene.add(rifle);

        console.log(rifle);
        rifle.scale.set(1, 1, 1);

        this.currentAnimation = null;

        const startAnimation = (
            animation: AnimationClipController,
            done: boolean,
            afterTime: undefined | number = undefined
        ) => {
            this.currentAnimation = {
                clip: animation,
                afterTime:
                    afterTime === undefined
                        ? animation.getDuration() - Global.deltaTime
                        : afterTime,
                done
            };
            for (const val of Object.values(clipControllers)) {
                val.save();
                val.setEffectiveWeigth(0);
            }
            animation.setEffectiveWeigth(1);
            animation.start();
        };

        this.update = () => {
            mesh.quaternion.copy(body.quaternion);

            mesh.getWorldDirection(mesh.position);
            mesh.position.multiplyScalar(-0.2).add(body.position);

            const isWalking =
                Global.keyboardController.isKeyPressed("KeyW") ||
                Global.keyboardController.isKeyPressed("KeyA") ||
                Global.keyboardController.isKeyPressed("KeyS") ||
                Global.keyboardController.isKeyPressed("KeyD");

            const isShooting = Global.mouseController.isMousePressed(0);
            const isStarterShooting = Global.mouseController.isMouseDown(0);

            const isShifting = Global.keyboardController.isKeyPressed(
                "ShiftLeft"
            );
            const isControling = Global.keyboardController.isKeyPressed(
                "ControlLeft"
            );

            const animate = () => {
                clipControllers.walking.setWeight(+(isWalking && !isShooting));
                clipControllers.idle.setWeight(+(!isWalking && !isShooting));

                clipControllers.walking.setTimeScale(
                    0.5 + 0.5 * +(!isShifting && !isControling)
                );
                clipControllers.idle.setTimeScale(
                    0.5 + 0.5 * +(!isShifting && !isControling)
                );

                if (isStarterShooting) {
                    clipControllers.walking.setEffectiveWeigth(0);
                    clipControllers.idle.setEffectiveWeigth(0);

                    clipControllers.fire.setEffectiveWeigth(+!isWalking);
                    clipControllers.firewalk.setEffectiveWeigth(+isWalking);
                }

                clipControllers.fire.setWeight(+(!isWalking && isShooting));
                clipControllers.firewalk.setWeight(+(isWalking && isShooting));

                for (const val of Object.values(clipControllers)) {
                    val.update();
                }
            };

            if (this.currentAnimation === null) {
                animate();
            } else {
                console.log("time", this.currentAnimation.clip.getTime());
            }
            if (
                this.currentAnimation !== null &&
                this.currentAnimation.clip.getTime() >=
                    this.currentAnimation.afterTime &&
                this.currentAnimation.done
            ) {
                this.currentAnimation = null;
                for (const val of Object.values(clipControllers)) {
                    val.load();
                }
                animate();
            }

            if (
                this.currentAnimation !== null &&
                this.currentAnimation.clip.getTime() >=
                    this.currentAnimation.afterTime &&
                !this.currentAnimation.done
            ) {
                this.currentAnimation.clip.setTime(
                    this.currentAnimation.afterTime
                );
            }

            if (Global.keyboardController.isKeyDown("KeyE")) {
                startAnimation(clipControllers.throw, false);
                clipControllers.throw.setTime(0);
            }

            if (Global.keyboardController.isKeyUp("KeyE")) {
                startAnimation(clipControllers.throw, true);
                clipControllers.throw.setTime(1.8);
            }

            mixer.update(Global.deltaTime);

            spine.rotation.x =
                -Global.cameraController.rotation.y * THREE.MathUtils.DEG2RAD;

            Global.camera.position
                .copy(nose.getWorldPosition(new THREE.Vector3()))
                .add(body.quaternion.vmult(new CANNON.Vec3(0, 0, 0)))
                .add(
                    new THREE.Vector3(0, 0, 0).applyQuaternion(
                        Global.camera.quaternion
                    )
                );
        };

        Global.scene.add(mesh);
    }
}
