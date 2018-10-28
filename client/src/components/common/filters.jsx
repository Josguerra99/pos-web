import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import classNames from "classnames";
import FilterNumberRange from "./filterOptions/filterNumberRange";
import FilterSearch from "./filterOptions/filterSearch";
import FilterSelect from "./filterOptions/filterSelect";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import Collapse from "@material-ui/core/Collapse";
import nextFrame from "next-frame";

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
  },
  drawerPaper: {
    zIndex: 1300
  },
  backdrop: {
    zIndex: 1100
  },
  buttonDisable: false
});

class Filters extends Component {
  state = {
    drawer: { open: false, top: true },
    filters: []
  };

  /**
   * Guarda los filtros activos en objetos, estos se mandan al backend
   * para que este sepa que datos filtrar
   */

  constructor(props) {
    super(props);
  }

  async getFilters() {
    var filters = [];
    const { refs } = this.props;
    if (this.props.refs) {
      for (let el of refs) {
        await nextFrame();
        var filter = el.current.getFilter();
        if (filter.enable) filters.push(filter);
      }
    }
    return filters;
  }
  /**
   * Abre o cierra el menu de filtros
   */
  toggleDrawer = open => () => {
    if (!open && this.state.drawer.open) {
      const { beforeFilters, afterFilters } = this.props;
      this.setState({ buttonDisable: true });

      if (beforeFilters) {
        beforeFilters();
        if (!afterFilters) this.setState({ buttonDisable: false });
      }

      if (afterFilters) {
        Promise.resolve(this.getFilters()).then(filters => {
          afterFilters(filters).then(() => {
            this.setState({ buttonDisable: false });
          });
        });
      }

      //Si no hare nada solo vuelvo a activar el boton
      if (!beforeFilters && !afterFilters) {
        this.setState({ buttonDisable: false });
      }
    }
    this.setState({ drawer: { open } });
  };

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <Button
          onClick={this.toggleDrawer(true)}
          disabled={this.state.buttonDisable}
        >
          Filtros
          <KeyboardArrowDownIcon
            className={classNames(classes.iconSmall, classes.rightIcon)}
          />
        </Button>

        <Drawer
          anchor="top"
          open={this.state.drawer.open}
          onClose={this.toggleDrawer(false)}
          keepMounted
        >
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer(false)}
            onKeyDown={this.toggleDrawer(false)}
          />

          <Button onClick={this.toggleDrawer(false)}>
            Filtros
            <KeyboardArrowUpIcon
              className={classNames(classes.iconSmall, classes.rightIcon)}
            />
          </Button>
          <Divider />
          {this.props.children}
        </Drawer>
      </React.Fragment>
    );
  }
}

Filters.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Filters);
