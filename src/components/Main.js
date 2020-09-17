import React from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';

import Authentication from './modules/Auth/Authentication';
import AuthenticationManager from "./../services/auth";
import AppCore from './AppCore';

const Main = () => {

  let authManager = new AuthenticationManager();
  
  return (
    <Switch> {/* The Switch decides which component to show based on the current URL.*/}
      <Route path="/app">
        { authManager.isAuthenticated() ? <AppCore /> : <Redirect to="/auth" /> }
      </Route>
      
      <Route path="/auth">
        { !authManager.isAuthenticated() ? <Authentication /> : <Redirect to="/app" /> }
      </Route>
    </Switch>
  );

}

export default withRouter(Main);