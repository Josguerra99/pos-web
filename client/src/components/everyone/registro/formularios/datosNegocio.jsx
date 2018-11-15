import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

class DatosNegocioForm extends Component {
  state = {
    nit: "",
    nombre: "",
    denominacion: "",
    direccion: ""
  };
  handleText = (state, val) => {
    this.setState({ [state]: val });
    this.props.sync(state, val);
  };

  render() {
    const { nit, nombre, denominacion, direccion } = this.state;
    return (
      <React.Fragment>
        <Typography variant="h6" gutterBottom>
          Datos del negocio
        </Typography>
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
