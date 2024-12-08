import { Tooltip } from 'react-tooltip'
import { Ticks } from './Ticks'
import { DynamicFacet } from './facets/DynamicFacet'

export function Overview() {
  return (
    <div style={{ width: 2 * 2500 }}>
      <Ticks />
      <DynamicFacet />
      <Tooltip clickable id="tooltip" openOnClick style={{ zIndex: 1000 }} />
    </div>
  )
}
