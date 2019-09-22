import {Orderable} from './Orderable'
import {Moment} from "moment";
import {Event} from "./Event";

export class Person extends Orderable {
    public readonly shortName: string;

    constructor(
        public readonly name: string,
        public readonly birth: Moment,
        public readonly death: Moment,
        public readonly url: string,
        public readonly events: Event[] = [],
        short_name = ''
    ) {
        super();
        this.shortName = short_name
    }

    left(): Moment {
        return this.birth.clone()
    }

    right(): Moment {
        return this.death.clone()
    }
}
