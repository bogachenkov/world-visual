import React from 'react';
import { NavLink } from 'react-router-dom';

import './navbar.scss';

const Navbar:React.FC = () => {
  return (
    <nav role="navigation" className="navbar">
      <input type="checkbox" />
      <div className="navbar--hamburger">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className="navbar--menu">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/population">Population</NavLink>
        <NavLink to="/density">Density</NavLink>
        <NavLink to="/areas">Areas</NavLink>
        <NavLink to="/continents">Continents</NavLink>
        <NavLink to="/timezones">Timezones</NavLink>
        <NavLink to="/borders">Borders</NavLink>
      </div>
    </nav>
  );
};

export default Navbar;