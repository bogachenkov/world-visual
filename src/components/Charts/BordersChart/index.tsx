import React, { useRef, useEffect } from 'react';
import { IBorders } from '@types';
import BordersD3Chart from './BordersD3Chart';
import ChartWrapper from '@/ChartWrapper';

interface IBordersChartProps {
  data: IBorders[];
}

const BordersChart:React.FC<IBordersChartProps> = ({ data }) => {
  const chartElementRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<BordersD3Chart | null>(null);

  useEffect(() => {
    if (!chartElementRef.current) return;
    chartInstanceRef.current = new BordersD3Chart(
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

export default BordersChart;