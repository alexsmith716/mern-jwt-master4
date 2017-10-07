
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {PropTypes} from 'prop-types';

console.log('>>>> client > RequireAuth.js <<<< loaded');

export default function (ComposedComponent) {

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  class Authentication extends Component {

    static contextTypes = {
      router: PropTypes.object,
    };

    componentWillMount() {
      console.log('>>>> client > RequireAuth.js <<<< componentWillMount: ', this.props);
      if (!this.props.authenticated) {
        //this.context.router.history.push('/');
      }
    }

    componentWillUpdate(nextProps) {
      console.log('>>>> client > RequireAuth.js <<<< componentWillUpdate: ', nextProps);
      if (!nextProps.authenticated) {
        //this.context.router.history.push('/');
      }
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  const mapStateToProps = ({ auth }) => ({
    authenticated: auth.authenticated,
  });

  Authentication.propTypes = {
    authenticated: PropTypes.bool.isRequired,
  };

  return connect(mapStateToProps)(Authentication);

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

}
