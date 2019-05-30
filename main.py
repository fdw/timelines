import csv
import logging
import os
from collections import namedtuple
from operator import attrgetter
from typing import List

import bokeh
import pendulum
from bokeh.colors import Color
from bokeh.io import show, output_file
from bokeh.models import BoxZoomTool, WheelPanTool, WheelZoomTool, ZoomInTool, ZoomOutTool, \
    HoverTool
from bokeh.plotting import Figure
from bokeh.plotting import figure

from Lanes import Lanes

Person = namedtuple('Person', ['Name', 'Birth', 'Death', 'Category'])

CATEGORY_OFFSET = 5
LANE_SPACING = 5
HALF_LANE_HEIGHT = 1


def create_plot() -> Figure:
    wheel_pan_tool = WheelPanTool()
    plot = figure(
        plot_height=500,
        x_axis_type="datetime",
        toolbar_location='above',
        tools=[
            BoxZoomTool(),
            WheelZoomTool(dimensions='width'),
            wheel_pan_tool,
            ZoomInTool(),
            ZoomOutTool(),
            HoverTool(mode='vline', tooltips=[("Name", "$name")])
        ],
        active_scroll=wheel_pan_tool,
        x_range=(pendulum.parse('1500-01-01'), pendulum.parse('2000-01-01')),
        sizing_mode='stretch_both'
    )

    plot.yaxis.visible = False
    plot.ygrid.grid_line_color = None

    return plot


def read_files() -> List[str]:
    return list(filter(
        lambda filename: os.fsdecode(filename).endswith('.csv'),
        os.listdir(os.fsencode('data'))
    ))


def plot_files(plot: Figure, files: List[str]):
    colors = bokeh.palettes.viridis(len(files))
    offset = 0
    for (index, filename) in zip(range(len(files)), files):
        offset = plot_file_as_category('data/' + os.fsdecode(filename), offset, colors[index],
                                       plot) + CATEGORY_OFFSET


def plot_file_as_category(filename: str, starting_x: int, color: Color, plot: Figure) -> int:
    persons = read_data(filename)
    return plot_persons(persons, starting_x, color, plot)


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


if __name__ == '__main__':
    output_file("output.html", mode='inline')

    plot = create_plot()
    files = read_files()
    plot_files(plot, files)

    show(plot)
