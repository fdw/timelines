import { Parser } from '../parser'
import { Event } from './Event'
import { Renderable } from './Renderable'


export class Person extends Renderable {
  constructor ({
                 name,
                 birth,
                 death,
                 url,
                 events = [],
                 short_name = ''
               }) {
    super()
    this.name = name
    this.birth = Parser.parseDate(birth)
    this.death = Parser.parseDate(death)
    this.url = url
    this.events = events
      .map(it => { return it instanceof Event ? it : new Event(it) })
      .sort(function (one, two) {
        return one.left().isBefore(two.left()) ? -1
          : one.left().isAfter(two.left()) ? 1
            : 0
      })
    this.shortName = short_name === '' ? name : short_name
  }

  left () {
    return this.birth.clone()
  }

  right () {
    return this.death.clone()
  }
}
