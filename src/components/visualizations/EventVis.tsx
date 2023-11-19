import React from 'react'
import ReactDOMServer from 'react-dom/server'

import styled from 'styled-components'

import { Event } from '../../models'
import { calculateAbsoluteX } from '../../timeUtil'
import { WikipediaLink } from '../utils/WikipediaLink'
import { LANE_HEIGHT } from '../../constants'

export function EventVis({ event, offset = 0 }: { event: Event; offset?: number }): React.ReactElement {
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
      <EventName>{event.title}</EventName>
    </EventBox>
  )
}

const EventBox = styled.div`
  position: absolute;
  height: ${LANE_HEIGHT-5}px;
  width: ${LANE_HEIGHT-5}px;
  //border-width: 1px;
  //border-color: red;
  background-color: pink;
  //border-style: solid;
  border-radius: ${(LANE_HEIGHT -5)/ 2}px;
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
  max-height: ${(LANE_HEIGHT -5)/ 2 - 6}px;
`

const TooltipTitle = styled.div`

`

const TooltipDate = styled.div`
  font-size: smaller
`
