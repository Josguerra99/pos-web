import React, { Component } from "react";
import AdminDashboard from "./adminDashboard";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import classNames from "classnames";
import Typography from "@material-ui/core/Typography";
import queryString from "query-string";

const styles = theme => ({
  list: {
    width: 250
  },
  fullList: {
    width: "auto"
  },
  iconSmall: {
    fontSize: 15
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  }
});

class HistorialResoluciones extends Component {
  state = { drawer: { open: false, top: true } };
  toggleDrawer = open => () => {
    this.setState({
      drawer: { open: open }
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <AdminDashboard>
        <Button onClick={this.toggleDrawer(true)}>
          Filtros{" "}
          <KeyboardArrowDownIcon
            className={classNames(classes.iconSmall, classes.rightIcon)}
          />
        </Button>
        <Drawer
          anchor="top"
          open={this.state.drawer.open}
          onClose={this.toggleDrawer(false)}
        >
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer(false)}
            onKeyDown={this.toggleDrawer(false)}
          />

          <Button onClick={this.toggleDrawer(false)}>
            Filtros{" "}
            <KeyboardArrowUpIcon
              className={classNames(classes.iconSmall, classes.rightIcon)}
            />
          </Button>
          <Divider />
          <Typography variant="h7" gutterBottom>
            Número de resolución
          </Typography>

          <Typography variant="h7" gutterBottom>
            Serie
          </Typography>

          <Typography variant="h7" gutterBottom>
            Documento
          </Typography>

          <Typography variant="h7" gutterBottom>
            Fecha de emisión
          </Typography>
        </Drawer>
      </AdminDashboard>
    );
  }
}

HistorialResoluciones.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(HistorialResoluciones);
