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
import * as chroma from 'chroma-js'

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
    const renderer = this._renderer
    this._renderer.canvas.on('mouse:wheel', function (opt) {
      if (opt.e.ctrlKey) {
        const delta = opt.e.deltaY
        let zoom = renderer.canvas.getZoom()
        zoom = Math.min(Math.max(zoom + delta/20, 0.5), 3)
        renderer.canvas.zoomToPoint({x: opt.e.offsetX, y: opt.e.offsetY}, zoom)

        let original_viewportTransform = this.viewportTransform
        if (original_viewportTransform[5] >= 0) {
          this.viewportTransform[5] = 0
        } else if (Math.ceil(original_viewportTransform[5]) < Math.floor(renderer.canvas.getHeight() - canvasHeight() * zoom)) {
          this.viewportTransform[5] = renderer.canvas.getHeight() - canvasHeight() * zoom
        }

        renderer.renderGrid()
      } else {
        renderer.canvas.relativePan({x: opt.e.deltaY * 5, y: 0})
      }
      renderer.canvas.requestRenderAll()
      opt.e.preventDefault()
      opt.e.stopPropagation()
    })
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
}
