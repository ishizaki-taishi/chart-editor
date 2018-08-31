import { action, observable } from "mobx";

import Chart from "./stores/Chart";
interface IStore {}

interface IAudio {
  key: string;
  value: string;
}

import EditorSetting from "./stores/EditorSetting";

export class Editor implements IStore {
  @observable
  currentChart?: Chart;

  @observable
  setting?: EditorSetting;

  @observable
  audios?: IAudio[];

  @action
  test() {
    this.setting = new EditorSetting();
  }

  @action
  updateAudios(audios: IAudio[]) {
    this.audios = audios;
  }

  constructor() {
    //    this.currentChart = new Chart();

    this.test();

    const audios = {}; //require("../audio/*.wav");

    (async () => {
      const res = await fetch("http://localhost:3000");
      const t = await res.text();

      const n = new DOMParser().parseFromString(t, "text/html");

      const p = Array.from(n.querySelectorAll("a"));

      console.log(p);

      this.updateAudios(
        p.map((p: any) => ({
          key: p.textContent,
          value: "http://localhost:3000/" + p.textContent
        }))
      );
    })();
  }

  @action
  setAudio(audioKey: string) {
    const audio = this.audios!.find(audio => audio.key == audioKey)!;

    if (audio == null) return;

    if (this.currentChart) this.currentChart.audio.stop();

    this.currentChart = new Chart(audio.value);

    console.log("SetAudio", audio);
  }
}

export default {
  editor: new Editor()
};
