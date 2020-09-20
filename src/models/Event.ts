import { Orderable } from './Orderable'
import {DateTime} from "luxon";

export class Event extends Orderable {
  constructor (
    public readonly name: string,
    public readonly date: DateTime,
    public readonly url: string,
  ) {
    super()
  }

  left (): DateTime {
    return this.date
  }

  right (): DateTime {
    return this.date
  }
}
