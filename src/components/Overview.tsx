import { Tooltip } from 'react-tooltip'

import { ArtFacet } from './facets/ArtFacet'
import { ScienceFacet } from './facets/ScienceFacet'
import { Ticks } from './Ticks'

export function Overview() {
  return (
    <div style={{ width: 2 * 2500 }}>
      <Ticks />
      {/*<ArtFacet />*/}
      <ScienceFacet />
      <Tooltip clickable id="tooltip" openOnClick style={{ zIndex: 1000 }} />
    </div>
  )
}
