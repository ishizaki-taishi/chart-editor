import { Howl } from "howler";
import { action, observable } from "mobx";

import Chart from "./stores/Chart";
interface IStore {}

interface IAudio {
  key: string;
  value: string;
}
import HotReload from "./HotReload";
import EditorSetting from "./stores/EditorSetting";

export class Editor implements IStore {
  @observable
  currentChart?: Chart;

  @observable
  setting?: EditorSetting;

  readonly audios: IAudio[];

  @action
  test() {
    this.setting = new EditorSetting();
  }

  constructor() {
    //    this.currentChart = new Chart();

    this.test();

    const audios = require("../audio/*.wav");

    this.audios = Object.entries(audios).map(
      ([key, value]) =>
        ({
          key,
          value
        } as IAudio)
    );
  }

  @action
  setAudio(audioKey: string) {
    const audio = this.audios.find(audio => audio.key == audioKey)!;

    if (this.currentChart) this.currentChart.audio.stop();

    this.currentChart = new Chart(audio.value);

    console.log("SetAudio", audio);
  }

  private loadAudios() {
    /*
    console.log(sound);
    const decodeAudioData2: Function = ((window as any).decodeAudioData2 =
      (window as any).decodeAudioData2 || Howler.ctx.decodeAudioData);
    if ((window as any).playingSound) {
      ((window as any).playingSound as Howl).stop();
    }
    (window as any).playingSound = sound;
    sound.play();
    */
    // console.warn(sound);
  }
}

export default {
  editor: new Editor()
};
