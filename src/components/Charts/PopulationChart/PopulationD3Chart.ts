import * as d3 from 'd3';
import D3Chart, { IChartDimensions } from "@d3-chart";
import { ICountryPopulation } from "@types";

import personIcon from '@images/person.svg';

export default class PopulationD3Chart extends D3Chart {
  private colors = ["#033447","#03394e","#044862","#045676","#04738f","#038198","#028ea1","#02a1b6","#02b3ca","#02c4de"];
  constructor(element: HTMLDivElement, private data: ICountryPopulation[], dimensions: IChartDimensions) {
    super(element, dimensions);
    this.addAxisGroups();
    this.update();
  }

  updateData(data: ICountryPopulation[]):void {
    this.data = data;
    this.update();
  }

  private formatNumbers(n: number): string {
    if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K+";
    if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M+";
    if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B+";
    if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T+";
    return n.toString()
  }

  private update():void {
    const y = d3.scaleLinear()
      .domain([ 0, d3.max(this.data, d => d.population)! ])
      .range([this.height, 0]);
    const x = d3.scaleBand()
      .domain(this.data.map(d => d.name))
      .range([0, this.width])
      .padding(0.3);

    const yAxisCall = d3.axisLeft(y)
      .tickSize(-this.width)
      .tickPadding(10);
    const xAxisCall = d3.axisBottom(x)
      .tickSize(8)
      .tickPadding(5)
      .tickFormat(val => {
        if (val === 'United States of America') return 'USA';
        if (val === 'Russian Federation') return 'Russia';
        return val;
      });

    this.yAxisGroup.transition().duration(500).call(yAxisCall);
    this.xAxisGroup.call(xAxisCall).selectAll('.tick text').call(this.wrap, x.bandwidth());

    const shuffledColors = [...this.colors].sort(() => Math.random() - 0.5);

    const barGroups = this.svg.selectAll('g.bar').data(this.data);
    barGroups.exit().transition().duration(500).attr('height', 0).remove();

    barGroups
      .select('rect')
      .transition()
      .duration(500)
        .attr('x', d => x(d.name)!)
        .attr('y', d => y(d.population) - 1)
        .attr('width', x.bandwidth)
        .attr('height', d => this.height - y(d.population))
        .attr('fill', (_, i) => shuffledColors[i]);
    
    barGroups
      .select('g.bar--image')
      .select('image')
      .transition().duration(500)
        .attr('x', d => x(d.name)! + x.bandwidth() - 27)
        .attr('y', d => y(d.population) - 35);

    barGroups.select('text')
      .transition()
      .duration(500)
      .attr('x', d => x(d.name)!)
      .attr('y', d => y(d.population) - 10)
      .text(d => this.formatNumbers(d.population))

    const enteredBarGroups = barGroups.enter().append('g').classed('bar', true);
      
    enteredBarGroups.append('rect')
      .attr('x', d => x(d.name)!)
      .attr('y', this.height - 1)
      .attr('width', x.bandwidth)
      .attr('fill', (_, i) => shuffledColors[i])
      .attr('opacity', .1)
      .transition().duration(500)
        .attr('y', d => y(d.population) - 1)
        .attr('height', d => this.height - y(d.population))
        .attr('opacity', .7);

    enteredBarGroups.append('g').classed('bar--image', true)
      .append('svg:image')
        .attr('xlink:href', personIcon)
        .attr('width', 30)
        .attr('height', 40)
        .attr('x', d => x(d.name)! + x.bandwidth() - 27)
        .attr('y', this.height - 35)
        .transition().duration(500)
          .attr('y', d => y(d.population) - 35);

    enteredBarGroups.append('text')
        .attr('x', d => x(d.name)!)
        .attr('y', d => this.height - 10)
        .attr('font-family', "'Open Sans', sans-serif")
        .attr('font-size', 11)
        .attr('font-weight', 700)
        .attr('fill', '#355c7d')
        .text(d => this.formatNumbers(d.population))
        .transition().duration(500)
          .attr('y', d => y(d.population) - 10)
        
  }
}