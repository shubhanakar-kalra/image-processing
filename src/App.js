import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Dashboard from './containers/dashboard';
import ShowMarkDown from './components/ShowMarkDown';
import './App.css';
import Documenation from './Documentation.md';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route exact path='/' component={Dashboard} />
            <Route render={
              props => (<ShowMarkDown md={Documenation} />)
            } />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
