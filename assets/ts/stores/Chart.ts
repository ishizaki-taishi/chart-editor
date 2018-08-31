import { Howl } from "howler";
import { action, observable } from "mobx";

import HotReload from "../HotReload";

interface IStore {}

export default class Chart implements IStore {
  readonly audio: Howl;

  @observable
  audioBuffer?: AudioBuffer;

  @action
  setAudioBuffer(ab: AudioBuffer) {
    this.audioBuffer = ab;
  }

  constructor(src: string) {
    this.audio = new Howl({ src: src });

    if ((window as any).ps) (window as any).ps.stop();
    (window as any).ps = this.audio;

    var context: AudioContext = (this.audio as any)._sounds[0]._node.context;

    const self = this;

    HotReload.override(
      context,
      "decodeAudioData",
      async (base: any, ...args: any[]) => {
        const audioBuffer = await base(...args);

        console.warn("loaded", audioBuffer);

        self.setAudioBuffer(audioBuffer);

        return audioBuffer;
      }
    );

    this.audio.volume(0.5);
    this.audio.play();
  }
}
