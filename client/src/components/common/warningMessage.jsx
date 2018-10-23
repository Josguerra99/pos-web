import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Button from "@material-ui/core/Button";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import InfoIcon from "@material-ui/icons/Info";
import CloseIcon from "@material-ui/icons/Close";
import green from "@material-ui/core/colors/green";
import amber from "@material-ui/core/colors/amber";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import WarningIcon from "@material-ui/icons/Warning";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon
};

const styles = theme => ({
  card: {
    minWidth: 275,
    backgroundColor: theme.palette.error.dark
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  success: {
    backgroundColor: green[600]
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  info: {
    backgroundColor: theme.palette.primary.dark
  },
  warning: {
    backgroundColor: amber[700]
  },
  icon: {
    fontSize: 25,
    opacity: 0.9,
    marginRight: theme.spacing.unit,
    color: "#ffffff"
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit
  },
  message: {
    display: "flex",
    alignItems: "center",
    color: "#fff",
    fontSize: 15
  }
});

class WarningMessage extends Component {
  state = {};
  render() {
    const {
      classes,
      className,
      message,
      onClose,
      variant,
      ...other
    } = this.props;
    const Icon = variantIcon[variant];

    return (
      <Card className={classes.card}>
        <CardContent>
          <Grid container>
            <WarningIcon className={classes.icon} />

            <Typography variant="h6" className={classes.message}>
              {this.props.message}
            </Typography>
          </Grid>
        </CardContent>
      </Card>
    );
  }
}

WarningMessage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(WarningMessage);
