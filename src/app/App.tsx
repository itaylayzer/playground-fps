import { GoDotFill } from "react-icons/go";
import AssetLoader from "../components/AssetLoader";
import { useStyles } from "../hooks/useStyles";
import { useApScreens } from "../viewmodels";


function App() {
    useApScreens();

    return (
        <>
            <div style={styles.gameContainer} className="gameContainer">
                    <div style={styles.dot}>
                        <GoDotFill color="white" size={10} />
                    </div>
                
            </div>
        </>
    );
}

const styles = useStyles({
    gameContainer: {
        display: "block",
        position: "absolute",
        width: '100%',
        height: "100%",
        left: 0,
        top: 0
    },
    header: {
        zIndex: 2,
        color: "white",
        fontSize: 16,
        position: "absolute",
        boxSizing: "border-box",
        display: "block",
        top: 0,
        left: 0,
        fontFamily: "monospace",
        textAlign: "center",
        width: "100%",
    },
    href: {
        color: "rgb(41, 131, 255)",
    },
    container: {
        display: "flex",
        position: "absolute",
        boxSizing: "border-box",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        minHeight: "100%",
        minWidth: "100%",
        justifyContent: "center",
        flexDirection: "row-reverse",
    },

    dot: {
        position: "absolute",
        top: "50%",
        left: "50%",
        translate: "-50% -50%",
    },
    ui: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 3,
        pointerEvents: "none",
    },
    swords: {
        position: "absolute",
        bottom: 50,
        left: 80,
        width: 250,
        backgroundColor: "#080808",
        rotate: "-2deg",
        display: "flex",
        justifyContent: "space-around",
    },
    speakingIcon: {
        position: "absolute",
        bottom: 50,
        left: 25,
        rotate: "-2deg",
        transition: ".3s opacity, scale .3s",
        scale: "0.9",
        opacity: "0",
    },
    doesSpeak: {
        scale: "1",
        opacity: "1",
    },
    guns: {
        position: "absolute",
        bottom: 50,
        right: 50,
        width: 300,
        backgroundColor: "#080808",
        rotate: "2deg",
        display: "flex",
        justifyContent: "space-around",
        flexDirection: "row-reverse",
    },
    selectb: {
        background: "rgb(0,0,0,0)",
        border: 0,
        outline: 0,
        padding: 10,
        paddingInline: 20,
        transition: "opacity .3s, scale .3s",
        scale: "0.6",
        opacity: "0.2",
    },
    seletbselected: {
        scale: "1",
        opacity: "1",
    },
});

export default () => (
    <AssetLoader items={{
            rigged:"fbx/rigged-no-head-a.fbx",
            walk:"fbx/Rifle Run.fbx",
            idle:"fbx/Rifle Aiming Idle.fbx",
            fire:"fbx/Firing Rifle.fbx",
            firewalk:"fbx/Firing Rifle (1).fbx",
            rifle:"fbx/connected-rifle.fbx",
            throw:"fbx/Toss Grenade.fbx",
            jup:"fbx/Jump Up.fbx",
            jdown:"fbx/Jump Down.fbx",
            jloop:"fbx/Jump Loop.fbx"
        }}>
        <App />
    </AssetLoader>
);
