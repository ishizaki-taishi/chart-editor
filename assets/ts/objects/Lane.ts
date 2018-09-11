import TimelineObject from "./TimelineObject";
import LanePoint from "./LanePoint";
import Measure from "./Measure";

export default class Lane extends TimelineObject {
  points: LanePoint[] = [];

  renderer: LaneRenderer | null = null;
}

export class LaneRenderer extends PIXI.Sprite {
  constructor(public target: Lane) {
    super();
  }
  update(graphics: PIXI.Graphics, measures: Measure[]) {
    for (let i = 0; i < this.target.points.length - 1; ++i) {
      const p1 = this.target.points[i];
      const p2 = this.target.points[i + 1];

      const m1 = measures[p1.measureIndex];
      const m2 = measures[p2.measureIndex];

      const line = (x1: number, y1: number, x2: number, y2: number) => {
        graphics
          .lineStyle(4, Math.random() * 0xffffff)
          .moveTo(x1, y1)
          .lineTo(x2, y2);
      };

      // 同じレーンに存在しているなら
      if (m1 === m2) {
        const measure = m1;

        line(
          measure.x + p1.horizontalPosition.to01Number() * measure.width,

          measure.y +
            measure.height -
            measure.height * p1.measurePosition.to01Number(),

          measure.x + p2.horizontalPosition.to01Number() * measure.width,

          measure.y + measure.height * (1 - p2.measurePosition.to01Number())
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

          const x1 =
            measures[b.measureIndex].x +
            (left + (sa / sumPer) * currentPer) *
              measures[b.measureIndex].width;

          const x2 =
            measures[b.measureIndex].x +
            (left + (sa / sumPer) * (currentPer + b.percentage)) *
              measures[b.measureIndex].width;

          line(
            x1,
            measures[b.measureIndex].y +
              b.percentage * measures[b.measureIndex].height,

            x2,
            measures[b.measureIndex].y
          );

          currentPer += b.percentage;
        }

        // last 番目の小節に線を引く
        {
          const b = a.pop()!;

          const x1 =
            measures[b.measureIndex].x +
            (left + (sa / sumPer) * currentPer) *
              measures[b.measureIndex].width;

          const x2 =
            measures[b.measureIndex].x +
            (left + (sa / sumPer) * (currentPer + b.percentage)) *
              measures[b.measureIndex].width;

          line(
            x1,
            measures[b.measureIndex].y + measures[b.measureIndex].height,
            x2,
            measures[b.measureIndex].y +
              (1 - b.percentage) * measures[b.measureIndex].height
          );
        }
      }
    }
  }
}
