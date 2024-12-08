import React from 'react'
import ReactDOMServer from 'react-dom/server'

import styled from 'styled-components'

import { SingularEvent } from '../../models'
import { calculateAbsoluteX } from '../../timeUtil'
import { WikipediaLink } from '../utils/WikipediaLink'
import { LANE_HEIGHT } from '../../constants'

export function SingularEventVis({ event, offset = 0 }: { event: SingularEvent; offset?: number }): React.ReactElement {
  return (
    <EventBox
      data-tooltip-html={ReactDOMServer.renderToStaticMarkup(
        <>
          <TooltipTitle>{event.title}</TooltipTitle>
          <TooltipDate>{event.date.toFormat('DD')}</TooltipDate>
          <WikipediaLink url={event.url} />
        </>,
      )}
      data-tooltip-id='tooltip'
      style={{
        top: `${offset * (LANE_HEIGHT)}px`,
        left: calculateAbsoluteX(event.date),
      }}
    >
      <EventCircle />
      <EventName>{event.title}</EventName>
    </EventBox>
  )
}

const EventBox = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2px;
`

const EventCircle = styled.div`
  height: ${LANE_HEIGHT/2-5}px;
  width: ${LANE_HEIGHT/2-5}px;
  background-color: pink;
  border-radius: ${LANE_HEIGHT/ 2-5}px;
`

const EventName = styled.div`
  text-align: center;
  overflow: visible;
  white-space: nowrap;
  padding: 2px;
  max-height: ${(LANE_HEIGHT -5)/ 2 - 6}px;
  transform: translate(calc(-50% + ${LANE_HEIGHT/4}px), 0);
`

const TooltipTitle = styled.div`

`

const TooltipDate = styled.div`
  font-size: smaller
`
