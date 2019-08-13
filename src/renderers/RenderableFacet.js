import { Renderer } from './Renderer'
import { Person } from '../models/Person'
import { Event } from '../models/Event'
import { RenderablePerson } from './RenderablePerson'
import { RenderableEvent } from './RenderableEvent'
import { RenderableEra } from './RenderableEra'
import { Lanes } from '../RenderClasses'

export class RenderableFacet extends Renderer {
  constructor (canvas, facet) {
    super(canvas)

    this.name = facet.name
    this.eras = facet.eras.sort((one, two) => one.orderByStart(two))

    this.lanes = new Lanes()
    const objects = facet.people
      .concat(facet.events)
      .sort((one, two) => one.orderByStart(two))
    this.lanes.addObjects(
      objects
    )

    this.basecolor = facet.basecolor
  }

  render (offset) {
    this.eras.forEach(era =>
      new RenderableEra(this.canvas, era).render(offset, this.lanes.size() * (this.LANE_HEIGHT + this.LANE_PADDING), this.basecolor)
    )

    offset += this.LANE_PADDING / 2
    this.lanes.getLanes().forEach(lane => {
      lane.forEach(object => {
        switch (true) {
          case object instanceof Person:
            new RenderablePerson(this.canvas, object).render(offset, this.basecolor)
            break
          case object instanceof Event:
            new RenderableEvent(this.canvas, object).render(offset, this.basecolor)
            break
        }
      })
      offset += this.LANE_HEIGHT + this.LANE_PADDING
    })

    return offset - this.LANE_PADDING / 2
  }
}
