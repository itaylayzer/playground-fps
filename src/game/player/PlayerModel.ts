import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { Global } from "../store/Global";
import * as THREE from "three";
import * as CANNON from "cannon-es";

import { AnimationGraph } from "../animations/lib/AnimationGraph";
import { A_P_Blender, A_P_Single } from "../animations/lib/A_Vertex_Params";
import { A_Conditions } from "../animations/lib/types";
export class PlayerModel {
    public update: (onJump: boolean, grounded: boolean) => void;

    constructor(body: CANNON.Body) {
        const mesh = clone(Global.assets.fbx.rigged);
        const skinnedMesh = mesh.children[1] as THREE.SkinnedMesh;

        const nose = skinnedMesh.skeleton.getBoneByName("Eyes")!;
        const spine = skinnedMesh.skeleton.getBoneByName("mixamorigSpine")!;

        mesh.scale.copy(new THREE.Vector3(0.004, 0.004, 0.004));
        const agraph = new AnimationGraph(skinnedMesh);

        agraph.addVertex(
            new A_P_Blender(
                [
                    Global.assets.fbx.idle.animations[0],
                    Global.assets.fbx.walk.animations[0]
                ],
                "movement"
            )
        );

        agraph.addVertex(new A_P_Single(Global.assets.fbx.jloop.animations[0]));
        agraph.addVertex(
            new A_P_Single(Global.assets.fbx.fire.animations[0], false)
        );
        agraph.addVertex(
            new A_P_Single(Global.assets.fbx.firewalk.animations[0], false)
        );

        agraph.join(0, 1, "mj1");
        agraph.join(1, 0, "mj2");
        agraph.join(2, 0, "wait1");
        agraph.join(3, 0, "wait1");
        agraph.start(0);

        const rifle = Global.assets.fbx.rifle;
        Global.scene.add(rifle);

        rifle.scale.set(1, 1, 1);

        this.update = (onJump: boolean, grounded: boolean) => {
            mesh.quaternion.copy(body.quaternion);

            mesh.getWorldDirection(mesh.position);
            mesh.position.multiplyScalar(-0.2).add(body.position);

            const conditions: A_Conditions = {
                mj1: onJump,
                mj2: grounded,
                wait1: clip => {
                    return (
                        clip.getTime() >= Global.deltaTime * 5 &&
                        !Global.mouseController.isMousePressed(0)
                    );
                }
            };

            const isWalking =
                Global.keyboardController.isKeyPressed("KeyW") ||
                Global.keyboardController.isKeyPressed("KeyA") ||
                Global.keyboardController.isKeyPressed("KeyS") ||
                Global.keyboardController.isKeyPressed("KeyD");

            if (Global.mouseController.isMousePressed(0)) {
                agraph.setCurrent(2 + +isWalking);
            }

            agraph.update({ movement: +isWalking }, conditions);

            {
                // const rot =
                //     -Global.cameraController.rotation.y *
                //     THREE.MathUtils.DEG2RAD;
                spine.lookAt(
                    new THREE.Vector3(0, 0, -5)
                        .applyQuaternion(Global.camera.quaternion)
                        .add(Global.camera.position)
                );
                // mesh.rotation.y -= 0.7;
                // spine.rotateOnWorldAxis(
                //     new THREE.Vector3(0, 1, 0).applyQuaternion(
                //         Global.camera.quaternion
                //     ),
                //     -0.8
                // );
                // spine.rotation.y = spine.rotation.z = -rot ;
            }

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
