import * as d3 from 'd3';
import D3Chart, { IChartDimensions } from '@d3-chart';
import { ICountryArea } from '@types';
import { transition } from 'd3';

export default class AreaD3Chart extends D3Chart {
  private outerRadius: number;
  private arc!:d3.Arc<any, ICountryArea>;
  private colors = [
    { color: '#02c4de', value: 0 },
    { color: '#02b3ca', value: 100000 },
    { color: '#02a1b6', value: 200000 },
    { color: '#028ea1', value: 300000 },
    { color: '#038198', value: 550000 },
    { color: '#04738f', value: 700000 },
    { color: '#045676', value: 800000 },
    { color: '#044862', value: 90000 },
    { color: '#03394e', value: 1100000 },
    { color: '#033447', value: 1300000 },
  ]

  constructor(element: HTMLDivElement, private data: ICountryArea[], dimensions: IChartDimensions) {
    super(element, dimensions);
    const widthIsLess = Math.min(this.width, this.height) === this.width;
    this.outerRadius = widthIsLess ? this.width / 2 : this.height / 1.5;
    this.centerChart(this.width / 2 + this.margins.left, (this.height / (widthIsLess ? 2 : 1.5)) + this.margins.top * 2)
    this.update();
  }
  
  private yAxis(g: d3.Selection<SVGGElement, any, any, any>, y: d3.ScaleLinear<number, number>) {
    return g.attr("text-anchor", "middle")
      .call(g => g.selectAll("g")
        .data(y.ticks(5).slice(1))
        .join("g")
          .attr("fill", "none")
          .call((g, i) => g.append("circle")
              .attr("stroke", "#bbb")
              .attr("stroke-opacity", 0.5)
              .attr("r", y))
          .call(g => g.append("text")
              .attr("y", d => -y(d))
              .attr("dy", "0.35em")
              .attr("stroke-width", 5)
              .text(y.tickFormat(5, "s"))
              .attr('font-size', 11)
              .attr('font-family', `'Open Sans', sans-serif`)
              .attr('font-weight', 600)
          .clone(true)
              .attr("fill", "#000")
              .attr("stroke", "none")));
  }

  private arcTween(d: ICountryArea): (t: number) => string {
    const _ = this;
    const i = d3.interpolate({ area: 0 }, d);
    return function(t: number) {
      const d = _.arc(i(t));
      return d ? d : '';
    }
}

  private update() {
    const color = d3.scaleQuantile<string>()
      .domain(this.colors.map(c => c.value))
      .range(this.colors.map(c => c.color));

    const x = d3.scaleBand()
      .range([Math.PI * 1.4, Math.PI * 2.6])
      .align(0)
      .domain( this.data.map(d => d.name) );

    const yLinear = d3.scaleLinear()
      .range([ this.outerRadius * this.outerRadius, 0])
      .domain([d3.min(this.data, d=>d.area)!, d3.max(this.data, d => d.area)!]);
    const y = Object.assign((d: number) => Math.sqrt(yLinear(d)), yLinear);

    this.svg.append("g")
    .call(this.yAxis, y);

    this.arc = d3.arc<ICountryArea>()
      .innerRadius(y(0))
      .outerRadius(d => y(d.area))
      .startAngle(d => x(d.name)!)
      .endAngle(d => x(d.name)! + x.bandwidth())
      .padAngle(0.01)
      .padRadius(90);
      
    this.svg.append('g')
      .selectAll('path')
      .data(this.data)
      .join('path')
        .attr('fill', d => color(d.area!))
        .transition().duration(500)
        .attrTween('d', d => this.arcTween(d));

    this.svg.append('g')
      .selectAll('g')
      .data(this.data)
      .join('g')
        .attr("text-anchor", d => (x(d.name)! + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start")
        .attr("transform", d => "rotate(" + ((x(d.name)! + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + ( this.outerRadius + 5) + ",0)")
        .append("text")
          .text(d => {
            switch(d.name) {
              case `Lao People's Democratic Republic`: return `Lao People's D.R.`;
              case 'Macedonia (the former Yugoslav Republic of)': return 'Macedonia';
              case `Micronesia (Federated States of)`: return 'Micronesia';
              case 'Venezuela (Bolivarian Republic of)': return 'Venezuela';
              default: return d.name;
            }
          })
          .attr("transform", d => (x(d.name)! + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)")
          .style("font-size", "10px")
          .attr("alignment-baseline", "middle")
  }
}