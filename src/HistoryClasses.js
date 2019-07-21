import { Parser } from './parser'
import { FIRST_TICK } from './constants'

export class Facet {
  constructor (
    name,
    people,
    events,
    eras
  ) {
    this.name = name
    this.people = people
    this.events = events
    this.eras = eras
  }
}

export class Person {
  constructor ({
                 name,
                 birth,
                 death,
                 url,
                 events = [],
                 short_name = '',
               }) {
    this.name = name
    this.birth = Parser.parseDate(birth)
    this.death = Parser.parseDate(death)
    this.url = url
    this.events = events
      .map(it => { return it instanceof Event ? it : new Event(it) })
      .sort(function (one, two) {
        return one.start().isBefore(two.start()) ? -1
          : one.start().isAfter(two.start()) ? 1
            : 0
      })
    this.shortName = short_name === '' ? name : short_name
  }

  start () {
    return this.birth.clone()
  }

  end () {
    return this.death.clone()
  }
}

export class Event {
  constructor ({
                 name,
                 date,
                 url,
               }) {
    this.name = name
    this.date = Parser.parseDate(date)
    this.url = url
  }

  start () {
    return this.date.clone()
  }

  end () {
    return this.date.clone()
  }
}

export class Era {
  constructor ({
                 name,
                 start,
                 end,
                 url = ''
               }) {
    this.name = name
    this.start = Parser.parseDate(start)
    this.end = Parser.parseDate(end)

    this.url = url
  }
}
