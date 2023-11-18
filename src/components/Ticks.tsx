import { DateTime } from 'luxon'
import styled from 'styled-components'

import { calculateAbsoluteX } from '../timeUtil'

const TICK_PERIOD = 25

export function Ticks({
  firstTick = 0,
  lastTick = 2050,
}: {
  firstTick?: number
  lastTick?: number
}): React.ReactElement {
  return (
    <div style={{ height: '100vh' }}>
      {[...Array((lastTick - firstTick) / TICK_PERIOD).keys()].map(it => {
        return <Tick key={`tick-${it}`} year={it * TICK_PERIOD} />
      })}
    </div>
  )
}

function Tick({ year }: { year: number }): React.ReactElement {
  return (
    <TickBox
      style={{
        left: `${calculateAbsoluteX(DateTime.fromISO(`${year}-01-01`.padStart(10, '0')))}px`,
      }}
    >
      <TickLine />
      <TickLabel>{year}</TickLabel>
    </TickBox>
  )
}

const TickBox = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  height: 100vh;
  z-index: 0;
`

const TickLine = styled.div`
  border-left: 1px solid #cdcdcd;
  flex-grow: 1;
`

const TickLabel = styled.div`
  text-align: center;
  margin-left: -100%;
`
