import { Renderer } from './Renderer'
import { fabric } from 'fabric'
import { HistoryCanvas } from '../canvas/HistoryCanvas'

export class RenderableEvent extends Renderer {
  constructor (canvas, event) {
    super(canvas)

    this.name = event.name
    this.date = event.date
    this.url = event.url

    this.left = HistoryCanvas.calculateAbsoluteX(event.date)
  }

  render (offset, color) {
    const circle = new fabric.Circle({
      fill: color.hex(),
      left: this.left,
      top: offset,
      originX: 'center',
      radius: this.LANE_HEIGHT / 2,
      tooltipText: `${this.name}\n${this.date.format('YYYY')}`,
      color: color.hex(),
      url: this.url
    })

    this.canvas.add(circle)
  }

}
