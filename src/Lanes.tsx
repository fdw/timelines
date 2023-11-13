import {Person} from "./models";
import {PersonVis} from "./PersonVis.tsx";
import {DateTime} from "luxon";
import {sortByBirth} from "./timeUtil.ts";

export function Lanes({people}: { people: Person[] }): React.ReactElement {
    const lanes: Person[][] = []

    function findLaneEndingBefore(date: DateTime): number {
        for (const lane in Object.keys(lanes)) {
            if (laneEnd(Number(lane)).plus({years: 5}) < date) {
                return Number(lane)
            }
        }
        return addLane()
    }

    function laneEnd(index: number): DateTime {
        return lanes[index][lanes[index].length - 1].death
    }

    function addLane(): number {
        const newSize = Object.keys(lanes).length
        lanes[newSize] = [];
        return newSize
    }

    return <>{people.sort(sortByBirth).map(it => {
        const offset = findLaneEndingBefore(it.birth)
        lanes[offset].push(it)
        return <PersonVis person={it} key={it.name} offset={offset}/>
    })}</>
}
