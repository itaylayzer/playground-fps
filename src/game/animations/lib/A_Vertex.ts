import { inverseLerp as lerp } from "three/src/math/MathUtils.js";
import { A_Edge } from "./A_Edge";
import { Global } from "../../store/Global";
import { AnimationAction } from "three";

export abstract class A_Vertex {
  public edges: Map<number, A_Edge>;
  private lerpedWeight: number;
  protected innerUpdate:
    | ((obj: Record<string, any>) => void)
    | undefined = undefined;

  protected onFadeIn: (() => void) | undefined = undefined;
  protected onFadeOut: (() => void) | undefined = undefined;
  constructor(protected weight: number = 0) {
    this.lerpedWeight = weight;
    this.edges = new Map();
  }
  public fadeOut() {
    this.onFadeOut && this.onFadeOut();

    this.weight = 0;
  }
  public fadeIn() {
    this.onFadeIn && this.onFadeIn();
    this.weight = 1;
  }
  public setWeight(w: number) {
    this.weight = this.lerpedWeight = w;
  }
  public update(values: Record<string, any>, useLerp: boolean) {
    this.anim_setEffectiveWeight(
      (this.lerpedWeight = useLerp
        ? lerp(this.lerpedWeight, this.weight, Global.deltaTime * 7)
        : this.weight)
    );
    this.innerUpdate && this.innerUpdate(values);
  }

  public getDuration(): number {
    throw new Error("Method not implemented.");
  }
  public getTime(): number {
    throw new Error("Method not implemented.");
  }

  protected abstract anim_setEffectiveWeight(weight: number): void;
  public abstract getAction(): AnimationAction;
}
