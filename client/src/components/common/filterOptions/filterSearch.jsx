import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import FilterItem from "./filterItem";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";

class FilterSearch extends Component {
  state = {
    searchVal: "",
    filterType: "=",
    filterTypeItems: [
      { value: "=", name: "Igual" },
      { value: "!=", name: "No Igual" },
      { value: "%", name: "Contiene" },
      { value: "!%", name: "No Contiene" }
    ]
  };

  constructor(props) {
    super(props);
    this.filterItem = React.createRef();
    this.getFilter = this.getFilter.bind(this);
  }

  /**
   * Pasa los datos del filtro a un objeto
   */
  getFilter() {
    let filter = {};
    filter.type = "text";
    filter.id = this.props.id;
    filter.v1 = this.state.searchVal;
    filter.state = this.state.filterType;
    filter.enable = this.filterItem.current.isEnable();
    filter.dir = this.filterItem.current.getDir();
    return filter;
  }

  /**
   * Cuando cambio el valor del input activa el filtro
   * o lo intenta desactivar si esta vacio ademas de cambiar
   * el valor del input
   * @param {event} event Input que se quiere cambiar
   */
  onTypeEvent = event => {
    this.setState({ searchVal: event.target.value });
    this.filterItem.current.changeEnableAutomatic(
      event.target.value != "",
      event.target.value != ""
    );
  };

  /**
   * Cambia el valor del tipo de filtro
   * @param {String} Cambia el valor del tipo de filtro que se quiere aplicar
   */
  changeFilterType = val => {
    this.setState({ filterType: val });
  };

  render() {
    return (
      <FilterItem
        name={this.props.name}
        innerRef={this.filterItem}
        hasFilterData={this.state.searchVal != ""}
        currentFilterType={this.state.filterType}
        filterTypeItems={this.state.filterTypeItems}
        changeFilterType={this.changeFilterType}
      >
        <TextField
          id="standard-uncontrolled"
          label={this.props.label}
          margin="normal"
          onChange={this.onTypeEvent}
          fullWidth
        />
      </FilterItem>
    );
  }
}

export default FilterSearch;
