import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Title from '@/UI/Title';
import { GET_COUNTRIES_AREA } from '@queries';
import { ICountryArea } from '@types';
import AreaChart from '@/Charts/AreaChart';
import Preload from '@/UI/Preload';

interface ICountriesAreaData {
  Country: ICountryArea[]
};

const AreaPage:React.FC = () => {
  const { data, loading } = useQuery<ICountriesAreaData>(GET_COUNTRIES_AREA);
  return (
    <section>
      <Title>Countries with the Areas less than 1.5 million km<sup>2</sup></Title>
      { (loading && !data) && <Preload /> }
      { data && <AreaChart data={data.Country} /> }
    </section>
  );
};

export default AreaPage;