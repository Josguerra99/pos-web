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
import CircularIndeterminate from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";

class HomeDashboard extends Component {
  state = {
    registro: { val: false, num: null, hasData: false }
  };

  componentDidMount() {
    this.getComputadora();
  }

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

  getComputadora = () => {
    this.setState({ registro: { val: false, num: null, hasData: false } });
    return fetch("/api/getComputadora")
      .then(res => res.json())
      .then(data => {
        if (data["@err"] !== 0) {
          this.setState({ registro: { val: false, hasData: true } });
        } else {
          this.setState({
            registro: { val: true, num: data["num"], hasData: true }
          });
        }
      });
  };

  checkForComputer = () => {
    if (this.state.registro.hasData) {
      if (this.state.registro.val && this.state.registro.num !== null) {
        return (
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
                    {this.state.registro.num}
                  </Typography>
                </React.Fragment>
              );
            }}
            logout={this.logout}
          >
            {this.props.children}
          </Dashboard>
        );
      } else {
        return (
          <Dashboard
            title="POS"
            icon={() => {
              return (
                <Typography
                  component="h1"
                  variant="h6"
                  color="inherit"
                  noWrap
                  style={{ flex: 1, margin: 10 }}
                />
              );
            }}
            logout={this.logout}
          >
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              style={{ flex: 1, margin: 10 }}
            >
              {"Computadora no registrada"}
            </Typography>
          </Dashboard>
        );
      }
    } else {
      return (
        <main>
          <Grid container>
            <Grid container justify="center">
              <CircularIndeterminate />
            </Grid>
            <Grid container justify="center">
              <Typography variant="h6" gutterBottom>
                Comprobando registro de computadora
              </Typography>
            </Grid>
          </Grid>
        </main>
      );
    }
  };

  render() {
    return (
      <React.Fragment>
        <SessionChecker role="PUBLIC">{this.checkForComputer()}</SessionChecker>
      </React.Fragment>
    );
  }
}

HomeDashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(HomeDashboard);
