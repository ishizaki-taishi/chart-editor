import Lane from "./Lane";
import LaneRenderer, { ILaneRenderer } from "./LaneRenderer";
import Pixi from "../Pixi";

export default class LaneRendererResolver {
  static resolve(lane: Lane): ILaneRenderer {
    // レーンテンプレート
    const laneTemplate = Pixi.instance!.props.editor!.currentChart!.musicGameSystem!.laneTemplates.find(
      lt => lt.name === lane.templateName
    )!;

    if (laneTemplate.name === "default") return LaneRenderer;

    if (laneTemplate.rendererReference) {
      console.log(laneTemplate.rendererReference);

      return {
        getQuad: LaneRenderer.getQuad,
        render: laneTemplate.rendererReference as any
      };
    } else return LaneRenderer;
  }
}
