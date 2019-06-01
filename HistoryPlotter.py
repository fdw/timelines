from typing import Dict, List

import pendulum
from bokeh.io import show
from bokeh.models import WheelPanTool, BoxZoomTool, WheelZoomTool, ZoomInTool, ZoomOutTool, \
    HoverTool, PanTool
from bokeh.plotting import figure

from History import Person, Era, Facet
from Lanes import Lanes


class HistoryPlotter(object):
    def __init__(self):
        wheel_pan_tool = WheelPanTool()
        self._plot = figure(
            plot_height=500,
            x_axis_type="datetime",
            toolbar_location='above',
            tools=[
                PanTool(dimensions='width'),
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

        self._plot.yaxis.visible = False
        self._plot.ygrid.grid_line_color = None

    def plot_facets(self, data: Dict[str, 'Facet']):
        offset = 0
        for facet_name in data:
            facet = data[facet_name]
            width = self.plot_persons(facet.people, offset, facet.color)
            self.plot_eras(facet.eras, offset, width, facet.color)
            offset = offset + width

    def plot_persons(self, persons: List[Person], offset: int, color: str) -> int:
        lane_padding = 3
        lane_height = 2
        lanes = Lanes()
        for person in persons:
            lane = lanes.find_lane_ending_before(person.birth)
            lanes.occupy(lane, person.death)

            self._plot.quad(
                left=person.birth,
                right=person.death,
                bottom=offset + lane * (lane_height + lane_padding) + 0.5 * lane_padding,
                top=offset + lane * (lane_height + lane_padding) + lane_height + 0.5 * lane_padding,
                color=color,
                name=person.name
            )

        return lanes.size() * (lane_height + lane_padding)

    def plot_eras(self, eras: List['Era'], offset: int, width: int, color: str):
        for era in eras:
            self._plot.quad(
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

    def finish(self):
        show(self._plot)
