import * as CANNON from "cannon-es";
import { PhysicsObject } from "../physics/PhysicsMesh";
import { Global } from "../store/Global";
import * as THREE from "three";

class ThrowBomb extends PhysicsObject {
    constructor(position: CANNON.Vec3, direction: CANNON.Vec3) {
        direction.scale(-30, direction);
        const shpere = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 6, 6),
            new THREE.MeshPhongMaterial({ color: "brown" })
        );
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
                this.explode.bind(this)(shpere);
            }, 1000);
        });
    }
    public explode(shpere: THREE.Mesh) {
        Global.scene.remove(shpere);
        Global.world.removeBody(this);

        Global.world.bodies.forEach(body => {
            // add force here
            if (body.id == this.id || body.collisionFilterGroup === 1) return;
            const explosionForce = 300000; // Adjust the force magnitude as needed
            const directionToBody = new CANNON.Vec3().copy(body.position);
            directionToBody.vsub(this.position, directionToBody);
            directionToBody.normalize();
            const distance = body.position.distanceTo(this.position);

            if (distance > 0) {
                const forceMagnitude = explosionForce / distance; // Decrease force with distance
                const force = directionToBody.scale(forceMagnitude);
                body.applyForce(force);
            }
        });
    }
}

export class ThrowController {
    public throw: () => void;
    constructor(body: CANNON.Body) {
        this.throw = () => {
            new ThrowBomb(
                body.position,
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
