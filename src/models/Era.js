import { Orderable } from './Orderable'

export class Era extends Orderable {
  constructor (
    name,
    start,
    end,
    url = ''
  ) {
    super()
    this.name = name
    this.start = start
    this.end = end
    this.url = url
  }

  left () {
    return this.start.clone()
  }

  right () {
    return this.end.clone()
  }
}
