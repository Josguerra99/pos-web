import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import DraftsIcon from "@material-ui/icons/Drafts";
import HomeIcon from "@material-ui/icons/Home";
import ResolucionIcon from "@material-ui/icons/Class";
import AddResolucionIcon from "@material-ui/icons/PlaylistAdd";
import ActiveResolucionIcon from "@material-ui/icons/PlaylistAddCheck";
import FindResolucionIcon from "@material-ui/icons/History";

import InventoryIcon from "@material-ui/icons/ListAlt";
import EditInventoryIcon from "@material-ui/icons/Edit";
import ShopInventoryIcon from "@material-ui/icons/AddShoppingCart";

import TransaccionIcon from "@material-ui/icons/Loop";

import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import StarBorder from "@material-ui/icons/StarBorder";

import history from "../common/history";

const styles = theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4
  }
});

class NestedList extends React.Component {
  state = {
    openResolucion: false,
    openInventory: false,
    openTransaccion: false
  };

  handleClick = name => {
    this.setState(state => ({ [name]: !state[name] }));
  };

  render() {
    const { classes } = this.props;

    return (
      <List component="nav">
        <ListItem button onClick={() => history.push("/admin/home")}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText inset primary="Inicio" />
        </ListItem>

        <ListItem button onClick={() => this.handleClick("openResolucion")}>
          <ListItemIcon>
            <ResolucionIcon />
          </ListItemIcon>
          <ListItemText inset primary="Resoluciones" />
          {this.state.openResolucion ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={this.state.openResolucion} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              button
              className={classes.nested}
              onClick={() => history.push("/admin/agregar-resolucion")}
            >
              <ListItemIcon>
                <AddResolucionIcon />
              </ListItemIcon>
              <ListItemText inset primary="Agregar" />
            </ListItem>
            <ListItem
              button
              className={classes.nested}
              onClick={() => history.push("/admin/resoluciones-activas")}
            >
              <ListItemIcon>
                <ActiveResolucionIcon />
              </ListItemIcon>
              <ListItemText inset primary="Activas" />
            </ListItem>
            <ListItem
              button
              className={classes.nested}
              onClick={() => history.push("/admin/historial-resoluciones")}
            >
              <ListItemIcon>
                <FindResolucionIcon />
              </ListItemIcon>
              <ListItemText inset primary="Historial" />
            </ListItem>
          </List>
        </Collapse>

        <ListItem button onClick={() => this.handleClick("openInventory")}>
          <ListItemIcon>
            <InventoryIcon />
          </ListItemIcon>
          <ListItemText inset primary="Inventario" />
          {this.state.openInventory ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={this.state.openInventory} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              button
              className={classes.nested}
              onClick={() => history.push("/admin/inventario")}
            >
              <ListItemIcon>
                <EditInventoryIcon />
              </ListItemIcon>
              <ListItemText inset primary="Gestionar" />
            </ListItem>
            <ListItem
              button
              className={classes.nested}
              onClick={() => history.push("/admin/compras")}
            >
              <ListItemIcon>
                <ShopInventoryIcon />
              </ListItemIcon>
              <ListItemText inset primary="Comprar" />
            </ListItem>
          </List>
        </Collapse>

        <ListItem button onClick={() => this.handleClick("openTransaccion")}>
          <ListItemIcon>
            <TransaccionIcon />
          </ListItemIcon>
          <ListItemText inset primary="Transacciones" />
          {this.state.openTransaccion ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={this.state.openTransaccion} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              button
              className={classes.nested}
              onClick={() => history.push("/admin/historial-transacciones")}
            >
              <ListItemIcon>
                <FindResolucionIcon />
              </ListItemIcon>
              <ListItemText inset primary="Historial" />
            </ListItem>
            <ListItem button className={classes.nested}>
              <ListItemIcon>
                <ShopInventoryIcon />
              </ListItemIcon>
              <ListItemText inset primary="Comprar" />
            </ListItem>
          </List>
        </Collapse>
      </List>
    );
  }
}

NestedList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NestedList);
