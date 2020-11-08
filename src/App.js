import React from 'react';
import './App.less';
import { Route, withRouter, Switch } from 'react-router-dom';
import Authentication from './components/Authentication';
import AuthenticationManager from "./services/auth";
import AppCore from './components/AppTemplate';
import Totem from './components/totem/Totem'

const App = () => {

    let authManager = new AuthenticationManager();
    
    return (
        <Switch>
            <Route exact path="/totem" component={ () => <Totem /> }/>
            <Route path="/" component={ () => authManager.isAuthenticated() ? <AppCore /> : <Authentication /> }/>
        </Switch>
    );
  
  }
  
export default withRouter(App);