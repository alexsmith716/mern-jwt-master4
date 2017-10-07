
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {PropTypes} from 'prop-types';
import { fetchMessage } from './authentication.actions';

class Feature extends Component {

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  static fetchData({ store }) {
    return new Promise(resolve => resolve());
  }
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  componentWillMount() {
    this.props.fetchMessage();
  }

  render() {
    return (
      <div>Message from server: {this.props.message}</div>
    );
  }
  
}



const mapStateToProps = ({ auth }) => ({
  message: auth.message,
});

Feature.propTypes = {
  fetchMessage: PropTypes.func.isRequired,
  message: PropTypes.string,
};

Feature.defaultProps = {
  message: '',
};



export default connect(mapStateToProps, { fetchMessage })(Feature);
