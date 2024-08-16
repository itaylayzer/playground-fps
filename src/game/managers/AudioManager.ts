import { Audio, AudioListener, PositionalAudio } from "three";
import { Global } from "../store/Global";

export class AudioManager<T extends string> {
    private listener: AudioListener;
    constructor(private audios: Record<T, AudioBuffer>) {
        this.listener = new AudioListener().setMasterVolume(1);

        Global.camera.add(this.listener);
    }

    playAt(trackName: T, distance: number) {
        const audio = new PositionalAudio(this.listener)
            .setBuffer(this.audios[trackName])
            .setLoop(false)
            .setVolume(1);

        console.log("refDistance", distance);

        audio.setRefDistance(100 / distance);
        audio.play();
    }
    play(trackName: T) {
        new Audio(this.listener)
            .setBuffer(this.audios[trackName])
            .setLoop(false)
            .setVolume(1)
            .play();
    }
}
