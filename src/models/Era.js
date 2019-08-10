import { Parser } from '../parser'

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
