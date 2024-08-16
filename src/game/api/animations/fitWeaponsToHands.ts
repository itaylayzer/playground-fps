import * as THREE from "three";

function getChildrenAVGPos(obj: THREE.Object3D) {
    // return obj.getWorldPosition(new THREE.Vector3());
    const vec = new THREE.Vector3();
    for (const child of obj.children) {
        vec.add(child.getWorldPosition(new THREE.Vector3()));
    }
    return vec.divideScalar(obj.children.length);
}

export function fitWeaponToHands(
    weaponMesh: THREE.Group,
    leftHandBone: THREE.Bone,
    rightHandBone: THREE.Bone
) {
    const [leftPos, rightPos] = [
        getChildrenAVGPos(leftHandBone),
        getChildrenAVGPos(rightHandBone)
    ];

    const midpoint = new THREE.Vector3()
        .addVectors(leftPos, rightPos)
        .multiplyScalar(0.5);

    weaponMesh.position.copy(midpoint);

    const obj = new THREE.Object3D();
    obj.position.copy(rightPos);
    obj.lookAt(leftPos);

    const weaponQuaternion = obj.quaternion.clone();

    weaponMesh.quaternion.copy(weaponQuaternion);
    weaponMesh.position.add(weaponMesh.up.clone().multiplyScalar(-0.1));

    obj.clear();
    obj.removeFromParent();
}
