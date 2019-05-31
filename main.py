from typing import List, Dict

import bokeh
import pendulum
from bokeh.io import show, output_file
from bokeh.models import BoxZoomTool, WheelPanTool, WheelZoomTool, ZoomInTool, ZoomOutTool, \
    HoverTool
from bokeh.plotting import Figure
from bokeh.plotting import figure

from History import parse_json, Person, Facet, Era
from Lanes import Lanes


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
        width = plot_persons(data[facet_name].people, offset, colors[index], plot)
        plot_eras(data[facet_name].eras, offset, width, colors[index], plot)
        offset = offset + width


def plot_persons(persons: List[Person], offset: int, color: str, plot: Figure) -> int:
    lane_padding = 3
    lane_height = 2
    lanes = Lanes()
    for person in persons:
        lane = lanes.find_lane_ending_before(person.birth)
        lanes.occupy(lane, person.death)

        plot.quad(
            left=person.birth,
            right=person.death,
            bottom=offset + lane * (lane_height + lane_padding) + 0.5 * lane_padding,
            top=offset + lane * (lane_height + lane_padding) + lane_height + 0.5 * lane_padding,
            color=color,
            name=person.name
        )

    return lanes.size() * (lane_height + lane_padding)


def plot_eras(eras: List['Era'], offset: int, width: int, color: str, plot: Figure):
    for era in eras:
        plot.quad(
            left=era.start,
            right=era.end,
            bottom=offset,
            top=offset + width,
            fill_alpha=0.1,
            fill_color=color,
            line_width=1,
            line_alpha=0.2,
            line_color=color,
            name=era.name,
            hatch_pattern='right_diagonal_line',
            hatch_scale=10,
            hatch_alpha=0.1
        )


if __name__ == '__main__':
    output_file('docs/timelines.html', title='Timelines of the world', mode='inline')

    plot = create_plot()
    history = parse_json('data/data.json')
    plot_facets(plot, history.facets)

    show(plot)
