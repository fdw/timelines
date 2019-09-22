import { Orderable } from './Orderable'
import {Moment} from "moment";

export class Event extends Orderable {
  constructor (
    public readonly name: string,
    public readonly date: Moment,
    public readonly url: string,
  ) {
    super()
  }

  left (): Moment {
    return this.date.clone()
  }

  right (): Moment {
    return this.date.clone()
  }
}
