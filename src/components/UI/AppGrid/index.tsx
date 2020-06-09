import React from 'react';

import './app-grid.scss';

const AppGrid:React.FC = ({ children }) => {
  return (
    <div className="app-grid">
      { children }
    </div>
  );
};

export default AppGrid;