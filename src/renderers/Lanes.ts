import {Orderable} from "../models/Orderable";
import {DateTime} from "luxon";

export class Lanes {
    private lanes: Orderable[][] = [];

    size(): number {
        return Object.keys(this.lanes).length
    }

    private addLane(): number {
        this.lanes[this.size()] = [];
        return this.size() - 1
    }

    private laneEnd(index: number|string): DateTime {
        return this.lanes[index][this.lanes[index].length - 1].right()
    }

    private findLaneEndingBefore(date: DateTime): number|string {
        for (const lane in Object.keys(this.lanes)) {
            if (this.laneEnd(lane).plus({years: 5}) < date) {
                return lane
            }
        }
        return this.addLane()
    }

    addObject(object: Orderable): void {
        const laneIndex = this.findLaneEndingBefore(object.left());
        this.lanes[laneIndex].push(object)
    }

    addObjects(objects: Orderable[]): void {
        objects.forEach(it => this.addObject(it))
    }

    getLanes(): Orderable[][] {
        return this.lanes
    }
}

