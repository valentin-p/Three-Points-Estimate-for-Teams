import React from 'react';
import { BrowserRouter as Router, Switch, Route, NavLink } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import HomePage from './pages/HomePage';

import './App.css';

class App extends React.Component {
  render() {
     return (
      <Router>
      <div>
        <nav className="topnav">
          <div className="navbar-title">Welcome to Three Points Estimate for Teams</div>
          <NavLink exact={true} to={'/'}>Home</NavLink>
          <NavLink to={'/admin'} >Admin</NavLink>
        </nav>
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route path='/admin' component={AdminPage} />
        </Switch>
      </div>
    </Router>
     )
  }
}
export default App;

