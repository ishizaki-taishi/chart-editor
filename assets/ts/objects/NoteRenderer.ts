import { Fraction } from "../math";
import TimelineObject from "./TimelineObject";
import { GUID, guid } from "../util";
import Lane from "./Lane";
import { sortQuadPoint, sortQuadPointFromQuad } from "../utils/drawQuad";
import Measure from "./Measure";
import Note from "./Note";

interface INoteRenderer {
  getBounds(note: Note, lane: Lane, measure: Measure): PIXI.Rectangle;

  render(
    target: Note,
    graphics: PIXI.Graphics,
    lane: Lane,
    measure: Measure
  ): void;
}

class NoteRenderer implements INoteRenderer {
  getBounds(note: Note, lane: Lane, measure: Measure): PIXI.Rectangle {
    const q = lane.renderer!.getQuad(
      measure,
      note.horizontalPosition,
      note.measurePosition
    )!;

    return new PIXI.Rectangle(
      q.point.x - q.width / 2,
      q.point.y - 5,
      q.width,
      10
    );
  }

  render(note: Note, graphics: PIXI.Graphics, lane: Lane, measure: Measure) {
    const q = lane.renderer!.getQuad(
      measure,
      note.horizontalPosition,
      note.measurePosition
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
        .lineStyle(4, note.color)
        .moveTo(q.point.x - q.width / 2, q.point.y)
        .lineTo(q.point.x + q.width / 2, q.point.y);
    }
  }
}

export default new NoteRenderer() as INoteRenderer;
