import { Coord } from "./commons";
import Drawable from "./drawable";

export default class Polygon implements Drawable {
  constructor(
    public points: Array<Coord>,
    public point: Coord,
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
