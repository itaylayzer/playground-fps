import { Audio, AudioListener, PositionalAudio, Vector3Like } from "three";
import { Global } from "../store/Global";

export class AudioManager<T extends string> {
  private listener: AudioListener;
  constructor(private audios: Record<T, AudioBuffer>) {
    this.listener = new AudioListener().setMasterVolume(1);

    Global.camera.add(this.listener);
  }

  playAt(trackName: T, pos: Vector3Like) {
    const audio = new PositionalAudio(this.listener)
      .setBuffer(this.audios[trackName])
      .setLoop(false)
      .setVolume(1);

    audio.position.copy(pos);
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
