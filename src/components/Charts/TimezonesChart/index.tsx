import React, { useRef, useEffect } from 'react';
import { ITimezone } from '@types';
import TimezonesD3Chart from './TimezonesD3Chart';

import './timezones-chart.scss';
import ChartWrapper from '@/ChartWrapper';

interface ITimezonesChartProps {
  data: ITimezone[];
};

const TimezonesChart:React.FC<ITimezonesChartProps> = ({ data }) => {
  const chartElementRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<TimezonesD3Chart | null>(null);

  useEffect(() => {
    if (!chartElementRef.current) return;

    const formattedData = data.map(d => {
      const totalCountries = d.countries.length;
      const totalPopulation = d.countries.reduce((total, x) => total + x.population, 0);
      return {
        name: d.name,
        totalCountries,
        totalPopulation
      }
    });
    
    chartInstanceRef.current = new TimezonesD3Chart(
      chartElementRef.current,
      formattedData,
      {
        margins: { top: 50, right: 30, bottom: 80, left: 100 }
      }
    )
  }, [data])

  return (
    <ChartWrapper classNames={["timezones-chart"]} ref={chartElementRef} />
  );
};

export default TimezonesChart;