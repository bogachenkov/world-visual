import * as d3 from 'd3';
import D3Chart, { IChartDimensions } from '@d3-chart';
import { IContinent, ICountryPopulation } from '@types';

export default class ContinentsD3Chart extends D3Chart {
  private radius: number;
  private colors = [
    '#02c4de', '#02b3ca', '#02a1b6', '#028ea1', '#038198',
    '#04738f', '#045676', '#044862', '#03394e', '#033447'
  ];
  private totalValue!: number;
  constructor(element: HTMLDivElement, private data: IContinent[], dimensions: IChartDimensions) {
    super(element, dimensions);

    this.radius = Math.min(this.width, this.height) / 2 - this.margins.top;
    this.centerChart(this.width / 2 + this.margins.left, this.height / 2 + this.margins.top);

    this.update();
  }

  private reduceCountries(countries: ICountryPopulation[]): number {
    return countries.reduce((total, country) => total + country.population, 0);
  }

  private formatData() {
    const data = this.data.map(d => {
      const value: number = d.subregions.reduce((total, sub) => total + this.reduceCountries(sub.countries), 0)
      return {
        name: d.name,
        value
      }
    });
    this.totalValue = data.reduce((total, d) => total + d.value, 0);

    const oceaniaIndex = data.findIndex(d => d.name === 'Oceania');
    const africaIndex = data.findIndex(d => d.name === 'Africa');

    const africa = data.splice(africaIndex, 1)[0];
    data.splice(oceaniaIndex, 0, africa);

    const americas = data.find(d => d.name === "Americas")!; 
    return [
      ...data.filter(d => d.name !== 'Americas'),
      { name: "North America", value: americas.value * .58 },
      { name: "South America", value: americas.value * .42 }
    ];
  }

  private update() {
    const color = d3.scaleOrdinal<string>()
      .domain(this.data.map(d => d.name))
      .range(this.colors);

    const pie = d3.pie<{ name: string; value: number }>()
      .sort(null)
      .value(d => d.value)
      .startAngle(this.degToRad(15))
      .endAngle(this.degToRad(375))
    const data = pie(this.formatData());

    const arc = d3.arc()
      .innerRadius(this.radius * 0.5)
      .outerRadius(this.radius * 0.8)

    const outerArc = d3.arc()
      .innerRadius(this.radius * 0.9)
      .outerRadius(this.radius * 0.9);

    this.svg.selectAll('path')
      .data(data)
      .join('path')
        .attr('fill', d => color(d.data.name))
        .transition().duration(500)
        .attrTween('d', d => {
          const i = d3.interpolate(d.startAngle + .1, d.endAngle);
          return t => {
            d.endAngle = i(t);
            return arc(<any>d);          }
        })
        .attr("stroke", "#edf1f4")
        .style("stroke-width", "2px")

    this.svg.selectAll('circle')
      .data(data)
      .join('circle')
        .attr('fill', '#597a95')
        .attr('cx', d => arc.centroid(<any>d)[0])
        .attr('cy', d => arc.centroid(<any>d)[1])
        .attr('r', 3)

    this.svg.selectAll('polyline')
      .data(data)
      .join('polyline')
        .attr('stroke', '#597a95')
        .attr('fill', 'none')
        .attr('stroke-width', 1)
        .attr('opacity', 0)
        .attr('points', d => {
          const angles = {
            name: d.data.name,
            startAngle: d.startAngle * 180 / Math.PI,
            endAngle: d.endAngle * 180 / Math.PI 
          };
          const posA = arc.centroid(<any>d) // line insertion in the slice
          const posB = outerArc.centroid(<any>d) // line break: we use the other arc generator that has been built only for that
          const posC = outerArc.centroid(<any>d); // Label position = almost the same as posB
          let midangle = d.startAngle + ((d.endAngle - d.startAngle) / 2) // we need the angle to see if the X position will be at the extreme right or extreme left
          if (midangle > (2 * Math.PI)) midangle -= 2 * Math.PI;
          posC[0] = this.radius * 1.25 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
          return [posA, posB, posC]
        })
        .transition().duration(500)
          .attr('opacity', 1);
    
    this.svg.selectAll('text.percentage')
      .data(data)
      .join('text')
        .classed('percentage', true)
        .text(d => `${(d.data.value/this.totalValue*100).toFixed(1)}%`)
        .attr('font-size', 18)
        .attr('font-weight', 700)
        .attr('fill', '#355c7d')
        .style('text-anchor', d => {
          var midangle = d.startAngle + ((d.endAngle - d.startAngle) / 2);
          if (midangle > (2 * Math.PI)) midangle -= 2 * Math.PI;
          return (midangle < Math.PI ? 'end' : 'start')
        })
        .attr('opacity', 0)
        .transition().duration(500)
          .attr('transform', d => {
            const pos = outerArc.centroid(<any>d);
            let midangle = d.startAngle + ((d.endAngle - d.startAngle) / 2);
            if (midangle > (2 * Math.PI)) midangle -= 2 * Math.PI;
            pos[0] = this.radius * 1.25 * (midangle < Math.PI ? 1 : -1);
            pos[1] = pos[1] - 5;
            return 'translate(' + pos + ')';
          })
          .attr('opacity', 1);
        
    this.svg.selectAll('text.name')
      .data(data)
      .join('text')
        .classed('name', true)
        .text(d => d.data.name)
        .attr('font-size', 12)
        .attr('fill', '#355c7d')
        .attr('font-weight', 600)
        .style('text-transform', 'uppercase')
        .style('text-anchor', d => {
          var midangle = d.startAngle + ((d.endAngle - d.startAngle) / 2);
          if (midangle > (2 * Math.PI)) midangle -= 2 * Math.PI;
          return (midangle < Math.PI ? 'end' : 'start')
        })
        .attr('opacity', 0)
        .transition().duration(500)
          .attr('transform', d => {
            const pos = outerArc.centroid(<any>d);
            let midangle = d.startAngle + ((d.endAngle - d.startAngle) / 2);
            if (midangle > (2 * Math.PI)) midangle -= 2 * Math.PI;
            pos[0] = this.radius * 1.25 * (midangle < Math.PI ? 1 : -1);
            pos[1] = pos[1] + 20;
            return 'translate(' + pos + ')';
          })
          .attr('opacity', 1);
  }
}