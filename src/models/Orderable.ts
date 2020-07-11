import {Moment} from "moment";

export abstract class Orderable {
    abstract left(): Moment

    abstract right(): Moment

    orderByStart(other: Orderable): number {
        return this.left().isBefore(other.left()) ? -1
            : this.left().isAfter(other.left()) ? 1
                : 0
    }

    orderByEnd(other: Orderable): number {
        return this.right().isAfter(other.right()) ? -1
            : this.right().isBefore(other.right()) ? 1
                : 0
    }
}

