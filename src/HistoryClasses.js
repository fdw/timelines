import moment from 'moment'

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
    this.birth = moment(birth, 'Y-MM-DD')
    this.death = moment(death, 'Y-MM-DD')
    this.url = url
    this.events = events
      .map(it => {return it instanceof Event ? it : new Event(it)})
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
    this.date = moment(date, 'Y-MM-DD')
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
                 url = '',
               }) {
    this.name = name
    this.start = moment(start, 'Y-MM-DD')
    this.end = moment(end, 'Y-MM-DD')
    this.url = url
  }
}
