import glob

from bokeh.io import output_file

from History import parse_json, History
from HistoryPlotter import HistoryPlotter

output_file('docs/timelines.html', title='Timelines of the world', mode='inline')

plotter = HistoryPlotter()
history = History()
for filename in sorted(glob.glob('data/*.json')):
    history.append(parse_json(filename))
plotter.plot_facets(history.facets)

plotter.finish()
