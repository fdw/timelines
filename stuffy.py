from collections import namedtuple

import bokeh
import pendulum
from bokeh.colors import Color
from bokeh.io import show, output_file
from bokeh.models import BoxZoomTool, PanTool, WheelPanTool, WheelZoomTool, ZoomInTool, ZoomOutTool, \
    HoverTool
from bokeh.plotting import figure

from helpers import plot_category

CATEGORY_OFFSET = 5

Category = namedtuple('Category', ['Name', 'Filename', 'Color'])

categories = [
    Category('Artists', 'data/artists.csv', bokeh.colors.named.aquamarine),
    Category('Composers', 'data/composers.csv', bokeh.colors.named.darkviolet),
    Category('Writers', 'data/writers.csv', bokeh.colors.named.midnightblue)
]

output_file("output.html")

tooltips = [
    ("Name", "$name")
]

plot = figure(
    plot_height=500,
    x_axis_type="datetime",
    toolbar_location='above',
    tools=[BoxZoomTool(), PanTool(), WheelZoomTool(dimensions='width'), WheelPanTool(), ZoomInTool(), ZoomOutTool(),
           HoverTool(mode='vline', tooltips=tooltips)],
    x_range=(0, pendulum.now()),
    sizing_mode='stretch_both'
)
plot.yaxis.visible = False
plot.ygrid.grid_line_color = None

offset = 0
for category in categories:
    offset = plot_category(category.Filename, offset, category.Color, plot) + CATEGORY_OFFSET

show(plot)
