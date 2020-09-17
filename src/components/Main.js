import React from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';

import Authentication from './modules/Auth/Authentication';
import { isAuthenticated, } from "./../services/auth";
import AppCore from './AppCore';

const Main = () => {
  
  return (
    <Switch> {/* The Switch decides which component to show based on the current URL.*/}
      <Route path="/app">
        { isAuthenticated() ? <AppCore /> : <Redirect to="/auth" /> }
      </Route>
      
      <Route path="/auth">
        { !isAuthenticated() ? <Authentication /> : <Redirect to="/app" /> }
      </Route>
    </Switch>
  );

}

export default withRouter(Main);