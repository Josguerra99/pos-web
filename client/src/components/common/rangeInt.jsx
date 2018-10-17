import React, { Component } from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Grid from "@material-ui/core/Grid";
import { isNull } from "util";
class IntRange extends Component {
  state = {
    start: "",
    end: "",
    start_input: "",
    end_input: ""
  };

  handleStartChange = e => {
    //Parser a int
    this.setState({ start_input: e.target.value });
  };

  handleEndChange = e => {
    this.setState({ end_input: e.target.value });
  };

  checkValue(cmp, v1, v1_input, v2) {
    var v = parseInt(v1);

    //Primero comparamos que sea un numero entero valido (>0)
    var v_input = -1;

    //Si lo dejamos vacio entonces borramos el dato
    if (v1_input == "") return "";

    //Si es un numero entonces lo parseamos
    if (!isNaN(v1_input)) {
      var inputtmp = parseInt(v1_input);
      //Luego comprobamos que sea un numero entero mayor a 0
      if (Number.isInteger(inputtmp) && inputtmp >= 0) {
        v_input = inputtmp;
      }
    }

    //Comprobamos que sea valido primero y luego de eso comprobamos que sea menor
    //La comprobacion del end, lo hara su propio checker
    if (v_input !== -1) {
      if (v2 == "") v = v_input;
      if (cmp === "<") if (v_input < v2) v = v_input;
      if (cmp === ">") if (v_input > v2) v = v_input;
    }

    if (isNaN(v)) v = "";
    return v;
  }

  checkStartValue = () => {
    var start = this.checkValue(
      "<",
      this.state.start,
      this.state.start_input,
      this.state.end
    );

    this.setState({ start: start });
    this.setState({ start_input: start });
    if (this.props.getStart) this.props.getStart(start);
  };

  checkEndValue = () => {
    var end = this.checkValue(
      ">",
      this.state.end,
      this.state.end_input,
      this.state.start
    );
    this.setState({ end: end });
    this.setState({ end_input: end });
    if (this.props.getEnd) this.props.getEnd(end);
  };

  render() {
    return (
      <React.Fragment>
        <Grid container spacing={24}>
          <Grid item xs={6}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="start">Inicio</InputLabel>
              <Input
                type="number"
                id="start"
                name="start"
                value={this.state.start_input}
                onChange={this.handleStartChange}
                onBlur={this.checkStartValue}
                step="1"
                min="0"
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="end">Fin</InputLabel>
              <Input
                type="number"
                id="end"
                name="end"
                value={this.state.end_input}
                onChange={this.handleEndChange}
                onBlur={this.checkEndValue}
                step="1"
                min="0"
              />
            </FormControl>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default IntRange;
