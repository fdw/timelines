import {ArtFacet} from "./Art.tsx";
import {Ticks} from "./Ticks.tsx";

export function Overview() {
    return (
        <div style={{width: 2*2500}}>
            <Ticks />
            <ArtFacet />
        </div>
    )
}

