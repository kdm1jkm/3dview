import { Pos2 } from "./commons";
import Drawable from "./drawable";

export default class Polygon implements Drawable {
  constructor(
    public points: Array<Pos2>,
    public point: Pos2,
    public color: string
  ) {}

  draw(context: CanvasRenderingContext2D): void {
    context.beginPath();
    context.moveTo(this.point.x, this.point.y);
    this.points.forEach((p) => {
      context.lineTo(this.point.x + p.x, this.point.y + p.y);
    });
    context.fillStyle = this.color;
    context.fill();
  }
}
