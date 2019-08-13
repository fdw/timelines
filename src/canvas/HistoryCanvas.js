import { fabric } from 'fabric'
import {
  BACKGROUND_COLOR,
  DATE_ORIGIN,
  DATE_SCALE_FACTOR,
  DATE_SCALE_UNIT,
  FIRST_TICK,
  GRID_COLOR,
  LANE_HEIGHT,
  LAST_TICK
} from './Properties'
import moment from 'moment'
import { RenderableFacet } from '../renderers/RenderableFacet'

export class HistoryCanvas {
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

    this._initializeCanvas()
  }

  _initializeCanvas () {
    this.canvas = new fabric.Canvas('canvas')
    this.canvas.setDimensions({width: window.innerWidth, height: window.innerHeight})
    this.canvas.hoverCursor = 'default'
    this.canvas.selection = false
    this.canvas.absolutePan({x: HistoryCanvas.calculateAbsoluteX(moment('1500-01-01', 'Y-MM-DD')), y: 0})
    this.canvas.renderOnAddRemove = false
  }

  render (facets) {
    this.renderGrid()
    this._renderData(facets)
    this.canvas.requestRenderAll()
  }

  renderGrid () {
    this.canvas.remove(...this._ticks)
    this._ticks.length = 0

    for (let currentTick = FIRST_TICK.clone(); currentTick.isBefore(LAST_TICK); currentTick.add(this._periodBetweenTicks())) {
      const x = HistoryCanvas.calculateAbsoluteX(currentTick)
      const line = new fabric.Line(
        [
          x,
          -this.canvas.viewportTransform[5] / this.canvas.viewportTransform[3],
          x,
          (-this.canvas.viewportTransform[5] + window.innerHeight) / this.canvas.viewportTransform[3]
        ],
        {
          stroke: GRID_COLOR.hex(),
          strokeWidth: 1
        })

      const label = new fabric.Textbox(
        currentTick.format('YYYY'),
        {
          left: x,
          top: (-this.canvas.viewportTransform[5] + window.innerHeight - LANE_HEIGHT) / this.canvas.viewportTransform[3],
          originX: 'center',
          originY: 'center',
          fontSize: (LANE_HEIGHT - 4) / this.canvas.viewportTransform[3],
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
    return moment.duration(25 / this.canvas.getZoom(), 'y')
  }

  tickCount () {
    return this._ticks.length - 1
  }

  _renderData (facets) {
    facets.reduce((offset, facet) => new RenderableFacet(this.canvas, facet).render(offset), 0)

    this.canvas.renderAll()
  }

  static calculateAbsoluteX (date) {
    return HistoryCanvas.calculateRelativeX(DATE_ORIGIN.clone(), date)
  }

  static calculateRelativeX (start, end) {
    return end.diff(start, DATE_SCALE_UNIT) / DATE_SCALE_FACTOR
  }
}
