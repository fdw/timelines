import { fabric } from 'fabric'
import { Interactions } from './interaction'
import { HistoryRenderer } from './rendering'
import { Parser } from './parser'
import data from './data.json'

function initializeWorkaroundsForFabric () {
  fabric.Canvas.prototype.getItem = function (id) {
    for (let i = 0, len = this.size(); i < len; i++) {
      if (this.getObjects()[i].id && this.getObjects()[i].id === id) {
        return this.getObjects()[i]
      }
    }
  }
}

const parser = new Parser()
const facets = parser.parseData(data)

initializeWorkaroundsForFabric()

const renderer = new HistoryRenderer()
const interactions = new Interactions(renderer)
interactions.addAll()

renderer.renderData(facets)
