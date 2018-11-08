import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import styles from "../themes/dashboardStyle";
import Theme from "../themes/defaulTheme";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

class Dashboard extends Component {
  state = {
    anchorEl: null,
    open: true,
    mainListItems: [],
    secondaryListItems: []
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleLogOut = () => {
    this.handleMenuClose();
    if (this.props.logout) this.props.logout();
  };
  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    const openMenu = Boolean(anchorEl);

    return (
      <React.Fragment>
        <Theme>
          <CssBaseline />
          <div className={classes.root}>
            <AppBar position="absolute">
              <Toolbar
                disableGutters={!this.state.open}
                className={classes.toolbar}
              >
                <IconButton
                  color="inherit"
                  aria-label="Abrir menu"
                  onClick={this.handleDrawerOpen}
                  className={classNames(
                    classes.menuButton,
                    this.state.open && classes.menuButtonHidden
                  )}
                >
                  <MenuIcon />
                </IconButton>
                <Typography
                  component="h1"
                  variant="h6"
                  color="inherit"
                  noWrap
                  className={classes.title}
                  style={{ margin: 20 }}
                >
                  {this.props.title}
                </Typography>
                {this.props.icon()}
                {
                  //style={{ flex: 1 }}
                }

                <div>
                  <IconButton
                    aria-owns={openMenu ? "menu-appbar" : undefined}
                    aria-haspopup="true"
                    onClick={this.handleMenu}
                    color="inherit"
                  >
                    <AccountCircle />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    open={openMenu}
                    onClose={this.handleMenuClose}
                  >
                    <MenuItem onClick={this.handleLogOut}>Salir</MenuItem>
                  </Menu>
                </div>
              </Toolbar>
            </AppBar>

            <main className={classes.content}>
              <div className={classes.appBarSpacer} />
              {this.props.children}
            </main>
          </div>
        </Theme>
      </React.Fragment>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Dashboard);
