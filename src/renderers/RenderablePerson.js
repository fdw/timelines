import { Renderer } from './Renderer'
import { fabric } from 'fabric'
import chroma from 'chroma-js'
import { HistoryCanvas } from '../canvas/HistoryCanvas'

export class RenderablePerson extends Renderer {
  constructor (canvas, person) {
    super(canvas)

    this.name = person.name
    this.birth = person.birth
    this.death = person.death
    this.events = person.events.sort((one, two) => one.orderByStart(two))
    this.shortName = person.shortName
    this.url = person.url

    this.left = HistoryCanvas.calculateAbsoluteX(person.birth)
    this.width = HistoryCanvas.calculateRelativeX(person.birth, person.death)

  }

  render (offset, color) {
    const rect = new fabric.Rect({
      fill: color.hex(),
      left: this.left,
      width: this.width,
      top: offset,
      height: this.LANE_HEIGHT,
    })

    const renderedEvents = this.events.map(it => this._renderNestedEvent(it, offset, color))

    const textColor = color.luminance() > 0.4 ? chroma('black').hex() : chroma('white').hex()
    const label = new fabric.Textbox(
      this.shortName,
      {
        left: this.left + this.width / 2,
        width: this.width,
        top: offset + this.LANE_HEIGHT / 2,
        originX: 'center',
        originY: 'center',
        fontSize: this.LANE_HEIGHT - 6,
        textAlign: 'center',
        strokeWidth: 0,
        fill: textColor
      }
    )

    const personGlyph = new fabric.Group([rect, ...renderedEvents, label], {
      tooltipText: this._buildPersonTooltip(),
      color: color.hex(),
      url: this.url
    })

    this.canvas.add(personGlyph)
  }

  _renderNestedEvent (event, offset, color) {
    return new fabric.Circle({
      fill: color.darken(0.3).hex(),
      left: HistoryCanvas.calculateAbsoluteX(event.date),
      top: offset + this.LANE_HEIGHT / 2,
      originY: 'center',
      originX: 'center',
      radius: this.LANE_HEIGHT * 3 / 8,
      strokeWidth: 1,
      stroke: color.darken(0.9).hex()
    })
  }

  _buildPersonTooltip () {
    const events = this.events.length > 0 ? '\n' + this.events.map(it => it.name + ' (' + it.date.format('YYYY') + ')').join(', ') : ''
    return `${this.name}\n${this.birth.format('YYYY')} - ${this.death.format('YYYY')}${events}`
  }

}
