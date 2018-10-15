import React, { Component } from "react";
import CircularIndeterminate from "../common/circularprogress";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import styles from "../themes/dashboardStyle";
import Theme from "../themes/defaulTheme";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import history from "./history";

class CheckSession extends Component {
  state = {
    authorized: false,
    hasSession: false
  };
  //Cuando haya cargado, autenticamos la sesion
  componentDidMount() {
    this.authenticate();
  }

  /**
   * Comprobar credenciales de login
   * Hacemos un GET al api y nos va a devolver
   * una sesion si existe, o un objeto authorized:false
   * si no hay ninguna sesion abierta
   */
  authenticate() {
    //Datos que enviare al backend
    const requestData = {
      empty: ""
    };

    //Realizar peticion get
    fetch("/api/get_session")
      .then(res => res.json())
      .then(data => {
        /*
                         * Si esta autorizado hay que ver que permisos tiene (Role)
                         * Actualizamos el estado, y si authorized es true entonces
                         * Va a redireccionar a la url deseada dependiendo del rol
                         */
        if (data["authorized"] === true) {
          if (data["role"] === this.props.role) {
            this.setState({ authorized: true });
          } else {
            history.push("/signin");
          }
        }
        //No esta autorizado
        else {
          history.push("/signin");
        }
        this.setState({ hasSession: true });
      });
  }
  /**
   * Va a renderizar un icono de carga si no a traido los daots
   * y si los trajo correctamente va a renderizar la pagina
   * si no los trajo correctamente nos redireccionara al login
   */
  renderLoad = classes => {
    //Esto estara mientas espera que haya traido la sesion
    if (!this.state.hasSession) {
      return (
        <main className={classes.content}>
          <Grid container>
            <Grid container justify="center">
              <CircularIndeterminate />
            </Grid>
            <Grid container justify="center">
              <Typography variant="h6" gutterBottom>
                Comprobando sesión
              </Typography>
            </Grid>
          </Grid>
        </main>
      );
    } else {
      //Ya trajo la sesion hay dos opciones, hay que comprobar si la sesion tiene autoridad para ver esta pagina o no
      if (this.state.authorized === true)
        return <React.Fragment>{this.props.children}</React.Fragment>;
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Theme>{this.renderLoad(classes)}</Theme>
      </React.Fragment>
    );
  }
}

CheckSession.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(CheckSession);
