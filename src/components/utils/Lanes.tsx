import { DateTime } from 'luxon'

import { LANE_HEIGHT } from '../../constants'
import { SingularEvent, TimeRange } from '../../models'
import { sortByDate } from '../../timeUtil'
import { SingularEventVis } from '../visualizations/SingularEventVis'
import { TimeRangeVis } from '../visualizations/TimeRangeVis'

export function Lanes({ people = [], events = [] }: { people?: TimeRange[], events?: SingularEvent[] }): React.ReactElement {
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
        return lastObject.object.stop
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
    date: it.start,
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
      return <TimeRangeVis key={object.name} offset={offset} event={object} />
    case 'Event':
      return <SingularEventVis event={object} key={object.title} offset={offset} />
  }
}

type Visualizable = {
  date: DateTime
  object: TimeRange
  type: 'Person'
} | {
  date: DateTime
  object: SingularEvent
  type: 'Event'
}
