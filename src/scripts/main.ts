import { fabric } from "fabric";

export default class Main {
  private readonly canvas = new fabric.StaticCanvas("canvas", {
    width: window.innerWidth,
    height: window.innerHeight,
  });
  private readonly canvasElement = this.canvas.getElement();

  constructor() {
    window.addEventListener("resize", (_) => {
      this.canvas.setWidth(window.innerWidth);
      this.canvas.setHeight(window.innerHeight);
    });

    this.canvasElement.addEventListener("mousedown", () => {
      console.log("Request PointerLock");
      this.canvasElement.requestPointerLock();
    });

    this.canvasElement.addEventListener("mousemove", (e) => {
      console.log(e.movementX, e.movementY);
    });

    this.canvas.backgroundColor = "";
  }
}
