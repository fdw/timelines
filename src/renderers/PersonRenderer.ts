import {Renderer} from './Renderer'
import {fabric} from 'fabric'
import chroma, {Color} from 'chroma-js'
import {HistoryCanvas} from '../canvas/HistoryCanvas'
import {Person} from "../models/Person";
import {Event} from "../models/Event";
import {IGroupOptions} from "fabric/fabric-impl";
import {DateTime} from "luxon";

export class PersonRenderer extends Renderer {
    private readonly name: string;
    private readonly birth: DateTime;
    private readonly death: DateTime;
    private readonly events: Event[];
    private readonly shortName: string;
    private readonly url: string;
    private readonly left: number;
    private readonly width: number;

    constructor(canvas: fabric.Canvas, person: Person) {
        super(canvas);

        this.name = person.name;
        this.birth = person.birth;
        this.death = person.death;
        this.events = person.events.sort((one, two) => one.orderByStart(two));
        this.shortName = person.shortName;
        this.url = person.url;

        this.left = HistoryCanvas.calculateAbsoluteX(person.birth);
        this.width = HistoryCanvas.calculateRelativeX(person.birth, person.death);

    }

    render(offset: number, color: Color): void {
        const rect = new fabric.Rect({
            fill: color.hex(),
            left: this.left,
            width: this.width,
            top: offset,
            height: this.LANE_HEIGHT,
        });

        const renderedEvents = this.events.map(it => this.renderNestedEvent(it, offset, color));

        const textColor = color.luminance() > 0.4 ? chroma('black').hex() : chroma('white').hex();
        const label = new fabric.Textbox(
            this.shortName,
            {
                left: this.left + this.width / 2,
                width: this.width,
                top: offset + this.LANE_HEIGHT / 2,
                originX: 'center',
                originY: 'center',
                fontSize: this.LANE_HEIGHT - 6,
                textAlign: 'center',
                strokeWidth: 0,
                fill: textColor
            }
        );

        const personGlyph = new fabric.Group([rect, ...renderedEvents, label], {
            tooltipText: this.buildPersonTooltip(),
            fill: color.hex(),
            url: this.url
        } as IGroupOptions);

        this.canvas.add(personGlyph)
    }

    private renderNestedEvent(event: Event, offset: number, color: Color): fabric.Object {
        return new fabric.Circle({
            fill: color.darken(0.3).hex(),
            left: HistoryCanvas.calculateAbsoluteX(event.date),
            top: offset + this.LANE_HEIGHT / 2,
            originY: 'center',
            originX: 'center',
            radius: this.LANE_HEIGHT * 3 / 8,
            strokeWidth: 1,
            stroke: color.darken(0.9).hex()
        })
    }

    private buildPersonTooltip(): string {
        const events = this.events.length > 0 ? '\n' + this.events.map(it => `${it.name} (${it.date.year})`).join(', ') : '';
        return `${this.name}\n${this.birth.year} - ${this.death.year}${events}`
    }

}
