import React, { Component } from "react";
import AdminDashboard from "../adminDashboard";
import InventoryTable from "./inventoryTable";
import ProductBrandTable from "./productBrandTable";
import ProductDescriptionTable from "./productDescriptionTable";
import ProductMeasurmentTable from "./productMeasurementTable";
import ProductNamesTable from "./productNamesTable";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";

import Filters from "../../common/filters";
import FilterNumberRange from "../../common/filterOptions/filterNumberRange";
import FilterSearch from "../../common/filterOptions/filterSearch";
import FilterSelect from "../../common/filterOptions/filterSelect";
import Grid from "@material-ui/core/Grid";

function TabContainer(props) {
  return (
    <Typography
      component="div"
      style={{ padding: 8 * 3, backgroundColor: "#f6f6f6" }}
    >
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  }
});

class InventoryMngr extends Component {
  state = {
    value: "inv",
    datosInventario: [],
    datosPresentacion: [],
    datosMarca: [],
    datosDescripcion: [],
    datosNombre: [],
    invHasChanges: false,
    presHasChanges: false,
    marcaHasChanges: false,
    descHasChanges: false,
    nombHasChanges: false,
    hasInventarioData: false,
    hasNombreData: false,
    hasMarcaData: false,
    hasDescripcionData: false,
    hasPresentacionData: false
  };

  constructor(props) {
    super(props);
    this.marca = React.createRef();
    this.nombre = React.createRef();
    this.descripcion = React.createRef();
    this.presentacion = React.createRef();
    this.inventarioCodigo = React.createRef();
    this.inventarioPrecio = React.createRef();
    this.inventarioStock = React.createRef();

    const refsMarca = [];
    refsMarca.push(this.marca);
    this.state.refsMarca = refsMarca;

    const refsNombre = [];
    refsNombre.push(this.nombre);
    this.state.refsNombre = refsNombre;

    const refsDescripcion = [];
    refsDescripcion.push(this.descripcion);
    this.state.refsDescripcion = refsDescripcion;

    const refsPresentacion = [];
    refsPresentacion.push(this.presentacion);
    this.state.refsPresentacion = refsPresentacion;

    const refsInventario = [];
    refsInventario.push(this.inventarioCodigo);
    refsInventario.push(this.inventarioPrecio);
    refsInventario.push(this.inventarioStock);
    this.state.refsInventario = refsInventario;

    this.handleFilterNamesBefore = this.handleFilterNamesBefore.bind(this);
  }

  componentDidMount() {
    this.bringAllData();
  }

  /**
   * Funciones para traer datos
   */
  async bringAllData(filters = []) {
    this.setState({ datosInventario: [], hasInventarioData: false });
    this.setState({ datosNombre: [], hasNombreData: false });
    this.setState({ datosDescripcion: [], hasDescripcionData: false });
    this.setState({ datosPresentacion: [], hasPresentacionData: false });
    this.setState({ datosMarca: [], hasMarcaData: false });
    await this.bringHelpersParallel().then(() => {
      Promise.resolve(this.bringInventory(filters)).then(() => {
        this.setState({ invHasChanges: false, hasInventarioData: true });
        this.setState({ nombHasChanges: false, hasNombreData: true });
        this.setState({ marcaHasChanges: false, hasMarcaData: true });
        this.setState({ descHasChanges: false, hasDescripcionData: true });
        this.setState({ presHasChanges: false, hasPresentacionData: true });
      });
    });
  }

  /**
   * Solo obtener los datos requeridos
   * @param {String} value id de la pestaña en la que estamos
   */

  async bringRequiredData(value) {
    if (value === "inv" && this.state.invHasChanges) {
      Promise.resolve(this.bringAllData()).then(() => {});
    } else if (value === "brand" && this.state.marcaHasChanges) {
      this.setState({ datosMarca: [], hasMarcaData: false });
      Promise.resolve(this.bringHelpers("datosMarca", "MARCA")).then(() =>
        this.setState({ marcaHasChanges: false, hasMarcaData: true })
      );
    } else if (value === "product" && this.state.nombHasChanges) {
      this.setState({ datosNombre: [], hasNombreData: false });
      Promise.resolve(this.bringHelpers("datosNombre", "NOMBRE")).then(() =>
        this.setState({ nombHasChanges: false, hasNombreData: true })
      );
    } else if (value === "description" && this.state.descHasChanges) {
      this.setState({ datosDescripcion: [], hasDescripcionData: false });
      Promise.resolve(
        this.bringHelpers("datosDescripcion", "DESCRIPCION")
      ).then(() =>
        this.setState({ descHasChanges: false, hasDescripcionData: true })
      );
    } else if (value === "measurment" && this.state.presHasChanges) {
      this.setState({ datosPresentacion: [], hasPresentacionData: false });
      Promise.resolve(
        this.bringHelpers("datosPresentacion", "PRESENTACION")
      ).then(() =>
        this.setState({ presHasChanges: false, hasPresentacionData: true })
      );
    }
  }

  /**
   * Va a traer los datos de marca, nombre, etc en paralelo
   * para que cuando estos se terminen se pueda llamar el inventario
   */
  bringHelpersParallel = () => {
    return Promise.all([
      this.bringHelpers("datosNombre", "NOMBRE"),
      this.bringHelpers("datosDescripcion", "DESCRIPCION"),
      this.bringHelpers("datosPresentacion", "PRESENTACION"),
      this.bringHelpers("datosMarca", "MARCA")
    ]);
  };

  /**
   * Va a traer los datos de ayuda para el inventario (las tablas de marca, nombre, presentacio y descripcion)
   * @param {*} stateName nombre del estado a cambiar
   * @param {*} type tipo de helper a traer (MARCA/DESCRIPCION/NOMBRE/PRESENTACION)
   */
  bringHelpers(stateName, type, filters = []) {
    const request = { filters: filters, type: type };
    //Realizar peticion get

    //return fetch("/api/getInventoryHelper?type=" + type)

    return fetch("/api/getInventoryHelper", {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          this.setState({ [stateName]: data });
        } else {
          this.setState({ [stateName]: [] });
        }
        this.setState({ hasData: true });
      });
  }

  /**
   * Encargado de ir a traer el inventario completo a la db
   */
  bringInventory(filters = []) {
    //Realizar peticion get

    const request = { filters: filters };
    return fetch("/api/getInventory", {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          this.updateData(data);
        } else {
          this.setState({ datosInventario: [] });
        }
        this.setState({ hasData: true });
      });
  }

  /**
   * Funciones para insertar los datos
   * @param {*} name nombre del dato que se va a insertar
   * @param {*} type tipo de helper a traer (MARCA/DESCRIPCION/NOMBRE/PRESENTACION)
   */
  addHelper = (name, type, callback, changes, tabID) => {
    const requestData = {
      type: type,
      name: name
    };
    fetch("/api/addInventoryHelper", {
      method: "POST",
      body: JSON.stringify(requestData),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        var err = data["@err"];
        if (err === 0) this.setState({ invHasChanges: true });
        if (err === 0)
          this.setState({ [changes]: true }, () =>
            this.bringRequiredData(tabID)
          );
        callback(parseInt(err));
      });
  };

  addInventory = (inv, callback) => {
    const requestData = {
      codigo: inv.codigo,
      idMarca: inv.idMarca,
      idNombre: inv.idNombre,
      idDescripcion: inv.idDescripcion,
      idPresentacion: inv.idPresentacion,
      unidades: inv.unidades,
      precioActual: inv.precioActual
    };
    fetch("/api/addInventory", {
      method: "POST",
      body: JSON.stringify(requestData),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        var err = data["@err"];
        if (err === 0)
          this.setState({ invHasChanges: true }, () =>
            this.bringRequiredData("inv")
          );
        callback(parseInt(err));
      });
  };

  editHelper = (type, id, name, callback, changes, tabID) => {
    const requestData = {
      type: type,
      id: id,
      name: name
    };
    fetch("/api/editInventoryHelper", {
      method: "POST",
      body: JSON.stringify(requestData),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        var err = data["@err"];
        if (err === 0) this.setState({ invHasChanges: true });
        if (err === 0)
          this.setState({ [changes]: true }, () =>
            this.bringRequiredData(tabID)
          );

        callback(parseInt(err));
      });
  };

  editInventory = (inv, callback) => {
    const requestData = {
      codigo: inv.codigo,
      id: inv.iddb,
      codigo: inv.codigo,
      idMarca: inv.idMarca,
      idNombre: inv.idNombre,
      idDescripcion: inv.idDescripcion,
      idPresentacion: inv.idPresentacion,
      unidades: inv.unidades,
      precioActual: inv.precioActual
    };
    fetch("/api/editInventory", {
      method: "POST",
      body: JSON.stringify(requestData),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        var err = data["@err"];
        if (err === 0)
          this.setState({ invHasChanges: true }, () =>
            this.bringRequiredData("inv")
          );
        callback(parseInt(err));
      });
  };

  /**
   * Maneja los mensajes que se le mostraran al usuario dependiendo del codigo que
   * haya retornado
   */
  messageHandler(code, action) {
    if (code === 0) {
      return "Agregado exitosamente";
    }
    if (code === 1) {
      return "Error desconocido";
    }
    if (code === -1) {
      return "No autorizado";
    }
    if (code === 100) {
      return "No se pudo ingresar, valores repetidos";
    }
    if (code === 101) {
      return "No se pudo ingresar, código de barras repetido";
    }
  }

  /**
   * Filtra un elemento (que sea igual) y retorna la primera columna
   * que obtuvo el filtrado
   *
   * @param {Array} data Array de datos que se utilizara
   * @param {String} idName Nombre de la columna en la que se va a comparar
   * @param {*} id Dato que se va a comparar para filtrar
   * @param {string} column Columna que se va a retornar
   */
  getElementData(data, idName, id, column) {
    const result = data.filter(el => el[idName] == id);
    if (result.length > 0) return result[0][column];
  }

  /**
   * Va a colocar el state de datosinventario, para eso
   * va a mapear los datos que le pase para poder pasarle
   * en conjunto por ejemplo la marca, con su nombre y su id
   * en lugar de tener solo el id
   * @param {Array} data los datos que voy a mapear
   */
  updateData = data => {
    this.setState({
      datosInventario: data.map(el => {
        var element = { ...el };
        element.marca = {
          value: el.idMarca,
          label: this.getElementData(
            this.state.datosMarca,
            "idMarca",
            el.idMarca,
            "marca"
          )
        };

        element.nombre = {
          value: el.idNombre,
          label: this.getElementData(
            this.state.datosNombre,
            "idNombre",
            el.idNombre,
            "nombre"
          )
        };

        element.descripcion = {
          value: el.idDescripcion,
          label: this.getElementData(
            this.state.datosDescripcion,
            "idDescripcion",
            el.idDescripcion,
            "descripcion"
          )
        };

        element.presentacion = {
          value: el.idPresentacion,
          label: this.getElementData(
            this.state.datosPresentacion,
            "idPresentacion",
            el.idPresentacion,
            "presentacion"
          )
        };

        element.iddb = element.id;
        delete element.id;
        delete element.idDescripcion;
        delete element.idNombre;
        delete element.idMarca;
        delete element.idPresentacion;

        return element;
      })
    });
  };

  handleChange = (event, value) => {
    this.bringRequiredData(value);
    this.setState({ value });
  };

  async handleFilterNamesBefore(hasDataName, changesName, dataName) {
    this.setState({ [hasDataName]: false, [changesName]: true });
    this.setState({ [dataName]: [] });
  }

  /**
   * Va a traer los datos de las resoluciones pero esta vez los va a traer con los filtros
   * que le pasemos
   * @param {Array} filters Array de filtros que les sera pasado por el componente Filters
   */
  handleFilterNamesAfter = (
    stateName,
    type,
    hasDataName,
    changesName,
    filters
  ) => {
    return Promise.resolve(
      Promise.resolve(this.bringHelpers(stateName, type, filters)).then(() =>
        this.setState({ [changesName]: false, [hasDataName]: true })
      )
    );
  };

  async handleFilterInventoryBefore() {
    this.setState({ hasInventarioData: false, invHasChanges: true });
    this.setState({ datosInventario: [] });
  }

  /**
   * Va a traer los datos de las resoluciones pero esta vez los va a traer con los filtros
   * que le pasemos
   * @param {Array} filters Array de filtros que les sera pasado por el componente Filters
   */
  handleFilterInventoryAfter = filters => {
    return Promise.resolve(this.bringAllData(filters));
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;
    return (
      <AdminDashboard>
        <div className={classes.root}>
          <AppBar position="static">
            <Tabs value={value} onChange={this.handleChange}>
              <Tab value="inv" label="Inventario" />
              <Tab value="brand" label="Marcas" />
              <Tab value="product" label="Productos" />
              <Tab value="description" label="Descripciones" />
              <Tab value="measurment" label="Presentaciones" />
            </Tabs>
          </AppBar>
          {value === "inv" && (
            <TabContainer>
              <Grid container>
                <Filters
                  refs={this.state.refsInventario}
                  afterFilters={filters => {
                    return this.handleFilterInventoryAfter(filters);
                  }}
                  beforeFilters={() => {
                    this.handleFilterInventoryBefore();
                  }}
                >
                  <FilterSearch
                    id={"codigo"}
                    name={"Código"}
                    label={"Código"}
                    ref={this.inventarioCodigo}
                  />
                  <FilterNumberRange
                    id={"stock"}
                    name={"Stock"}
                    label={"Cantidad"}
                    ref={this.inventarioStock}
                  />
                  <FilterNumberRange
                    id={"precioActual"}
                    name={"Precio"}
                    label={"Precio"}
                    ref={this.inventarioPrecio}
                  />
                </Filters>
              </Grid>
              <InventoryTable
                data={this.state.datosInventario}
                datosMarca={this.state.datosMarca}
                datosNombre={this.state.datosNombre}
                datosDescripcion={this.state.datosDescripcion}
                datosPresentacion={this.state.datosPresentacion}
                onInsert={this.addInventory}
                onUpdate={this.editInventory}
                hasData={this.state.hasInventarioData}
                messageHandler={this.messageHandler}
              />
            </TabContainer>
          )}
          {value === "brand" && (
            <TabContainer>
              <Grid container>
                <Filters
                  refs={this.state.refsMarca}
                  afterFilters={filters => {
                    return this.handleFilterNamesAfter(
                      "datosMarca",
                      "MARCA",
                      "hasMarcaData",
                      "marcaHasChanges",
                      filters
                    );
                  }}
                  beforeFilters={() => {
                    this.handleFilterNamesBefore(
                      "hasMarcaData",
                      "marcaHasChanges",
                      "datosMarca"
                    );
                  }}
                >
                  <FilterSearch
                    id={"marca"}
                    name={"Marca"}
                    label={"Marca"}
                    ref={this.marca}
                  />
                </Filters>
              </Grid>

              <ProductBrandTable
                data={this.state.datosMarca}
                onInsert={this.addHelper}
                onUpdate={this.editHelper}
                hasData={this.state.hasMarcaData}
                messageHandler={this.messageHandler}
              />
            </TabContainer>
          )}
          {value === "product" && (
            <TabContainer>
              <Grid container>
                <Filters
                  refs={this.state.refsNombre}
                  afterFilters={filters => {
                    return this.handleFilterNamesAfter(
                      "datosNombre",
                      "NOMBRE",
                      "hasNombreData",
                      "nombHasChanges",
                      filters
                    );
                  }}
                  beforeFilters={() => {
                    this.handleFilterNamesBefore(
                      "hasNombreData",
                      "nombHasChanges",
                      "datosNombre"
                    );
                  }}
                >
                  <FilterSearch
                    id={"nombre"}
                    name={"Nombre"}
                    label={"Nombre"}
                    ref={this.nombre}
                  />
                </Filters>
              </Grid>
              <ProductNamesTable
                data={this.state.datosNombre}
                onInsert={this.addHelper}
                onUpdate={this.editHelper}
                hasData={this.state.hasNombreData}
                messageHandler={this.messageHandler}
              />
            </TabContainer>
          )}
          {value === "description" && (
            <TabContainer>
              <Grid container>
                <Filters
                  refs={this.state.refsDescripcion}
                  afterFilters={filters => {
                    return this.handleFilterNamesAfter(
                      "datosDescripcion",
                      "DESCRIPCION",
                      "hasDescripcionData",
                      "descHasChanges",
                      filters
                    );
                  }}
                  beforeFilters={() => {
                    this.handleFilterNamesBefore(
                      "hasDescripcionData",
                      "descHasChanges",
                      "datosDescripcion"
                    );
                  }}
                >
                  <FilterSearch
                    id={"descripcion"}
                    name={"Descripción"}
                    label={"Descripción"}
                    ref={this.descripcion}
                  />
                </Filters>
              </Grid>
              <ProductDescriptionTable
                data={this.state.datosDescripcion}
                onInsert={this.addHelper}
                onUpdate={this.editHelper}
                hasData={this.state.hasInventarioData}
                messageHandler={this.messageHandler}
              />
            </TabContainer>
          )}
          {value === "measurment" && (
            <TabContainer>
              <Grid container>
                <Filters
                  refs={this.state.refsPresentacion}
                  afterFilters={filters => {
                    return this.handleFilterNamesAfter(
                      "datosPresentacion",
                      "PRESENTACION",
                      "hasPresentacionData",
                      "presHasChanges",
                      filters
                    );
                  }}
                  beforeFilters={() => {
                    this.handleFilterNamesBefore(
                      "hasPresentacionData",
                      "presHasChanges",
                      "datosPresentacion"
                    );
                  }}
                >
                  <FilterSearch
                    id={"presentacion"}
                    name={"Presentación"}
                    label={"Presentación"}
                    ref={this.presentacion}
                  />
                </Filters>
              </Grid>
              <ProductMeasurmentTable
                data={this.state.datosPresentacion}
                onInsert={this.addHelper}
                onUpdate={this.editHelper}
                hasData={this.state.hasPresentacionData}
                messageHandler={this.messageHandler}
              />
            </TabContainer>
          )}
        </div>
      </AdminDashboard>
    );
  }
}
InventoryMngr.propTypes = { classes: PropTypes.object.isRequired };

export default withStyles(styles)(InventoryMngr);
