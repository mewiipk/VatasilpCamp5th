import React from 'react';
import './styles/index.scss';
import {Switch, Route} from 'react-router-dom';

import MainMinority from './pages/minority/Main';
import AdminMinority from './pages/minority/Admin';

function App() {
  return (
    <div className="App">
      <Switch>

          <Route exact path="/minority">
            <MainMinority />
          </Route>

          <Route path="/minority/admin">
            <AdminMinority />
          </Route>

          <Route path="/">
            <div>Homeeee!!!</div>
          </Route>

        </Switch>
    </div>
  );
}

export default App;
