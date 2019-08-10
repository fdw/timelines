import { Renderer } from './Renderer'
import { fabric } from 'fabric'
import { LANE_HEIGHT } from '../constants'
import { HistoryRenderer } from './HistoryRenderer'

export class EventRenderer extends Renderer {
  constructor (canvas) {
    super(canvas)
  }

  render(event, offset, color) {
    const left = HistoryRenderer.calculateAbsoluteX(event.date)
    const circle = new fabric.Circle({
      fill: color.hex(),
      left: left,
      top: offset,
      originX: 'center',
      radius: LANE_HEIGHT / 2,
      tooltipText: `${event.name}\n${event.date.format('YYYY')}`,
      color: color.hex(),
      url: event.url
    })

    this.canvas.add(circle)
  }

}
