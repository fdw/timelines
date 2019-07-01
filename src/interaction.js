import { fabric } from 'fabric'
import {
  BACKGROUND_COLOR,
  canvasHeight,
  DATE_ORIGIN,
  DATE_SCALE_FACTOR,
  DATE_SCALE_UNIT,
  GRID_COLOR,
  LANE_HEIGHT,
  viewWidth,
} from './constants'
import chroma from 'chroma-js'

export class Interactions {

  constructor (renderer) {
    this._renderer = renderer
  }

  addAll () {
    this.supportResizing()
    this.addWheel()
    this.addHover()
    this.addTooltips()
    this.addWikipediaLinks()
    this.addKeyboardControl()
  }

  supportResizing () {
    const renderer = this._renderer
    window.onresize = function () {
      renderer.canvas.setDimensions({width: viewWidth(), height: canvasHeight()})
      renderer.renderGrid()
      renderer.canvas.requestRenderAll()
    }
  }

  addWheel () {
    const that = this
    this._renderer.canvas.on('mouse:wheel', function (opt) {
      if (opt.e.ctrlKey) {
        that._relativeZoom(opt.e.deltaY / 20, {x: opt.e.offsetX, y: opt.e.offsetY})
      } else {
        that._pan(opt.e.deltaY * 5)
      }
      opt.e.preventDefault()
      opt.e.stopPropagation()
    })
  }

  _pan (amount) {
    this._renderer.canvas.relativePan({x: -amount, y: 0})
    this._renderer.canvas.requestRenderAll()
  }

  _relativeZoom (delta, point) {
    this._absoluteZoom(this._calculateAbsoluteZoom(delta), point)
  }

  _calculateAbsoluteZoom (delta) {
    let zoom = this._renderer.canvas.getZoom()
    return Math.min(Math.max(zoom + delta, 0.5), 3)
  }

  _absoluteZoom (absoluteZoom, point) {
    this._renderer.canvas.zoomToPoint(point, absoluteZoom)

    let original_viewportTransform = this._renderer.canvas.viewportTransform
    if (original_viewportTransform[5] >= 0) {
      this._renderer.canvas.viewportTransform[5] = 0
    } else if (Math.ceil(original_viewportTransform[5]) < Math.floor(this._renderer.canvas.getHeight() - canvasHeight() * absoluteZoom)) {
      this._renderer.canvas.viewportTransform[5] = this._renderer.canvas.getHeight() - canvasHeight() * absoluteZoom
    }

    this._renderer.renderGrid()
    this._renderer.canvas.requestRenderAll()
  }

  addHover () {
    const renderer = this._renderer
    const lineId = 'mouseline'

    this._renderer.canvas.on('mouse:move', function (options) {
      renderer.canvas.remove(renderer.canvas.getItem(lineId))

      const p = renderer.canvas.getPointer(options.e)

      const line = new fabric.Line(
        [
          p.x,
          0,
          p.x,
          renderer.canvas.height
        ],
        {
          stroke: GRID_COLOR.hex(),
          strokeWidth: 1
        })

      const label = new fabric.Textbox(
        DATE_ORIGIN.clone().add(p.x * DATE_SCALE_FACTOR, DATE_SCALE_UNIT).format('YYYY'),
        {
          left: p.x,
          top: window.innerHeight - LANE_HEIGHT,
          originX: 'center',
          originY: 'center',
          fontSize: LANE_HEIGHT - 4,
          textAlign: 'center',
          strokeWidth: 0,
          fill: GRID_COLOR.hex(),
          textBackgroundColor: BACKGROUND_COLOR.hex()
        }
      )

      const mouseLine = new fabric.Group([line, label], {id: lineId})

      renderer.canvas.add(mouseLine)
      mouseLine.moveTo(renderer.tickCount() + 1)
      renderer.canvas.requestRenderAll()
    })
  }

  addTooltips () {
    const canvas = this._renderer.canvas
    this._renderer.canvas.on('mouse:over', function (e) {

      if (e.target && e.target.tooltipText) {
        const p = canvas.getPointer(e)

        const tooltipText = new fabric.Textbox(
          e.target.tooltipText,
          {
            fontSize: LANE_HEIGHT - 7,
            textAlign: 'center',
            strokeWidth: 0,
            fill: 'black',
            width: 190,
            left: p.x,
            top: p.y - 7,
            originX: 'center',
            originY: 'bottom',
          }
        )

        const tooltipBackground = new fabric.Rect({
          fill: chroma(e.target.color).brighten(3).hex(),
          stroke: chroma(e.target.color).hex(),
          strokeWidth: 1,
          width: tooltipText.width,
          height: tooltipText.height + 2,
          left: p.x,
          top: p.y - 5,
          originX: 'center',
          originY: 'bottom',
        })

        if (p.y < tooltipText.height + 10) {
          tooltipText.setOptions(
            {
              originY: 'top',
              top: p.y + 15
            })
          tooltipBackground.setOptions(
            {
              originY: 'top',
              top: p.y + 13
            })
        }

        const tooltip = new fabric.Group([tooltipBackground, tooltipText], {id: 'tooltip'})

        canvas.add(tooltip)
      }
      canvas.requestRenderAll()
    })

    this._renderer.canvas.on('mouse:out', function (e) {
      canvas.remove(canvas.getItem('tooltip'))
      canvas.requestRenderAll()
    })
  }

  addWikipediaLinks () {
    this._renderer.canvas.on('mouse:down', function (event) {
      if (event.target && event.target.url) {
        window.open(event.target.url)
      }
    })
  }

  addKeyboardControl () {
    const that = this
    document.onkeydown = function (e) {
      switch (e.keyCode) {
        case 37:  // Left arrow
          that._pan(-30)
          break
        case 39:  // Right arrow
          that._pan(30)
          break
        case 38:  // Up arrow
          break
        case 40:  // Down arrow
          break
        case 107: // Plus
        case 171:
          that._relativeZoom(0.25, {x: 0, y: 0})
          break
        case 109: // Minus
        case 173:
          that._relativeZoom(-0.25, {x: 0, y: 0})
          break
        case 48:
        case 96:
          that._absoluteZoom(1, {x: 0, y: 0})
      }
    }
  }
}
