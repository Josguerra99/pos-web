import React, { Component } from "react";
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
import styles from "../themes/signinstyles";
import Theme from "../themes/defaulTheme";
import Grid from "@material-ui/core/Grid";
import Snackbar from "@material-ui/core/Snackbar";
import history from "../common/history";
import EveryOne from "../everyone/everyone";

class SignIn extends Component {
  constructor() {
    super();
    this.state = {
      user_name: "",
      pass: "",
      nit: "",
      role: "None",
      nit_negocio: "None",
      authorized: false,
      snack: {
        open: false,
        vertical: "bottom",
        horizontal: "right",
        message: ""
      }
    };
    this.tryToSign = this.tryToSign.bind(this);
  }

  /*
   * INGRESAR CON EL USUARIO (O RECHARZAR)
   *
   * Hace un request al backend, y la respuesta de esto sera un json
   * que contiene informacion de la sesion creada, si es invalido
   * le regresa sin autorizacion y si es valido le regresa con que
   * rol se a creado, dependiendo del rol va a ser dirigido a la
   * pagina correspondiente
   */

  tryToSign(e) {
    e.preventDefault();
    //Datos que enviare al backend
    const requestData = {
      user_name: this.state.user_name,
      pass: this.state.pass,
      nit_negocio: this.state.nit
    };

    //Realizar peticion post
    fetch("/api/authenticate_user", {
      method: "POST",
      body: JSON.stringify(requestData),
      headers: { "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .then(data => {
        /*
         * Si esta autorizado hay que ver que permisos tiene (Role)
         * Actualizamos el estado, y si authorized es true entonces
         * Va a redireccionar a la url deseada dependiendo del rol
         */
        if (data["authorized"] === true) {
          if (data["role"] === "SYS") {
            this.setState({ authorized: true });
            this.setState({ role: "SYS" });
            history.push("/system/home");
          } else if (data["role"] === "ADMIN") {
            this.setState({ authorized: true });
            this.setState({ role: "ADMIN" });
            history.push("/admin/home");
          } else if (data["role"] === "PUBLIC") {
            this.setState({ authorized: true });
            this.setState({ role: "PUBLIC" });
            history.push("/default/home");
          } else
            this.handleOpenSnack("Hubo un error comprobando la autenticidad");
        }
        //No esta autorizado
        else {
          this.handleOpenSnack("Usuario o contraseña invalidos");
        }
      });
  }

  ////*****************EVENTS */
  //Actualizar el nombre de usuario al escribir en el input
  handleText = (state, val) => {
    this.setState({ [state]: val });
  };

  //Abrir un mensaje en la esquina (puede servir cuando diga login incorrecto)
  handleOpenSnack = message => {
    this.setState({
      snack: {
        open: true,
        vertical: "bottom",
        horizontal: "right",
        message: message
      }
    });
  };

  //Cerrar el mensaje
  handleCloseSnack = () => {
    this.setState({
      snack: {
        open: false,
        vertical: "bottom",
        horizontal: "right",
        message: ""
      }
    });
  };
  ////*****************EVENTS */

  ////*****************CREAR PAGINA */
  render() {
    const { classes } = this.props;
    const { vertical, horizontal, open, message } = this.state.snack;
    return (
      <EveryOne>
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
              <form className={classes.form} onSubmit={this.tryToSign}>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="nit">NIT</InputLabel>
                  <Input
                    id="nit"
                    name="nit"
                    autoComplete="nit"
                    value={this.state.nit}
                    onChange={e => {
                      this.handleText("nit", e.target.value);
                    }}
                    autoFocus
                  />
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="user">Usuario</InputLabel>
                  <Input
                    id="user"
                    name="user"
                    autoComplete="user"
                    value={this.state.user_name}
                    onChange={e => {
                      this.handleText("user_name", e.target.value);
                    }}
                  />
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="password">Contraseña</InputLabel>
                  <Input
                    name="password"
                    type="password"
                    id="password"
                    value={this.state.pass}
                    onChange={this.handlePassChange}
                    onChange={e => {
                      this.handleText("pass", e.target.value);
                    }}
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
                      className={classNames(
                        classes.iconSmall,
                        classes.rightIcon
                      )}
                    />
                  </Button>
                </Grid>
              </form>
            </Paper>
            <Snackbar
              anchorOrigin={{ vertical, horizontal }}
              open={open}
              onClose={this.handleCloseSnack}
              ContentProps={{ "aria-describedby": "message-id" }}
              message={<span id="message-id">{this.state.snack.message}</span>}
            />
          </main>
        </Theme>
      </EveryOne>
    );
  }
  ////*****************CREAR PAGINA */
}

SignIn.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SignIn);
