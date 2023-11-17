import { ArtFacet } from './ArtFacet.tsx'
import { Ticks } from './Ticks'
import { ScienceFacet } from './ScienceFacet.tsx'

export function Overview() {
  return (
    <div style={{ width: 2 * 2500 }}>
      <Ticks />
      {/*<ArtFacet />*/}
      <ScienceFacet />
    </div>
  )
}
