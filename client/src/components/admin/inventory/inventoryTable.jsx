import React, { Component } from "react";
import TableCell from "@material-ui/core/TableCell";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import AutoComplete from "../../common/autocompleter";

import TableMngr from "../../common/mngr/tableMngr";

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
    return (
      <React.Fragment>
        <TableCell>{row.codigo}</TableCell>
        <TableCell>{row.marca.label}</TableCell>
        <TableCell>{row.nombre.label} </TableCell>
        <TableCell>{row.descripcion.label}</TableCell>
        <TableCell>{row.presentacion.label}</TableCell>
        <TableCell>{row.unidades}</TableCell>
        <TableCell>{row.stock}</TableCell>
        <TableCell>{"Q." + row.precioActual}</TableCell>
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

  /**
   * Rendizar formulario de agregar o editar
   */
  dialogForm = () => {
    return (
      <React.Fragment>
        <Grid container style={{ padding: 10 }}>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Codigo"
            autoComplete="false"
            value={this.state.tempElement.codigo}
            onChange={this.handleCodigo}
            fullWidth
          />
        </Grid>

        <Grid container>
          <Grid item xs={6} style={{ padding: 10 }}>
            <AutoComplete
              name="Marca"
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
          </Grid>
          <Grid item xs={6} style={{ padding: 10 }}>
            <AutoComplete
              name="Nombre"
              placeholder="Elija el nombre"
              value={this.state.tempElement.nombre}
              onChange={this.handleNombreChange}
              suggestions={this.props.datosNombre.map(el => {
                const element = {};
                element.value = el.idNombre;
                element.label = el.nombre;
                return element;
              })}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} style={{ padding: 10 }}>
          <AutoComplete
            name="Descripción"
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
        </Grid>
        <Grid container>
          <Grid item xs={8} style={{ padding: 10 }}>
            <AutoComplete
              value={this.state.tempElement.presentacion}
              name="Presentación"
              placeholder="Elija la presentación"
              onChange={this.handlePresentacionChange}
              suggestions={this.props.datosPresentacion.map(el => {
                const element = {};
                element.value = el.idPresentacion;
                element.label = el.presentacion;
                return element;
              })}
            />
          </Grid>
          <Grid item xs={4} style={{ padding: 10 }}>
            <TextField
              margin="dense"
              id="name"
              label="Unidades"
              autoComplete="false"
              value={this.state.tempElement.unidades}
              onChange={this.handleUnidades}
              fullWidth
            />
          </Grid>
        </Grid>

        <Grid item xs={12} style={{ padding: 10 }}>
          <TextField
            margin="dense"
            id="name"
            label="Precio"
            autoComplete="false"
            value={this.state.tempElement.precioActual}
            onChange={this.handlePrecio}
            fullWidth
          />
        </Grid>
      </React.Fragment>
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
        columns={8}
        onInsert={this.onInsert}
        onUpdate={this.onUpdate}
      />
    );
  }
}

export default InventoryTable;
