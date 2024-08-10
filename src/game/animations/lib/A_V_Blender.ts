import { AnimationClip, AnimationMixer } from "three";
import { A_Vertex } from "./A_Vertex";
import { lerp } from "three/src/math/MathUtils.js";
import { Global } from "../../store/Global";

export class A_V_Blender extends A_Vertex {
    private masterWeight: number;
    constructor(
        mixer: AnimationMixer,
        
        clips: AnimationClip[],
        key: string
    ) {
        super();
        this.masterWeight = 0;

        const actions = clips.map(clip => mixer.clipAction(clip));
        const weights = actions.map(_ => 0);
        for (const [actionIndex, action] of actions.entries()) {
            action.play();
            action.setEffectiveWeight(+(actionIndex == 0));
        }

        this.innerUpdate = values => {
            const index = values[key] as number;

            for (const [actionIndex, action] of actions.entries()) {
                weights[actionIndex] = lerp(
                    weights[actionIndex],
                    +(actionIndex == index),
                    Global.deltaTime * 7
                );
                action.setEffectiveWeight(
                    weights[actionIndex] * this.masterWeight
                );
            }
        };
    }

    protected anim_setEffectiveWeight(weight: number): void {
        this.masterWeight = weight;
    }
}
