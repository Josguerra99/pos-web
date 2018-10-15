import React, { Component } from "react";
import Dashboard from "../dashboard/dashboard";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import styles from "../dashboard/dashboardStyle";
import SessionChecker from "../common/sessionChecker";
import { mainListItems, secondaryListItems } from "./defaultMenuList";

class HomeDashboard extends Component {
  render() {
    return (
      <React.Fragment>
        <SessionChecker role="PUBLIC">
          <Dashboard
            title="Punto de Venta [Computadora #N]"
            mainListItems={mainListItems}
            secondaryListItems={secondaryListItems}
          >
            {this.props.children}
          </Dashboard>
        </SessionChecker>
      </React.Fragment>
    );
  }
}

HomeDashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(HomeDashboard);
