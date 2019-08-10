import { Renderer } from './Renderer'
import { fabric } from 'fabric'
import { LANE_HEIGHT } from '../constants'
import chroma from 'chroma-js'
import { HistoryRenderer } from './HistoryRenderer'

export class PersonRenderer extends Renderer {
  constructor (canvas) {
    super(canvas)
  }

  render(person, offset, color) {
    const left = HistoryRenderer.calculateAbsoluteX(person.birth)
    const width = HistoryRenderer.calculateRelativeX(person.birth, person.death)

    const rect = new fabric.Rect({
      fill: color.hex(),
      left: left,
      width: width,
      top: offset,
      height: LANE_HEIGHT,
    })

    let events = []
    for (let event in person.events) {
      events.push(this._renderNestedEvent(person.events[event], offset, color))
    }

    const textColor = color.luminance() > 0.4 ? chroma('black').hex() : chroma('white').hex()
    const label = new fabric.Textbox(
      person.shortName,
      {
        left: left + width / 2,
        width: width,
        top: offset + LANE_HEIGHT / 2,
        originX: 'center',
        originY: 'center',
        fontSize: LANE_HEIGHT - 6,
        textAlign: 'center',
        strokeWidth: 0,
        fill: textColor
      }
    )

    const personGlyph = new fabric.Group([rect, ...events, label], {
      tooltipText: this._buildPersonTooltip(person),
      color: color.hex(),
      url: person.url
    })

    this.canvas.add(personGlyph)
  }

  _renderNestedEvent (event, offset, color) {
    const left = HistoryRenderer.calculateAbsoluteX(event.date)
    return new fabric.Circle({
      fill: color.darken(0.3).hex(),
      left: left,
      top: offset + LANE_HEIGHT / 2,
      originY: 'center',
      originX: 'center',
      radius: LANE_HEIGHT * 3 / 8,
      strokeWidth: 1,
      stroke: color.darken(0.9).hex()
    })
  }

  _buildPersonTooltip (person) {
    const events = person.events.length > 0 ? '\n' + person.events.map(it => it.name + ' (' + it.date.format('YYYY') + ')').join(', ') : ''
    return `${person.name}\n${person.birth.format('YYYY')} - ${person.death.format('YYYY')}${events}`
  }

}
