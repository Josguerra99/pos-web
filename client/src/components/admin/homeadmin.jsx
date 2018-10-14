import React, { Component } from "react";
import Dashboard from "../dashboard/dashboard";
import { mainListItems, secondaryListItems } from "./adminMenuList";

class HomeAdmin extends Component {
  state = {};
  render() {
    return (
      <Dashboard
        title="Administracion"
        mainListItems={mainListItems}
        secondaryListItems={secondaryListItems}
      >
        <h1>Front end</h1>
      </Dashboard>
    );
  }
}

export default HomeAdmin;
