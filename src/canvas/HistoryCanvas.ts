import {fabric} from 'fabric'
import {
    BACKGROUND_COLOR,
    DATE_ORIGIN,
    DATE_SCALE_FACTOR,
    DATE_SCALE_UNIT,
    FIRST_TICK,
    GRID_COLOR,
    LANE_HEIGHT,
    LAST_TICK
} from './Properties'
import moment, {Duration, Moment} from 'moment'
import {FacetRenderer} from '../renderers/FacetRenderer'
import {Facet} from "../models/Facet";

export class HistoryCanvas extends fabric.Canvas {
    private ticks: fabric.Object[];

    constructor() {
        super('canvas');
        fabric.Object.prototype.selectable = false;
        fabric.Textbox.prototype.editable = false;
        fabric.Textbox.prototype.fontFamily = 'sans';

        this.initializeCanvas()
    }

    private initializeCanvas() {
        this.setDimensions({width: window.innerWidth, height: window.innerHeight});
        this.hoverCursor = 'default';
        this.selection = false;
        this.absolutePan(new fabric.Point(HistoryCanvas.calculateAbsoluteX(moment('1500-01-01', 'Y-MM-DD')), 0));
        this.renderOnAddRemove = false;

        this.ticks = []
    }


    getItem(id: string): fabric.Object {
        for (let i = 0, len = super.size(); i < len; i++) {
            if (this.getObjects()[i].id && this.getObjects()[i].id === id) {
                return this.getObjects()[i]
            }
        }
    }

    render(facets: Facet[]): void {
        this.renderGrid();
        this.renderData(facets.sort((one, two) => one.orderByStart(two)));
        this.requestRenderAll();
    }

    renderGrid(): void {
        this.remove(...this.ticks);
        this.ticks.length = 0;

        for (let currentTick = FIRST_TICK.clone(); currentTick.isBefore(LAST_TICK); currentTick.add(this.periodBetweenTicks())) {
            const x = HistoryCanvas.calculateAbsoluteX(currentTick);
            const line = new fabric.Line(
                [
                    x,
                    -this.viewportTransform[5] / this.viewportTransform[3],
                    x,
                    (-this.viewportTransform[5] + window.innerHeight) / this.viewportTransform[3]
                ],
                {
                    stroke: GRID_COLOR.hex(),
                    strokeWidth: 1
                });

            const label = new fabric.Textbox(
                currentTick.format('YYYY'),
                {
                    left: x,
                    top: (-this.viewportTransform[5] + window.innerHeight - LANE_HEIGHT) / this.viewportTransform[3],
                    originX: 'center',
                    originY: 'center',
                    fontSize: (LANE_HEIGHT - 4) / this.viewportTransform[3],
                    textAlign: 'center',
                    strokeWidth: 0,
                    fill: GRID_COLOR.hex(),
                    textBackgroundColor: BACKGROUND_COLOR.hex()
                }
            );

            const gridline = new fabric.Group([line, label]);
            this.insertAt(gridline, 1, false);
            this.ticks.push(gridline)
        }
    }

    private periodBetweenTicks(): Duration {
        return moment.duration(25 / this.getZoom(), 'y')
    }

    tickCount(): number {
        return this.ticks.length - 1
    }

    private renderData(facets: Facet[]): void {
        facets.reduce((offset, facet) => new FacetRenderer(this, facet).render(offset), 0);

        this.renderAll()
    }

    static calculateAbsoluteX(date: Moment): number {
        return HistoryCanvas.calculateRelativeX(DATE_ORIGIN.clone(), date)
    }

    static calculateRelativeX(start: Moment, end: Moment): number {
        return end.diff(start, DATE_SCALE_UNIT) / DATE_SCALE_FACTOR
    }
}
