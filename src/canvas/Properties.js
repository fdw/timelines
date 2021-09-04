import chroma from 'chroma-js'
import DateTime from 'luxon/src/datetime'

export const LANE_HEIGHT = 20
export const GRID_COLOR = chroma('lightgrey')
export const HOVER_COLOR = chroma('darkgrey')
export const BACKGROUND_COLOR = chroma('white')
export const DATE_SCALE_FACTOR = 3
export const DATE_SCALE_UNIT = 'months'
export const DATE_ORIGIN = DateTime.fromISO('0000-01-01')
export const FIRST_TICK = DateTime.fromISO('-007000')
export const LAST_TICK = DateTime.local()

