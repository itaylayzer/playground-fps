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

    return [
        searchBones(sk.children[0].children[0] as Bone),
        sk.children[0] as Bone
    ]
        .flat()
        .map(v => v.name);
}
