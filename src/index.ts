import {InteractiveCanvas} from './canvas/InteractiveCanvas'
import {Parser} from './Parser'
import data from './data.json'

const parser = new Parser();
const facets = parser.parseData(data);

const canvas = new InteractiveCanvas();

canvas.render(facets);

