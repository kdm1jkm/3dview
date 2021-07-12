import { Pos2, Pos3 } from "./commons";
import Object3D from "./object3d";
import * as math from "mathjs";
import Polygon from "./polygon";

export default class Camera {
  public get screen(): { width: number; height: number } {
    return this._screen;
  }
  public set screen(value: { width: number; height: number }) {
    this._screen = value;
    this.screenMat = math.matrix([
      [value.width / this.k, 0, value.width / 2, 0],
      [0, -value.width / this.k, value.height / 2, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ]);
  }
  public get FOV(): number {
    return this._FOV;
  }
  public set FOV(value: number) {
    this._FOV = value;
    this.k = 2 * Math.tan(value / 2);
    this.screenMat = math.matrix([
      [this.screen.width / value, 0, this.screen.width / 2, 0],
      [0, -this.screen.width / value, this.screen.height / 2, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ]);
  }
  public get position(): Pos3 {
    return this._position;
  }
  public set position(value: Pos3) {
    this._position = value;
    this.transform = math.matrix([
      [1, 0, 0, -value.x],
      [0, 1, 0, -value.y],
      [0, 0, 1, -value.z],
      [0, 0, 0, 1],
    ]);
  }
  public get tilt(): { v: number; h: number } {
    return this._tilt;
  }
  public set tilt(value: { v: number; h: number }) {
    this._tilt = value;
    this.rotate = Camera.getRotateMatrix({ v: -value.v, h: -value.h });
  }
  // tilt h -> Degree of Horizontal Tiltrated
  //      v -> Degree of Vertical Tiltrated
  constructor(
    public context: CanvasRenderingContext2D,
    private _screen: { width: number; height: number },
    private _position: Pos3 = { x: 0, y: 0, z: 0 },
    private _tilt: { v: number; h: number } = { v: 0, h: 0 },
    private _FOV: number = Math.PI / 2
  ) {}

  public static getRotateMatrix(tilt: { v: number; h: number }) {
    return math.matrix([
      [Math.cos(tilt.h), 0, -Math.sin(tilt.h), 0],
      [
        -Math.sin(tilt.h) * Math.sin(tilt.v),
        Math.cos(tilt.v),
        -Math.cos(tilt.h) * Math.sin(tilt.v),
        0,
      ],
      [
        Math.sin(tilt.h) * Math.cos(tilt.v),
        Math.sin(tilt.v),
        Math.cos(tilt.h) * Math.cos(tilt.v),
        0,
      ],
      [0, 0, 0, 1],
    ]);
  }

  private rotate: math.Matrix = Camera.getRotateMatrix({
    v: -this.tilt.v,
    h: -this.tilt.h,
  });

  private transform = math.matrix([
    [1, 0, 0, -this.position.x],
    [0, 1, 0, -this.position.y],
    [0, 0, 1, -this.position.z],
    [0, 0, 0, 1],
  ]);

  private k = 2 * Math.tan(this.FOV / 2);
  private screenMat = math.matrix([
    [this.screen.width / this.k, 0, this.screen.width / 2, 0],
    [0, -this.screen.width / this.k, this.screen.height / 2, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ]);

  private reverse = -1;

  public draw(...objects: Object3D[]) {
    this.context.fillStyle = "white";
    this.context.fillRect(0, 0, this.screen.width, this.screen.height);

    const transform = this.transform;
    const rotate = this.rotate;
    const screenMat = this.screenMat;

    const mat = math.multiply(screenMat, math.multiply(rotate, transform));

    const projectedPolygons = objects.flatMap((object) => {
      return object.points
        .map((p) =>
          p.map((point): Pos3 => {
            const result = math
              .multiply(mat, math.matrix([point.x, point.y, point.z, 1]))
              .toJSON().data;

            if (result[2] < 0) return { x: NaN, y: NaN, z: NaN };

            return {
              x: result[0] / result[3] / result[2],
              y: result[1] / result[3] / result[2],
              z: result[2] / result[3],
            };
          })
        )
        .flatMap((points) => {
          const result: [Pos3, Pos3, Pos3][] = [];
          for (let i = 0; i < points.length - 2; i++) {
            result.push([points[i], points[i + 1], points[i + 2]]);
          }
          return result;
        })
        .map((p) => {
          return { points: p, color: object.color };
        });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "r") {
        this.reverse *= -1;
      }
    });

    projectedPolygons
      .sort((p1, p2) => {
        return (
          this.reverse *
          (p1.points[0].z +
            p1.points[1].z +
            p1.points[2].z -
            p2.points[0].z -
            p2.points[1].z -
            p2.points[1].z)
        );
      })
      .map((p) => {
        return new Polygon(
          [p.points[0], p.points[1], p.points[2]],
          { x: 0, y: 0 },
          p.color
        );
      })
      .forEach((p) => {
        p.draw(this.context);
      });
  }
}
