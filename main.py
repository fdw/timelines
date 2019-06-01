from bokeh.io import show, output_file

from History import parse_json
from HistoryPlotter import HistoryPlotter

if __name__ == '__main__':
    output_file('docs/timelines.html', title='Timelines of the world', mode='inline')

    plotter = HistoryPlotter()
    history = parse_json('data/data.json')
    plotter.plot_facets(history.facets)

    plotter.finish()
