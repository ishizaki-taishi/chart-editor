import Lane from "./Lane";
import LanePoint from "./LanePoint";
import BPMChange from "./BPMChange";

export default class Timeline {
  /**
   * 水平レーン分割数
   */
  horizontalLaneDivision: number = 16;

  bpmChanges: BPMChange[] = [];

  lanePoints: LanePoint[] = [];

  /**
   * レーン
   */
  lanes: Lane[] = [];
}
