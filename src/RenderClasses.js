import * as chroma from 'chroma-js'

export class RenderableFacet {
  constructor(name, lanes, eras ){
    this.name = name
    this.lanes = lanes
    this.eras = eras
    this.basecolor = chroma('#005f69')
  }
}


export class Lanes {
  constructor () {
    this._lanes = {}
  }

  size () {
    return Object.keys(this._lanes).length
  }

  addLane () {
    this._lanes[this.size()] = []
    return this.size() - 1
  }

  laneEnd (index) {
    return this._lanes[index][this._lanes[index].length-1].end()
  }

  findLaneEndingBefore (date) {
    for (let lane in this._lanes) {
      if (this.laneEnd(lane).add(4, 'Y').isBefore(date)) {
        return lane
      }
    }
    return this.addLane()
  }

  addObject (object) {
    const laneIndex = this.findLaneEndingBefore(object.start())
    this._lanes[laneIndex].push(object)
  }

  addObjects(objects) {
    objects.forEach(it => this.addObject(it))
  }

  getLanes () {
    return Object.values(this._lanes)
  }

  getLane(index) {
    return this._lanes[index]
  }
}

