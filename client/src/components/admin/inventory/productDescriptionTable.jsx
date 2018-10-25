import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TableRow from "@material-ui/core/TableRow";
import formatDate from "date-fns/format";
import TableCell from "@material-ui/core/TableCell";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import TextField from "@material-ui/core/TextField";
import Theme from "../../themes/defaulTheme";
import Typography from "@material-ui/core/Typography";

import TableMngr from "../../common/mngr/tableMngr";

class ProductDescriptionTable extends Component {
  state = {
    elementStructure: { codigo: "", descripcion: "" },

    tempElement: undefined
  };

  constructor(props) {
    super(props);
    this.state.data = props.data;
  }
  /**
   * Events
   */
  handleName = e => {
    const tempElement = { ...this.state.tempElement };
    tempElement.descripcion = e.target.value;
    this.setState({ tempElement });
  };

  /**
   * Sincronizadores
   */
  syncTemp = tempElement => {
    this.setState({ tempElement });
  };

  syncMemoryData = data => {
    this.setState({ data });
  };

  /**
   * Renderizar header de la tabla
   */
  renderTableHead = () => {
    return <TableCell>Descripcion</TableCell>;
  };

  /**
   * Renderizar fila de la tabla
   */
  renderTableRow = row => {
    return <TableCell>{row.descripcion}</TableCell>;
  };

  /**
   * Renderizar cuando se vaya a eliminar
   */
  deleteMessage = () => {
    return (
      <Typography>
        Esta seguro de eliminar {this.state.tempElement.descripcion}?
      </Typography>
    );
  };

  /**
   * Rendizar formulario de agregar o editar
   */
  dialogForm = () => {
    return (
      <TextField
        autoFocus
        margin="dense"
        id="name"
        label="Nombre"
        type="text"
        autoComplete="false"
        value={this.state.tempElement.descripcion}
        onChange={this.handleName}
        fullWidth
      />
    );
  };

  render() {
    return (
      <TableMngr
        elementStructure={this.state.elementStructure}
        data={this.state.data}
        renderRow={this.renderTableRow}
        renderHead={this.renderTableHead}
        renderDeleteMessage={this.deleteMessage}
        renderDialogForm={this.dialogForm}
        syncData={this.syncMemoryData}
        syncTemp={this.syncTemp}
        tempElement={this.state.tempElement}
        dialogName="descripción"
        columns={1}
      />
    );
  }
}

export default ProductDescriptionTable;
