import { Fraction } from "../math";
import TimelineObject from "./TimelineObject";
import { GUID, guid } from "../util";
import Lane from "./Lane";
import { sortQuadPoint, sortQuadPointFromQuad } from "../utils/drawQuad";
import Measure from "./Measure";
import Note from "./Note";
import NoteRenderer from "./NoteRenderer";
import NoteLine from "./NoteLine";
import Pixi from "../Pixi";

interface INoteLineRenderer {
  render(noteLine: NoteLine, graphics: PIXI.Graphics, notes: Note[]): void;
}

import { getLines } from "./Lane";
import LanePoint from "./LanePoint";

class NoteLineRenderer implements INoteLineRenderer {
  render(noteLine: NoteLine, graphics: PIXI.Graphics, notes: Note[]) {
    const measures = Pixi.instance!.measures;
    const {
      lanes,
      lanePoints
    } = Pixi.instance!.props.editor!.currentChart!.timeline;

    let head = notes.find(note => note.guid === noteLine.head)!;
    let tail = notes.find(note => note.guid === noteLine.tail)!;

    //    return;

    // head, tail をソート
    [head, tail] = [head, tail].sort(
      (a, b) =>
        a.measureIndex +
        a.measurePosition.to01Number() -
        (b.measureIndex + b.measurePosition.to01Number())
    );

    const lane = lanes.find(l => l.guid === head.lane)!;

    const headPos = head.measureIndex + head.measurePosition.to01Number();
    const tailPos = tail.measureIndex + tail.measurePosition.to01Number();

    const length = tailPos - headPos;

    const cloneLanePoint = (lanePoint: LanePoint) => ({
      ...lanePoint,
      horizontalPosition: lanePoint.horizontalPosition.clone(),
      measurePosition: lanePoint.measurePosition.clone()
    });

    // 先頭ノートと末尾ノートの間にあるレーン中間ポイントを取得する
    let lps = lane.points
      .map(guid => lanePoints.find(lp => lp.guid === guid)!)
      .filter(lp => {
        const n = lp.measureIndex + lp.measurePosition.to01Number();

        return n > headPos + 0.2 && n < tailPos;
      })
      .map(lp => {
        lp = cloneLanePoint(lp);

        lp.horizontalSize = (Math.random() * 16) | 0;

        return lp;
      });
    // console.log(head, tail);

    const headBounds = NoteRenderer.getBounds(
      head,
      lane,
      measures[head.measureIndex]
    );

    const tailBounds = NoteRenderer.getBounds(
      tail,
      lanes.find(l => l.guid === tail.lane)!,
      measures[tail.measureIndex]
    );

    const noteToLanePoint = (note: Note, noteBounds: PIXI.Rectangle) => {
      return {
        horizontalSize: noteBounds.width,
        horizontalPosition: new Fraction(
          noteBounds.x - measures[note.measureIndex].x,
          measures[note.measureIndex].width
        ),
        measureIndex: note.measureIndex,
        measurePosition: new Fraction(
          note.measurePosition.denominator - note.measurePosition.numerator - 1,
          note.measurePosition.denominator
        )
      } as LanePoint;
    };

    lps = [
      noteToLanePoint(head, headBounds),
      ...lps,
      noteToLanePoint(tail, tailBounds)
    ];

    //  (window as any).testtest = true;

    const lines = getLines(lps, measures);

    (window as any).testtest = false;
    for (const line of lines) {
      graphics
        .lineStyle(10, 0xff0000, 0.5)
        .moveTo(line.start.point.x, line.start.point.y)
        .lineTo(line.end.point.x, line.end.point.y);
    }

    graphics
      .lineStyle(1, 0xff0000, 0.5)
      .moveTo(headBounds.x, headBounds.y)
      .lineTo(tailBounds.x, tailBounds.y);
  }
}

export default new NoteLineRenderer() as INoteLineRenderer;
