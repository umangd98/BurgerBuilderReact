import React, { useEffect, useState } from 'react';
import Aux from '../Aux';
import Modal from '../../components/UI/Modal/Modal';

export default function withErrorHandler(WrappedComponent, axios) {
  return (props) => {
    const [error, seterror] = useState(null);
    const reqInterceptor = axios.interceptors.request.use((req) => {
      // this.setState({ error: null });
      seterror(null);
      return req;
    });
    const resInterceptor = axios.interceptors.response.use(
      (res) => res,
      (err) => {
        seterror(err);
      }
    );

    // componentWillUnmount() {
    //   console.log('Will unmount', this.reqInterceptor, this.resInterceptor);
    //   axios.interceptors.request.eject(this.reqInterceptor);
    //   axios.interceptors.response.eject(this.resInterceptor);
    // }
    useEffect(() => {
      return () => {
        console.log('Will unmount', reqInterceptor, resInterceptor);
        axios.interceptors.request.eject(reqInterceptor);
        axios.interceptors.response.eject(resInterceptor);
      };
    }, [reqInterceptor, resInterceptor]);
    const errorConfirmedHandler = () => {
      seterror(null);
    };

    return (
      <Aux>
        <Modal show={error} modalClosed={errorConfirmedHandler}>
          {error ? error.message : null}
        </Modal>
        <WrappedComponent {...props} />
      </Aux>
    );
  };
}
