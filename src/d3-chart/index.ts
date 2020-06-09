import * as d3 from 'd3';

export interface IMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface IChartDimensions {
  margins: IMargins;
  width?: number;
  height?: number;
}

export type D3Selection = d3.Selection<SVGGElement, any, any, any>; 

export default abstract class D3Chart {
  protected svg: D3Selection;
  protected margins:IMargins;
  protected width:number;
  protected height:number;
  protected xAxisGroup!: D3Selection;
  protected yAxisGroup!: D3Selection;

  constructor(
    element: HTMLDivElement,
    { margins, height, width }: IChartDimensions,
    verticalScreen?: boolean
  ) {
    this.margins = margins;

    const svgWidth = (width || element.clientWidth);
    const svgHeight = (height || element.clientHeight);

    const viewBoxWidth = Math.max(svgWidth, 1100);
    const viewBoxHeight = Math.max(svgHeight, verticalScreen ? 1100 : 700);

    this.width = viewBoxWidth - this.margins.left - this.margins.right;
    this.height = viewBoxHeight - this.margins.top - this.margins.bottom;

    this.svg = 
      d3.select(element)
        .append('svg')
          .attr('viewBox', `0 0 ${viewBoxWidth} ${viewBoxHeight}`)
          .attr("preserveAspectRatio", "xMinYMin meet")
        .append('g');
    this.centerChart();
  }
  
  protected addAxisGroups(x: boolean = true, y: boolean = true): void {
    if (x) {
      this.xAxisGroup = this.svg.append('g')
        .classed('axis-group', true)
        .classed('x-axis-group', true)
        .attr('transform', `translate(0, ${this.height})`);
    }
    if (y) {
      this.yAxisGroup = this.svg.append('g')
        .classed('axis-group', true)
        .classed('y-axis-group', true);
    }
  }

  protected centerChart(left: number = this.margins.left, top: number = this.margins.top):void {
    this.svg.attr('transform', `translate(${left}, ${top})`)
  }

  protected wrap(text: d3.Selection<d3.BaseType, unknown, SVGGElement, any>, width: number) {
    text.each(function() {
      let text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line: string[] = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em")
      while (word = words.pop()) {
        line.push(word)
        tspan.text(line.join(" "))
        if (tspan.node()!.getComputedTextLength() > width) {
          line.pop()
          tspan.text(line.join(" "))
          line = [word]
          tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", `${++lineNumber * lineHeight + dy}em`).text(word)
        }
      }
    })
  }

  protected degToRad(deg: number): number {
    return deg * Math.PI / 180;
  }

  protected radToDeg(rad: number): number {
    return rad * 180 / Math.PI;
  }
}