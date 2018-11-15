import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Theme from "../themes/defaulTheme";
import LoginIcon from "@material-ui/icons/ExitToApp";
import history from "../common/history";

const styles = theme => ({
  "@global": {
    body: {
      backgroundColor: "#eceff1"
    }
  },
  appBar: {
    position: "relative"
  },
  toolbarTitle: {
    flex: 1
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(900 + theme.spacing.unit * 3 * 2)]: {
      width: 900,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  heroContent: {
    maxWidth: 600,
    margin: "0 auto",
    padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`
  },

  footer: {
    marginTop: theme.spacing.unit * 8,
    borderTop: `1px solid ${theme.palette.divider}`,
    padding: `${theme.spacing.unit * 6}px 0`
  },
  button: {
    margin: theme.spacing.unit
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  }
});

function EveryOne(props) {
  const { classes } = props;

  return (
    <Theme>
      <CssBaseline />
      <AppBar position="static" color="primary" className={classes.appBar}>
        <Toolbar>
          <Typography
            variant="h6"
            color="inherit"
            noWrap
            className={classes.toolbarTitle}
            onClick={() => {
              history.push("/home");
            }}
          >
            Suburban
          </Typography>
          <Button
            style={{ color: "#ffffff" }}
            className={classes.button}
            onClick={() => {
              history.push("/signin");
            }}
          >
            <LoginIcon className={classes.leftIcon} />
            Login
          </Button>
        </Toolbar>
      </AppBar>
      <main className={classes.layout}>{props.children}</main>
    </Theme>
  );
}

EveryOne.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(EveryOne);
