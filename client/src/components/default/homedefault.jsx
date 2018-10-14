import React, { Component } from "react";
import Dashboard from "../dashboard/dashboard";
import { mainListItems, secondaryListItems } from "./defaultMenuList";

class HomeDefault extends Component {
  state = {};
  render() {
    return (
      <Dashboard
        title="Punto de Venta [Computadora #N]"
        mainListItems={mainListItems}
        secondaryListItems={secondaryListItems}
      >
        <h1>Front end</h1>
      </Dashboard>
    );
  }
}

export default HomeDefault;
