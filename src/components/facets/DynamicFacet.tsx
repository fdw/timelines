import { parseDate } from '../../timeUtil'
import { Lanes } from '../utils/Lanes'
import { data } from '../data/all'

export function DynamicFacet(): React.ReactElement {
  const tags = ['architecture', 'art', 'science', 'philosophy']

  return (
    <>
      {tags.map(tag => <Lanes key={tag}
                              people={data.filter(it => it.tags.includes(tag)).map(it => ({
                                name: it.short_name ?? it.name,
                                start: parseDate(it.start),
                                stop: parseDate(it.stop),
                                url: it.url,
                              }))}
      />)}
    </>
  )
}


