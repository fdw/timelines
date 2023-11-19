import { DateTime } from 'luxon'

import { Event, Person } from '../../models'
import { sortByDate } from '../../timeUtil'
import { EventVis } from '../visualizations/EventVis'
import { PersonVis } from '../visualizations/PersonVis'
import { LANE_HEIGHT } from '../../constants'

export function Lanes({ people = [], events = [] }: { people?: Person[], events?: Event[] }): React.ReactElement {
  const lanes: (Visualizable)[][] = []

  function findLaneEndingBefore(date: DateTime): number {
    return Object.keys(lanes).map(it => ({
      index: Number(it),
      date: laneEnd(Number(it)),
    })).filter(it => it.date.plus({ years: 5 }) < date).sort(sortByDate)[0]?.index ?? addLane()
  }

  function laneEnd(index: number): DateTime {
    const lastObject = lanes[index][lanes[index].length - 1]

    switch (lastObject.type) {
      case 'Person':
        return lastObject.object.death
      case 'Event':
        return lastObject.object.date.plus({ years: 10 })
    }
  }


  function addLane(): number {
    lanes.reverse()
    lanes.push([])
    return lanes.length - 1
  }

  const everything = people.map(it => ({
    date: it.birth,
    object: it,
    type: 'Person',
  } as Visualizable)).concat(events.map(it => ({ date: it.date, object: it, type: 'Event' }))).sort(sortByDate)

  everything.forEach(it => {
    const lineIndex = findLaneEndingBefore(it.date)
    lanes[lineIndex].push(it)
  })

  return (
    <div style={{ height: lanes.length * LANE_HEIGHT, position: 'relative' }}>
      {lanes.map((lane, index) => {
        return lane.map(it => getVisualization(it, index))
      })}
    </div>
  )
}

function getVisualization({ object, type }: Visualizable, offset: number): React.ReactElement {
  switch (type) {
    case 'Person':
      return <PersonVis key={object.name} offset={offset} person={object} />
    case 'Event':
      return <EventVis event={object} key={object.title} offset={offset} />
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
