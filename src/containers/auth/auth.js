import React, { useState, useEffect } from 'react';
import Input from '../../components/UI/Input/Input';
import { connect } from 'react-redux';
import Button from '../../components/UI/Button/Button';
import classes from './auth.css';
import * as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';
import { Redirect } from 'react-router-dom';
import { checkValidity } from '../../store/utility';
const Auth = (props) => {
  const [controls, setcontrols] = useState({
    email: {
      elementType: 'input',
      elementConfig: {
        type: 'email',
        placeholder: 'Your Email',
      },
      value: '',
      validation: {
        required: true,
        // isEmail: true,
      },
      valid: false,
      touched: false,
    },
    password: {
      elementType: 'input',
      elementConfig: {
        type: 'password',
        placeholder: 'Password',
      },
      value: '',
      validation: {
        required: true,
        minLength: 6,
      },
      valid: false,
      touched: false,
    },
  });
  const [isSignup, setisSignup] = useState(true);
  // state = {
  //   controls: {
  //     email: {
  //       elementType: 'input',
  //       elementConfig: {
  //         type: 'email',
  //         placeholder: 'Your Email',
  //       },
  //       value: '',
  //       validation: {
  //         required: true,
  //         // isEmail: true,
  //       },
  //       valid: false,
  //       touched: false,
  //     },
  //     password: {
  //       elementType: 'input',
  //       elementConfig: {
  //         type: 'password',
  //         placeholder: 'Password',
  //       },
  //       value: '',
  //       validation: {
  //         required: true,
  //         minLength: 6,
  //       },
  //       valid: false,
  //       touched: false,
  //     },
  //   },
  //   isSignup: true,
  // };
  // componentDidMount() {
  //   if (!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
  //     this.props.onSetAuthRedirectPath();
  //   }
  // }
  useEffect(() => {
    if (!props.buildingBurger && props.authRedirectPath !== '/') {
      props.onSetAuthRedirectPath();
    }
  }, []);
  const switchAuthModeHandler = () => {
    // this.setState((prevState) => {
    //   return { isSignup: !prevState.isSignup };
    // });
    setisSignup(!isSignup);
  };

  const inputChangedHandler = (event, controlName) => {
    const updatedControls = {
      ...controls,
      [controlName]: {
        ...controls[controlName],
        value: event.target.value,
        valid: checkValidity(
          event.target.value,
          controls[controlName].validation
        ),
        touched: true,
      },
    };
    // this.setState({ controls: updatedControls });
    setcontrols(updatedControls);
  };

  const submitHandler = (event) => {
    // console.log('submit handler');
    event.preventDefault();

    props.onAuth(controls.email.value, controls.password.value, isSignup);
  };

  const formElementsArray = [];
  for (let key in controls) {
    formElementsArray.push({
      id: key,
      config: controls[key],
    });
  }
  let form = formElementsArray.map((formElement) => (
    <Input
      key={formElement.id}
      elementType={formElement.config.elementType}
      elementConfig={formElement.config.elementConfig}
      value={formElement.config.value}
      changed={(event) => inputChangedHandler(event, formElement.id)}
      invalid={!formElement.config.valid}
      touched={formElement.config.touched}
      shouldValidate={formElement.config.validation}
    />
  ));
  if (props.loading) {
    form = <Spinner />;
  }
  let errorMessage = null;
  if (props.error) {
    errorMessage = <p>{props.error.message}</p>;
  }
  let authRedirect = null;
  if (props.isAuthenticated) {
    authRedirect = <Redirect to={props.authRedirectPath} />;
  }
  return (
    <div className={classes.auth}>
      {authRedirect}
      {errorMessage}
      <form onSubmit={submitHandler}>
        {form}
        <Button btnType="Success">Submit</Button>
      </form>
      <Button clicked={switchAuthModeHandler} btnType="Danger">
        Switch to {isSignup ? 'SIGNIN' : 'SIGNUP'}
      </Button>
    </div>
  );
};

const mapStateToProps = (state) => ({
  loading: state.auth.loading,
  error: state.auth.error,
  isAuthenticated: state.auth.token !== null,
  buildingBurger: state.burgerBuilder.building,
  authRedirectPath: state.auth.authRedirectPath,
});

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (email, password, isSignup) =>
      dispatch(actions.auth(email, password, isSignup)),
    onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/')),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
