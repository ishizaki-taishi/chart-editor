import { Fraction } from "../math";
import TimelineObject from "./TimelineObject";
import { GUID, guid } from "../util";
import Lane from "./Lane";
import { sortQuadPoint, sortQuadPointFromQuad } from "../utils/drawQuad";
import Measure from "./Measure";

export default interface NoteLine extends TimelineObject {
  horizontalSize: number;
  horizontalPosition: Fraction;

  type: string;

  color: number; // = 0xffffff;

  /**
   * 所属レーンの GUID
   */
  lane: GUID;

  /**
   * 接続可能ノートか
   */
  connectable: boolean;

  renderer?: NoteLineRenderer;
}

export class NoteLineRenderer extends PIXI.Sprite {
  constructor(public target: NoteLine) {
    super();
  }

  update(graphics: PIXI.Graphics, lane: Lane, measure: Measure) {
    const q = lane.renderer!.getQuad(
      measure,
      this.target.horizontalPosition,
      this.target.measurePosition
    );

    /*
    const quads = lane.renderer!.quadCache.filter(
      quad =>
        quad.horizontalIndex === this.target.horizontalPosition.numerator &&
        quad.verticalIndex === this.target.measurePosition.numerator
    );
    */

    const quads = q;

    if (q) {
      //.length) {
      graphics
        .lineStyle(4, this.target.color)
        .moveTo(q.point.x - q.width / 2, q.point.y)
        .lineTo(q.point.x + q.width / 2, q.point.y);
    }
  }
}
