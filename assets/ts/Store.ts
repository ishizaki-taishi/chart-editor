import { action, observable } from "mobx";

import Chart from "./stores/Chart";
interface IStore {}

import EditorSetting from "./stores/EditorSetting";
import Asset from "./stores/Asset";

export class Editor implements IStore {
  readonly debugMode: boolean = true;

  @observable
  currentChart?: Chart;

  @observable
  currentChartIndex: number = -1;

  @observable
  setting?: EditorSetting;

  @observable
  asset: Asset = new Asset(this.debugMode);

  @observable
  charts: Chart[] = [];

  @action
  setAudioDirectory(path: string) {}

  /**
   * 新規譜面を作成する
   */
  @action
  newChart() {
    this.charts.push(new Chart(""));
  }

  @action
  setCurrentChart(chartIndex: number) {
    this.currentChartIndex = chartIndex;
    this.currentChart = this.charts[chartIndex];
  }

  @action
  test() {
    this.setting = new EditorSetting();
  }

  constructor() {
    //    this.currentChart = new Chart();

    for (var i = 3; i--; ) {
      this.newChart();
    }

    this.setCurrentChart(0);

    this.test();
  }
}

export default {
  editor: new Editor()
};
