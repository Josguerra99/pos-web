import React, { Component } from "react";
import PaginationTable from "../paginationTable";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Filters from "../filters";
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

import AddEditDialog from "./addEditDialog";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: "none"
  }
});

class TableMngr extends Component {
  state = {
    action: "ADD",
    selectedID: null,
    data: [],
    hasData: false,
    tempElement: undefined,
    dialogIsOpen: false,
    dialogName: "producto",
    dialogTitle: "Agregar producto"
  };

  constructor(props) {
    super(props);
    if (props.dialogName) this.state.dialogName = props.dialogName;
    this.state.elementStructure = props.elementStructure;
    this.state.tempElement = { ...this.state.elementStructure };
    this.state.hasData = false;
    //Ver si los datos ya estan pasados
    if (props.data !== null && props.data.length > 0) {
      const data = this.mapData(this.props.data);
      this.state.data = data;
      this.state.hasData = true;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.data !== this.props.data) {
      var data = [];
      if (this.props.data != null) {
        data = this.mapData(this.props.data);
      }
      this.setState({ data });
      this.setState({ hasData: true });
    }
  }

  /**
   * Mapear elemento (le va a agregar un elemento id)
   */
  mapData = data => {
    return data.map((el, id) => {
      var element = { ...el };
      element.id = id;
      return element;
    });
  };

  /**
   * Agrega un nuevo elemento
   */
  addElementCallback = () => {
    if (this.state.action != "ADD") return;

    if (this.props.onInsert != null) {
      this.props.onInsert(err => {
        if (err === 0) {
          this.addElement();
        }
      });
    } else {
      this.addElement();
    }
  };

  addElement = () => {
    this.handleDialogOpen(false);
    let data = this.state.data;
    const element = this.props.tempElement;
    element.id = data.length;
    data.unshift({ ...element });
    this.setState({ data });
    if (this.props.syncData) this.props.syncData(data);
  };

  /**
   * Edita el elemento que tiene el id en la tabla/arreglo
   * @param {Integer} id El id de la fila en la que esta el elemento
   */
  editElementCallback = () => {
    if (this.state.action != "EDIT") return;

    if (this.props.onUpdate != null)
      this.props.onUpdate(err => {
        if (err === 0) {
          this.editElement();
        }
      });
    else {
      this.editElement();
    }
  };

  editElement = () => {
    this.handleDialogOpen(false);
    const id = this.state.selectedID;
    const data = [...this.state.data];
    const element = { ...this.props.tempElement };
    element.id = id;
    data[id] = { ...element };
    this.setState({ data });
    if (this.props.syncData) this.props.syncData(data);
  };

  /**
   * ELimina el elemento que tiene el id en la tabla/arreglo
   * @param {Integer} id El id de la fila en la que esta el elemento
   */
  deleteElement = () => {
    if (this.state.action !== "DELETE") return;
    const id = this.state.selectedID;
    const tempData = [...this.state.data];
    tempData.splice(id, 1);

    const data = tempData.map((el, id) => {
      const element = { ...el };
      element.id = id;
      return element;
    });

    this.setState({ data });
    if (this.props.syncData) this.props.syncData(data);
  };
  /**
   * Abre el dialog donde se muestra lo de agregar o editar
   * Si el elemento que se va a editar es null entonces abrimos
   * el dialog vacio si no lo abrimos con los valores del elemento
   * @param {Boolean} val si vamos a abrir o a cerrar el dialog
   * @param {Object} selectedID Elemento que se va a editar (id en array)
   */
  handleDialogOpen = (val, action = null, selectedID = null) => {
    //Modificamos cosas del dialog que voy a abrir, como el titulo
    //Ademas de los estados para saber si voy a agregar, editar o eliminar
    if (val) {
      var title = "Agregar " + this.state.dialogName;
      var tempElement = { ...this.state.elementStructure };

      if (action === "EDIT") {
        title = "Editar " + this.state.dialogName;
        tempElement = { ...this.state.data[selectedID] };
      }
      if (action === "DELETE") {
        title = "Eliminar " + this.state.dialogName;
        tempElement = { ...this.state.data[selectedID] };
      }

      if (this.props.syncTemp) this.props.syncTemp(tempElement);
      this.setState({ tempElement });
      this.setState({ action });
      this.setState({ dialogTitle: title });
      this.setState({ selectedID });
    }

    this.setState({ dialogIsOpen: val });
  };

  handleDialogOk = () => {
    if (this.state.action === "ADD") this.addElementCallback();
    if (this.state.action === "EDIT") this.editElementCallback();
    if (this.state.action === "DELETE{") this.deleteElement();
  };

  renderTableHead() {
    return (
      <TableRow>
        {this.props.renderHead()}
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
        {this.props.renderRow(row)}
        <TableCell align={"center"}>
          <IconButton
            color="primary"
            aria-label="Edit element"
            onClick={() => {
              this.handleDialogOpen(true, "EDIT", row.id);
            }}
          >
            <EditIcon />
          </IconButton>
          {/*<IconButton
            color="secondary"
            aria-label="Add an alarm"
            onClick={() => {
              this.handleDialogOpen(true, "DELETE", row.id);
            }}
          >
            <DeleteIcon />
          </IconButton>*/}
        </TableCell>
      </TableRow>
    );
  };

  /**
   * Va a renderizar el contenido del dialog si es DELETE renderiza
   * un cuadro de confirmacion, caso contrario renderiza un formulario
   */
  renderDialog = () => {
    if (!this.state.dialogIsOpen) return <React.Fragment />;
    if (this.state.action === "DELETE") {
      return (
        <React.Fragment>{this.props.renderDeleteMessage()}</React.Fragment>
      );
    } else {
      return <React.Fragment>{this.props.renderDialogForm()}</React.Fragment>;
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <Theme>
        <IconButton onClick={() => this.handleDialogOpen(true, "ADD")}>
          <AddIcon />
        </IconButton>
        <PaginationTable
          tableHead={this.renderTableHead()}
          bodyMap={this.bodyMap}
          rows={this.state.data}
          columns={this.props.columns + 1}
          loading={!this.state.hasData}
        />
        <AddEditDialog
          title={this.state.dialogTitle}
          open={this.state.dialogIsOpen}
          handleOpen={this.handleDialogOpen}
          handleOk={this.handleDialogOk}
        >
          {this.renderDialog()}
        </AddEditDialog>
      </Theme>
    );
  }
}

TableMngr.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array
};

export default withStyles(styles)(TableMngr);
