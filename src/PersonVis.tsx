import {Person} from './models'
import {calculateAbsoluteX, calculateRelativeX} from "./timeUtil.ts";
import React from "react";
import styled from 'styled-components';

const HEIGHT = 50

export function PersonVis({person, offset = 0}: { person: Person, offset?: number }): React.ReactElement {
    return <PersonBox style={{
        top: `${offset * (HEIGHT + 5)}px`,
        left: calculateAbsoluteX(person.birth),
        width: calculateRelativeX(person.birth, person.death),
    }}><NameSpan>{person.name}</NameSpan>
        <YearsSpan>{person.birth.year} - {person.death.year}</YearsSpan>
    </PersonBox>
}

const PersonBox = styled.div`
  position: absolute;
  height: ${HEIGHT}px;
  //border-width: 1px;
  //border-color: red;
  background-color: teal;
  //border-style: solid;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
`

const NameSpan = styled.span`
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 2px;
  max-height: ${HEIGHT / 2 - 6}px;
`

const YearsSpan = styled.span`
  text-align: center;
  padding: 2px;
  max-height: ${HEIGHT / 2 - 6}px;
  font-size: smaller;
`
