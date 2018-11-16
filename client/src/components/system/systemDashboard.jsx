import React, { Component } from "react";
import SessionChecker from "../common/sessionChecker";
import Dashboard from "../dashboard/dashboardDark";
import history from "../common/history";
import styles from "../themes/dashboardStyleSystem";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";

class SystemDashboard extends Component {
  state = {};
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
    const { classes, children, className, ...other } = this.props;

    return (
      <SessionChecker role="SYS">
        <Dashboard title="Sistema" logout={this.logout} alternativeStyle>
          {this.props.children}
        </Dashboard>
      </SessionChecker>
    );
  }
}
export default SystemDashboard;
