import React, { Component } from "react";
import SystemDashboard from "./systemDashboard";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";

import Paper from "@material-ui/core/Paper";
import Snackbar from "@material-ui/core/Snackbar";
import List from "@material-ui/core/List";
import LinearProgress from "@material-ui/core/LinearProgress";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import classNames from "classnames";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";

import DatePicker from "material-ui-pickers/DatePicker";
import formatDate from "date-fns/format";

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
    maxWidth: "50%",
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

class ResolucionSistema extends Component {
  state = {
    selectedDate: new Date(),
    num: "",
    snack: { open: false, message: "" }
  };

  componentDidMount() {
    this.bringResolucion();
  }

  bringResolucion = () => {
    return fetch("/api/getResolucionSistema")
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          var fecha = new Date();
          if (data[0].fecha != null) {
            fecha = data[0].fecha;
          }
          this.setState({
            num: data[0].num,
            selectedDate: fecha
          });
        }
      });
  };

  tryToAddRes = () => {
    if (this.state.num === "") {
      this.handleSnackOpen("Ingresa el número de resolución");
      return;
    }

    if (this.state.selectedDate === "" || this.state.selectedDate == null) {
      this.handleSnackOpen("Ingresa la fecha");
      return;
    }

    const fecha = formatDate(this.state.selectedDate, "yyyy/MM/dd");

    const requestData = {
      num: this.state.num,
      fecha: fecha
    };

    //Realizar peticion post
    fetch("/api/updateResolucionSistema", {
      method: "POST",
      body: JSON.stringify(requestData),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        var err = data["@err"];
        //No hay errores entonces vamos a la pagina de resoluciones activas
        if (err === 0) {
          this.handleSnackOpen("Resolución cambiada exitosamente");
        }
        if (err == 1) {
          this.handleSnackOpen("Error al intentar agregar resolucion");
        }
      });
  };

  handleSnackOpen = message => {
    this.setState({ snack: { open: true, message } });
  };

  handleSnackClose = () => {
    this.setState({ snack: { open: false, message: "" } });
  };

  handleChange = (name, val) => {
    this.setState({ [name]: val });
  };
  handleDateChange = date => {
    this.setState({ selectedDate: date });
  };

  render() {
    const { classes } = this.props;
    return (
      <SystemDashboard>
        <Paper className={classes.paper}>
          <Typography
            component="h1"
            variant="h4"
            align="center"
            style={{ fontSize: 20 }}
          >
            Resolución del Sistema
          </Typography>

          <Grid container spacing={12}>
            <Grid item xs={12}>
              <FormControl margin="normal" required fullWidth>
                <TextField
                  id="name"
                  label="Numero"
                  autoFocus
                  autoComplete="off"
                  //className={classes.textField}
                  value={this.state.num}
                  onChange={e => this.handleChange("num", e.target.value)}
                  margin="normal"
                  fullWidth
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} style={{ display: "flex" }}>
              <FormControl margin="justify" required fullWidth>
                <div className="picker">
                  <DatePicker
                    maxDate={new Date()}
                    keyboard
                    label="Fecha de emisión"
                    format="dd/MM/yyyy"
                    mask={value =>
                      value
                        ? [
                            /\d/,
                            /\d/,
                            "/",
                            /\d/,
                            /\d/,
                            "/",
                            /\d/,
                            /\d/,
                            /\d/,
                            /\d/
                          ]
                        : []
                    }
                    value={this.state.selectedDate}
                    onChange={this.handleDateChange}
                    disableOpenOnEnter
                    animateYearScrolling={false}
                    required
                  />
                </div>
              </FormControl>
            </Grid>
          </Grid>
          <div className={classes.buttons}>
            <Button
              variant="contained"
              color="primary"
              onClick={this.tryToAddRes}
              className={classes.button}
            >
              Aceptar
            </Button>
          </div>
        </Paper>

        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={this.state.snack.open}
          onClose={this.handleSnackClose}
          message={<span id="message-id">{this.state.snack.message}</span>}
        />
      </SystemDashboard>
    );
  }
}

export default withStyles(styles)(ResolucionSistema);
