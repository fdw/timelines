import React from 'react'
import ReactDOMServer from 'react-dom/server'

import styled from 'styled-components'

import { TimeRange } from '../../models'
import { calculateAbsoluteX, calculateRelativeX } from '../../timeUtil'
import { WikipediaLink } from '../utils/WikipediaLink'
import { LANE_HEIGHT } from '../../constants'

export function TimeRangeVis({ event, offset = 0 }: { event: TimeRange; offset?: number }): React.ReactElement {
  return (
    <TimeRangeBox
      data-tooltip-html={ReactDOMServer.renderToStaticMarkup(
        <>
          <TooltipTitle>{event.name}</TooltipTitle>
          <TooltipDate>{event.start.toFormat('DD')}- {event.stop.toFormat('DD')}</TooltipDate>
          <WikipediaLink url={event.url} />
        </>,
      )}
      data-tooltip-id='tooltip'
      style={{
        top: `${offset * (LANE_HEIGHT)}px`,
        left: calculateAbsoluteX(event.start),
        width: calculateRelativeX(event.start, event.stop),
      }}
    >
      <NameSpan>{event.name}</NameSpan>
      <YearsSpan>
        {event.start.year} - {event.stop.year}
      </YearsSpan>
    </TimeRangeBox>
  )
}

const TimeRangeBox = styled.div`
    position: absolute;
    height: ${LANE_HEIGHT - 5}px;
    //border-width: 1px;
    //border-color: red;
    background-color: teal;
    //border-style: solid;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
`

const NameSpan = styled.span`
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding: 2px;
    max-height: ${(LANE_HEIGHT - 5) / 2 - 6}px;
`

const YearsSpan = styled.span`
    text-align: center;
    padding: 2px;
    max-height: ${(LANE_HEIGHT - 5) / 2 - 6}px;
    font-size: smaller;
`

const TooltipTitle = styled.div`

`

const TooltipDate = styled.div`
    font-size: smaller
`
