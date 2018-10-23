import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import SignIn from "../components/signin/signin";

import HomeDefault from "../components/default/homedefault";
import HomeSystem from "../components/system/homesystem";

import HomeAdmin from "../components/admin/homeadmin";
import AgregarResolucionAdmin from "../components/admin/agregarResolucion";
import HistorialResoluiciones from "../components/admin/historialResoluciones";
import ResolucionesActivas from "../components/admin/resolucionesActivas";

import history from "../components/common/history";
import Filter from "../components/common/filters";

import WarningMessage from "../components/common/warningMessage";

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
        path="/admin/agregar-resolucion"
        exact
        render={props => <AgregarResolucionAdmin {...props} />}
      />
      <Route
        path="/admin/historial-resoluciones"
        exact
        render={props => <HistorialResoluiciones {...props} />}
      />
      <Route
        path="/admin/resoluciones-activas"
        exact
        render={props => <ResolucionesActivas {...props} />}
      />
      <Route
        path="/system/home"
        exact
        render={props => <HomeSystem {...props} />}
      />

      <Route
        path="/tests"
        exact
        render={props => <WarningMessage {...props} />}
      />
    </Switch>
  </Router>
);
