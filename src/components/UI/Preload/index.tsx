import React from 'react';

import './preload.scss';

interface IPreloadProps {
  animated?: boolean;
}

const Preload:React.FC<IPreloadProps> = ({ animated = true }) => {
  return (
    <div className={`preload ${animated ? 'preload-animated' : 'preload-simple'}`}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};

export default Preload;