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

import InventoryMngr from "../components/admin/inventory/inventoryMngr";
import Compras from "../components/admin/compras/compras";
import Facturacion from "../components/admin/facturacion/facturacion";
import HistorialFacturacion from "../components/admin/facturacion/historialFacturacion";
import DynamicInsertTable from "../components/common/dynamicInsertTable/dynamicInsertTable";

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
        path="/admin/inventario"
        exact
        render={props => <InventoryMngr {...props} />}
      />
      <Route
        path="/admin/compras"
        exact
        render={props => <Compras {...props} />}
      />{" "}
      <Route
        path="/admin/facturacion"
        exact
        render={props => <Facturacion {...props} />}
      />
      <Route
        path="/system/home"
        exact
        render={props => <HomeSystem {...props} />}
      />
      <Route
        path="/tests"
        exact
        render={props => <HistorialFacturacion {...props} />}
      />
    </Switch>
  </Router>
);
