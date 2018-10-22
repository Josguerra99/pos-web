import React, { Component } from "react";
import IntRange from "../rangeInt";
import FilterItem from "./filterItem";
import TextField from "@material-ui/core/TextField";

class FilterNumberRange extends Component {
  state = {
    val1: "",
    val2: "",
    filterType: "=",
    filterTypeItems: [
      { value: "=", name: "Igual" },
      { value: "!=", name: "No Igual" },
      { value: ">", name: "Mayor" },
      { value: "<", name: "Menor" },
      { value: "<>", name: "Entre" }
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
    filter.type = "numeric";
    filter.v1 = parseInt(this.state.val1);
    filter.v2 = parseInt(this.state.val2);
    filter.state = this.state.type;
    filter.enable = this.filterItem.current.isEnable();
    filter.dir = this.filterItem.current.getDir();
    return filter;
  }

  /**
   * Cambia el valor del tipo de filtro
   * @param {String} Cambia el valor del tipo de filtro que se quiere aplicar
   */
  changeFilterType = val => {
    this.setState({ filterType: val });
  };

  /**
   * Cuando cambio el valor del input activa el filtro
   * o lo intenta desactivar si esta vacio ademas de cambiar
   * el valor del input, en este caso si v2 es nulo entonces
   * es que estamos cambiando solo un valor, si v1 y v2 son pasados
   * hay que comprobar cualquier cambio en los dos valores
   * @param {event} v1 Valor 1 nuevo
   * @param {event} v2 Valor 2 nuevo
   */
  onTypeEvent = (v1, v2 = null) => {
    var changeValue = true;
    if (this.state.filterType === "<>") {
      if (v1 === "" && v2 === "") changeValue = false;
    } else {
      if (v1 === "") changeValue = false;
    }
    this.filterItem.current.changeEnableAutomatic(changeValue, changeValue);
  };

  /**
   * Este evento es para cuando se tiene seleccionado un solo input
   * (o sea el tipo de conversion no es entre)
   * @param {event} event Input del cual se obtendra el valor
   */
  handleVal1Change = event => {
    this.setState({ val1: event.target.value });
    this.onTypeEvent(event.target.value);
  };

  /**
   * Actualiza el valor de inicio
   * y luego intenta activar o desactivar el filtro
   */
  handleInicioChange = val => {
    this.setState({ val1: val });
    this.onTypeEvent(val, this.state.val2);
  };
  /**
   * Actualiza el valor final
   * y luego intenta activar o desactivar el filtro
   */

  handleFinChange = val => {
    this.setState({ val2: val });
    this.onTypeEvent(this.state.val1, val);
  };

  /**
   * Dira si tenemos datos ingresados
   * si el tipo de filtro es entre entonces mira si uno de los dos tiene datos
   * caso contrario mira que val1 tenga valor
   */
  hasFilterData = () => {
    if (this.state.filterType === "<>") {
      return this.state.val1 != "" && this.state.val2 != "";
    } else {
      return this.state.val1 !== "" && this.state.val1 !== null;
    }
  };

  renderFilterInput(val) {
    if (val === "<>") {
      return (
        <IntRange
          isForm={false}
          getStart={this.handleInicioChange}
          getEnd={this.handleFinChange}
        />
      );
    } else {
      return (
        <TextField
          id="standard-uncontrolled"
          label={this.props.label}
          margin="normal"
          type="number"
          value={this.state.val1}
          onChange={this.handleVal1Change}
          fullWidth
        />
      );
    }
  }

  render() {
    return (
      <FilterItem
        name={this.props.name}
        innerRef={this.filterItem}
        hasFilterData={this.hasFilterData()}
        currentFilterType={this.state.filterType}
        filterTypeItems={this.state.filterTypeItems}
        changeFilterType={this.changeFilterType}
      >
        {this.renderFilterInput(this.state.filterType)}
      </FilterItem>
    );
  }
}

export default FilterNumberRange;
