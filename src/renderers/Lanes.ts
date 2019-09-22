import {Orderable} from "../models/Orderable";
import {Moment} from "moment";

export class Lanes {
    private lanes: Orderable[][] = [];

    size(): number {
        return Object.keys(this.lanes).length
    }

    private addLane(): number {
        this.lanes[this.size()] = [];
        return this.size() - 1
    }

    private laneEnd(index: number|string): Moment {
        return this.lanes[index][this.lanes[index].length - 1].right()
    }

    private findLaneEndingBefore(date: Moment): number|string {
        for (let lane in Object.keys(this.lanes)) {
            if (this.laneEnd(lane).add(3, 'y').isBefore(date)) {
                return lane
            }
        }
        return this.addLane()
    }

    addObject(object: Orderable) {
        const laneIndex = this.findLaneEndingBefore(object.left());
        this.lanes[laneIndex].push(object)
    }

    addObjects(objects: Orderable[]) {
        objects.forEach(it => this.addObject(it))
    }

    getLanes(): Orderable[][] {
        return this.lanes
    }
}

