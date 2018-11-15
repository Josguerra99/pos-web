import React, { Component } from "react";
import TableCell from "@material-ui/core/TableCell";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import AutoComplete from "../../common/autocompleter";
import TableMngr from "../../common/mngr/tableMngr";
import FormControl from "@material-ui/core/FormControl";
import Snackbar from "@material-ui/core/Snackbar";
import FormHelperText from "@material-ui/core/FormHelperText";

import MoneyFormat from "../../common/inputFormats/money";
import IntegerFormat from "../../common/inputFormats/integer";

class InventoryTable extends Component {
  state = {
    elementStructure: {
      iddb: -1,
      codigo: "",
      marca: null,
      nombre: null,
      descripcion: null,
      presentacion: null,
      unidades: "",
      stock: 0,
      precioActual: "",
      delete: false
    },
    snack: {
      open: false,
      vertical: "bottom",
      horizontal: "right",
      message: ""
    },
    errors: {
      marca: false,
      nombre: false,
      descripcion: false,
      presentacion: false
    }
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
      const inv = {
        codigo: this.state.tempElement.codigo,
        idMarca: this.state.tempElement.marca.value,
        idNombre: this.state.tempElement.nombre.value,
        idDescripcion: this.state.tempElement.descripcion.value,
        idPresentacion: this.state.tempElement.presentacion.value,
        unidades: this.state.tempElement.unidades,
        precioActual: this.state.tempElement.precioActual
      };
      this.props.onInsert(inv, callback);
    } else callback(0);
  };

  onUpdate = callback => {
    if (this.props.onUpdate != null) {
      const inv = {
        iddb: this.state.tempElement.iddb,
        codigo: this.state.tempElement.codigo,
        idMarca: this.state.tempElement.marca.value,
        idNombre: this.state.tempElement.nombre.value,
        idDescripcion: this.state.tempElement.descripcion.value,
        idPresentacion: this.state.tempElement.presentacion.value,
        unidades: this.state.tempElement.unidades,
        precioActual: this.state.tempElement.precioActual
      };

      this.props.onUpdate(inv, callback);
    } else callback(0);
  };

  /**
   * Events
   */
  handleCodigo = e => {
    const tempElement = { ...this.state.tempElement };
    tempElement.codigo = e.target.value;
    this.setState({ tempElement });
  };

  handleUnidades = e => {
    const tempElement = { ...this.state.tempElement };
    tempElement.unidades = e.target.value;
    this.setState({ tempElement });
  };

  handlePrecio = e => {
    const tempElement = { ...this.state.tempElement };
    tempElement.precioActual = e.target.value;
    this.setState({ tempElement });
  };

  handleMarcaChange = value => {
    const tempElement = { ...this.state.tempElement };
    tempElement.marca = value;
    this.setState({ tempElement });
  };
  handleNombreChange = value => {
    const tempElement = { ...this.state.tempElement };
    tempElement.nombre = value;
    this.setState({ tempElement });
  };
  handleDescripcionChange = value => {
    const tempElement = { ...this.state.tempElement };
    tempElement.descripcion = value;
    this.setState({ tempElement });
  };
  handlePresentacionChange = value => {
    const tempElement = { ...this.state.tempElement };
    tempElement.presentacion = value;
    this.setState({ tempElement });
  };

  /**
   * Sincronizadores
   */
  syncTemp = tempElement => {
    this.setState({ tempElement });
  };

  syncMemoryData = (data, type) => {
    this.setState({ data });
  };

  getElementData(data, idName, id, column) {
    const result = data.filter(el => el[idName] == id);
    if (result.length > 0) return result[0][column];
  }

  checkForm = () => {
    var errors = { ...this.state.errors };
    if (
      this.state.tempElement.marca === null ||
      JSON.stringify(this.state.tempElement.marca) === "[]"
    ) {
      errors.marca = true;
      this.setState({ errors });
      this.handleOpenSnack("Ingresa una marca");
      return false;
    }

    if (
      this.state.tempElement.nombre === null ||
      JSON.stringify(this.state.tempElement.nombre) === "[]"
    ) {
      errors.nombre = true;
      this.setState({ errors });
      this.handleOpenSnack("Ingresa una nombre");
      return false;
    }
    if (
      this.state.tempElement.descripcion === null ||
      JSON.stringify(this.state.tempElement.descripcion) === "[]"
    ) {
      errors.descripcion = true;
      this.setState({ errors });
      this.handleOpenSnack("Ingresa una descripcion");
      return false;
    }
    if (
      this.state.tempElement.presentacion === null ||
      JSON.stringify(this.state.tempElement.presentacion) === "[]"
    ) {
      errors.presentacion = true;
      this.setState({ errors });
      this.handleOpenSnack("Ingresa una presentacion");
      return false;
    }

    return true;
  };

  /**
   * Renderizar header de la tabla
   */
  renderTableHead = () => {
    return (
      <React.Fragment>
        <TableCell>Código</TableCell>
        <TableCell>Marca</TableCell>
        <TableCell>Nombre</TableCell>
        <TableCell>Descripción</TableCell>
        <TableCell>Presentación</TableCell>
        <TableCell>Unidades</TableCell>
        <TableCell>Stock</TableCell>
        <TableCell>Precio</TableCell>
      </React.Fragment>
    );
  };

  /**
   * Renderizar fila de la tabla
   */
  renderTableRow = row => {
    var precioActual = "";
    if (row.precioActual && row.precioActual.toFixed)
      precioActual = row.precioActual.toFixed(2);
    return (
      <React.Fragment>
        <TableCell>{row.codigo}</TableCell>
        <TableCell>{row.marca.label}</TableCell>
        <TableCell>{row.nombre.label} </TableCell>
        <TableCell>{row.descripcion.label}</TableCell>
        <TableCell>{row.presentacion.label}</TableCell>
        <TableCell>{row.unidades}</TableCell>
        <TableCell>{row.stock}</TableCell>
        <TableCell>{"Q." + precioActual}</TableCell>
      </React.Fragment>
    );
  };

  /**
   * Renderizar cuando se vaya a eliminar
   */
  deleteMessage = () => {
    return (
      <Typography>
        Esta seguro de eliminar {this.state.tempElement.nombre.label}?
      </Typography>
    );
  };

  //Abrir mensaje
  handleOpenSnack = message => {
    this.setState({
      snack: {
        open: true,
        vertical: "bottom",
        horizontal: "right",
        message: message
      }
    });
  };

  //Cerrar el mensaje
  handleCloseSnack = () => {
    this.setState({
      snack: {
        open: false,
        vertical: "bottom",
        horizontal: "right",
        message: ""
      }
    });
  };

  /**
   * Rendizar formulario de agregar o editar
   */
  dialogForm = () => {
    return (
      <React.Fragment>
        <Grid container style={{ padding: 10 }}>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            label="Codigo"
            autoComplete="false"
            value={this.state.tempElement.codigo}
            onChange={this.handleCodigo}
            autoComplete="off"
            fullWidth
            inputProps={{ maxLength: 30 }}
          />
        </Grid>

        <Grid container>
          <Grid item xs={6} style={{ padding: 10 }}>
            <AutoComplete
              name="Marca"
              required
              placeholder="Elija la marca"
              value={this.state.tempElement.marca}
              onChange={this.handleMarcaChange}
              suggestions={this.props.datosMarca.map(el => {
                const element = {};
                element.value = el.idMarca;
                element.label = el.marca;
                return element;
              })}
            />
            {this.state.errors.marca && (
              <FormHelperText>Campo requerido!</FormHelperText>
            )}
          </Grid>
          <Grid item xs={6} style={{ padding: 10 }}>
            <AutoComplete
              name="Nombre"
              placeholder="Elija el nombre"
              required
              value={this.state.tempElement.nombre}
              onChange={this.handleNombreChange}
              suggestions={this.props.datosNombre.map(el => {
                const element = {};
                element.value = el.idNombre;
                element.label = el.nombre;
                return element;
              })}
            />
            {this.state.errors.nombre && (
              <FormHelperText>Campo requerido!</FormHelperText>
            )}
          </Grid>
        </Grid>
        <Grid item xs={12} style={{ padding: 10 }}>
          <AutoComplete
            name="Descripción"
            required
            placeholder="Elija la descripción"
            onChange={this.handleDescripcionChange}
            value={this.state.tempElement.descripcion}
            suggestions={this.props.datosDescripcion.map(el => {
              const element = {};
              element.value = el.idDescripcion;
              element.label = el.descripcion;
              return element;
            })}
          />
          {this.state.errors.descripcion && (
            <FormHelperText>Campo requerido!</FormHelperText>
          )}
        </Grid>
        <Grid container>
          <Grid item xs={8} style={{ padding: 10 }}>
            <AutoComplete
              value={this.state.tempElement.presentacion}
              name="Presentación"
              required
              placeholder="Elija la presentación"
              onChange={this.handlePresentacionChange}
              suggestions={this.props.datosPresentacion.map(el => {
                const element = {};
                element.value = el.idPresentacion;
                element.label = el.presentacion;
                return element;
              })}
            />
            {this.state.errors.presentacion && (
              <FormHelperText style={{ fontColor: "" }}>
                Campo requerido!
              </FormHelperText>
            )}
          </Grid>
          <Grid item xs={4} style={{ padding: 10 }}>
            <TextField
              margin="dense"
              id="name"
              label="Unidades"
              autoComplete="false"
              required
              type="numeric"
              value={this.state.tempElement.unidades}
              onChange={this.handleUnidades}
              autoComplete="off"
              InputProps={{ inputComponent: IntegerFormat }}
              fullWidth
            />
          </Grid>
        </Grid>

        <Grid item xs={12} style={{ padding: 10 }}>
          <TextField
            margin="dense"
            id="name"
            label="Precio"
            required
            autoComplete="false"
            value={this.state.tempElement.precioActual}
            onChange={this.handlePrecio}
            fullWidth
            InputProps={{ inputComponent: MoneyFormat }}
            autoComplete="off"
          />
        </Grid>
      </React.Fragment>
    );
  };

  render() {
    return (
      <React.Fragment>
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
          columns={8}
          onInsert={this.onInsert}
          onUpdate={this.onUpdate}
          hasData={this.props.hasData}
          messageHandler={this.props.messageHandler}
          checkForm={this.checkForm}
        />
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={this.state.snack.open}
          onClose={this.handleCloseSnack}
          ContentProps={{ "aria-describedby": "message-id" }}
          message={<span id="message-id">{this.state.snack.message}</span>}
        />
      </React.Fragment>
    );
  }
}

export default InventoryTable;
