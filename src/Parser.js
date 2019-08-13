import chroma from 'chroma-js'
import moment from 'moment'
import { Person } from './models/Person'
import { Era } from './models/Era'
import { Event } from './models/Event'
import { Facet } from './models/Facet'

export class Parser {
  constructor () {
    this.DATE_PARSER_FORMAT = 'Y-MM-DD'
  }

  _setColors (facets) {
    let colorScale = chroma.scale('Viridis').domain([0, facets.length - 1])
    facets.forEach((it, index) => {
      it.basecolor = colorScale(index)
    })
  }

  parseData (data) {
    const facets = Object.keys(data).map(facetName => {
      return new Facet(
        facetName,
        (data[facetName].eras || []).map(it => this.parseEra(it)),
        (data[facetName].people || []).map(it => this.parsePerson(it)),
        (data[facetName].events || []).map(it => this.parseEvent(it))
      )
    })

    this._setColors(facets)
    return facets
  }

  parseEra ({
              name,
              start,
              end,
              url = ''
            }) {
    return new Era(name, this.parseDate(start), this.parseDate(end), url)
  }

  parsePerson ({
                 name,
                 birth,
                 death,
                 url,
                 events = [],
                 short_name = ''
               }) {
    return new Person(name, this.parseDate(birth), this.parseDate(death), url, events.map(it => this.parseEvent(it)), short_name === '' ? name : short_name)
  }

  parseEvent ({
                name,
                date,
                url
              }) {
    return new Event(name, this.parseDate(date), url)

  }

  parseDate (string) {
    if (string === null) {
      return null
    } else if (string === 'now') {
      return moment()
    }
    return moment(string, this.DATE_PARSER_FORMAT)
  }
}
