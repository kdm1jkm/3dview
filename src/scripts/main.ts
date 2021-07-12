import * as math from "mathjs";
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
    new Object3D(
      [
        [
          { x: 10, y: 70, z: 60 },
          { x: 20, y: 70, z: 60 },
          { x: 10, y: 70, z: 70 },
          { x: 20, y: 70, z: 70 },
          { x: 10, y: 60, z: 60 },
          { x: 20, y: 60, z: 60 },
          { x: 10, y: 60, z: 70 },
          { x: 20, y: 60, z: 70 },
          { x: 10, y: 60, z: 60 },
          { x: 10, y: 60, z: 60 },
          { x: 10, y: 70, z: 70 },
          { x: 10, y: 70, z: 70 },
        ],
      ],
      "red"
    ),
    new Object3D(
      [
        [
          { x: -10, y: 70, z: 60 },
          { x: -20, y: 70, z: 60 },
          { x: -10, y: 70, z: 70 },
          { x: -20, y: 70, z: 70 },
          { x: -10, y: 60, z: 60 },
          { x: -20, y: 60, z: 60 },
          { x: -10, y: 60, z: 70 },
          { x: -20, y: 60, z: 70 },
          { x: -10, y: 70, z: 60 },
          { x: -10, y: 70, z: 70 },
          { x: -20, y: 70, z: 60 },
          { x: -20, y: 70, z: 70 },
          { x: -10, y: 60, z: 60 },
          { x: -10, y: 60, z: 70 },
          { x: -20, y: 60, z: 70 },
          { x: -20, y: 60, z: 60 },
        ],
      ],
      "blue"
    ),
  ];

  constructor() {
    document.body.appendChild(this.canvas);
    this.canvas.innerText = "이 기기는 지원되지 않습니다.";
    this.resizeCanvas();

    this.registerEventListener();

    let lastTime = Date.now();
    setInterval(() => {
      const elapsed = Date.now() - lastTime;
      lastTime = Date.now();

      let velocityX = 0;
      let velocityY = 0;
      let velocityZ = 0;

      if (this.pressingKey.has("w")) velocityZ += 1;
      if (this.pressingKey.has("s")) velocityZ -= 1;
      if (this.pressingKey.has("a")) velocityX -= 1;
      if (this.pressingKey.has("d")) velocityX += 1;
      if (this.pressingKey.has(" ")) velocityY += 1;
      if (this.pressingKey.has("shift")) velocityY -= 1;

      const rotated = math
        .multiply(
          Camera.getRotateMatrix({ v: 0, h: this.camera.tilt.h }),
          math.matrix([velocityX, 0, velocityZ, 1])
        )
        .toJSON().data;

      this.camera.position.x += rotated[0] * elapsed * 0.1;
      this.camera.position.z += rotated[2] * elapsed * 0.1;
      this.camera.position.y += velocityY * elapsed * 0.1;

      this.camera.position = this.camera.position;

      this.camera.draw(...this.objects);
    });
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
      if (this.pressingKey.has("escape")) return;
      const deltaX = (e.movementX / 200) * -1;
      const deltaY = e.movementY / 200;

      this.camera.tilt.h += deltaX;
      if (this.camera.tilt.h > 2 * Math.PI) this.camera.tilt.h -= Math.PI * 2;
      if (this.camera.tilt.h < 0) this.camera.tilt.h += Math.PI * 2;
      this.camera.tilt.v += deltaY;
      this.camera.tilt.v = Math.min(this.camera.tilt.v, Math.PI / 2);
      this.camera.tilt.v = Math.max(this.camera.tilt.v, -Math.PI / 2);

      this.camera.tilt = this.camera.tilt;
    });

    document.addEventListener("keydown", (e) => {
      this.pressingKey.add(e.key.toLowerCase());
      if (e.key === "r") this.camera.reverse *= -1;
    });

    document.addEventListener("keyup", (e) => {
      this.pressingKey.delete(e.key.toLowerCase());
    });
  }

  private resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.camera.screen = {
      width: this.canvas.width,
      height: this.canvas.height,
    };
    this.camera.draw(...this.objects);
  }

  draw(...objects: Drawable[]) {
    objects.forEach((o) => o.draw(this.context));
  }
}
