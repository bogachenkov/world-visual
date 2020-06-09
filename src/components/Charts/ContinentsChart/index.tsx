import React, { useRef, useEffect } from 'react';
import { IContinent } from '@types';
import ContinentsD3Chart from './ContinentsD3Chart';
import ChartWrapper from '@/ChartWrapper';

interface IContinentsChartProps {
  data: IContinent[];
}

const ContinentsChart:React.FC<IContinentsChartProps> = ({ data }) => {
  const chartElementRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<ContinentsD3Chart | null>(null);

  useEffect(() => {
    if (!chartElementRef.current) return;
    chartInstanceRef.current = new ContinentsD3Chart(
      chartElementRef.current,
      data,
      {
        margins: { top: 50, right: 50, bottom: 50, left: 50 }
      }
    );
  }, [data]);

  return (
    <ChartWrapper ref={chartElementRef} />
  );
};

export default ContinentsChart;