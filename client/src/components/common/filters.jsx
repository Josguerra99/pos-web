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
  }
});

const select = [
  { id: "FAC", name: "Factura" },
  { id: "NC", name: "Nota de crédito" },
  { id: "ND", name: "Nota de débito" }
];

class Filters extends Component {
  state = { drawer: { open: false, top: true }, filters: [] };

  /**
   * Guarda los filtros activos en objetos, estos se mandan al backend
   * para que este sepa que datos filtrar
   */

  constructor(props) {
    super(props);
    this.inicio = React.createRef();
  }

  getFilters() {
    JSON.stringify(this.inicio.current.getFilter());
  }

  /**
   * Abre o cierra el menu de filtros
   */
  toggleDrawer = open => () => {
    this.setState({
      drawer: { open: open }
    });
    if (!open) {
      this.getFilters();
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <Button onClick={this.toggleDrawer(true)}>
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

          <FilterSelect
            name={"Tipo de documento"}
            label={"Documento"}
            items={select}
          />
          <FilterSearch name={"Número de resolución"} label={"Resolución"} />
          <FilterSearch name={"Serie"} label={"Serie"} />
          <FilterNumberRange
            name={"Inicio"}
            label={"Valor"}
            ref={this.inicio}
          />
          <FilterNumberRange name={"Fin"} label={"Valor"} />
          <FilterNumberRange name={"Fecha"} label={"Date"} />
        </Drawer>
      </React.Fragment>
    );
  }
}

Filters.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Filters);
