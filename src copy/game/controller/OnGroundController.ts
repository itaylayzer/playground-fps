
import * as CANNON from 'cannon-es';
export class OnGroundController {
    private _onGround: boolean;
    constructor(body: CANNON.Body) {
        this._onGround = false;

        const contactNormal = new CANNON.Vec3();
        const upAxis = new CANNON.Vec3(0, 1, 0);

        // @ts-ignore
        body.addEventListener('collide', (event) => {
            const { contact } = event

            // contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
            // We do not yet know which one is which! Let's check.
            if (contact.bi.id === body.id) {
                // bi is the player body, flip the contact normal
                contact.ni.negate(contactNormal)
            } else {
                // bi is something else. Keep the normal as it is
                contactNormal.copy(contact.ni)
            }

            // If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
            if (contactNormal.dot(upAxis) > 0.5) {
                // Use a "good" threshold value between 0 and 1 here!
                this._onGround = true
            }
        })

    }
    public get onGround() {
        return this._onGround
    }

    public off() {
        this._onGround = false;
    }
}