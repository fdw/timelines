import { fabric } from 'fabric'
import {
  BACKGROUND_COLOR,
  canvasHeight,
  DATE_ORIGIN,
  DATE_SCALE_FACTOR,
  DATE_SCALE_UNIT,
  FIRST_TICK,
  GRID_COLOR,
  LANE_HEIGHT,
  LANE_PADDING,
  LAST_TICK,
  viewHeight,
  viewWidth
} from './constants'
import * as chroma from 'chroma-js'
import moment from 'moment'
import { Person } from './HistoryClasses'

export class HistoryRenderer {
  constructor () {
    fabric.Object.prototype.selectable = false
    fabric.Textbox.prototype.editable = false
    fabric.Textbox.prototype.fontFamily = 'sans'

    fabric.Canvas.prototype.getItem = function (id) {
      for (let i = 0, len = this.size(); i < len; i++) {
        if (this.getObjects()[i].id && this.getObjects()[i].id === id) {
          return this.getObjects()[i]
        }
      }
    }

    this._ticks = []

    this.initializeCanvas()
    this.renderGrid()
    this.canvas.requestRenderAll()
  }

  initializeCanvas () {
    this.canvas = new fabric.Canvas('canvas')
    this.canvas.setDimensions({width: viewWidth(), height: canvasHeight()})
    this.canvas.hoverCursor = 'default'
    this.canvas.selection = false
    this.canvas.absolutePan({x: HistoryRenderer.calculateAbsoluteX(moment('1500-01-01', 'Y-MM-DD')), y: 0})
    this.canvas.renderOnAddRemove = false
  }

  renderGrid () {
    this.canvas.remove(...this._ticks)
    this._ticks.length = 0

    for (let currentTick = FIRST_TICK.clone(); currentTick.isBefore(LAST_TICK); currentTick.add(this._periodBetweenTicks(), 'Y')) {
      const x = HistoryRenderer.calculateAbsoluteX(currentTick)
      const line = new fabric.Line(
        [
          x,
          -this.canvas.viewportTransform[5] / this.canvas.getZoom(),
          x,
          (-this.canvas.viewportTransform[5] + viewHeight()) / this.canvas.getZoom()
        ],
        {
          stroke: GRID_COLOR.hex(),
          strokeWidth: 1
        })

      const label = new fabric.Textbox(
        currentTick.format('YYYY'),
        {
          left: x,
          top: (-this.canvas.viewportTransform[5] + viewHeight() - LANE_HEIGHT) / this.canvas.getZoom(),
          originX: 'center',
          originY: 'center',
          fontSize: (LANE_HEIGHT - 4) / this.canvas.getZoom(),
          textAlign: 'center',
          strokeWidth: 0,
          fill: GRID_COLOR.hex(),
          textBackgroundColor: BACKGROUND_COLOR.hex()
        }
      )

      const gridline = new fabric.Group([line, label])
      this.canvas.insertAt(gridline, 1, false)
      this._ticks.push(gridline)
    }
  }

  _periodBetweenTicks () {
    return 25 / this.canvas.getZoom()
  }

  tickCount () {
    return this._ticks.length - 1
  }

  renderData (facets) {
    let offset = 0
    for (let facetName in facets) {
      const facet = facets[facetName]
      offset = this.renderFacet(facet, offset)
    }

    this.canvas.renderAll()
  }

  renderFacet (facet, offset) {
    for (let eraName in facet.eras) {
      this.renderEra(facet.eras[eraName], offset, facet.lanes.size() * (LANE_HEIGHT + LANE_PADDING), facet.basecolor)
    }

    offset += LANE_PADDING / 2
    for (let laneIndex in facet.lanes.getLanes()) {
      const lane = facet.lanes.getLane(laneIndex)
      for (let object in lane) {
        if (lane[object] instanceof Person) {
          this.renderPerson(lane[object], offset, facet.basecolor)
        } else {
          this.renderEvent(lane[object], offset, facet.basecolor)
        }
      }
      offset += LANE_HEIGHT + LANE_PADDING
    }
    return offset - LANE_PADDING / 2
  }

  renderEra (era, offset, height, color) {
    const left = HistoryRenderer.calculateAbsoluteX(era.start)
    const width = HistoryRenderer.calculateRelativeX(era.start, era.end)

    const rect = new fabric.Rect({
      fill: color.brighten(0.2).alpha(0.1).hex(),
      stroke: color.brighten(0.1).alpha(0.3).hex(),
      strokeWidth: 2,
      left: left,
      width: width,
      top: offset,
      height: height
    })

    const min_era_width_for_horizontal = HistoryRenderer.calculateRelativeX(moment('0001-01-01', 'Y_MM_DD'), moment('00026-01-01', 'Y-MM-DD'))
    const isWideEnough = width > min_era_width_for_horizontal
    const label = new fabric.Textbox(
      era.name,
      {
        left: left + width / 2,
        width: isWideEnough ? 500 : height,
        top: offset + height / 2,
        originX: 'center',
        originY: 'center',
        angle: isWideEnough ? 0 : 270,
        fontSize: LANE_HEIGHT,
        textAlign: 'center',
        strokeWidth: 0,
        fill: chroma('darkgray').hex()
      }
    )

    const eraGlyph = new fabric.Group([rect, label])

    this.canvas.add(eraGlyph)
  }

  renderPerson (person, offset, color) {
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
      events.push(this.renderPersonEvent(person.events[event], offset, color))
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
      tooltipText: this.buildPersonTooltip(person),
      color: color.hex(),
      url: person.url
    })

    this.canvas.add(personGlyph)
  }

  renderPersonEvent (event, offset, color) {
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

  buildPersonTooltip (person) {
    const events = person.events.length > 0 ? '\n' + person.events.map(it => it.name + ' (' + it.date.format('YYYY') + ')').join(', ') : ''
    return `${person.name}\n${person.birth.format('YYYY')} - ${person.death.format('YYYY')}${events}`
  }

  renderEvent (event, offset, color) {
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

  static calculateAbsoluteX (date) {
    return HistoryRenderer.calculateRelativeX(DATE_ORIGIN.clone(), date)
  }

  static calculateRelativeX (start, end) {
    return end.diff(start, DATE_SCALE_UNIT) / DATE_SCALE_FACTOR
  }

}
