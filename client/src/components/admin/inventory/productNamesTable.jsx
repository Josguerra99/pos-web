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

class ProductNamesTable extends Component {
  state = {
    elementStructure: { codigo: "", nombre: "" },

    tempElement: undefined
  };

  constructor(props) {
    super(props);
    if (props.data != null && props.data.length > 0) {
      this.state.data = props.data;
    } else {
      this.state.data = [];
    }
    // this.updateData(props);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.data !== this.props.data) {
      var data = [];
      if (this.props.data != null) {
        data = this.props.data;
      }
      this.setState({ data });
      this.setState({ hasData: true });
    }
  }

  onInsert = callback => {
    if (this.props.onInsert != null) {
      this.props.onInsert(
        this.state.tempElement.nombre,
        "NOMBRE",
        callback,
        "nombHasChanges",
        "product"
      );
    } else callback(0);
  };

  onUpdate = callback => {
    if (this.props.onUpdate != null) {
      this.props.onUpdate(
        "NOMBRE",
        this.state.tempElement.idNombre,
        this.state.tempElement.nombre,
        callback,
        "nombHasChanges",
        "product"
      );
    } else callback(0);
  };

  /**
   * Events
   */
  handleName = e => {
    const tempElement = { ...this.state.tempElement };
    tempElement.nombre = e.target.value;
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
    return <TableCell>Nombre</TableCell>;
  };

  /**
   * Renderizar fila de la tabla
   */
  renderTableRow = row => {
    return <TableCell>{row.nombre}</TableCell>;
  };

  /**
   * Renderizar cuando se vaya a eliminar
   */
  deleteMessage = () => {
    return (
      <Typography>
        Esta seguro de eliminar {this.state.tempElement.nombre}?
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
        required
        autoComplete="off"
        value={this.state.tempElement.nombre}
        onChange={this.handleName}
        fullWidth
        inputProps={{ maxLength: 30 }}
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
        dialogName="producto"
        columns={1}
        onInsert={this.onInsert}
        onUpdate={this.onUpdate}
        hasData={this.props.hasData}
        messageHandler={this.props.messageHandler}
      />
    );
  }
}

export default ProductNamesTable;
