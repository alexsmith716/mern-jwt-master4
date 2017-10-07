
import React, { Component } from 'react';

class PageNotFound extends Component {

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  static fetchData({ store }) {
    return new Promise(resolve => resolve());
  }
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  render() {

    return (

      <div>
        Error 404; Page Not Found.
      </div>

    );

  }
}

export default PageNotFound;