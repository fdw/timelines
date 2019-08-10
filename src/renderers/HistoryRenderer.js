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
  LAST_TICK,
  viewHeight,
  viewWidth
} from '../constants'
import moment from 'moment'
import { FacetRenderer } from './FacetRenderer'

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

    this._initializeCanvas()
  }

  render(facets) {
    this.renderGrid()
    this._renderData(facets)
    this.canvas.requestRenderAll()
  }

  _initializeCanvas () {
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
          -this.canvas.viewportTransform[5] / this.canvas.viewportTransform[3],
          x,
          (-this.canvas.viewportTransform[5] + viewHeight()) / this.canvas.viewportTransform[3]
        ],
        {
          stroke: GRID_COLOR.hex(),
          strokeWidth: 1
        })

      const label = new fabric.Textbox(
        currentTick.format('YYYY'),
        {
          left: x,
          top: (-this.canvas.viewportTransform[5] + viewHeight() - LANE_HEIGHT) / this.canvas.viewportTransform[3],
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
    return 25 / this.canvas.getZoom()
  }

  tickCount () {
    return this._ticks.length - 1
  }

  _renderData (facets) {
    let offset = 0
    for (let facetName in facets) {
      const facet = facets[facetName]
      offset = new FacetRenderer(this.canvas).render(facet, offset)
    }

    this.canvas.renderAll()
  }

  static calculateAbsoluteX (date) {
    return HistoryRenderer.calculateRelativeX(DATE_ORIGIN.clone(), date)
  }

  static calculateRelativeX (start, end) {
    return end.diff(start, DATE_SCALE_UNIT) / DATE_SCALE_FACTOR
  }
}
