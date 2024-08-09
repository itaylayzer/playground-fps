import { loadedAssets } from "../viewmodels/useAssetLoader";
import setupWorld from "./api/setup/world";
import { Global } from "./store/Global";
import { LocalPlayer } from "./player/LocalPlayer";
import { PhysicsObject } from "./physics/PhysicsMesh";
import { Clock } from "three";

export default (assets: loadedAssets) => {
    Global.assets = assets;

    setupWorld();

    new LocalPlayer();

    const clock = new Clock();

    setInterval(() => {
        Global.deltaTime = clock.getDelta();
        Global.updates
            .concat(PhysicsObject.childrens.flatMap(v => v.update))
            .map(fn => fn());

        Global.renderer.render(Global.scene, Global.camera);
        Global.world.step(2.6 * Global.deltaTime);

        // Global.cannonDebugger.update();

        Global.mouseController.lastUpdate();
        Global.keyboardController.lastUpdate();

        Global.stats.update();
    }, 1000 / 120);

    return {
        destroyer: () => {
            // while (Global.container.firstChild) Global.container.removeChild(Global.container.firstChild);
        }
    };
};
