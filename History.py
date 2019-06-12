import json
from operator import attrgetter
from typing import List, Dict, Union

import bokeh
import pendulum
import numpy as np
from bokeh.colors import RGB, Color
from pendulum import DateTime


class History(object):
    def __init__(self, facets: Dict[str, 'Facet']):
        self.facets = facets

    @property
    def people(self):
        return [person for facet in self.facets.values() for person in facet.people]

    @property
    def events(self):
        return [event for facet in self.facets.values() for event in facet.events]

    @property
    def eras(self):
        return [era for facet in self.facets.values() for era in facet.eras]

    @staticmethod
    def from_dict(data: Dict[str, Union[str, Dict[str, str]]]):
        colors = iter([to_color(color) for color in bokeh.palettes.viridis(len(data))])
        facets = {}
        for facet_name in data:
            facets[facet_name] = Facet.from_dict(facet_name, next(colors), data[facet_name])

        return History(facets)


class Facet(object):
    def __init__(
            self,
            name: str,
            color: Color,
            people: List['Person'],
            events: List['Event'],
            eras: List['Era']
    ):
        self.name = name
        self.color = color
        self.people = people
        self.events = events
        self.eras = eras

    @staticmethod
    def from_dict(name: str, color: Color, data: Dict[str, Union[str, Dict[str, str]]]) -> 'Facet':
        return Facet(
            name,
            color,
            list(map(Person.from_dict, data['people'])) if 'people' in data else [],
            list(map(Event.from_dict, data['events'])) if 'events' in data else [],
            list(map(Era.from_dict, data['eras'])) if 'eras' in data else []
        )


class Person(object):
    def __init__(self, name: str, birth: np.datetime64, death: np.datetime64):
        self.name = name
        self.birth = birth
        self.death = death

    @staticmethod
    def from_dict(data: Dict[str, str]) -> 'Person':
        return Person(
            data['name'],
            np.datetime64(data['birth'], 'D'),
            np.datetime64(data['death'], 'D'),
        )


class Event(object):
    def __init__(self, name: str, date: np.datetime64):
        self.name = name
        self.date = date

    @staticmethod
    def from_dict(data: Dict[str, str]) -> 'Event':
        return Event(
            data['name'],
            np.datetime64(data['date'], 'D')
        )


class Era(object):
    def __init__(self, name: str, start: np.datetime64, end: np.datetime64):
        self.name = name
        self.start = start
        self.end = end

    @staticmethod
    def from_dict(data: Dict[str, str]) -> 'Era':
        return Era(
            data['name'],
            np.datetime64(data['start'], 'D'),
            np.datetime64(data['end'], 'D'),
        )


def parse_json(filename: str):
    with open(filename, mode='r', newline='') as file:
        data = json.load(file)
        return History.from_dict(data)


def to_color(string: str) -> Color:
    return RGB(int(string[1:3], 16), int(string[3:5], 16), int(string[5:7], 16))
