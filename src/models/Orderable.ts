import {DateTime} from "luxon";

export abstract class Orderable {
    abstract left(): DateTime

    abstract right(): DateTime

    orderByStart(other: Orderable): number {
        return this.left() < other.left() ? -1
            : this.left() > other.left() ? 1
                : 0
    }

    orderByEnd(other: Orderable): number {
        return this.right() > other.right() ? -1
            : this.right() < other.right() ? 1
                : 0
    }
}

