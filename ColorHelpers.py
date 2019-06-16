from bokeh.colors import RGB, HSL, Color
from bokeh.colors.named import black, white


def luminance(color: Color) -> Color:
    if isinstance(color, RGB):
        return (0.299 * color.r + 0.587 * color.g + 0.114 * color.b) / 255
    elif isinstance(color, HSL):
        return color.l
    else:
        raise NotImplementedError


def text_color(color: Color) -> Color:
    if luminance(color) > 0.5:
        return black
    else:
        return white


def to_color(string: str) -> Color:
    return RGB(int(string[1:3], 16), int(string[3:5], 16), int(string[5:7], 16))
