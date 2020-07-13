import React, { useState } from 'react';
import { connect } from 'react-redux';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import { purchaseBurger } from '../../../store/actions/index';
import { checkValidity } from '../../../store/utility';
const contactData = (props) => {
  const [orderForm, setorderForm] = useState({
    name: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'Your Name',
      },
      value: '',
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    street: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'Your Street',
      },
      value: '',
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    zipCode: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'Your Zipcode',
      },
      value: '',
      validation: {
        required: true,
        minLength: 6,
        maxLength: 6,
      },
      valid: false,
      touched: false,
    },
    country: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'Your Country',
      },
      value: '',
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    email: {
      elementType: 'input',
      elementConfig: {
        type: 'email',
        placeholder: 'Your E-Mail',
      },
      value: '',
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    deliveryMethod: {
      elementType: 'select',
      elementConfig: {
        options: [
          { value: 'fastest', displayValue: 'Fastest' },
          { value: 'cheapest', displayValue: 'Cheapest' },
        ],
      },
      value: 'fastest',
      validation: {},
      valid: true,
    },
  });
  const [formIsValid, setformIsValid] = useState(false);
  // state = {
  //   orderForm: {
  //     name: {
  //       elementType: 'input',
  //       elementConfig: {
  //         type: 'text',
  //         placeholder: 'Your Name',
  //       },
  //       value: '',
  //       validation: {
  //         required: true,
  //       },
  //       valid: false,
  //       touched: false,
  //     },
  //     street: {
  //       elementType: 'input',
  //       elementConfig: {
  //         type: 'text',
  //         placeholder: 'Your Street',
  //       },
  //       value: '',
  //       validation: {
  //         required: true,
  //       },
  //       valid: false,
  //       touched: false,
  //     },
  //     zipCode: {
  //       elementType: 'input',
  //       elementConfig: {
  //         type: 'text',
  //         placeholder: 'Your Zipcode',
  //       },
  //       value: '',
  //       validation: {
  //         required: true,
  //         minLength: 6,
  //         maxLength: 6,
  //       },
  //       valid: false,
  //       touched: false,
  //     },
  //     country: {
  //       elementType: 'input',
  //       elementConfig: {
  //         type: 'text',
  //         placeholder: 'Your Country',
  //       },
  //       value: '',
  //       validation: {
  //         required: true,
  //       },
  //       valid: false,
  //       touched: false,
  //     },
  //     email: {
  //       elementType: 'input',
  //       elementConfig: {
  //         type: 'email',
  //         placeholder: 'Your E-Mail',
  //       },
  //       value: '',
  //       validation: {
  //         required: true,
  //       },
  //       valid: false,
  //       touched: false,
  //     },
  //     deliveryMethod: {
  //       elementType: 'select',
  //       elementConfig: {
  //         options: [
  //           { value: 'fastest', displayValue: 'Fastest' },
  //           { value: 'cheapest', displayValue: 'Cheapest' },
  //         ],
  //       },
  //       value: 'fastest',
  //       validation: {},
  //       valid: true,
  //     },
  //   },
  //   formValid: false,
  //   loading: false,
  // };
  const orderHandler = (event) => {
    event.preventDefault();

    // this.setState({ loading: true });
    const formData = {};
    for (let formElementIdentifier in orderForm) {
      formData[formElementIdentifier] = orderForm[formElementIdentifier].value;
    }
    const order = {
      ingredients: props.ings,
      price: props.price,
      orderData: formData,
      userId: props.userId,
    };
    props.onOrderBurger(order, props.token);
  };

  const inputChangedHandler = (event, inputIdentifier) => {
    // console.log(event.target.value);
    const updatedOrderForm = { ...orderForm };
    const updatedFormElement = { ...updatedOrderForm[inputIdentifier] };
    updatedFormElement.value = event.target.value;
    updatedFormElement.valid = checkValidity(
      updatedFormElement.value,
      updatedFormElement.validation
    );
    updatedFormElement.touched = true;
    updatedOrderForm[inputIdentifier] = updatedFormElement;
    // console.log(updatedFormElement);
    let formIsValid = true;
    for (let inputIdentifier in updatedOrderForm) {
      formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
    }
    setorderForm(updatedOrderForm);
    setformIsValid(formIsValid);
    // this.setState({ orderForm: updatedOrderForm, formValid: formIsValid });
  };

  const formElementsArray = [];
  for (let key in orderForm) {
    formElementsArray.push({
      id: key,
      config: orderForm[key],
    });
  }
  let form = (
    <form onSubmit={orderHandler}>
      {formElementsArray.map((formElement) => (
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
      ))}
      <Button btnType="Success" disabled={!formIsValid}>
        ORDER
      </Button>
    </form>
  );
  if (props.loading) {
    form = <Spinner />;
  }
  return (
    <div className={classes.ContactData}>
      <h4>Enter your Contact Data</h4>
      {form}
    </div>
  );
};

const mapStateToProps = (state) => ({
  ings: state.burgerBuilder.ingredients,
  price: state.burgerBuilder.totalPrice,
  loading: state.order.loading,
  token: state.auth.token,
  userId: state.auth.userId,
});
const mapDispatchToProps = (dispatch) => {
  return {
    onOrderBurger: (orderData, token) =>
      dispatch(purchaseBurger(orderData, token)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(contactData, axios));
