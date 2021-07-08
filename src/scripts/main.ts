import Drawable from "./drawable";

export default class Main {
  private readonly canvas = document.createElement("canvas");
  private readonly context = this.canvas.getContext("2d");

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
      console.log(e.movementX, e.movementY);
    });
  }

  private resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  draw(...objects: Drawable[]) {
    objects.forEach((o) => o.draw(this.context));
  }
}
