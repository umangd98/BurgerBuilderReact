import React from 'react';
import classes from './Button.css';
export default function Button(props) {
  return (
    <button
      onClick={props.clicked}
      className={[classes.Button, classes[props.btnType]].join(' ')}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
}
