import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Paper from "@material-ui/core/Paper";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import DatosNegocio from "./formularios/datosNegocio";
import DatosComprador from "./formularios/datosComprador";
import AddNegocio from "./addNegocio";
import Snackbar from "@material-ui/core/Snackbar";
import List from "@material-ui/core/List";
import LinearProgress from "@material-ui/core/LinearProgress";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

//import PaymentForm from "./PaymentForm";
//import Review from "./Review";

const styles = theme => ({
  appBar: {
    position: "relative"
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
      width: 600,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
      marginTop: theme.spacing.unit * 6,
      marginBottom: theme.spacing.unit * 6,
      padding: theme.spacing.unit * 3
    }
  },
  stepper: {
    padding: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 5}px`
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end"
  },
  button: {
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit
  }
});

const steps = ["Datos del negocio", "Datos del comprador", "Finalizar compra"];

class Checkout extends React.Component {
  state = {
    activeStep: 0,
    negocio: { nit: "", nombre: "", denominacion: "", direccion: "" },
    comprador: { user: "", pass1: "", pass2: "" },
    snack: { open: false, message: "" },
    registrado: { val: false, message: [], terminado: false }
  };

  getStepContent(step) {
    switch (step) {
      case 0:
        return <DatosNegocio sync={this.handleNegocio} />;
      case 1:
        return <DatosComprador sync={this.handleComprador} />;
      case 2:
        return <React.Fragment />;
      default:
        throw new Error("Unknown step");
    }
  }

  constructor(props) {
    super(props);
  }

  check = step => {
    switch (step) {
      case 0:
        return this.checkNegocio();
      case 1:
        return this.checkComprador();
      case 2:
        return true;
      default:
        throw new Error("Unknown step");
    }
  };

  checkNegocio = () => {
    const { negocio } = this.state;
    if (
      negocio.nit === "" ||
      negocio.nombre === "" ||
      negocio.denominacion === "" ||
      negocio.direccion === ""
    ) {
      this.handleSnackOpen("Ingresa todos los datos");
      return false;
    }

    return true;
  };

  checkComprador = () => {
    const { comprador } = this.state;
    if (
      comprador.user === "" ||
      comprador.pass1 === "" ||
      comprador.pass2 === ""
    ) {
      this.handleSnackOpen("Ingresa todos los datos");
      return false;
    }

    if (comprador.pass1 !== comprador.pass2) {
      this.handleSnackOpen("Contraseñas no coinciden");
      return false;
    }
    return true;
  };

  handleNegocio = (name, val) => {
    var negocio = { ...this.state.negocio };
    negocio[name] = val;
    this.setState({ negocio });
  };
  handleComprador = (name, val) => {
    var comprador = { ...this.state.comprador };
    comprador[name] = val;
    this.setState({ comprador });
  };

  handleNext = () => {
    if (!this.check(this.state.activeStep)) return;

    if (this.state.activeStep === steps.length - 1) {
      const addNegocio = new AddNegocio(
        this.state.negocio,
        this.state.comprador,
        5
      );
      var data = addNegocio.generateData();
      addNegocio.registerNegocio(data, (inserted, err) => {
        if (err === 0) {
          this.handleSnackOpen("Negocio registrado");
          this.setState({
            registrado: {
              val: true,
              message: inserted.computadoras,
              terminado: true
            }
          });
        } else {
          this.handleSnackOpen("Error al ingresar negocio");
          this.setState({
            registrado: { val: false, message: [], terminado: true }
          });
        }
      });
    }

    this.setState(state => ({
      activeStep: state.activeStep + 1
    }));
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1
    }));
  };

  handleReset = () => {
    this.setState({
      activeStep: 0
    });
  };

  handleSnackOpen = message => {
    this.setState({ snack: { open: true, message } });
  };

  handleSnackClose = () => {
    this.setState({ snack: { open: false, message: "" } });
  };

  renderFinal = () => {
    if (this.state.registrado.terminado) {
      return (
        <React.Fragment>
          <Typography variant="h5" gutterBottom>
            {this.state.registrado.val
              ? "Registro completo"
              : "Error al registrar negocio"}
          </Typography>
          <List>
            {this.state.registrado.message.map((el, item) => {
              return (
                <ListItem>
                  <ListItemText
                    primary={"Computadora #" + el.num}
                    secondary={el.id}
                  />
                </ListItem>
              );
            })}
          </List>
        </React.Fragment>
      );
    } else {
      return <LinearProgress />;
    }
  };

  render() {
    const { classes } = this.props;
    const { activeStep } = this.state;

    return (
      <React.Fragment>
        <CssBaseline />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Typography component="h1" variant="h4" align="center">
              Compra
            </Typography>
            <Stepper activeStep={activeStep} className={classes.stepper}>
              {steps.map(label => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <React.Fragment>
              {activeStep === steps.length ? (
                <React.Fragment>{this.renderFinal()}</React.Fragment>
              ) : (
                <React.Fragment>
                  {this.getStepContent(activeStep)}
                  <div className={classes.buttons}>
                    {activeStep !== 0 && (
                      <Button
                        onClick={this.handleBack}
                        className={classes.button}
                      >
                        Anterior
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.handleNext}
                      className={classes.button}
                    >
                      {activeStep === steps.length - 1
                        ? "Finalizar"
                        : "Siguiente"}
                    </Button>
                  </div>
                </React.Fragment>
              )}
            </React.Fragment>
          </Paper>
        </main>
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={this.state.snack.open}
          onClose={this.handleSnackClose}
          message={<span id="message-id">{this.state.snack.message}</span>}
        />
      </React.Fragment>
    );
  }
}

Checkout.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Checkout);
