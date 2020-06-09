import React from 'react';
import Title from '@/UI/Title';
import ChartsGrid from '@/ChartsGrid';

const HomePage:React.FC = () => {
  return (
    <section>
      <Title>Charts</Title>
      <ChartsGrid></ChartsGrid>
    </section>
  );
};

export default HomePage;