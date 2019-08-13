import { Orderable } from './Orderable'

export class Person extends Orderable {
  constructor (
    name,
    birth,
    death,
    url,
    events = [],
    short_name = ''
  ) {
    super()
    this.name = name
    this.birth = birth
    this.death = death
    this.url = url
    this.events = events
    this.shortName = short_name
  }

  left () {
    return this.birth.clone()
  }

  right () {
    return this.death.clone()
  }
}
