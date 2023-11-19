import { DateTime } from 'luxon'

import { Event, Person } from '../../models'
import { sortByDate } from '../../timeUtil'
import { EventVis } from '../visualizations/EventVis'
import { PersonVis } from '../visualizations/PersonVis'

export function Lanes({ people = [], events = [] }: { people?: Person[], events?: Event[] }): React.ReactElement {
  const lanes: (Visualizable)[][] = []

  let nextLane: 'up' | 'down' = 'up'

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
    const nextIndex = findIndex()
    lanes[nextIndex] = []
    return nextIndex
  }

  function findIndex(): number {
    if (lanes.length === 0) {
      return 10
    }

    let fn: (_: number[]) => number
    switch (nextLane) {
      case 'up':
        fn = (values: number[]) => Math.min(...values) - 1
        nextLane = 'down'
        break
      case 'down':
        fn = (values: number[]) => Math.max(...values) + 1
        nextLane = 'up'
        break
    }
    return fn(Object.keys(lanes).map(it => Number(it)))
  }

  const everything = people.map(it => ({
    date: it.birth,
    object: it,
    type: 'Person',
  } as Visualizable)).concat(events.map(it => ({ date: it.date, object: it, type: 'Event' }))).sort(sortByDate)

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
