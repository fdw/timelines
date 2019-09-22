import chroma from 'chroma-js'
import moment from 'moment'

export const LANE_HEIGHT = 20
export const GRID_COLOR = chroma('lightgrey')
export const HOVER_COLOR = chroma('darkgrey')
export const BACKGROUND_COLOR = chroma('white')
export const DATE_SCALE_FACTOR = 3
export const DATE_SCALE_UNIT = 'M'
export const DATE_ORIGIN = moment('0000-01-01')
export const FIRST_TICK = moment('-7000', 'Y')
export const LAST_TICK = moment()
