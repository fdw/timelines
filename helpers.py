import csv
import logging
from collections import namedtuple
from operator import attrgetter
from typing import List

import pendulum
from bokeh.colors import Color
from bokeh.plotting import Figure

from Lanes import Lanes

Person = namedtuple('Person', ['Name', 'Birth', 'Death', 'Category'])

LANE_SPACING = 5
HALF_LANE_HEIGHT = 1


def read_data(filename: str) -> List[Person]:
    values = []
    with open(filename, mode='r', newline='') as csvfile:
        reader = csv.reader(csvfile)
        next(reader)  # skip header
        for row in reader:
            values.append(Person(
                row[0],
                pendulum.parse(row[1]),
                pendulum.parse(row[2]),
                row[3]
            ))
    return sorted(values, key=attrgetter('Birth'))


def plot_persons(persons: List[Person], offset: int, color: Color, plot: Figure) -> int:
    lanes = Lanes()
    for person in persons:
        lane = lanes.find_lane_ending_before(person.Birth)
        lanes.occupy(lane, person.Death)

        logging.debug(person.Name + ": " + str(lane) + " (" + person.Birth.format(
            "YYYY-MM-DD") + " - " + person.Death.format("YYYY-MM-DD") + ")")

        plot.quad(
            left=person.Birth,
            right=person.Death,
            bottom=offset + lane * LANE_SPACING - HALF_LANE_HEIGHT,
            top=offset + lane * LANE_SPACING + HALF_LANE_HEIGHT,
            color=color,
            name=person.Name
        )

    return offset + lanes.size() * LANE_SPACING


def plot_category(filename: str, starting_x: int, color: Color, plot: Figure) -> int:
    persons = read_data(filename)
    return plot_persons(persons, starting_x, color, plot)
