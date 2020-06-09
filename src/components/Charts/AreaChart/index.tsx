import React, { useRef, useEffect } from 'react';
import { ICountryArea } from '@types';
import AreaD3Chart from './AreaD3Chart';
import ChartWrapper from '@/ChartWrapper';

interface IAreaChartProps {
  data: ICountryArea[];
}

const AreaChart:React.FC<IAreaChartProps> = ({ data }) => {
  const chartElementRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<AreaD3Chart | null>(null);

  useEffect(() => {
    if (!chartElementRef.current) return;
    chartInstanceRef.current = new AreaD3Chart(
      chartElementRef.current,
      data,
      {
        margins: { top: 50, right: 50, bottom: 50, left: 50 }
      }
    );
  }, [data])

  return (
    <ChartWrapper ref={chartElementRef} />
  );
};

export default AreaChart;