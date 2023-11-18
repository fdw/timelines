import React from 'react'

export function WikipediaLink({ url }: { url: string }): React.ReactElement {
  return <a href={url} target={'_blank'}>Read more</a>

}
