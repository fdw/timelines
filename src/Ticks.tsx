import {calculateAbsoluteX} from "./timeUtil.ts";
import {DateTime} from "luxon";

const TICK_PERIOD = 25

export function Ticks({firstTick = 0, lastTick = 2050}: { firstTick?: number, lastTick?: number }): React.ReactElement {
    return <div style={{height: '100vh'}}>
        {[...Array((lastTick - firstTick) / TICK_PERIOD).keys()].map(it => {
            return <Tick year={it * TICK_PERIOD}/>
        })}
    </div>
}

function Tick({year}: { year: number }): React.ReactElement {
    return <div style={{
        position: "absolute",
        left: `${calculateAbsoluteX(DateTime.fromISO(`${year}-01-01`.padStart(10, '0')))}px`,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
    }}>
        <div style={{
            borderLeft: '1px solid #CDCDCD',
            flexGrow: '1',
        }}/>
        <div style={{textAlign: 'center', marginLeft: '-100%'}}>        {year}</div>
    </div>
}
