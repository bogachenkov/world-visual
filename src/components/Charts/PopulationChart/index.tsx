import React, { useEffect, useRef } from 'react';
import PopulationD3Chart from './PopulationD3Chart';

import { ICountryPopulation } from '@types';

import './population-chart.scss';
import ChartWrapper from '@/ChartWrapper';

interface IChartProps {
  data: ICountryPopulation[];
}

const PopulationChart:React.FC<IChartProps> = ({ data }) => {
  const chartElemRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<PopulationD3Chart | null>(null);

  useEffect(() => {
    if (!chartElemRef.current) return;
    if (!chartInstanceRef.current) {
      chartInstanceRef.current = new PopulationD3Chart(
        chartElemRef.current, 
        data,
        {
          margins: {
            top: 100, 
            right: 0, 
            bottom: 150, 
            left: 100
          }
        }
      )
    } else {
      chartInstanceRef.current.updateData(data);
    }
  }, [data]);

  return (
    <ChartWrapper ref={chartElemRef} classNames={["population-chart"]} />
  );
};

export default PopulationChart;