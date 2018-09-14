import { Fraction } from "../math";
import TimelineObject from "./TimelineObject";
import { GUID, guid } from "../util";
import Lane from "./Lane";
import { sortQuadPoint, sortQuadPointFromQuad } from "../utils/drawQuad";
import Measure from "./Measure";

export default interface Note extends TimelineObject {
  horizontalSize: number;
  horizontalPosition: Fraction;

  color: number; // = 0xffffff;

  /**
   * 所属レーンの GUID
   */
  lane: GUID;

  /**
   * 接続可能ノートか
   */
  connectable: boolean;

  renderer?: NoteRenderer;
}

export class NoteRenderer extends PIXI.Sprite {
  constructor(public target: Note) {
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

    const quads = [q];

    console.log(quads);

    if (q) {
      //.length) {
      const [_, __, a, b] = sortQuadPointFromQuad(quads.pop()!);

      graphics
        .lineStyle(4, this.target.color)
        .moveTo(a.x, a.y)
        .lineTo(b.x, b.y);
    }
  }
}
