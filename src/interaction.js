import { fabric } from 'fabric'
import { BACKGROUND_COLOR, DATE_ORIGIN, DATE_SCALE_FACTOR, DATE_SCALE_UNIT, GRID_COLOR, LANE_HEIGHT } from './constants'
import * as chroma from 'chroma-js'

export class Interactions {

  constructor (canvas) {
    this._canvas = canvas
  }

  addAll () {
    this.supportResizing()
    this.addWheel()
    this.addHover()
    this.addTooltips()
    this.addWikipediaLinks()
  }

  supportResizing () {
    const canvas = this._canvas
    window.onresize = function () {
      canvas.setDimensions({width: window.innerWidth - 20, height: 2000})
    }
  }

  addWheel () {
    const canvas = this._canvas
    this._canvas.on('mouse:wheel', function (opt) {
      if (opt.e.ctrlKey) {
        const delta = opt.e.deltaY
        let zoom = canvas.getZoom()
        zoom = Math.min(Math.max(zoom + delta / 500, 0.2), 2)
        canvas.zoomToPoint({x: opt.e.offsetX, y: opt.e.offsetY}, zoom)
      } else {
        canvas.relativePan({x: opt.e.deltaY * 5, y: 0})
      }
      opt.e.preventDefault()
      opt.e.stopPropagation()
    })
  }

  addHover () {
    const canvas = this._canvas
    const lineId = 'mouseline'

    this._canvas.on('mouse:move', function (options) {
      canvas.remove(canvas.getItem(lineId))

      const p = canvas.getPointer(options.e)

      const line = new fabric.Line(
        [
          p.x,
          0,
          p.x,
          canvas.height
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

      canvas.add(mouseLine)
      mouseLine.moveTo(251)
    })
  }

  addTooltips () {
    const canvas = this._canvas
    this._canvas.on('mouse:over', function (e) {

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
          }
        )

        const tooltipBackground = new fabric.Rect({
          fill: chroma(e.target.color).brighten(3).hex(),
          stroke: chroma(e.target.color).hex(),
          strokeWidth: 1,
          width: tooltipText.width,
          height: tooltipText.height
        })

        const tooltip = new fabric.Group([tooltipBackground, tooltipText], {
          left: p.x,
          top: p.y - 5,
          originX: 'center',
          originY: 'bottom',
          id: 'tooltip'
        })

        canvas.add(tooltip)
      }
      canvas.renderAll()
    })

    this._canvas.on('mouse:out', function (e) {
      canvas.remove(canvas.getItem('tooltip'))
      canvas.renderAll()
    })
  }

  addWikipediaLinks () {
    this._canvas.on('mouse:down', function (event) {
      if (event.target && event.target.url) {
        window.open(event.target.url)
      }
    })
  }
}
