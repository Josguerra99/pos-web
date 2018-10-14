import React from "react";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControl from "@material-ui/core/FormControl";
import classNames from "classnames";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import LockIcon from "@material-ui/icons/LockOutlined";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import SendIcon from "@material-ui/icons/Send";
import styles from "./signinstyles";
import Theme from "../themes/defaulTheme";
import Grid from "@material-ui/core/Grid";

function SignIn(props) {
  const { classes } = props;

  return (
    <React.Fragment>
      <Theme>
        <CssBaseline />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Ingresar
            </Typography>
            <form className={classes.form}>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="user">Usuario</InputLabel>
                <Input id="user" name="user" autoComplete="user" autoFocus />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="password">Contraseña</InputLabel>
                <Input
                  name="password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
              </FormControl>
              <Grid container justify="center">
                <Button
                  type="submit"
                  variant="extendedFab"
                  size="medium"
                  color="primary"
                  className={classes.submit}
                >
                  Ingresar
                  <SendIcon
                    className={classNames(classes.iconSmall, classes.rightIcon)}
                  />
                </Button>
              </Grid>
            </form>
          </Paper>
        </main>
      </Theme>
    </React.Fragment>
  );
}

SignIn.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SignIn);
