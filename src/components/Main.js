import React from 'react';
import { Route, withRouter, } from 'react-router-dom';

import Authentication from './Authentication';
import AuthenticationManager from "./../services/auth";
import AppCore from './AppLayout';

const Main = () => {

  let authManager = new AuthenticationManager();
  
  return (
    <Route path="/">
      { authManager.isAuthenticated() ? <AppCore /> : <Authentication /> }
    </Route>
  );

}

export default withRouter(Main);