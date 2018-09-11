import { Fraction } from "../math";

export default class TimelineObject {
  /**
   * 小節インデックス
   */
  measureIndex: number = 0;
  /**
   * 小節内の位置
   */
  measurePosition: Fraction = Fraction.none;
}
