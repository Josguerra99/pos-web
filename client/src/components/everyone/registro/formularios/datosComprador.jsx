import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

class DatosCompradorForm extends Component {
  state = {
    user: "",
    pass1: "",
    pass2: ""
  };
  handleText = (state, val) => {
    this.setState({ [state]: val });
    this.props.sync(state, val);
  };

  render() {
    const { user, pass1, pass2 } = this.state;
    return (
      <React.Fragment>
        <Typography variant="h6" gutterBottom>
          Datos del negocio
        </Typography>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <TextField
              required
              id="user"
              name="user"
              label="Usuario"
              fullWidth
              autoComplete="off"
              autoFocus
              value={user}
              onChange={e => this.handleText("user", e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              type="password"
              id="pass"
              name="pass"
              label="Contraseña"
              fullWidth
              autoComplete="off"
              value={pass1}
              onChange={e => this.handleText("pass1", e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              type="password"
              id="pass"
              name="pass"
              label="Repita contraseña"
              fullWidth
              autoComplete="off"
              value={pass2}
              onChange={e => this.handleText("pass2", e.target.value)}
            />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default DatosCompradorForm;
