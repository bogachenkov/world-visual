import * as d3 from 'd3';
import D3Chart, { IChartDimensions } from '@d3-chart';
import { IBorders } from '@types';

export default class BordersD3Chart extends D3Chart {
  private radius: number;
  private getNameByIndex: Map<number, string> = new Map;
  private color = '#033447';
  private chordColor = '#045676';
  
  constructor(element: HTMLDivElement, private data: IBorders[], dimensions: IChartDimensions) {
    super(element, dimensions, element.clientHeight > element.clientWidth);
    this.radius = Math.min(this.height, this.width) / 2.6;
    this.centerChart(this.width / 2 + this.margins.left, this.height / 2 + this.margins.top);

    this.svg.style('opacity', .1);

    this.update();
  }

  private createMatrix() {
    const filteredCountries = this.data.filter(d => d.borders.length > 0);
    filteredCountries.map((d, i) => this.getNameByIndex.set(i, d.name));

    const matrix = filteredCountries.map(d => {
      const borders = d.borders.map(b => b.alpha3Code);
      return filteredCountries.map(md => {
        if (borders.includes(md.alpha3Code)) return 1;
        return 0;
      })
    });

    return matrix;
  }

  private update() {
    const chord = d3.chord()
      .padAngle(.05)
      .sortSubgroups(d3.descending)
      .sortChords(d3.descending)
      (this.createMatrix());

    const arc = d3.arc()
      .innerRadius(this.radius)
      .outerRadius(this.radius + 2);

    const ribbon = d3.ribbon().radius(this.radius);
    
    const g = this.svg.append('g')
      .selectAll('g')
      .data(chord.groups)
      .join('g');

    const onMouseOver = (selected: d3.ChordGroup ) => {
      g.filter(d => d.index !== selected.index)
      .style('opacity', .65);

      this.svg.selectAll('.chord')
        .filter( d => (d.source.index !== selected.index) && (d.target.index !== selected.index))
        .style("opacity", 0.1);
    }

    const onMouseOut = () => {
      g.style('opacity', 1);
      this.svg.selectAll('.chord')
        .style('opacity', 1);
    }

    g.append('path')
      .attr('fill', this.color)
      .attr('stroke', this.color)
      .attr('d', <any>arc)
      .on('mouseover', onMouseOver)
      .on('mouseout', onMouseOut)

    g.append("text")
      .each(d => { d.angle = (d.startAngle + d.endAngle) / 2; })
      .attr("dy", ".35em")
      .attr("transform", d => `
        rotate(${(d.angle * 180 / Math.PI - 90)})
        translate(${this.radius + 10})
        ${d.angle > Math.PI ? "rotate(180)" : ""}
      `)
      .attr("text-anchor", d => d.angle > Math.PI ? "end" : null)
      .attr('font-size', 10)
      .attr('fill', this.color)
      .text(d => this.getNameByIndex.get(d.index)!)
      .on('mouseover', onMouseOver)
      .on('mouseout', onMouseOut)

    this.svg.append("g")
      .attr("fill-opacity", 0.67)
      .selectAll(".chord")
      .data(chord)
      .join("path")
        .classed('chord', true)
        .attr("stroke", this.chordColor)
        .attr("fill", this.chordColor)
        .attr("d", <any>ribbon)
        .on("mouseover", d => onMouseOver(d.source))
        .on("mouseout", onMouseOut);

    this.svg.transition().duration(600).style('opacity', 1)
  }
}