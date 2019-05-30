import json
from collections import namedtuple
from operator import attrgetter
from typing import List, Dict

import bokeh
import pendulum
from bokeh.colors import Color
from bokeh.io import show, output_file
from bokeh.models import BoxZoomTool, WheelPanTool, WheelZoomTool, ZoomInTool, ZoomOutTool, \
    HoverTool
from bokeh.plotting import Figure
from bokeh.plotting import figure

from Lanes import Lanes

Person = namedtuple('Person', ['Name', 'Birth', 'Death'])

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


def read_data() -> Dict[str, List[Person]]:
    with open('data/data.json', mode='r', newline='') as file:
        data = json.load(file)
        thingy = dict()
        for category in data:
            persons = []
            for person in data[category]['persons']:
                persons.append(Person(
                    person['name'],
                    pendulum.parse(person['birth']),
                    pendulum.parse(person['death']),
                ))
            thingy[category] = sorted(persons, key=attrgetter('Birth'))

        return thingy


def plot_categories(plot: Figure, data: Dict[str, List[Person]]):
    colors = bokeh.palettes.viridis(len(files))
    offset = 0
    for (index, category) in zip(range(len(data)), data):
        offset = plot_persons(data[category], offset, colors[index], plot)


def plot_persons(persons: List[Person], offset: int, color: Color, plot: Figure) -> int:
    lanes = Lanes()
    for person in persons:
        lane = lanes.find_lane_ending_before(person.Birth)
        lanes.occupy(lane, person.Death)

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
    output_file('docs/timelines.html', mode='inline')

    plot = create_plot()
    files = read_data()
    plot_categories(plot, files)

    show(plot)
