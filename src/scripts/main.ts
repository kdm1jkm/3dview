import Camera from "./camera";
import Drawable from "./drawable";

export default class Main {
  private readonly canvas = document.createElement("canvas");
  private readonly context = this.canvas.getContext("2d");

  constructor() {
    document.body.appendChild(this.canvas);

    window.addEventListener("resize", (_) => {
      this.resizeCanvas();
    });

    this.resizeCanvas();

    this.canvas.addEventListener("mousedown", () => {
      console.log("Request PointerLock");
      this.canvas.requestPointerLock();
    });

    this.canvas.addEventListener("mousemove", (e) => {
      console.log(e.movementX, e.movementY);
    });

    const camera = new Camera(this.context, {width: this.canvas.width,height: this.canvas.height},{x:30,y:40,z:50},{v:Math.PI/3,h:Math.PI/6});
    camera.draw()
  }

  private resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  draw(...objects: Drawable[]) {
    objects.forEach((o) => o.draw(this.context));
  }
}
