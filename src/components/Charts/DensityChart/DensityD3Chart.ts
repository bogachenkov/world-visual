import * as d3 from 'd3';
import D3Chart, { IChartDimensions } from "@d3-chart";
import { ICountryDensity } from "@types";
 
import geoJson from './geo.json';

export default class DensityD3Chart extends D3Chart {
  private data: Map<string, ICountryDensity>;
  private tooltip:d3.Selection<HTMLDivElement, unknown, null, undefined>;
  private colors = [
    { color: '#02c4de', value: 0 },
    { color: '#02b3ca', value: 5 },
    { color: '#02a1b6', value: 10 },
    { color: '#028ea1', value: 20 },
    { color: '#038198', value: 35 },
    { color: '#04738f', value: 55 },
    { color: '#045676', value: 80 },
    { color: '#044862', value: 100 },
    { color: '#03394e', value: 150 },
    { color: '#033447', value: 200 },
  ]
  constructor(element: HTMLDivElement, private arrayData: ICountryDensity[], dimensions: IChartDimensions) {
    super(element, dimensions);
    this.tooltip = d3.select(element).append('div')
      .classed('density--info', true);
    this.tooltip.append('p').text('Please, select a country');
    this.data = this.formatData(arrayData);
    this.update();
  }

  updateData(data: ICountryDensity[]): void {
    this.data = this.formatData(data);
    this.update();
  }

  private formatData(data:ICountryDensity[]): Map<string, ICountryDensity> {
    const formattedData = new Map<string, ICountryDensity>();
    data.map(d => formattedData.set(d.alpha3Code, d));
    return formattedData;
  }

  private formatNumbers(n: number): string {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  private update(): void {
    const _ = this;

    const color = d3.scaleQuantile<string>()
      .domain(this.colors.map(c => c.value))
      .range(this.colors.map(c => c.color));

    const projection = d3.geoMercator()
      .scale(160)
      .center(d3.geoCentroid(<any>geoJson))
      .translate([this.width / 2 + 70, this.height / 2 - 50])
    const path = d3.geoPath(projection);
    
    this.svg.append('g').classed('countries', true)
      .selectAll('path')
      .data(geoJson.features)
      .join('path')
      .attr('d', <any>path)
      .attr('stroke', '#edf1f4')
      .attr('stroke-width', .75)
      .attr('opacity', .8)
      .style('fill', 'rgba(2, 196, 222, 0.3)')
      .on('mouseover', function(d) {
        const data = _.data.get(d.id);
        if (!data) return;
        d3.select(this)
          .attr('stroke', '#355c7d')
          .attr('opacity', 1);
        _.tooltip.selectAll('*').remove();
        _.tooltip.append('p').text('Country: ').append('strong').text(`${data.name}`);
        _.tooltip.append('p').text('Population: ').append('strong').text(`${_.formatNumbers(data.population)}`);
        _.tooltip.append('p').text('Area: ').append('strong').text(`${_.formatNumbers(data.area)} km`).append('sup').text('2');
        _.tooltip.append('p').text('Population Density: ').append('strong').text(`${data.density.toFixed(3)}`);
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('stroke', '#edf1f4')
          .attr('opacity', .8)
        _.tooltip.selectAll('*').remove();
        _.tooltip.append('p').text('Please, select a country');
      })
      .transition().duration(500)
      .style('fill', d => {
        let density = this.data.get(d.id)?.density;
        return density ? color(density) : '#02c4de';
      });

    
    this.svg.append('text')
      .attr('y', (_, i) => this.height - 65 - (this.colors.length * 25))
      .attr('x', 30)
      .attr('font-size', 12)
      .attr('font-family', "'Poppins', sans-serif")
      .attr('font-weight', 500)
      .style('text-transform', 'uppercase')
      .attr('fill', '#355c7d')
      .text('People per square km');

    const legendGroup = this.svg.selectAll('g.legend')
      .data(this.colors)
      .join('g')
        .classed('legend', true);
    legendGroup.append('rect')
      .attr('width', 20)
      .attr('height', 20)
      .attr('fill', d => d.color)
      .attr('y', (_, i) => this.height - 75 - ((this.colors.length - 1 - i) * 25))
      .attr('x', 30)
      .attr('opacity', .8);
    legendGroup.append('text')
      .attr('y', (_, i) => this.height - 60 - ((this.colors.length - 1 - i) * 25))
      .attr('x', 60)
      .attr('font-size', 12)
      .attr('font-weight', 500)
      .attr('font-family', "'Poppins', sans-serif")
      .attr('fill', '#355c7d')
      .text((d, i) => {
        if (i === this.colors.length - 1) return `> ${d.value}`;
        return `${d.value} - ${this.colors[i + 1].value}`
      });
  }
}