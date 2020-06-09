import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router';

import Container from '@/UI/Container';
import Header from '@/Header';
import AppGrid from '@/UI/AppGrid';
import Preload from '@/UI/Preload';

const HomePage = React.lazy(() => import('./pages/HomePage'));
const PopulationPage = React.lazy(() => import('./pages/PopulationPage'));
const DensityPage  = React.lazy(() => import('./pages/DensityPage'));
const AreaPage  = React.lazy(() => import('./pages/AreaPage'));
const TimezonesPage  = React.lazy(() => import('./pages/TimezonesPage'));
const BordersPage  = React.lazy(() => import('./pages/BordersPage'));
const ContinentsPage  = React.lazy(() => import('./pages/ContinentsPage'));

const App:React.FC = () => {
  return (
    <Container>
      <AppGrid>
        <Header />
        <Suspense fallback={<Preload animated={false} />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/population" element={<PopulationPage />} />
            <Route path="/density" element={<DensityPage />} />
            <Route path="/areas" element={<AreaPage />} />
            <Route path="/timezones" element={<TimezonesPage />} />
            <Route path="/borders" element={<BordersPage />} />
            <Route path="/continents" element={<ContinentsPage />} />
          </Routes>
        </Suspense>
      </AppGrid>
    </Container>
  );
};

export default App;