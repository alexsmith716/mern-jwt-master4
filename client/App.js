
import React, { Component } from 'react';
import { Switch, Link, Route } from 'react-router-dom';
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++
import routeOptions from './routes';
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++

class App extends Component {

  render() {

    let routes = routeOptions.routes.map(({ path, component, exact }, i) =>

      // https://github.com/gaearon/react-hot-loader/issues/249
      // <Router routes={routes} history={browserHistory} key="ROUTER" />
      // <Route key={Math.random() + 'ROUTE_'} exact={exact} path={path} component={component} />
      <Route key="ROUTER" exact={exact} path={path} component={component} />
    );

    console.log('>>>> App.js <<<< render > routes: ', routes);

    return (

      <div>

        <Switch>

          {routes}

        </Switch>

      </div>

    );

  }

}
export default App;