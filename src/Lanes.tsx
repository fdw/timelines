import { DateTime } from 'luxon'

import { EventVis } from './EventVis.tsx'
import { Event, Person } from './models'
import { PersonVis } from './PersonVis'
import { sortByDate } from './timeUtil'

export function Lanes({ people = [], events=[] }: { people?: Person[], events?: Event[] }): React.ReactElement {
  const lanes: (Visualizable)[][] = []

  function findLaneEndingBefore(date: DateTime): number {
    for (const lane in Object.keys(lanes)) {
      if (laneEnd(Number(lane)).plus({ years: 5 }) < date) {
        return Number(lane)
      }
    }
    return addLane()
  }

  function laneEnd(index: number): DateTime {
    const lastObject = lanes[index][lanes[index].length - 1]
    switch(lastObject.type) {
      case 'Person': return lastObject.object.death
      case 'Event': return lastObject.object.date.plus({years: 10})
    }
  }

  function addLane(): number {
    const newSize = Object.keys(lanes).length
    lanes[newSize] = []
    return newSize
  }

  const everything = people.map(it => ({date: it.birth, object: it, type: 'Person'} as Visualizable)).concat(events.map(it => ({date: it.date, object: it, type: 'Event'}))).sort(sortByDate)

  return (
    <>
      {everything.map(it => {
        const offset = findLaneEndingBefore(it.date)
        lanes[offset].push(it)
        return getVisualization(it, offset)
      })}
    </>
  )
}

function getVisualization({object, type}: Visualizable, offset: number): React.ReactElement {
  switch(type) {
    case 'Person': return <PersonVis key={object.name} offset={offset} person={object} />
    case 'Event': return <EventVis event={object} key={object.title} offset={offset} />
  }
}

type Visualizable = {
  date: DateTime
  object: Person
  type: 'Person'
} | {
  date: DateTime
  object: Event
  type: 'Event'
}
