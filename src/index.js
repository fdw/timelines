import { InteractiveCanvas } from './canvas/InteractiveCanvas'
import { Parser } from './Parser'

import(/* webpackChunkName: "data" */ './data.json').then(data => {
  const parser = new Parser()
  const facets = parser.parseData(data)

  const canvas = new InteractiveCanvas()

  canvas.render(facets)
})
