import Lane from "./Lane";
import LaneRenderer from "./LaneRenderer";

export default class LaneRendererResolver {
  static resolve(lane: Lane) {
    return LaneRenderer;
  }
}
