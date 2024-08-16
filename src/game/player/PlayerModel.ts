import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { Global } from "../store/Global";
import * as THREE from "three";
import * as CANNON from "cannon-es";

import { AnimationGraph } from "../animations/lib/AnimationGraph";
import { A_P_Blender, A_P_Single } from "../animations/lib/A_Vertex_Params";
import { A_Conditions } from "../animations/lib/types";
import { getHigherBodyBones } from "../api/animations/seperateBones";
import { removesBonesFromClip } from "../api/animations/removeBonesFromClip";
import { degToRad, lerp } from "three/src/math/MathUtils.js";
import clamp from "../api/clamp";
import { fitWeaponToHands } from "../api/animations/fitWeaponsToHands";

export class PlayerModel {
    public update: (
        onJump: boolean,
        grounded: boolean,
        onShooting: boolean
    ) => void;
    public getBone: (name: string) => THREE.Bone | undefined;
    constructor(body: CANNON.Body) {
        const mesh = clone(Global.assets.fbx.rigged);
        const skinnedMesh = mesh.children[1] as THREE.SkinnedMesh;

        const nose = skinnedMesh.skeleton.getBoneByName("Eyes")!;

        const hips = skinnedMesh.skeleton.getBoneByName("mixamorigHips")!;
        const spine = skinnedMesh.skeleton.getBoneByName("mixamorigSpine")!;

        mesh.scale.copy(new THREE.Vector3(0.004, 0.004, 0.004));

        const higherBones = getHigherBodyBones(mesh.children[0] as THREE.Group);
        console.log("higherBones", higherBones);
        const lgraph = new AnimationGraph(skinnedMesh);

        lgraph.addVertex(
            new A_P_Blender(
                [
                    Global.assets.fbx.idle.animations[0],
                    Global.assets.fbx.walk.animations[0]
                ],
                "movement"
            )
        );

        this.getBone = name => skinnedMesh.skeleton.getBoneByName(name);

        lgraph.addVertex(new A_P_Single(Global.assets.fbx.jup.animations[0]));
        lgraph.addVertex(new A_P_Single(Global.assets.fbx.jloop.animations[0]));
        lgraph.addVertex(
            new A_P_Single(Global.assets.fbx.jdown.animations[0], true, 0.8)
        );

        lgraph.join(0, 1, "mj1");
        lgraph.join(1, 2, "end");
        lgraph.join(2, 3, "mj2");
        lgraph.join(3, 0, "end");

        lgraph.start(0);

        const hgraph = new AnimationGraph(skinnedMesh);

        const throwClip = removesBonesFromClip(
            Global.assets.fbx.throw.animations[0],
            higherBones
        );

        hgraph.addVertex(
            new A_P_Single(
                removesBonesFromClip(
                    Global.assets.fbx.idle.animations[0],
                    higherBones
                )
            )
        ); // 0

        hgraph.addVertex(new A_P_Single(throwClip, true, 1.8, 2.3)); // 1

        hgraph.addVertex(
            new A_P_Single(
                removesBonesFromClip(
                    Global.assets.fbx.fire.animations[0],
                    higherBones
                )
            )
        ); // 2

        hgraph.join(0, 1, "d");
        hgraph.join(1, 0, "e");
        hgraph.join(1, 1, "d");
        hgraph.join(0, 2, "s");
        hgraph.join(1, 2, "s");
        hgraph.join(2, 2, "s");
        hgraph.join(2, 0, "e");
        hgraph.join(2, 1, "d");

        hgraph.start();

        const rifle = Global.assets.fbx.rifle.clone();
        {
            const rmesh = rifle.children[0] as THREE.Mesh;
            rmesh.material = new THREE.MeshPhongMaterial({ color: "#111" });
        }

        rifle.scale.set(1, 1, 1).multiplyScalar(0.8);
        rifle.position.set(0, 1, 0);

        let lerypedY = 0;

        hgraph.addEventListener("fire", index => {
            const throwed = index === 1;
            rifle.visible = !throwed;
        });

        this.update = (
            onJump: boolean,
            grounded: boolean,
            onShooting: boolean
        ) => {
            mesh.quaternion.copy(body.quaternion);

            lerypedY = lerp(lerypedY, body.velocity.y, Global.deltaTime * 5);
            mesh.getWorldDirection(mesh.position);
            mesh.position.multiplyScalar(-0.2).add(body.position);

            const lowerConditions: A_Conditions = {
                mj1: onJump,
                mj2: grounded,
                wait1: clip => {
                    return (
                        clip.getTime() >= Global.deltaTime * 5 &&
                        !Global.mouseController.isMousePressed(0)
                    );
                },
                end: clip =>
                    clip.getTime() >= clip.getDuration() - Global.deltaTime * 5
            };

            const higherConditions: A_Conditions = {
                d: _ => {
                    const b =
                        Global.keyboardController.isKeyUp("KeyE") &&
                        Global.lockController.isLocked;

                    return b;
                },
                e: clip => {
                    return (
                        clip.getTime() + Global.deltaTime >= clip.getDuration()
                    );
                },
                s: onShooting && Global.lockController.isLocked
            };

            const isWalking =
                Global.keyboardController.isKeyPressed("KeyW") ||
                Global.keyboardController.isKeyPressed("KeyA") ||
                Global.keyboardController.isKeyPressed("KeyS") ||
                Global.keyboardController.isKeyPressed("KeyD");

            lgraph.update(
                { movement: +isWalking * +Global.lockController.isLocked },
                lowerConditions
            );
            hgraph.update({}, higherConditions);

            const fixX = degToRad(-Global.cameraController.rotation.y);
            spine.rotation.x = fixX;
            spine.rotation.y -= 1.2;
            hips.rotation.set(0, 0, 0);
            Global.camera.position
                .copy(nose.getWorldPosition(new THREE.Vector3()))
                .add(body.quaternion.vmult(new CANNON.Vec3(0, 0, 0)))
                .add(
                    new THREE.Vector3(
                        0,
                        clamp(-lerypedY / 200, -0.1, 0.1),
                        0
                    ).applyQuaternion(Global.camera.quaternion)
                );

            fitWeaponToHands(
                rifle,
                skinnedMesh.skeleton.getBoneByName("mixamorigLeftHand")!,
                skinnedMesh.skeleton.getBoneByName("mixamorigRightHand")!
            );
        };

        Global.scene.add(mesh);
        Global.scene.add(rifle);
    }
}
