import * as THREE from "three";
import { Global } from "../store/Global";
import { inverseLerp as lerp } from "three/src/math/MathUtils.js";
export class AnimationClipController {
  private action: THREE.AnimationAction;
  private val: number;
  private lerpedVal: number;
  private savedVal: number;
  constructor(
    mixer: THREE.AnimationMixer,
    clip: THREE.AnimationClip,
    timeScale: number = 1,
    looped: boolean = true
  ) {
    this.action = mixer.clipAction(clip);
    this.action.weight = 0;
    this.action.setEffectiveTimeScale(timeScale); // = 0;

    this.val = 0;
    this.lerpedVal = 0;
    this.action.play();
    this.savedVal = 0;
    this.action.loop = looped ? THREE.LoopRepeat : THREE.LoopOnce;
  }

  public update(smoothness: number = 7) {
    this.lerpedVal = lerp(
      this.lerpedVal,
      this.val,
      Global.deltaTime * smoothness
    );

    this.action.setEffectiveWeight(this.lerpedVal);
  }
  public setEffectiveWeigth(weight: number) {
    this.val = this.lerpedVal = weight;
    this.action.setEffectiveWeight(weight);
  }
  public setWeight(weight: number) {
    this.val = weight;
  }
  public setTimeScale(scale: number) {
    this.action.setEffectiveTimeScale(scale);
  }
  get isFinished() {
    return this.action.time >= this.action.getClip().duration;
  }
  get isNextFrameFinished() {
    return (
      this.action.time + Global.deltaTime >= this.action.getClip().duration
    );
  }
  public setTime(time: number) {
    this.action.time = time;
  }
  public start() {
    this.action.stop();
    this.action.time = 0;
    this.action.play();
  }

  public getDuration() {
    return this.action.getClip().duration;
  }
  public getTime() {
    return this.action.time;
  }
  public getTimeScale() {
    return this.action.getEffectiveTimeScale();
  }
  public pause() {
    this.action.paused = true;
  }
  public stop() {
    this.action.stop();
  }
  public save() {
    this.savedVal = this.val;
  }
  public load() {
    this.lerpedVal = this.savedVal;
    this.val = this.savedVal;
    this.action.setEffectiveWeight(this.lerpedVal);
  }
}
