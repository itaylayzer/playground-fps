import * as CANNON from "cannon-es";
import { PhysicsObject } from "../physics/PhysicsMesh";
import { Global } from "../store/Global";
import * as THREE from "three";
import { LocalPlayer } from "../player/LocalPlayer";

import {
    Emitter,
    Rate,
    Span,
    Position,
    Radius,
    Life,
    PointZone,
    Vector3D,
    Alpha,
    Scale,
    Color,
    SpriteRenderer,
    RadialVelocity,
    ease,
    ColorSpan,
    BodySprite,
    Force,
    SphereZone,
    Texture,
    VectorVelocity
} from "three-nebula";

class ThrowBomb extends PhysicsObject {
    constructor(
        position: CANNON.Vec3,
        direction: CANNON.Vec3,
        private exploded = false
    ) {
        direction.scale(-30, direction);
        const shpere = Global.assets.fbx.bomb.clone();
        shpere.scale.multiplyScalar(0.0005);

        super(shpere, {
            position,
            velocity: direction,
            mass: 10000,
            collisionFilterMask: ~1,
            collisionFilterGroup: 3,
            shape: new CANNON.Sphere(0.25),
            linearDamping: 0.2,
            angularDamping: 0.999,
            angularVelocity: new CANNON.Vec3(
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2
            )
        });

        shpere.position.copy(position);
        Global.scene.add(shpere);
        Global.world.addBody(this);

        this.addEventListener("collide", () => {
            setTimeout(() => {
                if (!this.exploded) this.explode.bind(this)(shpere);
            }, 1000);
        });
    }
    public explode(shpere: THREE.Group) {
        this.exploded = true;
        Global.audioManager.playAt(
            "exp",
            this.position.distanceTo(LocalPlayer.getInstance().position)
        );
        Global.scene.remove(shpere);
        Global.world.removeBody(this);

        let playerDistance = 0;
        Global.world.bodies.forEach(body => {
            // add force here
            if (body.id == this.id) return;

            const explosionForce = 300000; // Adjust the force magnitude as needed
            const directionToBody = new CANNON.Vec3().copy(body.position);
            directionToBody.vsub(this.position.clone(), directionToBody);
            directionToBody.normalize();
            const distance = body.position.distanceTo(this.position);

            if (distance > 0) {
                const forceMagnitude = explosionForce / distance; // Decrease force with distance

                if (body.collisionFilterGroup === 1) {
                    playerDistance = distance;
                    return;
                }
                const force = directionToBody.scale(forceMagnitude);
                body.applyForce(force);
            }
        });

        if (playerDistance > 0) {
            Global.cameraController.shake(playerDistance);
        }

        const emitter = new Emitter();
        const renderer = new SpriteRenderer(Global.scene, THREE);

        // Set emitter rate (particles per second) as well as the particle initializers and behaviours
        emitter
            .setLife(1)
            .setRate(new Rate(new Span(150, 150), new Span(1)))
            .setPosition(shpere.position)
            .setInitializers([
                new Position(new PointZone(0, 0, 0)),
                new Radius(2.5, 4),
                new Life(
                    // @ts-ignore
                    new Span(1, 5)
                ),

                new RadialVelocity(
                    // @ts-ignore
                    new Span(5, 10),
                    new Vector3D(0, 1, 0),
                    90
                ),

                new Texture(THREE, Global.assets.textures.txt_circle, {
                    blending: "AdditiveBlending"
                })
            ])
            .setBehaviours([
                new Alpha(1, 0.1, undefined, ease.easeInExpo),
                new Scale(1, 0.1, undefined, ease.easeInExpo),
                // @ts-ignore
                new Color(
                    // @ts-ignore
                    new ColorSpan([
                        "#d61e1e",
                        "#db1f12",
                        "#e06a09",
                        "#d61e1e",
                        "#db1f12",
                        "#e06a09",
                        "#d61e1e",
                        "#db1f12",
                        "#e06a09",
                        "#ffffff",
                        "#ffffff"
                    ])
                ),
                new Force(0, 0.004, 0)
            ])
            .emit(1);

        // add the emitter and a renderer to your particle system
        Global.system.addEmitter(emitter).addRenderer(renderer);
    }
}

export class ThrowController {
    public throw: () => void;
    constructor(bone: THREE.Bone) {
        this.throw = () => {
            new ThrowBomb(
                new CANNON.Vec3().copy(
                    // @ts-ignore
                    bone.getWorldPosition(new THREE.Vector3())
                ),
                new CANNON.Quaternion()
                    .set(
                        Global.camera.quaternion.x,
                        Global.camera.quaternion.y,
                        Global.camera.quaternion.z,
                        Global.camera.quaternion.w
                    )
                    .vmult(new CANNON.Vec3(0, 0, 1), new CANNON.Vec3())
            );
        };
    }
}
