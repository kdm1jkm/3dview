import Camera from "./camera";
import Drawable from "./drawable";
import Object3D from "./object3d";

export default class Main {
  private readonly canvas = document.createElement("canvas");
  private readonly context = this.canvas.getContext("2d");

  private readonly pressingKey: Set<string> = new Set();

  private readonly camera = new Camera(
    this.context,
    { width: this.canvas.width, height: this.canvas.height },
    { x: 15, y: 40, z: 20 },
    { v: (0 / 180) * Math.PI, h: (0 / 180) * Math.PI }
  );

  private readonly objects = [
    new Object3D(
      [
        [
          { x: 10, y: 50, z: 60 },
          { x: 20, y: 50, z: 60 },
          { x: 10, y: 50, z: 70 },
          { x: 20, y: 50, z: 70 },
        ],
      ],
      "#000000"
    ),
    new Object3D(
      [
        [
          { x: 50, y: 30, z: 10 },
          { x: 50, y: 30, z: 30 },
          { x: 50, y: 47.32, z: 20 },
        ],
      ],
      "#333333"
    ),
  ];

  constructor() {
    document.body.appendChild(this.canvas);
    this.resizeCanvas();

    this.registerEventListener();
  }

  private registerEventListener() {
    window.addEventListener("resize", (_) => {
      this.resizeCanvas();
    });

    this.canvas.addEventListener("mousedown", () => {
      console.log("Request PointerLock");
      this.canvas.requestPointerLock();
    });

    this.canvas.addEventListener("mousemove", (e) => {
      if (document.pointerLockElement !== this.canvas) return;
      const deltaX = (e.movementX / 100) * -1;
      const deltaY = e.movementY / 100;

      this.camera.tilt.h += deltaX;
      if (this.camera.tilt.h > 2 * Math.PI) this.camera.tilt.h -= Math.PI * 2;
      if (this.camera.tilt.h < 0) this.camera.tilt.h += Math.PI * 2;
      this.camera.tilt.v += deltaY;
      this.camera.tilt.v = Math.min(this.camera.tilt.v, Math.PI / 2);
      this.camera.tilt.v = Math.max(this.camera.tilt.v, -Math.PI / 2);

      console.log(
        (this.camera.tilt.h / Math.PI) * 180,
        (this.camera.tilt.v / Math.PI) * 180
      );

      this.camera.draw(...this.objects);
    });

    document.addEventListener("keydown", (e) => {
      this.pressingKey.add(e.key);
    });

    document.addEventListener("keyup", (e) => {
      this.pressingKey.delete(e.key);
    });
  }

  private resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.camera.screen = {
      width: this.canvas.width,
      height: this.canvas.height,
    };
  }

  draw(...objects: Drawable[]) {
    objects.forEach((o) => o.draw(this.context));
  }
}
