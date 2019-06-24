import { fabric } from 'fabric'
import { Interactions } from './interaction'
import { HistoryRenderer } from './rendering'
import { Parser } from './parser'
import data from './data.json'

const parser = new Parser()
const facets = parser.parseData(data)

const renderer = new HistoryRenderer()
const interactions = new Interactions(renderer)
interactions.addAll()

renderer.renderData(facets)
