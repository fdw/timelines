import { Orderable } from './Orderable'

export class Event extends Orderable {
  constructor (
    name,
    date,
    url,
  ) {
    super()
    this.name = name
    this.date = date
    this.url = url
  }

  left () {
    return this.date.clone()
  }

  right () {
    return this.date.clone()
  }
}
