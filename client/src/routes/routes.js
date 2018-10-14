import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import SignIn from "../components/signin/signin";
import HomeDefault from "../components/default/homedefault";
import HomeAdmin from "../components/admin/homeadmin";

export default () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact render={props => <SignIn {...props} />} />

      <Route path="/signin" exact render={props => <SignIn {...props} />} />

      <Route
        path="/employee/home"
        render={props => <HomeDefault {...props} />}
      />

      <Route
        path="/admin/home"
        exact
        render={props => <HomeAdmin {...props} />}
      />
    </Switch>
  </BrowserRouter>
);
