import { Howl } from "howler";
import { action, observable, computed } from "mobx";

import HotReload from "../HotReload";

import * as math from "mathjs";

import * as PIXI from "pixi.js";
import MusicGameSystem from "./MusicGameSystem";

interface IStore {}

class TimelineObject {
  /**
   * 小節インデックス
   */
  measureIndex: number = 0;
  /**
   * 小節内の位置
   */
  measurePosition: math.Fraction | null = null;
}

class BPMRenderer extends PIXI.Sprite {
  text: PIXI.Text;

  constructor(public target: BPMChange) {
    super();

    this.text = new PIXI.Text("aa", {
      fill: 0xffffff,

      dropShadow: true,
      dropShadowBlur: 8,
      dropShadowColor: "#000000",
      dropShadowDistance: 0,

      fontSize: 16,
      align: "center"
      //textBaseline: "middle"
    });

    this.text.anchor.set(0.5);

    this.addChild(this.text);
  }
  update(graphics: PIXI.Graphics, measure: PIXI.Container) {
    const bpm = this.target;
    const lane = measure;

    this.text.text = "BPM " + this.target.bpm;

    const x = lane.x;
    const y =
      lane.y +
      lane.height -
      (lane.height / bpm.measurePosition!.d) * bpm.measurePosition!.n;

    this.text.x = x + measure.width / 2;
    this.text.y = y;

    graphics
      .lineStyle(4, 0x00ff00)
      .moveTo(x, y)
      .lineTo(x + lane.width, y);
  }
}

class BPMChange extends TimelineObject {
  bpm: number = -1;

  renderer: BPMRenderer | null = null;
}

class LanePoint extends TimelineObject {
  horizontalIndex: number = 0;
  horizontalSize: number = 1;
}

class Lane extends TimelineObject {
  points: LanePoint[] = [];
}

class Timeline {
  /**
   * 水平レーン分割数
   */
  horizontalLaneDivision: number = 16;

  bpmChanges: BPMChange[] = [];

  /**
   * レーン
   */
  lanes: Lane[] = [];
}

export default class Chart implements IStore {
  timeline: Timeline;

  constructor(src: string) {
    this.timeline = new Timeline();

    {
      const bpmChange = {
        bpm: 120,
        measureIndex: 0,
        measurePosition: math.fraction(0, 1) as math.Fraction
      } as BPMChange;

      bpmChange.renderer = new BPMRenderer(bpmChange);

      this.timeline.bpmChanges.push(bpmChange);
    }
    {
      const bpmChange = {
        bpm: 240,
        measureIndex: 4,
        measurePosition: math.fraction(0, 1) as math.Fraction
      } as BPMChange;

      bpmChange.renderer = new BPMRenderer(bpmChange);

      this.timeline.bpmChanges.push(bpmChange);
    }

    this.guid = Math.random();

    if (src === "") {
      return;
    }

    //this.setAudio(src);
  }

  @observable
  name: string = "新規譜面";

  @action
  setName = (name: string) => (this.name = name);

  @observable
  musicGameSystem?: MusicGameSystem;

  @action
  setMusicGameSystem = (value: MusicGameSystem) =>
    (this.musicGameSystem = value);

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
    function clamp(num: number, min: number, max: number) {
      return num <= min ? min : num >= max ? max : num;
    }

    this.time = clamp(time, 0, this.audio!.duration());

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
}
