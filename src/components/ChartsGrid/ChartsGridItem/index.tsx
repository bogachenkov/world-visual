import React from 'react';
import { Link } from 'react-router-dom';

import './charts-grid-item.scss';

interface IChartGridItemProps {
  chart: {
    uri: string;
    name: string;
    img: string;
  }
}

const ChartsGridItem:React.FC<IChartGridItemProps> = ({ chart }) => {
  return (
    <Link className="charts-grid-item" to={chart.uri}>
      <div className="charts-grid-item--image" style={{ backgroundImage: `url("${chart.img}")` }}></div>
      <p className="charts-grid-item--title"> {chart.name} </p>
    </Link>
  );
};

export default ChartsGridItem;