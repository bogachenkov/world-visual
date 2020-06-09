import React from 'react';
import './title.scss';

const Title:React.FC = ({ children }) => {
  return (
    <h2 className="title">
      { children }
    </h2>
  );
};

export default Title;