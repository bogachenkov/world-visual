import React, { useRef, useEffect } from 'react';
import { ICountryDensity } from '@types';
import DensityD3Chart from './DensityD3Chart';

import './density.scss';
import ChartWrapper from '@/ChartWrapper';

interface IChartProps {
  data: ICountryDensity[]
}

const DensityChart:React.FC<IChartProps> = ({ data }) => {
  const chartElementRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<DensityD3Chart | null>(null);

  useEffect(() => {
    if ( !chartElementRef.current || !data ) return;
    if ( !chartInstanceRef.current ) {
      chartInstanceRef.current = new DensityD3Chart(
        chartElementRef.current,
        data,
        {
          margins: {
            top: 30,
            right: 10,
            bottom: 10,
            left: 10
          }
        }
      )
    }
  }, [ data ])

  return (
    <ChartWrapper classNames={["density"]} ref={chartElementRef} />
  );
};

export default DensityChart;