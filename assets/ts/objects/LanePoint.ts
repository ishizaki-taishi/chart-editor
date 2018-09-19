import { Fraction } from "../math";
import TimelineObject from "./TimelineObject";
import { LaneTemplate } from "../stores/MusicGameSystem";
import Pixi from "../Pixi";

/**
 * レーンの中間点
 */
export default interface LanePoint extends TimelineObject {
  horizontalSize: number;
  horizontalPosition: Fraction;

  template: LaneTemplate;

  color: number; // = 0xffffff;

  renderer: LanePointRenderer; // | null = null;
}

export class LanePointRenderer extends PIXI.Sprite {
  constructor(public target: LanePoint) {
    super();
  }

  update(graphics: PIXI.Graphics, measure: PIXI.Container) {
    const bpm = this.target;
    const lane = measure;

    //    math.fraction(0, 0)

    const w =
      (measure.width / this.target.horizontalPosition!.denominator) *
      this.target.horizontalSize;

    const x =
      lane.x +
      (measure.width / this.target.horizontalPosition!.denominator) *
        this.target.horizontalPosition!.numerator;

    const y =
      lane.y +
      lane.height -
      (lane.height / bpm.measurePosition!.denominator) *
        bpm.measurePosition!.numerator;

    graphics
      .lineStyle(4, 0xffffff, 0.5)
      .moveTo(x, y)
      .lineTo(x + w, y);

    const colliderH = 20;

    this.width = w;
    this.height = colliderH;
    this.x = x;
    this.y = y - colliderH / 2;

    Pixi.instance!.drawTempText(
      `${bpm.measureIndex}:${bpm.measurePosition}`,
      this.x,
      this.y,
      {
        fontSize: 16
      }
    );
  }
}
