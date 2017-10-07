
import React, { Component } from 'react';
import { Helmet } from 'react-helmet';

class Home extends Component {

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  static fetchData({ store }) {
    return new Promise(resolve => resolve());
  }
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  render() {

    console.log('>>>>>>> client > home.js > render')

    return (

      <div>

        <strong>Welcome !!!!!!</strong>

      </div>

    );
  }
}

export default Home;