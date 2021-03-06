import * as math from "mathjs";

export class Fraction {
  constructor(public numerator: number, public denominator: number) {}

  static none = new Fraction(0, 0);

  to01Number = () => (1 / this.denominator) * this.numerator;

  toMathjs = () => math.fraction(this.numerator, this.denominator);

  clone() {
    return new Fraction(this.numerator, this.denominator);
  }

  toString() {
    return this.numerator + "/" + this.denominator;
  }
}

export { default as Vector2 } from "./math/Vector2";
