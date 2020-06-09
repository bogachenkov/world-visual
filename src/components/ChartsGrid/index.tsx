import React, { useState } from 'react';

import areasImg from '@images/areas.png';
import bordersImg from '@images/borders.png';
import continentsImg from '@images/continents.png';
import densityImg from '@images/density.png';
import populationImg from '@images/population.png';
import timezonesImg from '@images/timezones.png';

import './charts-grid.scss';
import ChartsGridItem from './ChartsGridItem';

const ChartsGrid:React.FC = () => {
  const [ charts ] = useState([
    {
      uri: '/population',
      name: 'TOP TEN COUNTRIES WITH THE LARGEST POPULATION',
      img: populationImg
    },
    {
      uri: '/density',
      name: 'WORLD POPULATION DENSITY INTERACTIVE MAP',
      img: densityImg
    },
    {
      uri: '/areas',
      name: 'COUNTRIES WITH THE AREAS LESS THAN 1.5 MILLION SQUARE KM',
      img: areasImg
    },
    {
      uri: '/continents',
      name: 'WORLD POPULATION BY CONTINENTS',
      img: continentsImg
    },
    {
      uri: '/timezones',
      name: 'NUMBER OF COUNTRIES AND TOTAL POPULATION IN EACH TIMEZONE',
      img: timezonesImg
    },
    {
      uri: '/borders',
      name: 'COUNTRIES BY BORDERS. CHORD DIAGRAM',
      img: bordersImg
    },
  ]);
  return (
    <div className="charts-grid">
      {
        charts.map(c => <ChartsGridItem key={c.uri} chart={c} />)
      }
    </div>
  );
};

export default ChartsGrid;