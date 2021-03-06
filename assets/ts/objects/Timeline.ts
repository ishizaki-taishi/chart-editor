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

  @action
  addLane = (lane: Lane) => this.lanes.push(lane);

  /**
   * レーンを最適化する
   */
  @action
  optimiseLane() {
    // レーンポイントをソートする
    for (const lane of this.lanes) {
      lane.points = lane.points.slice().sort((a, b) => {
        const lp1 = this.lanePoints.find(lp => lp.guid === a)!;
        const lp2 = this.lanePoints.find(lp => lp.guid === b)!;

        const p1 = lp1.measureIndex + lp1.measurePosition.to01Number();
        const p2 = lp2.measureIndex + lp2.measurePosition.to01Number();

        return p1 - p2;
      });
    }

    while (1) {
      let f = false;

      for (const lane of this.lanes) {
        const lastLanePoint = lane.points[lane.points.length - 1];

        // 後方に結合するレーン
        const nextLane = this.lanes.find(lane2 => {
          if (lane === lane2) return false;

          return lane2.points[0] === lastLanePoint;
        });

        if (nextLane) {
          // 古いレーンを参照していたノートのレーン情報を更新
          for (const note of this.notes.filter(
            note => note.lane === nextLane.guid
          )) {
            note.lane = lane.guid;
          }

          const nextLaneIndex = this.lanes.findIndex(l => l === nextLane);
          lane.points.push(...nextLane.points.slice(1));

          this.lanes = this.lanes.filter((l, index) => index !== nextLaneIndex);
          f = true;
          break;
        }
      }

      if (!f) break;
    }
  }
}
