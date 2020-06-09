import React, { forwardRef } from 'react';
import './chart-wrapper.scss';

interface IChartWrapperProps {
  classNames?: string[];
}

const ChartWrapper = forwardRef<HTMLDivElement, IChartWrapperProps>(({ children, classNames = [] }, ref) => {
  return (
    <div ref={ref} className={`chart-wrapper ${classNames.join(' ')}`}>
      { children }
    </div>
  );
});

export default ChartWrapper;