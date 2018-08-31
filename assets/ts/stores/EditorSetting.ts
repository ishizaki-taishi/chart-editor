import { action, observable } from "mobx";

interface IStore {}

export default class EditorSetting implements IStore {
  @observable
  laneWidth = 200;

  @observable
  verticalLaneCount = 3;

  @action
  setVerticalLaneCount = (value: number) => (this.verticalLaneCount = value);

  @action
  setLaneWidth(newLaneWidth: number) {
    this.laneWidth = newLaneWidth;
  }
}
