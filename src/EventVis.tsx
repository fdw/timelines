import styled from 'styled-components'
import { Event } from './models'
import { calculateAbsoluteX } from './timeUtil'

const HEIGHT = 50

export function EventVis({ event, offset = 0 }: { event: Event; offset?: number }): React.ReactElement {
    return (
        <EventBox
            style={{
                top: `${offset * (HEIGHT + 5)}px`,
                left: calculateAbsoluteX(event.date),
            }}
        >
          <EventName>{event.title}</EventName>
        </EventBox>
    )
}

const EventBox = styled.div`
  position: absolute;
  height: ${HEIGHT}px;
  width: ${HEIGHT}px;
  //border-width: 1px;
  //border-color: red;
  background-color: pink;
  //border-style: solid;
  border-radius: ${HEIGHT/2}px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
`

const EventName = styled.div`
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 2px;
  max-height: ${HEIGHT / 2 - 6}px;
`
