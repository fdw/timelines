import csv
import logging
from collections import namedtuple
from operator import attrgetter
from typing import List

import pendulum
from bokeh.plotting import Figure

from Lanes import Lanes

Person = namedtuple('Person', ['Name', 'Birth', 'Death', 'Category'])


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


def plot_persons(persons: List[Person], plot: Figure):
    lanes = Lanes()
    for person in persons:
        lane = lanes.find_lane_ending_before(person.Birth)
        lanes.occupy(lane, person.Death)

        logging.debug(person.Name + ": " + str(lane) + " (" + person.Birth.format(
            "YYYY-MM-DD") + " - " + person.Death.format("YYYY-MM-DD") + ")")

        plot.quad(
            left=person.Birth,
            right=person.Death,
            bottom=lane * 5 - 1,
            top=lane * 5 + 1,
            color="#ff0000",
            name=person.Name
        )