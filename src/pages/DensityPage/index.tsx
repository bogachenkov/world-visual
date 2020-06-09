import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import Title from '@/UI/Title';
import { GET_COUNTRIES_DENSITY } from '@queries';
import { ICountryDensity } from '@types';
import DensityChart from '@/Charts/DensityChart';
import Preload from '@/UI/Preload';

interface IDensityData {
  Country: ICountryDensity[]
}

const DensityPage:React.FC = () => {
  const { data, loading } = useQuery<IDensityData>(GET_COUNTRIES_DENSITY);

  return (
    <section className="density-page">
      <Title>World Population Density Interactive Map</Title>
      { (loading && !data) && <Preload /> }
      { data && <DensityChart data={data.Country} /> }
    </section>
  );
};

export default DensityPage;