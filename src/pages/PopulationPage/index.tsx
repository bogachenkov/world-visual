import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { GET_COUNTRIES_POPULATION } from '@queries';
import PopulationChart from '@/Charts/PopulationChart';
import { ICountryPopulation } from '@types';

import './population-page.scss';
import Title from '@/UI/Title';
import Button from '@/UI/Button';
import Preload from '@/UI/Preload';

interface IPopulationData {
  Country: ICountryPopulation[]
}

type orderBy = 'population_desc' | 'population_asc';

interface IPopulationVars {
  orderBy: orderBy
}

const PopulationPage:React.FC = () => {
  const [ orderBy, setOrderBy ] = useState<orderBy>('population_desc');
  const { data, loading } = useQuery<IPopulationData, IPopulationVars>(GET_COUNTRIES_POPULATION, {
    variables: { orderBy }
  });

  const handleOrdering = (e: React.SyntheticEvent):void => {
    e.preventDefault();
    setOrderBy(orderBy => orderBy === 'population_desc' ? 'population_asc' : 'population_desc')
  }

  return (
    <section className="population-page">
      <header className="population-page--header">
        <Title>
          Top ten countries with the { orderBy === 'population_desc' ? 'largest' : 'smallest' } population
        </Title>
        <Button className="population-page--btn" onClick={handleOrdering}>
          Show <strong>{ orderBy === 'population_desc' ? 'smallest' : 'largest' }</strong>
        </Button>
      </header>
      { (loading && !data) && <Preload /> }
      { data && <PopulationChart data={data.Country} /> }
    </section>
  );
};

export default PopulationPage;