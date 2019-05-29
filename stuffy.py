from collections import namedtuple

import bokeh
import pendulum
from bokeh.io import show, output_file
from bokeh.models import BoxZoomTool, PanTool, WheelPanTool, WheelZoomTool, ZoomInTool, ZoomOutTool, \
    HoverTool
from bokeh.plotting import figure

from helpers import plot_category

CATEGORY_OFFSET = 5

Category = namedtuple('Category', ['Name', 'Filename'])

categories = [
    Category('Artists', 'data/artists.csv'),
    Category('Composers', 'data/composers.csv'),
    Category('Writers', 'data/writers.csv')
]

output_file("output.html", mode='inline')

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
    x_range=(0, pendulum.now()),
    sizing_mode='stretch_both'
)
plot.yaxis.visible = False
plot.ygrid.grid_line_color = None

colors = bokeh.palettes.viridis(len(categories))
offset = 0
index = 0
for category in categories:
    offset = plot_category(category.Filename, offset, colors[index], plot) + CATEGORY_OFFSET
    index = index + 1

show(plot)
