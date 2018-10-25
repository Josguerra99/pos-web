import React, { Component } from "react";
import PaginationTable from "./paginationTable";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Filters from "./filters";
import TableRow from "@material-ui/core/TableRow";
import formatDate from "date-fns/format";
import TableCell from "@material-ui/core/TableCell";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import TextField from "@material-ui/core/TextField";
import Theme from "../themes/defaulTheme";

import AddEditDialog from "./mngr/addEditDialog";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: "none"
  }
});

class ProductMngr extends Component {
  state = {
    editingID: null,
    elementStructure: { codigo: "", nombre: "" },
    data: [
      { codigo: "A", nombre: "Bombillo" },
      { codigo: "B", nombre: "Lentes de seguridad" },
      { codigo: "C", nombre: "Cinta industrial" },
      { codigo: "D", nombre: "Taladro" },
      { codigo: "E", nombre: "Generador electrico" },
      { codigo: "F", nombre: "Stepper" },
      { codigo: "G", nombre: "Multimetro" }
    ].map((el, id) => {
      var element = {};
      element.id = id;
      element.codigo = el.codigo;
      element.nombre = el.nombre;
      return element;
    }),
    hasData: true,
    tempElement: undefined,
    dialogIsOpen: false,
    dialogName: "producto",
    dialogTitle: "Agregar producto"
  };

  constructor(props) {
    super(props);
    this.state.tempElement = { ...this.state.elementStructure };
  }

  /**
   * Agrega un nuevo elemento
   */
  addElement = () => {
    let data = this.state.data;
    const element = this.state.tempElement;
    element.id = data.length;
    data.push({ ...element });
    this.setState({ data: data });
  };

  /**
   * Edita el elemento que tiene el id en la tabla/arreglo
   * @param {Integer} id El id de la fila en la que esta el elemento
   */
  editElement = () => {
    if (this.state.editingID === null) return;

    const id = this.state.editingID;
    const data = [...this.state.data];
    const element = { ...this.state.tempElement };
    element.id = id;
    data[id] = { ...element };
    this.setState({ data });
  };

  /**
   * Abre el dialog donde se muestra lo de agregar o editar
   * Si el elemento que se va a editar es null entonces abrimos
   * el dialog vacio si no lo abrimos con los valores del elemento
   * @param {Boolean} val si vamos a abrir o a cerrar el dialog
   * @param {Object} editElement Elemento que se va a editar (id en array)
   */
  handleDialogOpen = (val, editElement = null) => {
    //Si lo voy a abrir modifico el estilo del dialog y cambio mi estado de editando o no
    if (val) {
      var title = "Agregar " + this.state.dialogName;
      var tempElement = { ...this.state.elementStructure };

      if (editElement != null) {
        title = "Editar " + this.state.dialogName;
        tempElement = { ...this.state.data[editElement] };
      }

      this.setState({ tempElement });
      this.setState({ dialogTitle: title });
      this.setState({ editingID: editElement });
    }

    this.setState({ dialogIsOpen: val });
  };

  handleDialogOk = () => {
    this.handleDialogOpen(false);
    if (this.state.editingID === null) this.addElement();
    else this.editElement(this.state.editing);
  };

  /**
   * Actualizar nombre con el input
   */
  handleName = e => {
    const tempElement = { ...this.state.tempElement };
    tempElement.nombre = e.target.value;
    this.setState({ tempElement });
  };

  /*
    Se le pasa esta funcion como props para la tabla
     */
  renderTableHead() {
    return (
      <TableRow>
        <TableCell>Nombre</TableCell>
        <TableCell>Opciones</TableCell>
      </TableRow>
    );
  }

  /**
   *
   * @param {*} row
   * Esta funcion se le pasa a la tabla para la paginacion
   * lo hace con map y row es el parametro que le pasa
   * map, lo que hace es crear la fila actual con los datos de
   * rows (que son la informacion que trajimos y mapeamos anteriormente)
   */
  bodyMap = row => {
    return (
      <TableRow key={row.id}>
        <TableCell>{row.nombre}</TableCell>
        <TableCell align={"center"}>
          <IconButton
            color="primary"
            aria-label="Add an alarm"
            onClick={() => {
              this.handleDialogOpen(true, row.id);
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton color="secondary" aria-label="Add an alarm">
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  };

  render() {
    const { classes } = this.props;
    return (
      <Theme>
        <IconButton onClick={() => this.handleDialogOpen(true)}>
          <AddIcon />
        </IconButton>
        <PaginationTable
          tableHead={this.renderTableHead()}
          bodyMap={this.bodyMap}
          rows={this.state.data}
          columns={2}
          loading={!this.state.hasData}
        />
        <AddEditDialog
          title={this.state.dialogTitle}
          open={this.state.dialogIsOpen}
          handleOpen={this.handleDialogOpen}
          handleOk={this.handleDialogOk}
        >
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Nombre"
            type="text"
            autoComplete="false"
            value={this.state.tempElement.nombre}
            onChange={this.handleName}
            fullWidth
          />
        </AddEditDialog>
      </Theme>
    );
  }
}

ProductMngr.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProductMngr);
