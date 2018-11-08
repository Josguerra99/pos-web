import React, { Component } from "react";
import Dashboard from "../dashboard/dashboard";
import { mainListItems, secondaryListItems } from "./adminMenuList";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import styles from "../themes/dashboardStyle";
import SessionChecker from "../common/sessionChecker";
import NestedList from "./adminDashboardList";
import history from "../common/history";

class AdminDashboard extends Component {
  logout = () => {
    fetch("/api/logout", {
      method: "POST",
      body: JSON.stringify({}),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(data => {
      history.push("/signin");
    });
  };

  render() {
    return (
      <React.Fragment>
        <SessionChecker role="ADMIN">
          <Dashboard
            title="Administracion"
            mainListItems={NestedList}
            logout={this.logout}
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
