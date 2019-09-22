import {fabric} from "fabric";

export class Renderer {
  protected readonly canvas: fabric.Canvas;
  public readonly LANE_HEIGHT: number = 20;
  public readonly LANE_PADDING: number = 8;

  constructor (canvas) {
    this.canvas = canvas
  }

}
