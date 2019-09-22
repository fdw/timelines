import {Orderable} from './Orderable'
import {Moment} from "moment";

export class Era extends Orderable {
    constructor(
        public readonly name: string,
        public readonly start: Moment,
        public readonly end: Moment,
        public readonly url: string = ''
    ) {
        super();
    }

    left(): Moment {
        return this.start.clone()
    }

    right(): Moment {
        return this.end.clone()
    }
}
