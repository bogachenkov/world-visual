import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Title from '@/UI/Title';
import { GET_TIMEZONES } from '@queries';
import { ITimezone } from '@types';
import LanguagesChart from '@/Charts/TimezonesChart';
import Preload from '@/UI/Preload';

interface ITimezonesData {
  Timezone: ITimezone[];
}

const TimezonesPage:React.FC = () => {
  const { data, loading } = useQuery<ITimezonesData>(GET_TIMEZONES);
  return (
    <section>
      <Title>Number of countries and total population in each timezone</Title>
      { (loading && !data) && <Preload /> }
      { data && <LanguagesChart data={data.Timezone} /> }
    </section>
  );
};

export default TimezonesPage;