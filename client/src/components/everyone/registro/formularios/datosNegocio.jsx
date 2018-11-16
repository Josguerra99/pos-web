import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import Switch from "@material-ui/core/Switch";

class DatosNegocioForm extends Component {
  state = {
    nit: "",
    nombre: "",
    denominacion: "",
    direccion: "",
    nombreIn: "",
    apellidoIn: "",
    juridica: true,
    pequeno: false
  };
  handleText = (state, val) => {
    this.setState({ [state]: val });
    this.props.sync(state, val);
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
    this.props.sync(name, event.target.checked);
  };

  renderVariableData = () => {
    if (this.state.juridica) {
      return this.renderPersonaJuridica();
    }
    return this.renderPersonaIndividual();
  };

  renderPersonaIndividual() {
    const {
      nit,
      nombre,
      nombreIn,
      apellidoIn,
      denominacion,
      direccion
    } = this.state;
    return (
      <React.Fragment>
        <Grid item xs={6}>
          <TextField
            required
            id="nombre"
            name="nombre"
            label="Nombre"
            fullWidth
            autoComplete="off"
            value={nombreIn}
            onChange={e => this.handleText("nombreIn", e.target.value)}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            required
            id="apellido"
            name="apellido"
            label="Apellido"
            fullWidth
            autoComplete="off"
            value={apellidoIn}
            onChange={e => this.handleText("apellidoIn", e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="denominacion"
            name="denominacion"
            label="Contribuyente emisor"
            fullWidth
            autoComplete="off"
            value={denominacion}
            onChange={e => this.handleText("denominacion", e.target.value)}
          />
        </Grid>
      </React.Fragment>
    );
  }

  renderPersonaJuridica() {
    const { nit, nombre, denominacion, direccion } = this.state;
    return (
      <React.Fragment>
        <Grid item xs={12}>
          <TextField
            required
            id="nombre"
            name="nombre"
            label="Nombre"
            fullWidth
            autoComplete="off"
            value={nombre}
            onChange={e => this.handleText("nombre", e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="denominacion"
            name="denominacion"
            label="Razón social"
            fullWidth
            autoComplete="off"
            value={denominacion}
            onChange={e => this.handleText("denominacion", e.target.value)}
          />
        </Grid>
      </React.Fragment>
    );
  }

  render() {
    const { nit, nombre, denominacion, direccion } = this.state;
    return (
      <React.Fragment>
        <Typography variant="h6" gutterBottom>
          Datos del negocio
        </Typography>

        <FormGroup row>
          <FormControlLabel
            control={
              <Switch
                checked={this.state.juridica}
                onChange={this.handleChange("juridica")}
                value="juridica"
                color="secondary"
              />
            }
            label={
              this.state.juridica ? "Persona jurídica" : "Persona individual"
            }
          />
          <FormControlLabel
            control={
              <Switch
                checked={this.state.pequeno}
                onChange={this.handleChange("pequeno")}
                value="pequeno"
                color="secondary"
              />
            }
            label={
              this.state.pequeno
                ? "Pequeño contribuyente"
                : "Otro Contribuyente"
            }
          />
        </FormGroup>

        <Grid container spacing={24}>
          <Grid item xs={12}>
            <TextField
              required
              id="nit"
              name="nit"
              label="NIT"
              fullWidth
              autoComplete="off"
              autoFocus
              value={nit}
              onChange={e => this.handleText("nit", e.target.value)}
            />
          </Grid>
          {this.renderVariableData()}
          <Grid item xs={12}>
            <TextField
              required
              id="direccion"
              name="direccion"
              label="Dirección"
              multiline
              fullWidth
              autoComplete="off"
              value={direccion}
              onChange={e => this.handleText("direccion", e.target.value)}
            />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default DatosNegocioForm;
