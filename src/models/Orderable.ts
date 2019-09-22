import {Moment} from "moment";

export abstract class Orderable {
    abstract left(): Moment

    abstract right(): Moment

    orderByStart(other): number {
        return this.left().isBefore(other.left()) ? -1
            : this.left().isAfter(other.left()) ? 1
                : 0

    }
}

