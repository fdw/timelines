import {InteractiveCanvas} from './canvas/InteractiveCanvas'
import {Parser} from './Parser'
import data from './data.json'
import {HistoryData} from "./models/HistoryData";

const parser = new Parser();
const facets = parser.parseData(data as Record<string, HistoryData>);

const canvas = new InteractiveCanvas();

canvas.render(facets);

