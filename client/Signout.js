
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {PropTypes} from 'prop-types';

import { signoutUser } from './authentication.actions';

class Signout extends Component {

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  static fetchData({ store }) {
    return new Promise(resolve => resolve());
  }
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  
  componentWillMount() {
    this.props.signoutUser();
  }

  render() {
    return (
      <div>No... Come back!</div>
    );
  }
}



Signout.propTypes = {
  signoutUser: PropTypes.func.isRequired,
};

export default connect(null, { signoutUser })(Signout);
