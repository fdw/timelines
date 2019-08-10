import { Renderer } from './Renderer'
import { fabric } from 'fabric'
import moment from 'moment'
import { LANE_HEIGHT } from '../constants'
import chroma from 'chroma-js'
import { HistoryRenderer } from './HistoryRenderer'

export class EraRenderer extends Renderer {
  constructor (canvas) {
    super(canvas)
  }

  render (era, offset, height, color) {
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

    const min_era_width_for_horizontal = HistoryRenderer.calculateRelativeX(moment('0001-01-01', 'Y_MM_DD'), moment('00031-01-01', 'Y-MM-DD'))
    const isWideEnough = width > min_era_width_for_horizontal
    const label = new fabric.Textbox(
      era.name,
      {
        left: left + width / 2,
        width: isWideEnough ? Math.min(rect.width, 300) : height,
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

    const eraGlyph = new fabric.Group(
      [rect, label],
      {
        tooltipText: `${era.name}\n${era.start.format('YYYY')} - ${era.end.format('YYYY')}`,
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
