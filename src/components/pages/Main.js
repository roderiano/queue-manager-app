import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Authentication from './Authentication';
import AppStructure from './AppStructure';

const Main = () => {
  return (
    <Switch> {/* The Switch decides which component to show based on the current URL.*/}
      <Route exact path='/' component={AppStructure}></Route>
      <Route exact path='/authentication' component={Authentication}></Route>
    </Switch>
  );
}

export default Main;