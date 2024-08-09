import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { Global } from "../store/Global";
import * as THREE from "three";
import * as CANNON from "cannon-es";
export class PlayerModel {
    public update: () => void;
    constructor(body: CANNON.Body) {
        const mesh = clone(Global.assets.fbx.rigged);
        const skinnedMesh = mesh.children[0] as THREE.SkinnedMesh;
        const nose = skinnedMesh.skeleton.getBoneByName("Nose")!;
        mesh.scale.copy(new THREE.Vector3(0.004, 0.004, 0.004));

        this.update = () => {
            mesh.quaternion.copy(body.quaternion);

            mesh.getWorldDirection(mesh.position);
            mesh.position.multiplyScalar(-0.2).add(body.position);

            Global.camera.position.copy(
                nose.getWorldPosition(new THREE.Vector3())
            );
        };

        Global.scene.add(mesh);
    }
}
