import * as d3 from 'd3';
import D3Chart, { IChartDimensions } from '@d3-chart';
import { IFormatTimezone } from '@types';

export default class TimezonesD3Chart extends D3Chart {
  private colors = [
    '#02c4de', '#02b3ca', '#02a1b6', '#028ea1', '#038198',
    '#04738f', '#045676', '#044862', '#03394e', '#033447'
  ]
  constructor(element: HTMLDivElement, private data: IFormatTimezone[], dimensions: IChartDimensions) {
    super(element, dimensions);
    this.addAxisGroups();
    this.update();
  }

  private formatNumbers(n: number): string {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  private update() {
    const _ = this;

    const x = d3.scaleLinear()
      .domain([0, d3.max(this.data, d => d.totalCountries)!])
      .range([0, this.width]);
    const y = d3.scaleLinear()
      .domain([0, d3.max(this.data, d => d.totalPopulation)!])
      .range([ this.height, 0 ]);
    const z = d3.scaleLinear()
      .domain([ d3.min(this.data, d => d.totalPopulation  + d.totalCountries)!, d3.max(this.data, d => d.totalPopulation + d.totalCountries)! ])
      .range([10, 30])
    const color = d3.scaleOrdinal<string>()
      .domain(this.data.map(d => d.name))
      .range(this.colors);

    const xAxisCall = d3.axisBottom(x)
      .ticks(4)
      .tickSize(-this.height)
      .tickPadding(15);
    const yAxisCall = d3.axisLeft(y)
      .tickSize(-this.width)
      .tickPadding(10);

    this.xAxisGroup.call(xAxisCall);
    this.yAxisGroup.call(yAxisCall);

    const bubbles = this.svg.append('g')
      .selectAll('.bubbles')
      .data(this.data)
      .join('g')
      .classed('bubbles', true);

    bubbles.append('circle')
      .attr('cx', x(0))
      .attr('cy', y(0))
      .attr('r', d => z(d.totalPopulation + d.totalCountries ) * .2)
      .attr('fill', d => color(d.name))
      .attr('stroke', d => color(d.name))
      .transition().duration(700)
        .attr('cx', d => x(d.totalCountries))
        .attr('cy', d => y(d.totalPopulation))

    bubbles.append('circle')
      .attr('cx', x(0))
      .attr('cy', y(0))
      .attr('r', d => z(d.totalPopulation + d.totalCountries))
      .attr('fill', 'transparent')
      .attr('stroke', d => color(d.name))
      .attr('stroke-width', 1.5)
      .transition().duration(700)
        .attr('cx', d => x(d.totalCountries))
        .attr('cy', d => y(d.totalPopulation))

    bubbles.append('circle')
      .attr('cx', x(0))
      .attr('cy', y(0))
      .attr('r', d => z(d.totalPopulation + d.totalCountries))
      .attr('fill', d => color(d.name))
      .attr('opacity', .7)
      .on('mouseover', function(d) { d3.select(this).attr('opacity', .6) })
      .on('mouseout', function(d) { d3.select(this).attr('opacity', .7) })
      .transition().duration(700)
        .attr('cx', d => x(d.totalCountries))
        .attr('cy', d => y(d.totalPopulation));

    bubbles.append('title')
      .text(d => `${d.name}. Population: ${this.formatNumbers(d.totalPopulation)}. Countries: ${d.totalCountries}`);
  }
}