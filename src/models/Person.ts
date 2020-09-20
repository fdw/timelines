import {Orderable} from './Orderable'
import {Event} from "./Event";
import {DateTime} from "luxon";

export class Person extends Orderable {
    public readonly shortName: string;

    constructor(
        public readonly name: string,
        public readonly birth: DateTime,
        public readonly death: DateTime,
        public readonly url: string,
        public readonly events: Event[] = [],
        short_name = ''
    ) {
        super();
        this.shortName = short_name
    }

    left(): DateTime {
        return this.birth
    }

    right(): DateTime {
        return this.death
    }
}
