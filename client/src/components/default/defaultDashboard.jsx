import React, { Component } from "react";
import Dashboard from "../dashboard/appBar";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import styles from "../themes/dashboardStyle";
import SessionChecker from "../common/sessionChecker";
import { mainListItems, secondaryListItems } from "./defaultMenuList";
import history from "../common/history";
import Typography from "@material-ui/core/Typography";
import ComputerIcon from "@material-ui/icons/Computer";

class HomeDashboard extends Component {
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
        <SessionChecker role="PUBLIC">
          <Dashboard
            title="POS"
            icon={() => {
              return (
                <React.Fragment>
                  <ComputerIcon />
                  <Typography
                    component="h1"
                    variant="h6"
                    color="inherit"
                    noWrap
                    style={{ flex: 1, margin: 10 }}
                  >
                    {"1"}
                  </Typography>
                </React.Fragment>
              );
            }}
            logout={this.logout}
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
