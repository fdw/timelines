import {Renderer} from './Renderer'
import {fabric} from 'fabric'
import {HistoryCanvas} from '../canvas/HistoryCanvas'
import {Event} from "../models/Event";
import {Color} from "chroma-js";
import {ICircleOptions} from "fabric/fabric-impl";
import {DateTime} from "luxon";

export class EventRenderer extends Renderer {
    public readonly name: string;
    public readonly date: DateTime;
    private readonly url: string;
    private readonly left: number;

    constructor(canvas: fabric.Canvas, event: Event) {
        super(canvas);

        this.name = event.name;
        this.date = event.date;
        this.url = event.url;

        this.left = HistoryCanvas.calculateAbsoluteX(event.date)
    }

    render(offset: number, color: Color): void {
        const circle = new fabric.Circle({
            fill: color.hex(),
            left: this.left,
            top: offset,
            originX: 'center',
            radius: this.LANE_HEIGHT / 2,
            tooltipText: `${this.name}\n${this.date.year}`,
            color: color.hex(),
            url: this.url
        } as ICircleOptions);

        this.canvas.add(circle)
    }

}
