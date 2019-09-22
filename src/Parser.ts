import chroma from 'chroma-js'
import moment, {Moment} from 'moment'
import {Person} from './models/Person'
import {Era} from './models/Era'
import {Event} from './models/Event'
import {Facet} from './models/Facet'

export class Parser {
    private readonly DATE_PARSER_FORMAT = 'Y-MM-DD';

    parseData(data): Facet[] {
        const facets = Object.keys(data).map(facetName => {
            return new Facet(
                facetName,
                (data[facetName].eras || []).map(it => this.parseEra(it)),
                (data[facetName].people || []).map(it => this.parsePerson(it)),
                (data[facetName].events || []).map(it => this.parseEvent(it))
            )
        });

        this.setColors(facets);
        return facets
    }

    private setColors(facets: Facet[]): void {
        let colorScale = chroma.scale('Viridis').domain([0, facets.length - 1]);
        facets.forEach((it, index) => {
            it.basecolor = colorScale(index)
        })
    }

    private parseEra(
        {
            name,
            start,
            end,
            url = ''
        }
    ): Era {
        return new Era(name, this.parseDate(start), this.parseDate(end), url)
    }

    private parsePerson(
        {
            name,
            birth,
            death,
            url,
            events = [],
            short_name = ''
        }
    ): Person {
        return new Person(name, this.parseDate(birth), this.parseDate(death), url, events.map(it => this.parseEvent(it)), short_name === '' ? name : short_name)
    }

    private parseEvent(
        {
            name,
            date,
            url
        }
    ): Event {
        return new Event(name, this.parseDate(date), url)

    }

    private parseDate(string: string): Moment {
        if (string === null) {
            return null
        } else if (string === 'now') {
            return moment()
        }
        return moment(string, this.DATE_PARSER_FORMAT)
    }
}
