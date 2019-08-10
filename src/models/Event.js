import { Parser } from '../parser'
import { Renderable } from './Renderable'

export class Event extends Renderable {
  constructor ({
                 name,
                 date,
                 url,
               }) {
    super()
    this.name = name
    this.date = Parser.parseDate(date)
    this.url = url
  }

  left () {
    return this.date.clone()
  }

  right () {
    return this.date.clone()
  }
}
