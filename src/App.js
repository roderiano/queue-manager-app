import React from 'react';
import './App.less';
import { Route, } from 'react-router-dom';
import Authentication from './components/Authentication';
import AuthenticationManager from "./services/auth";
import AppCore from './components/AppTemplate';

const App = () => {

    let authManager = new AuthenticationManager();
    
    return (
      <Route exact path="/">
        { authManager.isAuthenticated() ? <AppCore /> : <Authentication /> }
      </Route>
    );
  
  }
  
export default App;