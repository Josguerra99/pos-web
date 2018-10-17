import React, { Component } from "react";
import AdminDashboard from "./adminDashboard";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Typography from "@material-ui/core/Typography";
import { DatePicker } from "material-ui-pickers";
import Grid from "@material-ui/core/Grid";
import styles from "../themes/agregarResolucionStyles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import AutoComplete from "../common/autocompleter";
import formatDate from "date-fns/format";
import IntRange from "../common/rangeInt";
import FormHelperText from "@material-ui/core/FormHelperText";
import Snackbar from "@material-ui/core/Snackbar";
import history from "../common/history";

class AgregarResolucionAdmin extends Component {
  state = {
    doc: null,
    nres: "",
    serie: "",
    inicio: "",
    fin: "",
    selectedDate: new Date(),
    dialog: { open: false },
    hasErrorsDoc: false,
    snack: {
      open: false,
      vertical: "bottom",
      horizontal: "right",
      message: ""
    }
  };
  constructor() {
    super();
    this.tryToSubmitForm = this.tryToSubmitForm.bind(this);
    this.tryToAddRes = this.tryToAddRes.bind(this);
  }

  componentDidMount() {}

  tryToAddRes() {
    const fecha = formatDate(this.state.selectedDate, "yyyy/MM/dd");
    const requestData = {
      num: this.state.nres,
      documento: this.state.doc.value,
      serie: this.state.serie,
      inicio: this.state.inicio,
      fin: this.state.fin,
      fecha: fecha
    };

    //Realizar peticion post
    fetch("/api/add_resolucion", {
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
        if (err == 0) {
          history.push(
            "/admin/resoluciones-activas?addSuccess=" + this.state.doc.value
          );
        }
        if (err == 1) {
          this.handleDialogClose();
          this.handleOpenSnack("Error al intentar agregar resolucion");
        }
      });
  }

  tryToSubmitForm(e) {
    e.preventDefault();
    if (this.state.doc == null || JSON.stringify(this.state.doc) === "[]") {
      this.setState({ hasErrorsDoc: true });
      return;
    }

    this.handleDialogOpen();
  }

  /*****************EVENTS*/
  handleDocChange = value => {
    this.setState({ doc: value });
  };

  handleNResChange = e => {
    this.setState({ nres: e.target.value });
  };
  handleSerieChange = e => {
    this.setState({ serie: e.target.value });
  };

  handleInicioChange = val => {
    this.setState({ inicio: val });
  };

  handleFinChange = val => {
    this.setState({ fin: val });
  };
  handleDateChange = date => {
    this.setState({ selectedDate: date });
  };

  handleDialogOpen = () => {
    this.setState({ dialog: { open: true } });
  };
  handleDialogClose = () => {
    this.setState({ dialog: { open: false } });
  };

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

  /*****************EVENTS*/

  renderTable(classes) {
    if (this.state.dialog.open)
      return (
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Documento</TableCell>
              <TableCell>Serie</TableCell>
              <TableCell>Rango</TableCell>
              <TableCell>Fecha</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow key={0}>
              <TableCell>{this.state.nres}</TableCell>
              <TableCell>{this.state.doc["label"]}</TableCell>
              <TableCell>{this.state.serie}</TableCell>
              <TableCell>
                {this.state.inicio + " al " + this.state.fin}
              </TableCell>
              <TableCell>
                {formatDate(this.state.selectedDate, "dd/MM/yyyy")}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
  }

  /*****************CREAR LA PAGINA*/
  render() {
    const { classes } = this.props;
    const { selectedDate } = this.state;
    const { hasErrorsDoc } = this.state;
    const { vertical, horizontal, open, message } = this.state.snack;

    return (
      <AdminDashboard>
        <Card className={classes.card}>
          <CardContent>
            <Typography
              className={classes.title}
              color="textSecondary"
              variant="h5"
              gutterBottom
            >
              Ingresar resolución
            </Typography>
            <form className={classes.form} onSubmit={this.tryToSubmitForm}>
              <FormControl
                margin="normal"
                required
                fullWidth
                error={hasErrorsDoc}
                autoFocus
              >
                <AutoComplete
                  name="Tipo de documento"
                  onChange={this.handleDocChange}
                  autoFocus
                />
                {hasErrorsDoc && (
                  <FormHelperText>Campo requerido!</FormHelperText>
                )}
              </FormControl>

              <Grid container spacing={24}>
                <Grid item xs={6}>
                  <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="nresolucion">
                      Número de resolución
                    </InputLabel>
                    <Input
                      id="nresolucion"
                      name="nresolucion"
                      onBlur={this.handleNResChange}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="serie">Serie</InputLabel>
                    <Input
                      id="serie"
                      name="serie"
                      onBlur={this.handleSerieChange}
                    />
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container spacing={0}>
                <Grid item xs={6}>
                  <IntRange
                    getStart={this.handleInicioChange}
                    getEnd={this.handleFinChange}
                  />
                </Grid>
              </Grid>

              <FormControl margin="normal" required fullWidth>
                <div className="picker">
                  <DatePicker
                    maxDate={new Date()}
                    keyboard
                    label="Fecha de emisión"
                    format="dd/MM/yyyy"
                    mask={
                      value =>
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
                          : [] // handle clearing outside => pass plain array if you are not controlling value outside
                    }
                    value={selectedDate}
                    onChange={this.handleDateChange}
                    disableOpenOnEnter
                    animateYearScrolling={false}
                    required
                  />
                </div>
              </FormControl>

              <Grid container spacing={24} justify="center">
                <Button
                  type="submit"
                  variant="extendedFab"
                  size="medium"
                  color="primary"
                  className={classes.submit}
                >
                  Agregar
                </Button>
              </Grid>
            </form>
          </CardContent>
        </Card>

        {/******Abre una ventana de confirmacion ******/}
        <Dialog
          open={this.state.dialog.open}
          onClose={this.handleDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth={"md"}
        >
          <DialogTitle id="alert-dialog-title">
            {"Agregar resolución?"}
          </DialogTitle>
          <DialogContent>
            <Grid container>{this.renderTable(classes)}</Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleDialogClose}
              color="secondary"
              variant="contained"
              autoFocus
            >
              No
            </Button>
            <Button onClick={this.tryToAddRes} color="primary">
              Si
            </Button>
          </DialogActions>
        </Dialog>

        {/******MUESTRA MENSAJE DE ERROR SI NO TODO SALIO BIEN ******/}
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          onClose={this.handleCloseSnack}
          ContentProps={{ "aria-describedby": "message-id" }}
          message={<span id="message-id">{this.state.snack.message}</span>}
        />
      </AdminDashboard>
    );
  }

  /*****************CREAR LA PAGINA*/
}

AgregarResolucionAdmin.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AgregarResolucionAdmin);
