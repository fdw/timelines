import json
from collections import namedtuple
from operator import attrgetter
from typing import List, Dict

import bokeh
import pendulum
from bokeh.colors import Color
from bokeh.io import show, output_file
from bokeh.models import BoxZoomTool, WheelPanTool, WheelZoomTool, ZoomInTool, ZoomOutTool, \
    HoverTool, BoxAnnotation
from bokeh.plotting import Figure
from bokeh.plotting import figure

from History import parse_json, Person, Facet
from Lanes import Lanes

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


def plot_facets(plot: Figure, data: Dict[str, 'Facet']):
    colors = bokeh.palettes.viridis(len(data))
    offset = 0
    for (index, facet_name) in zip(range(len(data)), data):
        offset = plot_persons(data[facet_name].people, offset, colors[index], plot)


def plot_persons(persons: List[Person], offset: int, color: Color, plot: Figure) -> int:
    lanes = Lanes()
    for person in persons:
        lane = lanes.find_lane_ending_before(person.birth)
        lanes.occupy(lane, person.death)

        plot.quad(
            left=person.birth,
            right=person.death,
            bottom=offset + lane * LANE_SPACING - HALF_LANE_HEIGHT,
            top=offset + lane * LANE_SPACING + HALF_LANE_HEIGHT,
            color=color,
            name=person.name
        )

    return offset + lanes.size() * LANE_SPACING


if __name__ == '__main__':
    output_file('docs/timelines.html', mode='inline')

    plot = create_plot()
    history = parse_json('data/data.json')
    plot_facets(plot, history.facets)

    show(plot)
