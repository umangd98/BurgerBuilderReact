import React from 'react';
import burgerLogo from '../../assests/images/original.png';
import classes from './Logo.css';
export default function Logo(props) {
  return (
    <div className={classes.Logo} style={{ height: props.height }}>
      <img src={burgerLogo} alt="MyBurger" />
    </div>
  );
}
