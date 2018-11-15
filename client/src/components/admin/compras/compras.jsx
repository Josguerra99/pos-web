import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import DynamicTable from "../../common/dynamicInsertTable/dynamicInsertTable";
import AdminDashboard from "../adminDashboard";
import TableCell from "@material-ui/core/TableCell";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Form from "@material-ui/core/FormGroup";
import { th } from "date-fns/esm/locale";

import Avatar from "@material-ui/core/Avatar";
import MoneyIcon from "@material-ui/icons/AttachMoneyRounded";
import ProductsIcon from "@material-ui/icons/ShoppingCartRounded";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import FinishIcon from "@material-ui/icons/SkipNext";

import Snackbar from "@material-ui/core/Snackbar";
import MoneyFormat from "../../common/inputFormats/money";
import IntegerFormat from "../../common/inputFormats/integer";

import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";

var bigDecimal = require("js-big-decimal");

const styles = theme => ({
  card: {
    // display: "flex"
    justify: "center",
    marginTop: 40,
    marginLeft: 200,
    marginRight: 200,
    height: 120
  },
  details: {
    display: "flex",
    flexDirection: "column"
  },
  content: {
    display: "flex",
    padding: 20,
    marginBottom: 10
  },
  cover: {
    width: 151
  },
  controls: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  moneyIcon: {
    fontSize: 25
  },
  productIcon: {
    fontSize: 20
  },
  moneyAvatar: {
    margin: 10,
    padding: 10,
    color: "#fff",
    backgroundColor: "#FF8F00"
  },

  productsAvatar: {
    margin: 10,
    padding: 10,
    color: "#fff",
    backgroundColor: "#00695f"
  },
  icon: {
    fontSize: 50
  },
  text: {
    //backgroundColor: "#FF8F00",
    paddingLeft: 10,
    paddingBottom: 30
  },
  button: {
    justify: "center",
    paddingTop: 15
  }
});

class Compras extends Component {
  state = {
    productos: [],
    hasData: false,
    tempData: {
      id: 0,
      codigo: "",
      producto: "",
      cantidad: 1,
      precioUnitario: 0,
      precio: 0
    },
    elementStructure: {
      id: 0,
      codigo: "",
      producto: "",
      cantidad: 1,
      precioUnitario: 0,
      precio: 0
    },
    data: [],
    cliente: { nit: "", nombre: "", direccion: "" },
    clienteExiste: false,
    cantidad: 0,
    total: 0,
    sendingData: false,
    open: false,
    message: "",
    montoTotal: ""
  };

  constructor(props) {
    super(props);
    this.firstInput = React.createRef();
    this.nitInput = React.createRef();
    this.end = React.createRef();

    this.scrollToBottom = this.scrollToBottom.bind(this);
  }

  componentDidMount() {
    this.bringProductos();
    this.bringCompraParcial();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  componentWillUnmount() {}
  scrollToBottom = () => {
    if (this.end == undefined || this.end.scrollIntoView == undefined) return;
    this.end.scrollIntoView({ behavior: "instant" });
  };

  clear() {
    this.setState({ tempData: { ...this.state.elementStructure } });
    this.setState({ data: [] });
    this.setState({ cliente: { nit: "", nombre: "", direccion: "" } });
    this.setState({ montoTotal: 0 });
    this.setState({ cantidad: 0 });
    this.setState({ total: 0 });
    this.setState({ clienteExiste: false });
    this.nitInput.current.focus();
  }

  checkCompra = () => {
    if (this.state.montoTotal == undefined || this.state.montoTotal === "") {
      this.handleSnackOpen("Agrega un monto");
      return false;
    }

    if (this.state.data == undefined || this.state.data.length <= 0) {
      this.handleSnackOpen("No hay productos ingresados");
      return false;
    }

    return true;
  };

  checkBeforeAdd = () => {
    if (!this.state.tempData.codigo || this.state.tempData.codigo === "") {
      this.handleSnackOpen("Ingresa un código de producto");
      return false;
    }

    if (!this.state.tempData.producto || this.state.tempData.producto === "") {
      this.handleSnackOpen("Código de producto ingresado no es válido");
      return false;
    }

    if (
      this.state.tempData.cantidad == undefined ||
      this.state.tempData.cantidad === ""
    ) {
      this.handleSnackOpen("Ingresa una cantidad");
      return false;
    }

    if (
      this.state.tempData.precioUnitario == undefined ||
      this.state.tempData.precioUnitario === ""
    ) {
      this.handleSnackOpen("Ingresa un precio");
      return false;
    }

    if (
      this.state.tempData.cantidad == undefined ||
      this.state.tempData.cantidad <= 0
    ) {
      this.handleSnackOpen("Cantidad tiene que ser mayor a 0");
      return false;
    }

    if (
      this.state.tempData.precioUnitario == undefined ||
      this.state.tempData.precioUnitario < 0
    ) {
      this.handleSnackOpen("Precio no puede ser negativo");
      return false;
    }

    return true;
  };

  /**
   * Traer los productos para hacer el ingreso mas rapido
   */

  bringProductos() {
    //Realizar peticion get
    return fetch("/api/getInventoryFact")
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          this.setState({ productos: data });
        } else {
          this.setState({ productos: null });
        }
        this.setState({ hasData: true });
      });
  }

  bringCompraParcial = () => {
    //Realizar peticion get
    return fetch("/api/getCompraParcial")
      .then(res => res.json())
      .then(data => {
        //alert(JSON.stringify(data));
        this.setCompraParcialValues(data);
      });
  };

  setCompraParcialValues = data => {
    if (data.length <= 0) {
      return;
    }

    this.setState({ montoTotal: data.compra.monto });

    var dataCompra = [];
    var total = 0;
    var cantidad = 0;
    data.detalle.forEach((el, id) => {
      var d = {};
      d.id = id;
      d.codigo = this.getProducto(el.idProducto, "id").codigo;
      d.cantidad = el.cantidad;
      d.precioUnitario = el.precioUnitarioCompra;
      const producto = this.getProducto(d.codigo);
      d.producto = producto.producto;
      var n1 = new bigDecimal(d.precioUnitario);
      var n2 = new bigDecimal(d.cantidad);
      d.precio = parseFloat(n1.multiply(n2).getValue());
      total += d.precio;
      cantidad += d.cantidad;
      dataCompra.push(d);
    });
    this.setState({ total, cantidad });
    this.setState({ data: dataCompra });
  };

  getProducto(codigo, columnName = "codigo") {
    const { productos } = this.state;
    let producto = productos.filter(el => {
      return el[columnName] === codigo;
    });

    if (producto != null && producto.length > 0) producto = producto[0];
    else producto = null;
    return producto;
  }

  addCompra = (factura, callback) => {
    this.setState({ sendingData: true });
    const requestData = {
      total: factura.total,
      detalle: factura.detalle,
      parcial: factura.parcial
    };
    fetch("/api/addCompra", {
      method: "POST",
      body: JSON.stringify(requestData),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        //alert(data);
        var err = parseInt(data["@err"]);
        this.setState({ sendingData: false });
        if (err === 0) {
          if (!factura.parcial) this.clear();
          this.handleSnackOpen(
            factura.parcial
              ? "Compra guardada"
              : "Compra realizada exitosamente"
          );
        } else {
          this.handleSnackOpen(
            factura.parcial
              ? "Error al guardar la compra"
              : "Error al intentar realizar la compra"
          );
        }
        //   callback(parseInt(err));
      });
  };

  handleSnackOpen = message => {
    this.setState({ message });
    this.setState({ open: true });
  };

  crearCompra(parcial = false) {
    if (!this.checkCompra()) {
      return;
    }

    var factura = {};
    factura.total = this.state.montoTotal;
    factura.detalle = [];
    factura.parcial = parcial;
    this.state.data.forEach(el => {
      factura.detalle.push({
        codigo: this.getProducto(el.codigo).id,
        cantidad: el.cantidad,
        precio: el.precioUnitario
      });
    });
    this.addCompra(factura);

    //alert(JSON.stringify(factura));
  }

  updateTotals() {
    var total = 0;
    var cantidad = 0;
    this.state.data.forEach(el => {
      total += el.precio;
      var tempCantidad = parseInt(el.cantidad);
      if (tempCantidad != null && tempCantidad > 0) cantidad += tempCantidad;
    });
    this.setState({ cantidad });
    this.setState({ total });
  }
  /**
   * Eventos
   * 453253454
   */

  handleClose = () => {
    this.setState({ open: false });
  };

  handleMontoChange = e => {
    this.setState({ montoTotal: e.target.value });
  };

  getButtonColor(disabled) {
    return disabled ? "#78909c" : "#0277bd";
  }

  /**
   * Actualiza el estado de los datos temprales
   * @param {Event} e Input para obtener el valor
   * @param {String} name nombre del campo que se quiere cambiar
   */
  handleDataChange = (e, name) => {
    let tempData = { ...this.state.tempData };
    tempData[name] = e.target.value;
    this.setState({ tempData });
  };

  /**
   * Actualiza el estado de los datos temporales
   * @param {Event} e Input para obtener el valor
   * @param {String} name nombre del campo que se quiere cambiar
   */
  handleDataBlur = (e, name) => {
    let tempData = { ...this.state.tempData };
    //tempData[name] = e.target.value;
    const producto = this.getProducto(tempData.codigo);
    if (producto != null) {
      tempData.producto = producto.producto;
      var n1 = new bigDecimal(tempData.precioUnitario);
      var n2 = new bigDecimal(tempData.cantidad);
      tempData.precio = parseFloat(n1.multiply(n2).getValue());
    }

    this.setState({ tempData });
  };

  syncData = data => {
    this.setState({ data }, () => {
      this.updateTotals();
      this.scrollToBottom();
    });
  };

  syncTempData = tempData => {
    this.setState({ tempData });
  };

  /**
   * Renderiza la cabecera de la tabla
   */

  renderTableHeader = () => {
    return (
      <React.Fragment>
        <TableCell>Codigo</TableCell>
        <TableCell>Nombre</TableCell>
        <TableCell>Cantidad</TableCell>
        <TableCell>Precio Unitario</TableCell>
        <TableCell>Precio</TableCell>
      </React.Fragment>
    );
  };
  /**
   * Renderiza el cuerpo de la tabla
   */

  renderTableBody = row => {
    return (
      <React.Fragment>
        <TableCell>{row.codigo}</TableCell>
        <TableCell>{row.producto}</TableCell>
        <TableCell>{row.cantidad}</TableCell>
        <TableCell>{"Q" + row.precioUnitario}</TableCell>
        <TableCell>{"Q" + row.precio}</TableCell>
      </React.Fragment>
    );
  };

  renderInsertRow = classes => {
    const { tempData, sendingData, total, montoTotal } = this.state;

    return (
      <React.Fragment>
        <TableCell className={classes.insertCell}>
          <TextField
            autoFocus={this.state.montoTotal !== ""}
            id="codigo"
            label="Codigo"
            inputRef={this.firstInput}
            className={classes.textField}
            value={tempData.codigo}
            onChange={e => this.handleDataChange(e, "codigo")}
            onBlur={e => this.handleDataBlur(e, "codigo")}
            inputProps={{ maxLength: 30 }}
          />
        </TableCell>
        <TableCell className={classes.insertCell}>
          {tempData.producto}
        </TableCell>
        <TableCell className={classes.insertCell}>
          <TextField
            id="cantidad"
            label="Cantidad"
            className={classes.textField}
            value={tempData.cantidad}
            onChange={e => this.handleDataChange(e, "cantidad")}
            onBlur={e => this.handleDataBlur(e, "cantidad")}
            InputProps={{ inputComponent: IntegerFormat }}
          />
        </TableCell>

        <TableCell className={classes.insertCell}>
          <TextField
            id="precio"
            label="Precio"
            inputRef={this.firstInput}
            className={classes.textField}
            value={tempData.precioUnitario}
            onChange={e => this.handleDataChange(e, "precioUnitario")}
            onBlur={e => this.handleDataBlur(e, "precioUnitario")}
            InputProps={{ inputComponent: MoneyFormat }}
          />
        </TableCell>
        <TableCell className={classes.insertCell}>
          {"Q" + tempData.precio}
        </TableCell>
      </React.Fragment>
    );
  };

  render() {
    const { classes, theme } = this.props;

    const { sendingData, total, montoTotal } = this.state;

    const notFinished = sendingData || total != parseInt(montoTotal);
    return (
      <AdminDashboard>
        <Grid container>
          <Grid item xs={4}>
            <Card>
              <CardContent>
                <Form>
                  <TextField
                    autoFocus
                    inputRef={this.nitInput}
                    id="monto"
                    label="Monto"
                    value={this.state.montoTotal}
                    onChange={e => {
                      this.handleMontoChange(e);
                    }}
                    style={{ margin: "10px" }}
                    disabled={this.state.clienteExiste}
                    InputProps={{ inputComponent: MoneyFormat }}
                  />
                </Form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <DynamicTable
          tableHeader={this.renderTableHeader}
          tableBody={this.renderTableBody}
          insertRow={this.renderInsertRow}
          tempData={this.state.tempData}
          elementStructure={this.state.elementStructure}
          firstInput={this.firstInput}
          data={this.state.data}
          syncData={this.syncData}
          syncTempData={this.syncTempData}
          checkBeforeAdd={this.checkBeforeAdd}
        />
        <BottomNavigation style={{ width: "100%", marginTop: 30 }} showLabels>
          <BottomNavigationAction
            disabled
            label={
              "Q." +
              this.state.total.toFixed(2) +
              "/ Q." +
              new bigDecimal(this.state.montoTotal).round(2).getPrettyValue()
            }
            icon={<MoneyIcon />}
          />
          <BottomNavigationAction
            disabled
            label={this.state.cantidad}
            icon={<ProductsIcon />}
          />
          <BottomNavigationAction
            label="Guardar"
            style={{ color: this.getButtonColor(false) }}
            icon={<SaveIcon />}
            onClick={() => {
              this.crearCompra(true);
            }}
          />
          <BottomNavigationAction
            label="Terminar"
            icon={<FinishIcon />}
            onClick={() => this.crearCompra(false)}
            disabled={notFinished}
            style={{ color: this.getButtonColor(notFinished) }}
          />
        </BottomNavigation>

        <div
          style={{ float: "left", clear: "both" }}
          ref={el => {
            this.end = el;
          }}
        />
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={this.state.open}
          onClose={this.handleClose}
          message={<span id="message-id">{this.state.message}</span>}
        />
      </AdminDashboard>
    );
  }
}

Compras.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Compras);
