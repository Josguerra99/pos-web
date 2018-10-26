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
    datosNombre: []
  };

  componentDidMount() {
    this.bringAllData();
  }

  /**
   * Funciones para traer datos
   */
  async bringAllData() {
    this.setState({ datosInventario: [] });
    this.setState({ datosNombre: [] });
    this.setState({ datosDescripcion: [] });
    this.setState({ datosPresentacion: [] });
    this.setState({ datosMarca: [] });
    await this.bringHelpersParallel().then(() => {
      Promise.resolve(this.bringInventory());
    });
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
  bringHelpers(stateName, type) {
    //Realizar peticion get
    return fetch("/api/getInventoryHelper?type=" + type)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          this.setState({ [stateName]: data });
        } else {
          this.setState({ [stateName]: null });
        }
        this.setState({ hasData: true });
      });
  }

  /**
   * Encargado de ir a traer el inventario completo a la db
   */
  bringInventory() {
    //Realizar peticion get
    return fetch("/api/getInventory")
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          this.updateData(data);
        } else {
          this.setState({ datosInventario: null });
        }
        this.setState({ hasData: true });
      });
  }

  /**
   * Funciones para insertar los datos
   * @param {*} name nombre del dato que se va a insertar
   * @param {*} type tipo de helper a traer (MARCA/DESCRIPCION/NOMBRE/PRESENTACION)
   */
  addHelper = (name, type, callback) => {
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
        callback(parseInt(err));
      });
  };

  editHelper = (type, id, name, callback) => {
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
        callback(parseInt(err));
      });
  };

  editInventory = (inv, callback) => {
    const requestData = {
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
        callback(parseInt(err));
      });
  };

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
        delete element.idDescripcion;
        delete element.idNombre;
        delete element.idMarca;
        delete element.idPresentacion;

        return element;
      })
    });
  };

  handleChange = (event, value) => {
    this.bringAllData();
    this.setState({ value });
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
              <InventoryTable
                data={this.state.datosInventario}
                datosMarca={this.state.datosMarca}
                datosNombre={this.state.datosNombre}
                datosDescripcion={this.state.datosDescripcion}
                datosPresentacion={this.state.datosPresentacion}
                onInsert={this.addInventory}
                onUpdate={this.editInventory}
              />
            </TabContainer>
          )}
          {value === "brand" && (
            <TabContainer>
              <ProductBrandTable
                data={this.state.datosMarca}
                onInsert={this.addHelper}
                onUpdate={this.editHelper}
              />
            </TabContainer>
          )}
          {value === "product" && (
            <TabContainer>
              <ProductNamesTable
                data={this.state.datosNombre}
                onInsert={this.addHelper}
                onUpdate={this.editHelper}
              />
            </TabContainer>
          )}
          {value === "description" && (
            <TabContainer>
              <ProductDescriptionTable
                data={this.state.datosDescripcion}
                onInsert={this.addHelper}
                onUpdate={this.editHelper}
              />
            </TabContainer>
          )}
          {value === "measurment" && (
            <TabContainer>
              <ProductMeasurmentTable
                data={this.state.datosPresentacion}
                onInsert={this.addHelper}
                onUpdate={this.editHelper}
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
