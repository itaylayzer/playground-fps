import { Bone, Group } from "three";

export function searchBones(originalBone: Bone) {
    let parents = [originalBone];
    let bones = [originalBone];

    while (parents.length) {
        const bone = parents.shift()!;
        if (bone === undefined || bone.children === undefined) continue;
        for (const c of bone.children) {
            if (c instanceof Bone) {
                parents.push(c);
                bones.push(c);
            }
        }
    }

    return bones;
}

export function getHigherBodyBones(sk: Group) {
    console.log(sk);
    return searchBones(sk.children[0].children[1] as Bone).map(v => v.name);
}
