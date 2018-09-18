import Lane from "./Lane";
import LanePoint from "./LanePoint";
import BPMChange from "./BPMChange";
import Note from "./Note";
import NoteLine from "./NoteLine";
import { observable, action } from "mobx";

export default class Timeline {
  /**
   * 水平レーン分割数
   */
  @observable
  horizontalLaneDivision: number = 16;

  @observable
  bpmChanges: BPMChange[] = [];

  @observable
  lanePoints: LanePoint[] = [];

  @observable
  notes: Note[] = [];

  @observable
  noteLines: NoteLine[] = [];

  @action
  addNote = (note: Note) => this.notes.push(note);

  @action
  addNoteLine = (noteLine: NoteLine) => this.noteLines.push(noteLine);

  @action
  addLanePoint = (value: LanePoint) => this.lanePoints.push(value);

  /**
   * レーン
   */
  @observable
  lanes: Lane[] = [];

  @action
  setLanes = (lanes: Lane[]) => (this.lanes = lanes);
}
