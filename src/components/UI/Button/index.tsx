import React from 'react';
import './button.scss';
const Button:React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...btnProps }) => {
  return (
    <button className={`button ${className}`} {...btnProps}>{ children }</button>
  );
};

export default Button;