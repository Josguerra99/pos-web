import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import SignIn from "../components/signin/signin";
import HomeDefault from "../components/default/homedefault";
import HomeAdmin from "../components/admin/homeadmin";
import HomeSystem from "../components/system/homesystem";
import history from "../components/common/history";

export default () => (
  <Router history={history}>
    <Switch>
      <Route path="/" exact render={props => <SignIn {...props} />} />

      <Route path="/signin" exact render={props => <SignIn {...props} />} />

      <Route
        path="/default/home"
        render={props => <HomeDefault {...props} />}
      />

      <Route
        path="/admin/home"
        exact
        render={props => <HomeAdmin {...props} />}
      />

      <Route
        path="/system/home"
        exact
        render={props => <HomeSystem {...props} />}
      />
    </Switch>
  </Router>
);
