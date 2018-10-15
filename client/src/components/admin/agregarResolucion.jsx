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

class AgregarResolucionAdmin extends Component {
  state = {
    doc: "",
    nres: "",
    serie: "",
    inicio: 0,
    fin: 0,
    selectedDate: null,
    dialog: { open: false }
  };
  constructor() {
    super();
    this.tryToSubmitForm = this.tryToSubmitForm.bind(this);
  }

  componentDidMount() {}

  tryToSubmitForm(e) {
    e.preventDefault();
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
  handleInicioChange = e => {
    //Si ya esta ingresado el fin comprobamos que este sea menor
    this.setState({
      inicio: e.target.value
    });
  };
  handleFinChange = e => {
    this.setState({ fin: e.target.value });
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

  /*****************EVENTS*/

  /*****************CREAR LA PAGINA*/
  render() {
    const { classes } = this.props;
    const { selectedDate } = this.state;

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
              <FormControl margin="normal" required fullWidth>
                <AutoComplete
                  name="Tipo de documento"
                  onChange={this.handleDocChange}
                />
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

              <Grid container spacing={24}>
                <Grid item xs={3}>
                  <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="start">Inicio</InputLabel>
                    <Input
                      type="number"
                      id="start"
                      name="start"
                      value={this.state.inicio}
                      onChange={this.handleInicioChange}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="end">Fin</InputLabel>
                    <Input
                      type="number"
                      id="end"
                      name="end"
                      value={this.state.fin}
                      onChange={this.handleFinChange}
                    />
                  </FormControl>
                </Grid>
              </Grid>

              <FormControl margin="normal" required fullWidth>
                <div className="picker">
                  <DatePicker
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
            <Grid container>
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
                      {this.state.inicio + " , " + this.state.fin}
                    </TableCell>
                    <TableCell>
                      {formatDate(this.state.selectedDate, "dd/MM/yyyy")}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Grid>
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
            <Button onClick={this.handleDialogClose} color="primary">
              Si
            </Button>
          </DialogActions>
        </Dialog>
      </AdminDashboard>
    );
  }

  /*****************CREAR LA PAGINA*/
}

AgregarResolucionAdmin.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AgregarResolucionAdmin);
