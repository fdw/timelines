import json
from typing import List, Dict, Union

import bokeh
import numpy as numpy

from ColorHelpers import to_color


class History(object):
    def __init__(self, facets: Dict[str, 'Facet'] = None):
        self.facets = facets if facets else {}
        self.__calculate_colors()

    def append(self, other: 'History') -> 'History':
        for facet in other.facets:
            if facet in self.facets:
                self.facets[facet].people.extend(other.facets[facet].people)
                self.facets[facet].events.extend(other.facets[facet].events)
                self.facets[facet].eras.extend(other.facets[facet].eras)
            else:
                self.facets[facet] = other.facets[facet]

        self.__calculate_colors()
        return self

    def __calculate_colors(self):
        colors = iter([to_color(color) for color in bokeh.palettes.viridis(len(self.facets))])
        for facet in self.facets:
            self.facets[facet].color = next(colors)

    @staticmethod
    def from_dict(data: Dict[str, Union[str, Dict[str, str]]]) -> 'History':
        facets = {}
        for facet_name in data:
            facets[facet_name] = Facet.from_dict(facet_name, data[facet_name])

        return History(facets)


class Facet(object):
    def __init__(
            self,
            name: str,
            people: List['Person'],
            events: List['Event'],
            eras: List['Era']
    ):
        self.name = name
        self.people = people
        self.events = events
        self.eras = eras
        self.color = None

    @staticmethod
    def from_dict(name: str, data: Dict[str, Union[str, Dict[str, str]]]) -> 'Facet':
        return Facet(
            name,
            list(map(Person.from_dict, data['people'])) if 'people' in data else [],
            list(map(Event.from_dict, data['events'])) if 'events' in data else [],
            list(map(Era.from_dict, data['eras'])) if 'eras' in data else []
        )


class Person(object):
    def __init__(
            self,
            name: str,
            birth: numpy.datetime64,
            death: numpy.datetime64,
            url: str,
            events: List['Event'] = None,
            short_name: str = None

    ):
        self.name = name
        self.birth = birth
        self.death = death
        self.url = url
        self.events = events if events is not None else []
        self.short_name = short_name if short_name is not None else name

    @staticmethod
    def from_dict(data: Dict[str, Union[str, Dict[str, str]]]) -> 'Person':
        return Person(
            data['name'],
            numpy.datetime64(data['birth'], 'D'),
            numpy.datetime64(data['death'], 'D'),
            data['url'],
            list(map(Event.from_dict, data['events'])) if 'events' in data else None,
            data['short_name'] if 'short_name' in data else None
        )


class Event(object):
    def __init__(
            self,
            name: str,
            date: numpy.datetime64,
            url: str = None
    ):
        self.name = name
        self.date = date
        self.url = url

    @staticmethod
    def from_dict(data: Dict[str, str]) -> 'Event':
        return Event(
            data['name'],
            numpy.datetime64(data['date'], 'D'),
            data['url'] if 'url' in data else None
        )


class Era(object):
    def __init__(
            self,
            name: str,
            start: numpy.datetime64,
            end: numpy.datetime64,
            url: str = None
    ):
        self.name = name
        self.start = start
        self.end = end
        self.url = url

    @staticmethod
    def from_dict(data: Dict[str, str]) -> 'Era':
        return Era(
            data['name'],
            numpy.datetime64(data['start'], 'D'),
            numpy.datetime64(data['end'], 'D'),
            data['url'] if 'url' in data else None
        )


def parse_json(filename: str) -> 'History':
    with open(filename, mode='r', newline='') as file:
        data = json.load(file)
        return History.from_dict(data)


