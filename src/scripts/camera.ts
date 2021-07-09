import { Pos2, Pos3 } from "./commons";
import Object3D from "./object3d";
import * as math from "mathjs";
import Polygon from "./polygon";

export default class Camera {
  // tilt h -> Degree of Horizontal Tiltrated
  //      v -> Degree of Vertical Tiltrated
  constructor(
    public context: CanvasRenderingContext2D,
    public screen: { width: number; height: number },
    public position: Pos3 = { x: 0, y: 0, z: 0 },
    public tilt: { v: number; h: number } = { v: 0, h: 0 },
    public FOV: number = Math.PI / 2
  ) {}

  public get rotateHorizontal() {
    return math.matrix([
      [Math.cos(this.tilt.h), 0, -Math.sin(this.tilt.h), 0],
      [0, 1, 0, 0],
      [Math.sin(this.tilt.h), 0, Math.cos(this.tilt.h), 0],
      [0, 0, 0, 1],
    ]);
  }

  public get rotate() {
    return math.matrix([
      [Math.cos(this.tilt.h), 0, Math.sin(this.tilt.h), 0],
      [
        -Math.sin(this.tilt.h) * Math.sin(this.tilt.v),
        Math.cos(this.tilt.v),
        Math.cos(this.tilt.h) * Math.sin(this.tilt.v),
        0,
      ],
      [
        -Math.sin(this.tilt.h) * Math.cos(this.tilt.v),
        -Math.sin(this.tilt.v),
        Math.cos(this.tilt.h) * Math.cos(this.tilt.v),
        0,
      ],
      [0, 0, 0, 1],
    ]);
  }

  public draw(...objects: Object3D[]) {
    this.context.fillStyle = "white";
    this.context.fillRect(0, 0, this.screen.width, this.screen.height);
    const k = 2 * Math.tan(this.FOV / 2);

    const transform = math.matrix([
      [1, 0, 0, -this.position.x],
      [0, 1, 0, -this.position.y],
      [0, 0, 1, -this.position.z],
      [0, 0, 0, 1],
    ]);
    const rotate = this.rotate;
    const screen = math.matrix([
      [this.screen.width / k, 0, this.screen.width / 2, 0],
      [0, -this.screen.width / k, this.screen.height / 2, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ]);

    const mat = math.multiply(screen, math.multiply(rotate, transform));

    const projectedPolygons = objects
      .map((object) => {
        return object.points
          .map((p) =>
            p.map((point): Pos2 => {
              const result = math
                .multiply(mat, math.matrix([point.x, point.y, point.z, 1]))
                .toJSON().data;

              if (result[2] < 0) return { x: NaN, y: NaN };

              return {
                x: result[0] / result[2] / result[3],
                y: result[1] / result[2] / result[3],
              };
            })
          )
          .flatMap((points) => {
            const result: Polygon[] = [];
            for (let i = 0; i < points.length - 2; i++) {
              result.push(
                new Polygon(
                  points.slice(i, i + 3),
                  { x: 0, y: 0 },
                  object.color
                )
              );
            }
            return result;
          });
      })
      .flatMap((e) => e);

    projectedPolygons.forEach((polygon) => polygon.draw(this.context));
  }
}
