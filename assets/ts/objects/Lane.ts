import TimelineObject from "./TimelineObject";
import LanePoint from "./LanePoint";
import Measure from "./Measure";

type GUID = string;

export default class Lane extends TimelineObject {
  points: GUID[] = [];

  renderer: LaneRenderer | null = null;
}

import { Fraction, Vector2 } from "../math";

interface LinePoint {
  measureIndex: number;
  measurePosition: Fraction;
  horizontalSize: number;
  horizontalPosition: Fraction;
}

interface LinePointInfo {
  point: Vector2;
  width: number;
}

interface LineInfo {
  measure: Measure;
  start: LinePointInfo;
  end: LinePointInfo;
}

function getLines(points: LinePoint[], measures: Measure[]): LineInfo[] {
  const lines: LineInfo[] = [];

  const line = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    w1: number,
    w2: number,
    measure: Measure
  ) => {
    lines.push({
      measure,
      start: { point: new Vector2(x1, y1), width: w1 },
      end: { point: new Vector2(x2, y2), width: w2 }
    });
  };

  for (let i = 0; i < points.length - 1; ++i) {
    const p1 = points[i];
    const p2 = points[i + 1];

    const m1 = measures[p1.measureIndex];
    const m2 = measures[p2.measureIndex];

    // 同じレーンに存在しているなら
    if (m1 === m2) {
      const measure = m1;

      const w1 =
        (measure.width / p1.horizontalPosition.denominator) * p1.horizontalSize;
      const w2 =
        (measure.width / p2.horizontalPosition.denominator) * p2.horizontalSize;

      line(
        measure.x + p1.horizontalPosition.to01Number() * measure.width + w1 / 2,

        measure.y +
          measure.height -
          measure.height * p1.measurePosition.to01Number(),

        measure.x + p2.horizontalPosition.to01Number() * measure.width + w2 / 2,

        measure.y + measure.height * (1 - p2.measurePosition.to01Number()),

        w1,
        w2,
        measure
      );
    } else {
      const a: {
        percentage: number;
        measureIndex: number;
        horizontalPosition: number;
      }[] = [];

      a.push({
        percentage: 1 - p1.measurePosition.to01Number(),
        measureIndex: p1.measureIndex,
        horizontalPosition: 0
      });

      // p1 と p2 の間に存在する小節をチェック
      for (var i2 = p1.measureIndex + 1; i2 < p2.measureIndex; ++i2) {
        a.push({
          percentage: 1,
          measureIndex: i2,
          horizontalPosition: 0
        });
      }

      a.push({
        percentage: p2.measurePosition.to01Number(),
        measureIndex: p2.measureIndex,
        horizontalPosition: 0
      });

      // レーン全体の長さ
      const sumPer = a.map(b => b.percentage).reduce((a, b) => a + b);

      let currentPer = 0;

      const left = p1.horizontalPosition.to01Number();
      const sa = p2.horizontalPosition.to01Number() - left;

      // 0 ~ (last-1) 番目の小節に線を引く
      for (var j = 0; j < a.length - 1; ++j) {
        const b = a[j];
        // const e = a[j + 1];

        const measure = measures[b.measureIndex];

        const x1 =
          measures[b.measureIndex].x +
          (left + (sa / sumPer) * currentPer) * measures[b.measureIndex].width;

        const x2 =
          measures[b.measureIndex].x +
          (left + (sa / sumPer) * (currentPer + b.percentage)) *
            measures[b.measureIndex].width;

        const w1 =
          (measure.width / p1.horizontalPosition.denominator) *
          p1.horizontalSize;

        const w2 =
          (measure.width / p2.horizontalPosition.denominator) *
          p2.horizontalSize;
        const ww1 = w1 + ((w2 - w1) / sumPer) * currentPer;
        const ww2 = w1 + ((w2 - w1) / sumPer) * (currentPer + b.percentage);

        line(
          x1 + ww1 / 2,
          measures[b.measureIndex].y +
            b.percentage * measures[b.measureIndex].height,

          x2 + ww2 / 2,
          measures[b.measureIndex].y,
          ww1,
          ww2,
          measure
        );

        currentPer += b.percentage;
      }

      // last 番目の小節に線を引く
      {
        const b = a.pop()!;
        const measure = measures[b.measureIndex];

        const x1 =
          measures[b.measureIndex].x +
          (left + (sa / sumPer) * currentPer) * measures[b.measureIndex].width;

        const x2 =
          measures[b.measureIndex].x +
          (left + (sa / sumPer) * (currentPer + b.percentage)) *
            measures[b.measureIndex].width;

        const w1 =
          (measure.width / p1.horizontalPosition.denominator) *
          p1.horizontalSize;

        const w2 =
          (measure.width / p2.horizontalPosition.denominator) *
          p2.horizontalSize;
        const ww1 = w1 + ((w2 - w1) / sumPer) * currentPer;
        const ww2 = w1 + ((w2 - w1) / sumPer) * (currentPer + b.percentage);

        line(
          x1 + ww1 / 2,
          measures[b.measureIndex].y + measures[b.measureIndex].height,
          x2 + ww2 / 2,
          measures[b.measureIndex].y +
            (1 - b.percentage) * measures[b.measureIndex].height,

          ww1,
          ww2,
          measure
        );
      }
    }
  }

  return lines;
}

interface Quad {
  a: Vector2;
  b: Vector2;
  c: Vector2;
  d: Vector2;
}

export class LaneRenderer extends PIXI.Sprite {
  constructor(public target: Lane) {
    super();
  }

  laneDivision = 3;

  getQuad(measureDivision: number, measureDivisionIndex: number): Quad {
    return {
      a: new Vector2(0, 0),
      b: new Vector2(0, 0),
      c: new Vector2(0, 0),
      d: new Vector2(0, 0)
    };
  }

  update(
    graphics: PIXI.Graphics,
    lanePoints: LanePoint[],
    measures: Measure[],
    drawHorizontalLineTargetMeasure?: Measure,
    md = 4
  ) {
    const lines = getLines(
      this.target.points.map(
        point => lanePoints.find(lanePoint => lanePoint.guid === point)!
      ),
      measures
    );

    interface Line {
      start: Vector2;
      end: Vector2;
    }

    function drawLine(line: Line, lineWidth: number, color: number) {
      graphics
        .lineStyle(lineWidth, color)
        .moveTo(line.start.x, line.start.y)
        .lineTo(line.end.x, line.end.y);
    }

    for (const line of lines) {
      graphics
        .lineStyle(1, 0xff00ff)
        .moveTo(line.start.point.x - line.start.width / 2, line.start.point.y)
        .lineTo(line.end.point.x - line.end.width / 2, line.end.point.y);
      graphics
        .lineStyle(1, 0xff00ff)
        .moveTo(line.start.point.x + line.start.width / 2, line.start.point.y)
        .lineTo(line.end.point.x + line.end.width / 2, line.end.point.y);
    }

    // 選択中の小節に乗っているレーン
    const targetMeasureLines = lines.filter(
      ({ measure }) => measure === drawHorizontalLineTargetMeasure
    );

    for (const line of targetMeasureLines) {
      for (var i = 1; i < this.laneDivision; ++i) {
        graphics
          .lineStyle(1, 0xffffff)
          .moveTo(
            line.start.point.x -
              line.start.width / 2 +
              (line.start.width / this.laneDivision) * i,
            line.start.point.y
          )
          .lineTo(
            line.end.point.x -
              line.end.width / 2 +
              (line.end.width / this.laneDivision) * i,
            line.end.point.y
          );
      }
    }

    // test
    {
      /*
      var judgeIentersected = function(ax:, ay, bx, by, cx, cy, dx, dy) {
        var ta = (cx - dx) * (ay - cy) + (cy - dy) * (cx - ax);
        var tb = (cx - dx) * (by - cy) + (cy - dy) * (cx - bx);
        var tc = (ax - bx) * (cy - ay) + (ay - by) * (ax - cx);
        var td = (ax - bx) * (dy - ay) + (ay - by) * (ax - dx);
      
        return tc * td < 0 && ta * tb < 0;
        // return tc * td <= 0 && ta * tb <= 0; // 端点を含む場合
      };

      */

      if (drawHorizontalLineTargetMeasure) {
        const line_intersect = (
          x1: number,
          y1: number,
          x2: number,
          y2: number,
          x3: number,
          y3: number,
          x4: number,
          y4: number
        ) => {
          // Check if none of the lines are of length 0
          if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
            return false;
          }

          var denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

          // Lines are parallel
          if (denominator === 0) {
            return false;
          }

          let ua =
            ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
          let ub =
            ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

          // is the intersection along the segments
          if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
            return false;
          }

          // Return a object with the x and y coordinates of the intersection
          let x = x1 + ua * (x2 - x1);
          let y = y1 + ua * (y2 - y1);

          return { x, y };
        };

        var getIntersectionLineSegments = function(point1: Line, point2: Line) {
          const add = Vector2.sub(point1.end, point1.start)
            .normalize()
            .multiplyScalar(4);

          point1.start.x -= add.x;
          point1.start.y -= add.y;

          point1.end.x += add.x;
          point1.end.y += add.y;

          // drawLine(point1, 2, 0x00ff00);
          // drawLine(point2, 2, 0x00ffff);

          const nn = line_intersect(
            point1.start.x,
            point1.start.y,
            point1.end.x,
            point1.end.y,
            point2.start.x,
            point2.start.y,
            point2.end.x,
            point2.end.y
          );

          if (!nn) return false;

          return new Vector2(nn!.x, nn!.y);
        };

        let pp = 0;

        // 対象の小節に存在してるレーン中間点の y 座標一覧
        var b3 = Array.from(
          new Set(
            targetMeasureLines
              .map(line => [line.start.point.y, line.end.point.y])
              .reduce((acc: any, val: any) => acc.concat(val), [])
          )
        );

        console.log(b3);

        // y 軸のライン
        const yLines: Line[] = [];
        // x 軸のライン
        const xLines: Line[] = [];

        // 縦
        for (let i = 0; i < md + 1; ++i) {
          // 小節内分割ライン

          const y =
            drawHorizontalLineTargetMeasure!.y +
            (drawHorizontalLineTargetMeasure!.height / md) * i;

          const measureLine: Line = {
            start: new Vector2(drawHorizontalLineTargetMeasure!.x, y),
            end: new Vector2(
              drawHorizontalLineTargetMeasure!.x +
                drawHorizontalLineTargetMeasure!.width,
              y
            )
          };

          yLines.push(measureLine);
        }

        // 横
        for (let j = 0; j < this.laneDivision; ++j) {
          for (const line of targetMeasureLines) {
            const linee: Line = {
              start: new Vector2(
                line.start.point.x -
                  line.start.width / 2 +
                  (line.start.width / this.laneDivision) * j,
                line.start.point.y
              ),
              end: new Vector2(
                line.end.point.x -
                  line.end.width / 2 +
                  (line.end.width / this.laneDivision) * j,
                line.end.point.y
              )
            };
            xLines.push(linee);
          }
        }

        // 縦
        for (let i = 0; i < md; ++i) {
          const yLine1 = yLines[i];
          const yLine2 = yLines[i + 1];

          drawLine(yLine1, 4, 0xff00ff);
          // 横
          for (let j = 0; j < this.laneDivision; ++j) {
            const xLine1 = xLines[j];
            const xLine2 = xLines[j + 1];

            var ret1 = getIntersectionLineSegments(yLine1, xLine1);
            var ret2 = getIntersectionLineSegments(yLine1, xLine2);
            var ret3 = getIntersectionLineSegments(yLine2, xLine1);
            var ret4 = getIntersectionLineSegments(yLine2, xLine2);

            console.log(ret1, ret2, ret3, ret4);

            // drawLine(xLine1, 4, 0xffff00);
          }
        }

        /*

        for (let i = 0; i <  1; ++i) {
          for (const line of targetMeasureLines) {
            // 小節内分割ライン

            const y =
              drawHorizontalLineTargetMeasure!.y +
              (drawHorizontalLineTargetMeasure!.height / md) * i;

            const measureLine: Line = {
              start: new Vector2(drawHorizontalLineTargetMeasure!.x, y),
              end: new Vector2(
                drawHorizontalLineTargetMeasure!.x +
                  drawHorizontalLineTargetMeasure!.width,
                y
              )
            };

            for (var j = 0; j < this.laneDivision + 1; ++j) {
              const linee: Line = {
                start: new Vector2(
                  line.start.point.x -
                    line.start.width / 2 +
                    (line.start.width / this.laneDivision) * j,
                  line.start.point.y
                ),
                end: new Vector2(
                  line.end.point.x -
                    line.end.width / 2 +
                    (line.end.width / this.laneDivision) * j,
                  line.end.point.y
                )
              };

              //drawLine(linee, 1, 0xffffff);

              var ret = getIntersectionLineSegments(linee, measureLine);

              if (ret) {
                //   console.log(ret);

                graphics.drawCircle(ret.x, ret.y, 10);

                graphics.beginFill(0xf1c40f); // Yellow

                // Draw a polygon to look like a star
                graphics.drawPolygon([
                  ret.x,
                  ret.y, // Starting x, y coordinates for the star
                  ret.x + 20,
                  ret.y, // Star is drawn in a clockwork motion
                  ret.x + 20,
                  ret.y + 20,
                  ret.x,
                  ret.y + 20
                ]);

                graphics.endFill();

                ++pp;
              }
            }
          }
        }

        */

        console.log(pp);
      }
    }

    this.test();
  }

  test() {}
}
