import {Person} from './models'
import {calculateAbsoluteX, calculateRelativeX} from "./timeUtil.ts";
import React from "react";
import {DateTime} from "luxon";

const HEIGHT = 50

export function PersonVis({person, offset = 0}: { person: Person, offset?: number }): React.ReactElement {
    return <a style={{
        position: 'absolute',
        left: calculateAbsoluteX(person.birth),
        top: `${offset * (HEIGHT + 5)}px`,
        width: calculateRelativeX(person.birth, person.death),
        height: `${HEIGHT}px`,
        borderWidth: '1px',
        borderColor: 'red',
        borderStyle: 'solid',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: "hidden",
    }}><Name name={person.name}/><Years birth={person.birth} death={person.death}/></a>
}

function Name({name}: { name: string }): React.ReactElement {
    return <span style={{
        textAlign: 'center',
        overflow: "hidden",
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        padding: '2px',
        maxHeight: `${HEIGHT / 2 - 6}px`
    }}>{name}</span>
}

function Years({birth, death}: { birth: DateTime, death: DateTime }): React.ReactElement {
    return <span style={{
        textAlign: 'center',
        padding: '2px',
        maxHeight: `${HEIGHT / 2 - 6}px`,
        fontSize: 'smaller'
    }}>{birth.year} - {death.year}</span>
}
