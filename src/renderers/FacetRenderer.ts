import {Renderer} from './Renderer'
import {Person} from '../models/Person'
import {Event} from '../models/Event'
import {PersonRenderer} from './PersonRenderer'
import {EventRenderer} from './EventRenderer'
import {EraRenderer} from './EraRenderer'
import {Lanes} from './Lanes'
import {Color} from "chroma-js";
import {Facet} from "../models/Facet";
import {fabric} from "fabric";
import {Era} from "../models/Era";
import {Orderable} from "../models/Orderable";

export class FacetRenderer extends Renderer {
    private readonly name: string;
    private readonly eras: Era[];
    private readonly lanes: Lanes;
    private readonly basecolor: Color;

    constructor(canvas: fabric.Canvas, facet: Facet) {
        super(canvas);

        this.name = facet.name;
        this.eras = facet.eras.sort((one, two) => one.orderByStart(two));

        this.lanes = new Lanes();
        const objects = (facet.people as Orderable[])
            .concat(facet.events as Orderable[])
            .sort((one, two) => one.orderByStart(two));
        this.lanes.addObjects(
            objects
        );

        this.basecolor = facet.basecolor
    }

    render(offset: number): number {
        this.eras.forEach(era =>
            new EraRenderer(this.canvas, era).render(offset, this.lanes.size() * (this.LANE_HEIGHT + this.LANE_PADDING), this.basecolor)
        );

        offset += this.LANE_PADDING / 2;
        this.lanes.getLanes().forEach(lane => {
            lane.forEach(object => {
                switch (true) {
                    case object instanceof Person:
                        new PersonRenderer(this.canvas, object as Person).render(offset, this.basecolor);
                        break;
                    case object instanceof Event:
                        new EventRenderer(this.canvas, object as Event).render(offset, this.basecolor);
                        break
                }
            });
            offset += this.LANE_HEIGHT + this.LANE_PADDING
        });

        return offset - this.LANE_PADDING / 2
    }
}
