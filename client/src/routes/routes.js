import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import SignIn from "../components/signin/signin";

import Home from "../components/everyone/home";
import RegistroBasic from "../components/everyone/registro/basic";
import RegistroPro from "../components/everyone/registro/pro";
import RegistroGolden from "../components/everyone/registro/golden";

import HomeDefault from "../components/default/homedefault";
import HomeSystem from "../components/system/resolucionSistema";

import HomeAdmin from "../components/admin/homeadmin";
import AgregarResolucionAdmin from "../components/admin/resoluciones/agregarResolucion";
import HistorialResoluiciones from "../components/admin/resoluciones/historialResoluciones";
import ResolucionesActivas from "../components/admin/resoluciones/resolucionesActivas";

import history from "../components/common/history";
import Filter from "../components/common/filters";

import InventoryMngr from "../components/admin/inventory/inventoryMngr";
import Compras from "../components/admin/compras/compras";
import Facturacion from "../components/default/facturacion/facturacion";
import HistorialTransacciones from "../components/admin/historialTransacciones";
import HistorialFacturacion from "../components/admin/facturacion/historialFacturacion";
import UsuariosTable from "../components/admin/negocio/usuariosTable";
import RegistrarComputadora from "../components/admin/negocio/registrarComputadora";
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
      <Route path="/home" exact render={props => <Home {...props} />} />
      <Route
        path="/basic"
        exact
        render={props => <RegistroBasic {...props} />}
      />
      <Route path="/pro" exact render={props => <RegistroPro {...props} />} />
      <Route
        path="/golden"
        exact
        render={props => <RegistroGolden {...props} />}
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
      />
      <Route
        path="/admin/historial-transacciones"
        exact
        render={props => <HistorialTransacciones {...props} />}
      />

      <Route
        path="/admin/usuarios"
        exact
        render={props => <UsuariosTable {...props} />}
      />
      <Route
        path="/admin/computadoras"
        exact
        render={props => <RegistrarComputadora {...props} />}
      />
      <Route
        path="/default/facturacion"
        exact
        render={props => <Facturacion {...props} />}
      />

      <Route
        path="/admin/historial-facturacion"
        exact
        render={props => <HistorialFacturacion {...props} />}
      />
      <Route
        path="/system/home"
        exact
        render={props => <HomeSystem {...props} />}
      />
    </Switch>
  </Router>
);
