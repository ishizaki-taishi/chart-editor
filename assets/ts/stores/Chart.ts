import { Howl } from "howler";
import { action, observable } from "mobx";

import HotReload from "../HotReload";

interface IStore {}

export default class Chart implements IStore {
  @observable
  name: string = "新規譜面";

  @action
  setName = (name: string) => (this.name = name);

  @observable
  audio?: Howl;

  @observable
  audioSource?: string;

  @observable
  audioBuffer?: AudioBuffer;

  @observable
  guid: number;

  @action
  private setAudioBuffer(ab: AudioBuffer) {
    this.audioBuffer = ab;
  }

  @action
  resetAudio() {
    delete this.audio;
    delete this.audioBuffer;
    delete this.audioSource;
  }

  @action
  play(volume: number = 0.5) {
    if (!this.audio) return;

    if ((window as any).ps) (window as any).ps.stop();
    (window as any).ps = this.audio;

    this.audio!.volume(volume);
    this.audio!.play();
  }

  @action
  setAudio(buffer: Buffer, source: string) {
    // BinaryString, UintXXArray, ArrayBuffer -> Blob
    const blob = new Blob([buffer], { type: "audio/wav" });

    const src = URL.createObjectURL(blob);

    console.warn(src);

    this.audio = new Howl({ src: src, format: ["wav"] });

    this.audioSource = source;

    if ((window as any).ps) (window as any).ps.stop();

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
  }

  constructor(src: string) {
    this.guid = Math.random();

    if (src === "") {
      return;
    }

    //this.setAudio(src);
  }
}
