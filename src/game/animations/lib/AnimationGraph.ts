import { Global } from "../../store/Global";
import { A_Edge } from "./A_Edge";
import { A_Vertex } from "./A_Vertex";
import { A_V_Params } from "./A_Vertex_Params";
import { A_Conditions } from "./types";
import * as THREE from "three";
import { EventTarget } from "./EventTarget";
export class AnimationGraph<T extends A_Conditions> extends EventTarget<{
    "fire": number;
}> {
    public vertecies: A_Vertex[];
    public current: number;
    public mixer: THREE.AnimationMixer;

    constructor(
        skinnedMesh: THREE.SkinnedMesh,
        private useLerp: boolean = false
    ) {
        super();
        this.current = 0;
        this.vertecies = [];
        this.mixer = new THREE.AnimationMixer(skinnedMesh);
    }

    public start(curr: number = 0) {
        this.vertecies[(this.current = curr)].setWeight(1);
    }
    public update(values: Record<string, any> = {}, conditions: T = {} as T) {
        const currV = this.vertecies[this.current];
        for (const e of currV.edges.values()) {
            e.travarseable(conditions) && this.setCurrent(e.to);
        }

        for (const v of this.vertecies) {
            v.update(values, this.useLerp);
        }

        this.mixer.update(Global.deltaTime);
    }

    public addVertex(vertex: A_V_Params): number {
        return this.vertecies.push(vertex.build(this.mixer)) - 1;
    }

    public join(from: number, to: number, key: keyof T): boolean {
        const v = this.vertecies[from];
        if (v.edges.has(to)) return false;
        v.edges.set(to, new A_Edge(v, to, key as string));
        return true;
    }
    public setCurrent(curr: number) {
        this.vertecies[this.current].fadeOut();
        this.vertecies[(this.current = curr)].fadeIn();

        this.callEvents("fire", this.current);
    }
}
