import {Orderable} from './Orderable'
import {DateTime} from "luxon";

export class Era extends Orderable {
    constructor(
        public readonly name: string,
        public readonly start: DateTime,
        public readonly end: DateTime,
        public readonly url: string = ''
    ) {
        super();
    }

    left(): DateTime {
        return this.start
    }

    right(): DateTime {
        return this.end
    }
}
