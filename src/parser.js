import chroma from 'chroma-js'
import { Lanes, RenderableFacet } from './RenderClasses'
import { Era, Event, Person } from './HistoryClasses'

export class Parser {

  _setColors (facets) {
    let colorScale = chroma.scale('Viridis').domain([0, facets.length - 1])
    facets.forEach((it, index) => {
      it.basecolor = colorScale(index)
    })
  }

  parseData (data) {
    const facets = Object.keys(data).map(facetName => {
      const lanes = new Lanes()

      lanes.addObjects(
        (data[facetName].people || [])
          .map(it => new Person(it))
          .concat((data[facetName].events || [])
            .map(it => new Event(it)))
          .sort(function (one, two) {
              return one.start().isBefore(two.start()) ? -1
                : one.start().isAfter(two.start()) ? 1
                  : 0
            }
          )
      )

      const eras = (data[facetName].eras || [])
        .map(it => new Era(it))
        .sort(function (one, two) {
          return one.start.isBefore(two.start) ? -1
            : one.start.isAfter(two.start) ? 1
              : 0
        })

      return new RenderableFacet(facetName, lanes, eras)
    })

    this._setColors(facets)
    return facets
  }
}
