import React from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';

import Authentication from './Authentication';
import AuthenticationManager from "./../services/auth";
import AppCore from './AppLayout';

const Main = () => {

  let authManager = new AuthenticationManager();
  
  return (
    <Switch>
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