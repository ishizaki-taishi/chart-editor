import { action, observable } from "mobx";

interface IStore {}

export default class EditorSetting implements IStore {
  @observable
  laneWidth = 200;

  @action
  setLaneWidth(newLaneWidth: number) {
    this.laneWidth = newLaneWidth;
  }
}
