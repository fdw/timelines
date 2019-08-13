import { Renderer } from './Renderer'
import { fabric } from 'fabric'
import moment from 'moment'
import chroma from 'chroma-js'
import { HistoryCanvas } from '../canvas/HistoryCanvas'

export class RenderableEra extends Renderer {

  constructor (canvas, era) {
    super(canvas)
    this.min_era_width_for_horizontal = HistoryCanvas.calculateRelativeX(moment('0001-01-01', 'Y_MM_DD'), moment('00031-01-01', 'Y-MM-DD'))

    this.name = era.name
    this.start = era.start
    this.end = era.end

    this.left = HistoryCanvas.calculateAbsoluteX(era.start)
    this.width = HistoryCanvas.calculateRelativeX(era.start, era.end)
  }

  render (offset, height, color) {
    const rect = new fabric.Rect({
      fill: color.brighten(0.2).alpha(0.1).hex(),
      stroke: color.brighten(0.1).alpha(0.3).hex(),
      strokeWidth: 2,
      left: this.left,
      width: this.width,
      top: offset,
      height: height
    })

    const isWideEnough = this.width > this.min_era_width_for_horizontal
    const label = new fabric.Textbox(
      this.name,
      {
        left: this.left + this.width / 2,
        width: isWideEnough ? Math.min(rect.width, 300) : height,
        top: offset + height / 2,
        originX: 'center',
        originY: 'center',
        angle: isWideEnough ? 0 : 270,
        fontSize: this.LANE_HEIGHT,
        textAlign: 'center',
        strokeWidth: 0,
        fill: chroma('darkgray').hex()
      }
    )

    const eraGlyph = new fabric.Group(
      [rect, label],
      {
        tooltipText: `${this.name}\n${this.start.format('YYYY')} - ${this.end.format('YYYY')}`,
        color: color.hex()
      }
    )

    const canvas = this.canvas
    eraGlyph.on('mouseover', function () {
      rect.setOptions({
        stroke: chroma('grey').hex(),
      })
      canvas.requestRenderAll()
    })

    eraGlyph.on('mouseout', function () {
      rect.setOptions({
        stroke: color.brighten(0.1).alpha(0.3).hex(),
      })
      canvas.requestRenderAll()
    })

    this.canvas.add(eraGlyph)
  }

}
