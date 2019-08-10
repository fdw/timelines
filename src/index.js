import { Interactions } from './interaction'
import { Parser } from './parser'
import { HistoryRenderer } from './renderers/HistoryRenderer'

import(/* webpackChunkName: "data" */ './data.json').then(data => {
  const parser = new Parser()
  const facets = parser.parseData(data)

  const renderer = new HistoryRenderer()
  const interactions = new Interactions(renderer)
  interactions.addAll()

  renderer.render(facets)
})
