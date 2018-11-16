import React, { Component } from "react";
import AdminDashboard from "../adminDashboard";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Typography from "@material-ui/core/Typography";
import DatePicker from "material-ui-pickers/DatePicker";
import Grid from "@material-ui/core/Grid";
import styles from "../../themes/agregarResolucionStyles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import AutoComplete from "../../common/autocompleter";
import formatDate from "date-fns/format";
import IntRange from "../../common/rangeInt";
import FormHelperText from "@material-ui/core/FormHelperText";
import Snackbar from "@material-ui/core/Snackbar";
import history from "../../common/history";
import WarningMessage from "../../common/warningMessage";
import TextField from "@material-ui/core/TextField";

const suggestions = [
  { value: "FAC", label: "Factura" },
  { value: "NC", label: "Nota de crédito" },
  { value: "ND", label: "Nota de débito" }
];

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
    },
    replaceRes: null
  };
  constructor() {
    super();
    this.checkForm = this.checkForm.bind(this);
    this.tryToAddRes = this.tryToAddRes.bind(this);
  }

  /**
   * Cada vez que se cambie el tipo de documento
   * esta funcion va a traer la resolucion que se va a reemplazar
   * si existe
   */

  bringReplaceResolution(doc) {
    fetch("/api/getReplaceResolucion?doc=" + doc.value)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          this.setState({ replaceRes: data[0] });
        } else {
          this.setState({ replaceRes: null });
        }
      });
  }

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
        if (err === 0) {
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

  /**
   * Va a hacer revisiones en el formulario para que solo se envie
   * cuando este tenga datos validos ingresados
   * @param {*} e  evento de abrir cuadro de dialogo
   *
   */
  checkForm(e) {
    e.preventDefault();
    if (this.state.doc == null || JSON.stringify(this.state.doc) === "[]") {
      this.handleOpenSnack("Ingresa un documento");
      this.setState({ hasErrorsDoc: true });
      return;
    }

    if (
      this.state.inicio >= this.state.fin ||
      this.state.inicio === "" ||
      this.state.fin === ""
    ) {
      this.handleOpenSnack("Rango invalido en inicio y fin");
      return;
    }

    if (this.state.inicio > 9999999999) {
      this.handleOpenSnack("Inicio tiene un número demasiado grande");
      return;
    }

    if (this.state.fin > 9999999999) {
      this.handleOpenSnack("Fin tiene un número demasiado grande");
      return;
    }

    this.handleDialogOpen();
  }

  /**
   * Dependiendo si se va a reemplazar o no
   * vamos a tener un mensaje de advertencia
   */
  getReplaceMessage() {
    if (this.state.replaceRes !== null) {
      const { replaceRes } = this.state;
      return ` Esta resolución va a reemplazar a ${
        replaceRes.Num
      } que todavia esta en uso, lleva ${replaceRes.Actual} de ${
        replaceRes.Fin
      }`;
    } else {
      return "None";
    }
  }

  /*****************EVENTS*/
  handleDocChange = value => {
    this.setState({ doc: value });
    this.bringReplaceResolution(value);
  };

  handleNResChange = e => {
    this.setState({ nres: e.target.value });
  };
  handleSerieChange = e => {
    this.setState({ serie: e.target.value });
  };

  /**
   * Actualiza el valor de inicio
   */
  handleInicioChange = val => {
    this.setState({ inicio: val });
  };
  /**
   * Actualiza el valor final
   */

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

  /***************Dynamic renders */
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

  renderWarning() {
    if (this.state.replaceRes !== null) {
      return (
        <React.Fragment>
          <Grid container />
          <Grid container className={this.props.classes.warning}>
            <WarningMessage message={this.getReplaceMessage()} />
          </Grid>
        </React.Fragment>
      );
    }
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
            <form className={classes.form} onSubmit={this.checkForm}>
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
                  autoFocus={true}
                  suggestions={suggestions}
                  placeholder={"Selecciona un documento"}
                  value={this.state.doc}
                />
                {hasErrorsDoc && (
                  <FormHelperText>Campo requerido!</FormHelperText>
                )}
              </FormControl>

              <Grid container spacing={24}>
                <Grid item xs={6}>
                  <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="nresolucion" maxLength="25">
                      Número de resolución
                    </InputLabel>
                    <Input
                      id="nresolucion"
                      name="nresolucion"
                      onBlur={this.handleNResChange}
                      autoComplete="off"
                      inputProps={{
                        maxLength: 25
                      }}
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
                      autoComplete="off"
                      inputProps={{
                        maxLength: 10
                      }}
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
            {this.renderWarning()}
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