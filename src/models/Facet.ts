import {Color} from "chroma-js";
import {Era} from "./Era";
import {Person} from "./Person";
import {Event} from "./Event";
import {Orderable} from "./Orderable";
import {Moment} from "moment";

export class Facet extends Orderable {
  public basecolor: Color;
  public readonly name: string;
  public readonly eras: Era[];
  public readonly people: Person[];
  public readonly events: Event[];

  constructor(
      name: string,
      eras: Era[],
      people: Person[],
      events: Event[]
  ) {
    super()
    this.name = name;
    this.eras = eras.sort((one, two) => one.orderByStart(two));
    this.people = people.sort((one, two) => one.orderByStart(two));
    this.events = events.sort((one, two) => one.orderByStart(two));
  }

  left(): Moment {
    return [this.eras[0], this.people[0], this.events[0]].sort((one, two) => one.orderByStart(two))[0].left()
  }

  right(): Moment {
    return [this.eras, this.people, this.events].flat().sort((one, two) => one.orderByEnd(two))[0].right()
  }

}
