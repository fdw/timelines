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
    return this._lanes[index][this._lanes[index].length - 1].right()
  }

  findLaneEndingBefore (date) {
    for (let lane in Object.keys(this._lanes)) {
      if (this.laneEnd(lane).add(3, 'Y').isBefore(date)) {
        return lane
      }
    }
    return this.addLane()
  }

  addObject (object) {
    const laneIndex = this.findLaneEndingBefore(object.left())
    this._lanes[laneIndex].push(object)
  }

  addObjects (objects) {
    objects.forEach(it => this.addObject(it))
  }

  getLanes () {
    return Object.values(this._lanes)
  }
}

