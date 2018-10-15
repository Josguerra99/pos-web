import React, { Component } from "react";
import Dashboard from "../dashboard/dashboard";
import { mainListItems, secondaryListItems } from "./adminMenuList";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import styles from "../themes/dashboardStyle";
import SessionChecker from "../common/sessionChecker";

class AdminDashboard extends Component {
  render() {
    return (
      <React.Fragment>
        <SessionChecker role="ADMIN">
          <Dashboard
            title="Administracion"
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

AdminDashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AdminDashboard);
