import {Color} from "chroma-js";
import {Era} from "./Era";
import {Person} from "./Person";
import {Event} from "./Event";

export class Facet {
    public basecolor: Color;

    constructor(
        public readonly name: string,
        public readonly eras: Era[],
        public readonly people: Person[],
        public readonly events: Event[]
    ) {
    }
}
