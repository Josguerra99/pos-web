import React, { Component } from "react";
import IntRange from "../rangeInt";
import FilterItem from "./filterItem";

class FilterNumberRange extends Component {
  state = {};
  render() {
    return (
      <FilterItem name={this.props.name}>
        <IntRange isForm={false} />
      </FilterItem>
    );
  }
}

export default FilterNumberRange;
