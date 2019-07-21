import { fabric } from 'fabric'
import {
  BACKGROUND_COLOR,
  canvasHeight,
  DATE_ORIGIN,
  DATE_SCALE_FACTOR,
  DATE_SCALE_UNIT, FIRST_TICK,
  HOVER_COLOR,
  LANE_HEIGHT, LAST_TICK,
  viewHeight,
  viewWidth,
} from './constants'
import chroma from 'chroma-js'
import { HistoryRenderer } from './rendering'
import { clamp } from './Utils'

export class Interactions {

  constructor (renderer) {
    this.renderer = renderer
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
    const renderer = this.renderer
    window.onresize = function () {
      renderer.canvas.setDimensions({width: viewWidth(), height: canvasHeight()})
      renderer.renderGrid()
      renderer.canvas.requestRenderAll()
    }
  }

  addWheel () {
    const that = this
    this.renderer.canvas.on('mouse:wheel', function (opt) {
      if (opt.e.ctrlKey) {
        that._relativeZoom(opt.e.deltaY / 20, {x: opt.e.offsetX, y: opt.e.offsetY})
      } else {
        that._pan(opt.e.deltaY * 5, 0)
      }
      opt.e.preventDefault()
      opt.e.stopPropagation()
    })
  }

  _pan (amountHorizontal, amountVertical) {
    const newX = clamp(HistoryRenderer.calculateAbsoluteX(FIRST_TICK), +amountHorizontal - this.renderer.canvas.viewportTransform[4], HistoryRenderer.calculateAbsoluteX(LAST_TICK))
    const newY = clamp(0, +amountVertical - this.renderer.canvas.viewportTransform[5], 2* canvasHeight())

    this.renderer.canvas.absolutePan({
      x: newX,
      y: newY
    })
    if(newY > 0) {
      this.renderer.renderGrid()
    }
    this.renderer.canvas.requestRenderAll()
  }

  _relativeZoom (delta, point) {
    this._absoluteZoom(this._calculateAbsoluteZoom(delta), point)
  }

  _calculateAbsoluteZoom (delta) {
    let zoom = this.renderer.canvas.getZoom()
    return clamp(0.5, zoom + delta, 3)
  }

  _absoluteZoom (absoluteZoom, point) {
   this.renderer.canvas.zoomToPoint(point, absoluteZoom)

    let original_viewportTransform = this.renderer.canvas.viewportTransform
    if (original_viewportTransform[5] >= 0) {
      this.renderer.canvas.viewportTransform[5] = 0
    } else if (Math.ceil(original_viewportTransform[5]) < Math.floor(this.renderer.canvas.getHeight() - canvasHeight() * absoluteZoom)) {
      this.renderer.canvas.viewportTransform[5] = this.renderer.canvas.getHeight() - canvasHeight() * absoluteZoom
    }

    this.renderer.renderGrid()
    this.renderer.canvas.requestRenderAll()
  }

  addHover () {
    const that = this
    const lineId = 'mouseline'

    this.renderer.canvas.on('mouse:move', function (options) {
      that.renderer.canvas.remove(that.renderer.canvas.getItem(lineId))

      const p = that.renderer.canvas.getPointer(options.e)

      const line = new fabric.Line(
        [
          p.x,
          -that.renderer.canvas.viewportTransform[5] / that.renderer.canvas.viewportTransform[3],
          p.x,
          (-that.renderer.canvas.viewportTransform[5] + viewHeight()) / that.renderer.canvas.viewportTransform[3]
        ],
        {
          stroke: HOVER_COLOR,
          strokeWidth: 1
        })

      const label = new fabric.Textbox(
        DATE_ORIGIN.clone().add(p.x * DATE_SCALE_FACTOR, DATE_SCALE_UNIT).format('YYYY'),
        {
          left: p.x,
          top: (-that.renderer.canvas.viewportTransform[5] + viewHeight() - LANE_HEIGHT) / that.renderer.canvas.viewportTransform[3],
          originX: 'center',
          originY: 'center',
          fontSize: (LANE_HEIGHT - 4) / that.renderer.canvas.viewportTransform[3],
          textAlign: 'center',
          strokeWidth: 0,
          fill: HOVER_COLOR,
          textBackgroundColor: BACKGROUND_COLOR.hex()
        }
      )

      const mouseLine = new fabric.Group([line, label], {id: lineId})

      that.renderer.canvas.add(mouseLine)
      mouseLine.moveTo(that.renderer.tickCount() + 1)
      that.renderer.canvas.requestRenderAll()
    })
  }

  addTooltips () {
    const canvas = this.renderer.canvas
    this.renderer.canvas.on('mouse:over', function (e) {

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

    this.renderer.canvas.on('mouse:out', function (e) {
      canvas.remove(canvas.getItem('tooltip'))
      canvas.requestRenderAll()
    })
  }

  addWikipediaLinks () {
    this.renderer.canvas.on('mouse:down', function (event) {
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
          that._pan(-30, 0)
          break
        case 39:  // Right arrow
          that._pan(30, 0)
          break
        case 38:  // Up arrow
          that._pan(0, -30)
          break
        case 40:  // Down arrow
          that._pan(0, 30)
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
