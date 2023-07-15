import {fabric} from 'fabric'
import chroma from 'chroma-js'
import {HistoryCanvas} from './HistoryCanvas'
import {
    BACKGROUND_COLOR,
    DATE_ORIGIN,
    DATE_SCALE_FACTOR,
    FIRST_TICK,
    HOVER_COLOR,
    LANE_HEIGHT,
    LAST_TICK
} from './Properties'
import {IGroupOptions} from "fabric/fabric-impl";

export class InteractiveCanvas extends HistoryCanvas {

    constructor() {
        super();

        this.supportResizing();
        this.addWheel();
        this.addHover();
        this.addTooltips();
        this.addWikipediaLinks();
        this.addKeyboardControl();
    }

    supportResizing(): void {
        const that = this;
        window.onresize = function () {
            that.setDimensions({width: window.innerWidth, height: window.innerHeight});
            that.renderGrid();
            that.requestRenderAll();
        }
    }

    addWheel(): void {
        const that = this;
        this.on('mouse:wheel', function (event) {
            const wheelEvent = event.e as WheelEvent
            if (wheelEvent.ctrlKey) {
                that._relativeZoom(wheelEvent.deltaY / 20, new fabric.Point(wheelEvent.offsetX, wheelEvent.offsetY))
            } else {
                that._pan(wheelEvent.deltaY * 5, 0)
            }
            event.e.preventDefault();
            event.e.stopPropagation();
        })
    }

    _pan(amountHorizontal: number, amountVertical: number): void {
        const newX = InteractiveCanvas.clamp(HistoryCanvas.calculateAbsoluteX(FIRST_TICK), amountHorizontal - this.viewportTransform[4], HistoryCanvas.calculateAbsoluteX(LAST_TICK));
        const newY = InteractiveCanvas.clamp(0, amountVertical - this.viewportTransform[5], 2 * window.innerHeight);

        this.absolutePan(new fabric.Point(newX, newY));
        if (newY > 0) {
            this.renderGrid()
        }
        this.requestRenderAll()
    }

    _relativeZoom(delta: number, point: fabric.Point): void {
        this._absoluteZoom(this._calculateAbsoluteZoom(delta), point)
    }

    _calculateAbsoluteZoom(delta: number): number {
        const zoom = this.getZoom();
        return InteractiveCanvas.clamp(0.5, zoom + delta, 3)
    }

    _absoluteZoom(absoluteZoom: number, point: fabric.Point): void {
        this.zoomToPoint(point, absoluteZoom);

        const original_viewportTransform = this.viewportTransform;
        if (original_viewportTransform[5] >= 0) {
            this.viewportTransform[5] = 0
        } else if (Math.ceil(original_viewportTransform[5]) < Math.floor(this.getHeight() - window.innerHeight * absoluteZoom)) {
            this.viewportTransform[5] = this.getHeight() - window.innerHeight * absoluteZoom
        }

        this.renderGrid();
        this.requestRenderAll();
    }

    addHover(): void {
        const that = this;
        const lineId = 'mouseline';

        this.on('mouse:move', function (options) {
            that.remove(that.getItem(lineId));

            const p = that.getPointer(options.e);

            const line = new fabric.Line(
                [
                    p.x,
                    -that.viewportTransform[5] / that.viewportTransform[3],
                    p.x,
                    (-that.viewportTransform[5] + window.innerHeight) / that.viewportTransform[3]
                ],
                {
                    stroke: HOVER_COLOR.hex(),
                    strokeWidth: 1
                });

            const label = new fabric.Textbox(
                DATE_ORIGIN.plus({months: p.x * DATE_SCALE_FACTOR}).year.toString(),
                {
                    left: p.x,
                    top: (-that.viewportTransform[5] + window.innerHeight - LANE_HEIGHT) / that.viewportTransform[3],
                    originX: 'center',
                    originY: 'center',
                    fontSize: (LANE_HEIGHT - 4) / that.viewportTransform[3],
                    textAlign: 'center',
                    strokeWidth: 0,
                    fill: HOVER_COLOR.hex(),
                    textBackgroundColor: BACKGROUND_COLOR.hex()
                }
            );

            const mouseLine = new fabric.Group([line, label], {id: lineId} as IGroupOptions);

            that.add(mouseLine);
            mouseLine.moveTo(that.tickCount() + 1);
            that.requestRenderAll()
        })
    }

    addTooltips(): void {
        const that = this;
        this.on('mouse:over', function (event) {

            if (event.target && event.target.tooltipText) {
                const p = that.getPointer(event.e);

                const tooltipText = new fabric.Textbox(
                    event.target.tooltipText,
                    {
                        fontSize: LANE_HEIGHT - 7,
                        textAlign: 'center',
                        strokeWidth: 0,
                        fill: 'black',
                        width: 190,
                        left: p.x,
                        top: p.y - 7,
                        originX: 'center',
                        originY: 'bottom',
                    }
                );

                const tooltipBackground = new fabric.Rect({
                    fill: chroma(event.target.fill as string).brighten(3).hex(),
                    stroke: chroma(event.target.fill as string).hex(),
                    strokeWidth: 1,
                    width: tooltipText.width,
                    height: tooltipText.height + 2,
                    left: p.x,
                    top: p.y - 5,
                    originX: 'center',
                    originY: 'bottom',
                });

                if (p.y < tooltipText.height + 10) {
                    tooltipText.setOptions(
                        {
                            originY: 'top',
                            top: p.y + 15
                        });
                    tooltipBackground.setOptions(
                        {
                            originY: 'top',
                            top: p.y + 13
                        })
                }

                const tooltip = new fabric.Group([tooltipBackground, tooltipText], {id: 'tooltip'} as IGroupOptions);

                that.add(tooltip)
            }
            that.requestRenderAll()
        });

        this.on('mouse:out', function () {
            that.remove(that.getItem('tooltip'));
            that.requestRenderAll()
        })
    }

    addWikipediaLinks(): void {
        this.on('mouse:down', function (event) {
            if (event.target && event.target.url) {
                window.open(event.target.url)
            }
        })
    }

    addKeyboardControl(): void {
        const that = this;
        document.onkeydown = function (e) {
            switch (e.key) {
                case 'ArrowLeft':
                    that._pan(-30, 0);
                    break;
                case 'ArrowRight':
                    that._pan(30, 0);
                    break;
                case 'ArrowUp':
                    that._pan(0, -30);
                    break;
                case 'ArrowDown':
                    that._pan(0, 30);
                    break;
                case '+':
                    that._relativeZoom(0.25, new fabric.Point(0, 0));
                    break;
                case '-':
                    that._relativeZoom(-0.25, new fabric.Point(0, 0));
                    break;
                case '0':
                    that._absoluteZoom(1, new fabric.Point(0, 0));
            }
        }
    }

    static clamp(min: number, value: number, max: number): number {
        return Math.max(min, Math.min(max, value))
    }

}
