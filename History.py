import json
from operator import attrgetter
from typing import List, Dict, Union

import pendulum
from pendulum import DateTime


class History(object):
    def __init__(self, facets: Dict[str, 'Facet']):
        self.facets = facets

    @property
    def people(self):
        return [person for facet in self.facets.values() for person in facet.people]

    @property
    def eras(self):
        return [era for facet in self.facets.values() for era in facet.eras]

    @staticmethod
    def from_dict(data: Dict[str, Union[str, Dict[str, str]]]):
        facets = {}
        for facet_name in data:
            facets[facet_name] = Facet.from_dict(facet_name, data[facet_name])

        return History(facets)


class Facet(object):
    def __init__(self, name: str, people: List['Person'], eras: List['Era']):
        self.name = name
        self.people = people
        self.eras = eras

    @staticmethod
    def from_dict(name, data: Dict[str, Union[str, Dict[str, str]]]) -> 'Facet':
        return Facet(
            name,
            sorted(map(Person.from_dict, data['people']), key=attrgetter('birth')),
            list(map(Era.from_dict, data['eras'])) if 'eras' in data else []
        )


class Person(object):
    def __init__(self, name: str, birth: DateTime, death: DateTime):
        self.name = name
        self.birth = birth
        self.death = death

    @staticmethod
    def from_dict(data: Dict[str, str]) -> 'Person':
        return Person(
            data['name'],
            pendulum.parse(data['birth']),
            pendulum.parse(data['death']),
        )


class Era(object):
    def __init__(self, name: str, start: DateTime, end: DateTime):
        self.name = name
        self.start = start
        self.end = end

    @staticmethod
    def from_dict(data: Dict[str, str]) -> 'Era':
        return Era(
            data['name'],
            pendulum.parse(data['start']),
            pendulum.parse(data['end']),
        )


def parse_json(filename: str):
    with open(filename, mode='r', newline='') as file:
        data = json.load(file)
        return History.from_dict(data)
