import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import FilterItem from "./filterItem";

class FilterNumberRange extends Component {
  state = {};
  render() {
    return (
      <FilterItem name={this.props.name}>
        <TextField
          id="standard-uncontrolled"
          label={this.props.label}
          margin="normal"
          fullWidth
        />
      </FilterItem>
    );
  }
}

export default FilterNumberRange;
