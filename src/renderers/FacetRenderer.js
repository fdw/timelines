import { Renderer } from './Renderer'
import { LANE_HEIGHT, LANE_PADDING } from '../constants'
import { Person } from '../models/Person'
import { Event } from '../models/Event'
import { PersonRenderer} from './PersonRenderer'
import { EventRenderer} from './EventRenderer'
import { EraRenderer } from './EraRenderer'

export class FacetRenderer extends Renderer {
  constructor (canvas) {
    super(canvas)
  }

  render (facet, offset) {
    for (let eraName in facet.eras) {
      new EraRenderer(this.canvas).render(facet.eras[eraName], offset, facet.lanes.size() * (LANE_HEIGHT + LANE_PADDING), facet.basecolor)
    }

    offset += LANE_PADDING / 2
    for (let laneIndex in facet.lanes.getLanes()) {
      const lane = facet.lanes.getLane(laneIndex)
      for (let object in lane) {
        switch (true) {
          case lane[object] instanceof Person:
            new PersonRenderer(this.canvas).render(lane[object], offset, facet.basecolor)
            break
          case lane[object] instanceof Event:
            new EventRenderer(this.canvas).render(lane[object], offset, facet.basecolor)
            break
        }
      }
      offset += LANE_HEIGHT + LANE_PADDING
    }
    return offset - LANE_PADDING / 2
  }

}
