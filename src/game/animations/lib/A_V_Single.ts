import { AnimationAction, AnimationClip, AnimationMixer } from "three";
import { A_Vertex } from "./A_Vertex";

export class A_V_Single extends A_Vertex {
    private action: AnimationAction;
    constructor(
        mixer: AnimationMixer,
        clip: AnimationClip,
        startOverOnFadeIn: boolean = true
    ) {
        super();
        this.action = mixer.clipAction(clip);
        this.action.play();
        this.onFadeIn = () => {
            startOverOnFadeIn && (this.action.time = 0);
        };
    }
    protected anim_setEffectiveWeight(weight: number): void {
        this.action.setEffectiveWeight(weight);
    }

    public getDuration(): number {
        return this.action.getClip().duration;
    }
    public getTime(): number {
        return this.action.time;
    }
}
