import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Title from '@/UI/Title';

import { GET_CONTINENTS } from '@queries';
import { IContinent } from '@types';
import ContinentsChart from '@/Charts/ContinentsChart';
import Preload from '@/UI/Preload';

interface IContinentsData {
  Region: IContinent[];
};

const ContinentsPage:React.FC = () => {
  const { data, loading } = useQuery<IContinentsData>(GET_CONTINENTS);
  return (
    <section>
      <Title>World population by Continents</Title>
      { (loading && !data) && <Preload /> }
      { data && <ContinentsChart data={data.Region} /> }
    </section>
  );
};

export default ContinentsPage;