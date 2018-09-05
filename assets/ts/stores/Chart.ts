import { Howl } from "howler";
import { action, observable, computed } from "mobx";

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

  @observable
  volume: number = 1.0;

  @action
  setVolume(value: number) {
    this.volume = value;
    this.audio!.volume(value);
  }

  @computed
  get normalizedPosition() {
    return this.time / this.audio!.duration();
  }

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

  @observable
  isPlaying: boolean = false;

  @action
  private setIsPlaying = (value: boolean) => (this.isPlaying = value);

  @action
  pause() {
    if (!this.audio) return;
    this.audio!.pause();

    this.isPlaying = false;
  }

  @action
  play(volume: number = 0.5) {
    if (!this.audio) return;

    this.isPlaying = true;

    if ((window as any).ps) (window as any).ps.stop();
    (window as any).ps = this.audio;

    this.audio!.seek(this.time);

    this.playId = this.audio!.play();
  }

  private observeTimeId: number | null = null;

  @observable
  time: number = 0;

  private playId: number = -1;

  @action
  setTime = (time: number, seek: boolean = false) => {
    this.time = time;

    //    console.log("change time", time);

    if (seek) this.audio!.seek(time); //, this.playId);
  };

  @action
  setAudio(buffer: Buffer, source: string) {
    // BinaryString, UintXXArray, ArrayBuffer -> Blob
    const blob = new Blob([buffer], { type: "audio/wav" });

    const src = URL.createObjectURL(blob);

    console.warn(src);

    // 既に楽曲が存在したら
    if (this.audio) {
      this.audio.off("end");
    }
    if (this.observeTimeId !== null) {
      window.clearInterval(this.observeTimeId);
    }

    this.audio = new Howl({ src: src, format: ["wav"] });

    this.audio.on("end", () => this.setIsPlaying(false));

    // 秒数リセット
    this.setTime(0);
    this.isPlaying = false;

    // 毎フレーム再生秒数を監視する
    this.observeTimeId = window.setInterval(() => {
      const time = this.audio!.seek() as number;

      if (this.time !== time) this.setTime(time);
    }, 1000 / 60);

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
