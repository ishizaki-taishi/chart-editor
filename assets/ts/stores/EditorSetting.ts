import { action, observable } from "mobx";

interface IStore {}

export default class EditorSetting implements IStore {
  @observable
  laneWidth = 200;

  @action
  setLaneWidth(newLaneWidth: number) {
    this.laneWidth = newLaneWidth;
  }
  @observable
  verticalLaneCount = 3;

  @action
  setVerticalLaneCount = (value: number) => (this.verticalLaneCount = value);

  @observable
  padding: number = 20;

  @action
  setPadding = (value: number) => (this.padding = value);

  /**
   * 1 小節の分割数
   */
  @observable
  measureDivision: number = 4;

  @action
  setMeasureDivision = (value: number) => (this.measureDivision = value);
}
