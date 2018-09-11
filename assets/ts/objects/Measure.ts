/**
 * 小節内の位置
 */
interface MeasurePoint {
  x: number;
}

/**
 * 小節
 */
export default class Measure extends PIXI.Sprite {
  constructor(public index: number, texture?: PIXI.Texture) {
    super();
  }
}
