import React from 'react';
import Navbar from '@/Navbar';

import './header.scss';

const Header:React.FC = () => {
  return (
    <header className="header">
      <h1 className="header--title">World's infographics</h1>
      <Navbar />
    </header>
  );
};

export default Header;