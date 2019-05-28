from bokeh.io import show, output_file
from bokeh.models import BoxZoomTool, PanTool, WheelPanTool, WheelZoomTool, ZoomInTool, ZoomOutTool, \
    HoverTool
from bokeh.plotting import figure

from helpers import read_data, plot_persons

artists = read_data('artists.csv')

output_file("output.html")

tooltips = [
    ("Name", "$name")
]

plot = figure(
    plot_height=500,
    plot_width=1000,
    x_axis_type="datetime",
    toolbar_location='above',
    tooltips=tooltips,
    tools=[BoxZoomTool(), PanTool(), WheelZoomTool(), WheelPanTool(), ZoomInTool(), ZoomOutTool(),
           HoverTool(mode='vline')]
)

plot_persons(artists, plot)

show(plot)
