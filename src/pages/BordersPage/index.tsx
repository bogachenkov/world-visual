import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Title from '@/UI/Title';
import { GET_COUNTRIES_BORDERS } from '@queries';
import { IBorders } from '@types';
import BordersChart from '@/Charts/BordersChart';
import Preload from '@/UI/Preload';

interface IBordersData {
  Country: IBorders[];
}

const BordersPage:React.FC = () => {
  const { data, loading } = useQuery<IBordersData>(GET_COUNTRIES_BORDERS);
  return (
    <section>
      <Title>Countries by borders. chord diagram</Title>
      { (loading && !data) && <Preload /> }
      { data && <BordersChart data={data.Country} /> }
    </section>
  );
};

export default BordersPage;