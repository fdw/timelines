import { ArtFacet } from './Art'
import { Ticks } from './Ticks'

export function Overview() {
  return (
    <div style={{ width: 2 * 2500 }}>
      <Ticks />
      <ArtFacet />
    </div>
  )
}
