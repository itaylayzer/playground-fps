import { BoxObject } from "../meshes/BoxObject";
import { Global } from "../../store/Global";
import { Platform } from "../meshes/Platform";
// import { createLight } from "../../api/createLights";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import { colors } from "../../constants";
import { KeyboardController } from "../../controller/KeyboardController";
import { MouseController } from "../../controller/MouseController";
import { CameraController } from "../../controller/CameraController";
import CannonDebugger from "cannon-es-debugger";
import Stats from "three/examples/jsm/libs/stats.module.js";
// import CannonUtils from "cannon-utils";
import { HighlightedArea } from "../meshes/HighiltedArea";
import { PointerLockControls } from "three/examples/jsm/Addons.js";
import { AudioManager } from "../../managers/AudioManager";

function setupLights() {
    // createLight(
    //     [
    //         {
    //             color: 0xffffff,
    //             intensity: 0.5,
    //             type: "directional",
    //             rot: new THREE.Euler(Math.PI / 3, 0, 0),
    //             pos: new THREE.Vector3(0, 2, 0),
    //         },
    //         {
    //             color: 0xffffff,
    //             intensity: 0.7,
    //             type: "ambient",
    //             rot: new THREE.Euler(0.9, 0.5, 0),
    //         },
    //     ],
    //     Global.scene
    // );

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
    hemiLight.color = new THREE.Color("#ffffff");
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 50, 0);
    Global.scene.add(hemiLight);

    // const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
    // Global.scene.add(hemiLightHelper);

    //

    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.color = new THREE.Color("#ffffff");
    dirLight.position.set(-1, 1.75, 1);
    dirLight.position.multiplyScalar(30);
    Global.scene.add(dirLight);

    dirLight.castShadow = true;

    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.blurSamples = 1;

    const d = 50;

    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;

    dirLight.shadow.camera.far = 3500;
    dirLight.shadow.camera.near = 0;
    dirLight.shadow.bias = -0.0001;

    // const dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 10);
    // Global.scene.add(dirLightHelper);
}

function setupObjects() {
    Global.updates = [];

    new Platform(70, 1, 100, new CANNON.Vec3(0, -1, 0));
    new BoxObject(2, "#222", new CANNON.Vec3(-5, 5, -5));
    new BoxObject(2.33, "#222", new CANNON.Vec3(-5, 5, 5));
    new BoxObject(2.67, "#222", new CANNON.Vec3(5, 5, -5));
    new BoxObject(3, "#222", new CANNON.Vec3(5, 5, 5));

    new HighlightedArea({
        width: 10,
        height: 10,
        outlineHeightMax: 0.7,
        outlineCounts: 2,
        thickness: 0.3,
        baseColor: "#223e8a",
        outlinesColors: "#223e8a",
        baseOpacity: 0.5,
        outlineOpacityMax: 0.8,
        position: { x: 5, y: 0, z: 20 },
        depth: 0.1
    });

    new HighlightedArea({
        width: 10,
        height: 10,
        outlineHeightMax: 0.7,
        outlineCounts: 2,
        thickness: 0.3,
        baseColor: "#a83232",
        outlinesColors: "#a83232",
        baseOpacity: 0.5,
        outlineOpacityMax: 0.8,
        position: { x: -5, y: 0, z: -20 },
        depth: 0.1
    });
}

function setupScene() {
    Global.container = document.querySelector("div.gameContainer")!;
    Global.renderer = new THREE.WebGLRenderer({ antialias: true });
    Global.renderer.setSize(
        Global.container.clientWidth,
        Global.container.clientHeight
    );
    Global.renderer.shadowMap.enabled = true;
    // Global.renderer.shadowMap.;
    Global.container.appendChild(Global.renderer.domElement);
    Global.scene = new THREE.Scene();
    Global.scene.background = new THREE.Color(colors.background);
}

function setupPhysicsWorld() {
    Global.world = new CANNON.World();
    Global.world.gravity = new CANNON.Vec3(0, -9.81, 0);
    Global.world.allowSleep = true;
    Global.world.broadphase = new CANNON.SAPBroadphase(Global.world);
}

function setupControllers() {
    // @ts-ignore
    Global.cannonDebugger = CannonDebugger(Global.scene, Global.world, {});
    Global.camera = new THREE.PerspectiveCamera(
        120,
        Global.container.clientWidth / Global.container.clientHeight,
        0.001,
        1000
    );
    Global.keyboardController = new KeyboardController();
    Global.mouseController = new MouseController();
    Global.cameraController = new CameraController(Global.camera);
    Global.lockController = new PointerLockControls(
        Global.camera,
        Global.renderer.domElement
    );
}

function setupManagers() {
    Global.audioManager = new AudioManager({
        throw: Global.assets.sfx.sfx_throw,
        exp: Global.assets.sfx.sfx_exp,
        shoot: Global.assets.sfx.sfx_shoot
    });
}

function setupWindowEvents() {
    Global.container.addEventListener("contextmenu", event => {
        event.preventDefault();
    });
    // addEventListener(
    //     "beforeunload",
    //     function(e) {
    //         e.stopPropagation();
    //         e.preventDefault();
    //         return false;
    //     },
    //     true
    // );

    window.addEventListener("resize", () => {
        Global.camera.aspect = window.innerWidth / window.innerHeight;
        Global.camera.updateProjectionMatrix();

        Global.renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function setupStats() {
    Global.stats = new Stats();
    document.body.appendChild(Global.stats.dom);
}

// function setupMap() {
//     const map = Global.assets.gltf.map.scene;
//     map.scale.multiplyScalar(3);
//     Global.scene.add(map);

//     // // Assuming 'mesh' is your Three.js mesh
//     // const position = new THREE.Vector3();
//     // const quaternion = new THREE.Quaternion();
//     // const scale = new THREE.Vector3();

//     // map.matrixWorld.decompose(position, quaternion, scale);

//     // const body = new CANNON.Body({ mass: 0 }); // Static object

//     // // create a body
//     // map.traverse((child) => {
//     //     // @ts-ignore
//     //     if (child.isMesh) {
//     //         const mesh: THREE.Mesh = child as THREE.Mesh;
//     //         const shape = createTrimesh(mesh.geometry);
//     //         shape.scale.scale(2.825, shape.scale);

//     //         shape.updateNormals();
//     //         shape.updateAABB();
//     //         shape.updateBoundingSphereRadius();

//     //         body.addShape(shape);
//     //     }
//     // });
//     // // Apply position
//     // body.position.set(position.x, position.y, position.z);

//     // // Apply rotation
//     // body.quaternion.setFromEuler(-Math.PI / 2, 0, 0)

//     // // body
//     // body.updateAABB();
//     // body.updateBoundingRadius();

//     // // Add body to your world
//     // Global.world.addBody(body);

//     map.traverse(child => {
//         // @ts-ignore
//         if (child.isMesh) {
//             const mesh = child;

//             // Extract transformations
//             const position = new THREE.Vector3();
//             const quaternion = new THREE.Quaternion();
//             const scale = new THREE.Vector3();
//             mesh.matrixWorld.decompose(position, quaternion, scale);

//             // Create the Cannon.js body
//             // @ts-ignore
//             const shape = CannonUtils.CreateTriMesh(mesh);
//             const body = new CANNON.Body({ mass: 0 }); // Static object
//             console.log("body.id", body.id);

//             // Apply position and rotation
//             body.position.set(position.x, position.y, position.z);
//             body.quaternion.set(
//                 quaternion.x,
//                 quaternion.y,
//                 quaternion.z,
//                 quaternion.w
//             );

//             shape.scale.scale(0.225 / 2, shape.scale);

//             body.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

//             body.addShape(shape);
//             // mesh.body = body;

//             // Add body to your world
//             Global.world.addBody(body);
//         }
//     });
// }

export default function() {
    setupScene();
    setupPhysicsWorld();
    setupLights();
    setupObjects();
    // setupMap();
    setupControllers();
    setupManagers();
    setupWindowEvents();
    setupStats();
}
