import { fabric } from 'fabric'
import chroma from 'chroma-js'
import { HistoryCanvas } from './HistoryCanvas'
import {
  BACKGROUND_COLOR,
  DATE_ORIGIN,
  DATE_SCALE_FACTOR,
  DATE_SCALE_UNIT,
  FIRST_TICK,
  HOVER_COLOR,
  LANE_HEIGHT,
  LAST_TICK
} from './Properties'

export class InteractiveCanvas extends HistoryCanvas {

  constructor () {
    super()

    this.supportResizing()
    this.addWheel()
    this.addHover()
    this.addTooltips()
    this.addWikipediaLinks()
    this.addKeyboardControl()
  }

  supportResizing () {
    const renderer = this
    window.onresize = function () {
      renderer.canvas.setDimensions({width: window.innerWidth, height: window.innerHeight})
      renderer.renderGrid()
      renderer.canvas.requestRenderAll()
    }
  }

  addWheel () {
    const that = this
    this.canvas.on('mouse:wheel', function (opt) {
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
    const newX = InteractiveCanvas.clamp(HistoryCanvas.calculateAbsoluteX(FIRST_TICK), amountHorizontal - this.canvas.viewportTransform[4], HistoryCanvas.calculateAbsoluteX(LAST_TICK))
    const newY = InteractiveCanvas.clamp(0, amountVertical - this.canvas.viewportTransform[5], 2 * window.innerHeight)

    this.canvas.absolutePan({
      x: newX,
      y: newY
    })
    if (newY > 0) {
      this.renderGrid()
    }
    this.canvas.requestRenderAll()
  }

  _relativeZoom (delta, point) {
    this._absoluteZoom(this._calculateAbsoluteZoom(delta), point)
  }

  _calculateAbsoluteZoom (delta) {
    let zoom = this.canvas.getZoom()
    return InteractiveCanvas.clamp(0.5, zoom + delta, 3)
  }

  _absoluteZoom (absoluteZoom, point) {
    this.canvas.zoomToPoint(point, absoluteZoom)

    let original_viewportTransform = this.canvas.viewportTransform
    if (original_viewportTransform[5] >= 0) {
      this.canvas.viewportTransform[5] = 0
    } else if (Math.ceil(original_viewportTransform[5]) < Math.floor(this.canvas.getHeight() - window.innerHeight * absoluteZoom)) {
      this.canvas.viewportTransform[5] = this.canvas.getHeight() - window.innerHeight * absoluteZoom
    }

    this.renderGrid()
    this.canvas.requestRenderAll()
  }

  addHover () {
    const that = this
    const lineId = 'mouseline'

    this.canvas.on('mouse:move', function (options) {
      that.canvas.remove(that.canvas.getItem(lineId))

      const p = that.canvas.getPointer(options.e)

      const line = new fabric.Line(
        [
          p.x,
          -that.canvas.viewportTransform[5] / that.canvas.viewportTransform[3],
          p.x,
          (-that.canvas.viewportTransform[5] + window.innerHeight) / that.canvas.viewportTransform[3]
        ],
        {
          stroke: HOVER_COLOR,
          strokeWidth: 1
        })

      const label = new fabric.Textbox(
        DATE_ORIGIN.clone().add(p.x * DATE_SCALE_FACTOR, DATE_SCALE_UNIT).format('YYYY'),
        {
          left: p.x,
          top: (-that.canvas.viewportTransform[5] + window.innerHeight - LANE_HEIGHT) / that.canvas.viewportTransform[3],
          originX: 'center',
          originY: 'center',
          fontSize: (LANE_HEIGHT - 4) / that.canvas.viewportTransform[3],
          textAlign: 'center',
          strokeWidth: 0,
          fill: HOVER_COLOR,
          textBackgroundColor: BACKGROUND_COLOR.hex()
        }
      )

      const mouseLine = new fabric.Group([line, label], {id: lineId})

      that.canvas.add(mouseLine)
      mouseLine.moveTo(that.tickCount() + 1)
      that.canvas.requestRenderAll()
    })
  }

  addTooltips () {
    const canvas = this.canvas
    this.canvas.on('mouse:over', function (e) {

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

    this.canvas.on('mouse:out', function () {
      canvas.remove(canvas.getItem('tooltip'))
      canvas.requestRenderAll()
    })
  }

  addWikipediaLinks () {
    this.canvas.on('mouse:down', function (event) {
      if (event.target && event.target.url) {
        window.open(event.target.url)
      }
    })
  }

  addKeyboardControl () {
    const that = this
    document.onkeydown = function (e) {
      switch (e.key) {
        case 'ArrowLeft':
          that._pan(-30, 0)
          break
        case 'ArrowRight':
          that._pan(30, 0)
          break
        case 'ArrowUp':
          that._pan(0, -30)
          break
        case 'ArrowDown':
          that._pan(0, 30)
          break
        case '+':
          that._relativeZoom(0.25, {x: 0, y: 0})
          break
        case '-':
          that._relativeZoom(-0.25, {x: 0, y: 0})
          break
        case '0':
          that._absoluteZoom(1, {x: 0, y: 0})
      }
    }
  }

  static clamp (min, value, max) {
    return Math.max(min, Math.min(max, value))
  }

}
