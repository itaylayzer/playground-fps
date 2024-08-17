import AssetLoader from "../components/AssetLoader";
import { useStyles } from "../hooks/useStyles";
import { useApScreens } from "../viewmodels";
import { GiHeavyBullets } from "react-icons/gi";
import { TbBombFilled } from "react-icons/tb";
import { RxCross2 } from "react-icons/rx";

const gold = "#fcd56e";
const blue = "#2ea4ff";
const fontWeight = 800;

function App() {
    useApScreens();

    return (
        <>
            <div style={styles.gameContainer} className="gameContainer">
                <div style={styles.dot}>
                    <RxCross2
                        color="white"
                        size={30}
                        style={{ rotate: "45deg" }}
                    />
                </div>
            </div>
            <div style={styles.ui}>
                <div
                    style={{
                        position: "absolute",
                        bottom: 5,
                        left: "50%",
                        translate: "-50% 0"
                    }}
                >
                    <div style={{ display: "flex", opacity: 0.7 }}>
                        <div style={{ ...styles.boxw, direction: "rtl" }}>
                            <p
                                style={{
                                    ...styles.num2,
                                    color: gold,

                                    filter: `drop-shadow(0 0 0.25rem ${gold})`
                                }}
                            >
                                100
                            </p>
                            <p
                                style={{
                                    ...styles.num2,

                                    filter: `drop-shadow(0 0 0.25rem ${blue})`
                                }}
                            >
                                100
                            </p>
                        </div>

                        <div
                            style={{
                                height: 2,
                                width: 500,
                                marginBlock: "auto",
                                marginInline: 10,
                                background: gold,
                                backgroundColor: gold,
                                color: gold,
                                display: "block"
                            }}
                        ></div>
                        <div style={styles.box}>
                            <p color={gold} style={styles.num1} id="ammo-gun">
                                1
                            </p>
                            <p color={gold} style={styles.num} id="ammo-clip">
                                | 2
                            </p>
                            <GiHeavyBullets
                                style={{
                                    marginBlock: "auto",
                                    marginLeft: 5,
                                    rotate: "-90deg"
                                }}
                                size={30}
                                color={gold}
                            />

                            <p color={gold} style={styles.num} id="bomb-ammo">
                                1
                            </p>
                            <TbBombFilled
                                style={{
                                    marginBlock: "auto",
                                    marginRight: 5
                                }}
                                size={30}
                                color={gold}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

const styles = useStyles({
    gameContainer: {
        display: "block",
        position: "absolute",
        width: "100%",
        height: "100%",
        left: 0,
        top: 0
    },

    dot: {
        position: "absolute",
        top: "50%",
        left: "50%",
        translate: "-50% -50%"
    },

    ui: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%"
    },
    num: {
        fontSize: 30,
        fontFamily: `"Lexend", sans-serif`,
        fontWeight,
        fontStyle: "normal",
        marginBlock: "auto",
        display: "block",
        color: gold
    },
    num1: {
        fontSize: 40,
        fontFamily: `"Lexend", sans-serif`,
        fontWeight,
        fontStyle: "normal",
        marginBlock: 0,
        marginRight: 15,
        display: "block",
        color: gold
    },
    box: {
        filter: `drop-shadow(0 0 0.25rem ${gold})`,
        minWidth: 100,
        display: "flex"
    },
    boxw: {
        minWidth: 100,
        display: "flex"
    },
    num2: {
        fontSize: 40,
        fontFamily: `"Lexend", sans-serif`,
        fontWeight,
        fontStyle: "normal",
        marginBlock: 0,
        marginRight: 15,
        display: "block",
        color: blue
    }
});

export default () => (
    <AssetLoader
        items={{
            rigged: "fbx/models/rigged-no-head-a.fbx",
            walk: "fbx/animations/full/Rifle Run.fbx",
            idle: "fbx/animations/full/Rifle Aiming Idle.fbx",
            fire: "fbx/animations/full/Firing Rifle.fbx",
            firewalk: "fbx/animations/full/Firing Rifle (1).fbx",
            rifle: "fbx/models/s-c-rifle.fbx",
            throw: "fbx/animations/full/Toss Grenade.fbx",
            jup: "fbx/animations/full/Jump Up.fbx",
            jdown: "fbx/animations/full/Jump Down.fbx",
            jloop: "fbx/animations/full/Jump Loop.fbx",
            bomb: "fbx/models/fbomb.fbx",
            // sfx_throw:"https://soxundbible.com/mp3/kung_fu_punch-Mike_Koenig-2097967259.mp3"
            sfx_throw: "sfx/throw.mp3",
            sfx_exp: "sfx/exp.mp3",
            sfx_shoot: "sfx/shoot.mp3",
            txt_circle: "textures/circle.png"
        }}
    >
        <App />
    </AssetLoader>
);
