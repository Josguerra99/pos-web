import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import DynamicTable from "../../common/dynamicInsertTable/dynamicInsertTable";
import DefaultDashboard from "../defaultDashboard";
import TableCell from "@material-ui/core/TableCell";
import TextField from "@material-ui/core/TextField";
import filterItem from "../../common/filterOptions/filterItem";
import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Form from "@material-ui/core/FormGroup";
//import { th } from "date-fns/esm/locale";

import Avatar from "@material-ui/core/Avatar";
import MoneyIcon from "@material-ui/icons/AttachMoneyRounded";
import ProductsIcon from "@material-ui/icons/ShoppingCartRounded";
import Button from "@material-ui/core/Button";
import NavigationIcon from "@material-ui/icons/Save";

import Snackbar from "@material-ui/core/Snackbar";

import ReportMngr from "../../common/reporter/reportMngr";

import MoneyFormat from "../../common/inputFormats/money";
import IntegerFormat from "../../common/inputFormats/integer";

import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";

import Warning from "../../common/warningMessage";

import SaveIcon from "@material-ui/icons/Save";
import FinishIcon from "@material-ui/icons/SkipNext";
import io from "socket.io-client";

var bigDecimal = require("js-big-decimal");

const reportmngr = new ReportMngr();

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
    //flex: "1 0 auto"
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
    fontSize: 40
  },
  productIcon: {
    fontSize: 35
  },
  moneyAvatar: {
    margin: 10,
    padding: 30,
    color: "#fff",
    backgroundColor: "#FF8F00"
  },

  productsAvatar: {
    margin: 10,
    padding: 30,
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

class Facturacion extends Component {
  state = {
    editing: false,
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
    printURL: null,
    resolucion: {
      hasIt: false,
      res: null
    },
    socket: null
  };

  constructor(props) {
    super(props);
    this.firstInput = React.createRef();
    this.nitInput = React.createRef();
    this.end = React.createRef();
    this.scrollToBottom = this.scrollToBottom.bind(this);
  }

  initSocket = responseFunction => {
    const socket = io();

    socket.on("connect", () => {
      console.log("Connected");
    });

    socket.on("RECEIVE_FACTURA", function(data) {
      responseFunction();
    });

    this.setState({ socket });
  };

  socketAddFactura = () => {
    this.state.socket.emit("ADD_FACTURA", {
      data: "factura ingresada para resolucion"
    });
  };

  updateAfterFact = () => {
    this.bringResolucion();
    this.bringProductos(true);
  };

  bringResolucion = () => {
    //Realizar peticion get
    fetch("/api/resolucion_activa?doc=FAC")
      .then(res => res.json())
      .then(data => {
        var res = null;

        if (data.length > 0) {
          res = data[0];
          if (res["@err"] != undefined && res["@err"] === -1) {
            res = null;
          }
        }
        this.setState({ resolucion: { hasIt: true, res: res } });
      });
  };
  componentDidMount() {
    this.initSocket(this.updateAfterFact);
    this.bringProductos();
    this.bringResolucion();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }
  componentWillMount() {}

  scrollToBottom = () => {
    if (this.end == undefined || this.end.scrollIntoView == undefined) return;
    this.end.scrollIntoView({ behavior: "instant" });
  };

  clear() {
    this.setState({ tempData: { ...this.state.elementStructure } });
    this.setState({ data: [] });
    this.setState({ cliente: { nit: "", nombre: "", direccion: "" } });
    this.setState({ cantidad: 0 });
    this.setState({ total: 0 });
    this.setState({ clienteExiste: false });
    this.nitInput.current.focus();
  }
  /**
   * Traer los productos para hacer el ingreso mas rapido
   */

  bringProductos(recheck = false) {
    //Realizar peticion get
    return fetch("/api/getInventoryFact")
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          this.setState({ productos: data });
          if (recheck) this.recheckAllProducts();
        } else {
          this.setState({ productos: null });
        }
        this.setState({ hasData: true });
      });
  }

  bringCliente(nit) {
    return fetch("/api/getCliente?nit=" + nit)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          this.setState({
            cliente: {
              nit: this.state.cliente.nit,
              nombre: data[0].nombre,
              direccion: data[0].direccion
            }
          });
          this.setState({ clienteExiste: true });
          this.firstInput.current.focus();
        } else {
          this.setState({
            cliente: { nit: this.state.cliente.nit, nombre: "", direccion: "" }
          });
          this.setState({ clienteExiste: false });
        }
        this.setState({ hasData: true });
      });
  }

  getProducto(codigo) {
    const { productos } = this.state;
    let producto = productos.filter(el => {
      return el.codigo === codigo;
    });

    if (producto != null && producto.length > 0) producto = producto[0];
    else producto = null;
    return producto;
  }

  addFactura = (factura, callback) => {
    if (this.state.sendingData) {
      return;
    }
    this.setState({ sendingData: true });
    const requestData = {
      total: factura.total,
      cliente: factura.cliente,
      detalle: factura.detalle,
      num: this.props.num
    };
    fetch("/api/addFactura", {
      method: "POST",
      body: JSON.stringify(requestData),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        //alert(data);
        this.socketAddFactura();
        var err = parseInt(data["@err"]);
        this.setState({ sendingData: false });
        if (err === 0) {
          this.clear();
          this.setState({ message: "Venta realizada exitosamente" });
          this.setState({ open: true }, () => {
            reportmngr.reset();
            reportmngr.openReport("factura?ntransaccion=", data, fireURL => {
              window.open(fireURL).print();
            });
          });
        } else {
          this.setState({ message: "Error al intentar realizar la venta" });
          this.setState({ open: true });
        }
        //   callback(parseInt(err));
      });
  };

  crearFactura() {
    if (!this.checkFactura()) {
      return;
    }

    var factura = {};
    factura.total = this.state.total;
    factura.cliente = { ...this.state.cliente };
    factura.detalle = [];
    this.state.data.forEach(el => {
      factura.detalle.push({
        codigo: this.getProducto(el.codigo).id,
        cantidad: el.cantidad
      });
    });
    this.addFactura(factura);
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

  handleClienteChange = (e, name) => {
    if (name !== "nit" && this.state.clienteExiste) return;

    var cliente = this.state.cliente;
    cliente[name] = e.target.value;
    this.setState({ cliente });
  };

  recheckAllProducts = () => {
    const prop = "codigo";
    const helper = [];
    const group = this.state.data.reduce(function(groups, item) {
      const val = item[prop];
      if (!helper.includes(val)) helper.push(val);
      groups[val] = groups[val] || [];
      groups[val].push(item);
      return groups;
    }, {});

    var message =
      "El inventario a sido actualizado, el stock no alcanza para los siguiente productos: ";
    var count = 0;
    for (var i = 0; i < helper.length; i++) {
      var sum = group[helper[i]]
        .map(item => parseInt(item.cantidad))
        .reduce((prev, next) => prev + next);

      if (this.getProducto(helper[i]).stock < sum) {
        message += " " + helper[i];
        count++;
      }
    }
    if (count > 0) {
      this.handleSnackOpen(message);
      return false;
    }

    return true;
  };

  checkProductStock = (codigo, cantidad) => {
    var cantidadIngresada = 0;
    this.state.data.forEach((el, i) => {
      if (!this.state.editing) {
        if (el.codigo === codigo) {
          cantidadIngresada += parseInt(el.cantidad);
        }
      } else if (el.codigo === codigo && el.id !== this.state.tempData.id) {
        cantidadIngresada += parseInt(el.cantidad);
      }
    });

    //cantidad = cantidad + cantidadIngresada;
    const stock = this.getProducto(codigo).stock;

    cantidad = parseInt(cantidad);
    cantidad += cantidadIngresada;
    if (stock < cantidad) {
      this.handleSnackOpen("No hay suficientes productos en stock");
      return false;
    }

    return true;
  };

  checkFactura = () => {
    if (this.state.resolucion.res === null) {
      this.handleSnackOpen("No hay ninguna resolución vigente");
      return false;
    }
    if (this.state.cliente.nit == undefined || this.state.cliente.nit === "") {
      this.handleSnackOpen("Agrega el NIT del cliente");
      return false;
    }

    if (
      this.state.cliente.nombre == undefined ||
      this.state.cliente.nombre === ""
    ) {
      this.handleSnackOpen("Agrega el nombre del cliente");
      return false;
    }

    if (
      this.state.cliente.direccion == undefined ||
      this.state.cliente.direccion === ""
    ) {
      this.handleSnackOpen("Agrega la dirección del cliente");
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
      this.state.tempData.cantidad == undefined ||
      this.state.tempData.cantidad <= 0
    ) {
      this.handleSnackOpen("Cantidad tiene que ser mayor a 0");
      return false;
    }

    return this.checkProductStock(
      this.state.tempData.codigo,
      this.state.tempData.cantidad
    );
  };

  handleClienteBlur = e => {
    var v = e.target.value;
    if (
      v === "cf" ||
      v === "CF" ||
      v === "." ||
      v === " " ||
      v === "C.F." ||
      v === "c.f." ||
      v === "c.f" ||
      v === "C.F"
    ) {
      v = "CF";
    }
    this.setState({ cliente: { nit: v, nombre: "", direccion: "" } });
    this.bringCliente(v);
  };

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
    tempData[name] = e.target.value;
    const producto = this.getProducto(tempData.codigo);
    if (producto != null) {
      tempData.producto = producto.producto;
      tempData.precioUnitario = producto.precioActual;
      var n1 = new bigDecimal(tempData.precioUnitario);
      var n2 = new bigDecimal(tempData.cantidad);
      tempData.precio = parseFloat(n1.multiply(n2).getValue());
    } else {
      tempData.producto = null;
      tempData.precioUnitario = 0;
      tempData.precio = 0;
    }

    this.setState({ tempData });
  };

  handleSnackOpen = message => {
    this.setState({ message });
    this.setState({ open: true });
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

  syncEditing = val => {
    this.setState({ editing: val });
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
    const { tempData } = this.state;
    return (
      <React.Fragment>
        <TableCell className={classes.insertCell}>
          <TextField
            autoFocus={this.state.cliente.nit != ""}
            id="codigo"
            label="Codigo"
            inputRef={this.firstInput}
            className={classes.textField}
            value={tempData.codigo}
            onChange={e => this.handleDataChange(e, "codigo")}
            onBlur={e => this.handleDataBlur(e, "codigo")}
            inputProps={{ maxLength: 30 }}
            disabled={!this.resolucionExiste()}
          />
        </TableCell>
        <TableCell className={classes.insertCell}>
          {tempData.producto}
        </TableCell>
        <TableCell className={classes.insertCell}>
          <TextField
            id="cantidad"
            label="Cantidad"
            type="numeric"
            className={classes.textField}
            value={tempData.cantidad}
            onChange={e => this.handleDataChange(e, "cantidad")}
            onBlur={e => this.handleDataBlur(e, "cantidad")}
            InputProps={{ inputComponent: IntegerFormat }}
            disabled={!this.resolucionExiste()}
          />
        </TableCell>

        <TableCell className={classes.insertCell}>
          {"Q" + tempData.precioUnitario}
        </TableCell>
        <TableCell className={classes.insertCell}>
          {"Q" + tempData.precio}
        </TableCell>
      </React.Fragment>
    );
  };

  resolucionExiste = () => {
    if (this.state.resolucion.hasIt) return this.state.resolucion.res !== null;
    else return true;
  };

  render() {
    const { classes, theme } = this.props;
    return (
      <DefaultDashboard>
        <Grid container>
          <Grid item xs={4}>
            <Card>
              <CardContent>
                <Form>
                  <TextField
                    autoFocus
                    inputRef={this.nitInput}
                    id="nit"
                    label="NIT"
                    value={this.state.cliente.nit}
                    onChange={e => {
                      this.handleClienteChange(e, "nit");
                    }}
                    onBlur={this.handleClienteBlur}
                    style={{ margin: "10px" }}
                    inputProps={{ maxLength: 10 }}
                    disabled={!this.resolucionExiste()}
                  />
                  <TextField
                    id="cliente"
                    label="Nombre"
                    value={this.state.cliente.nombre}
                    onChange={e => {
                      this.handleClienteChange(e, "nombre");
                    }}
                    style={{ margin: "10px" }}
                    disabled={
                      this.state.clienteExiste || !this.resolucionExiste()
                    }
                    inputProps={{ maxLength: 255 }}
                  />
                  <TextField
                    id="direccion"
                    label="Dirección"
                    value={this.state.cliente.direccion}
                    onChange={e => {
                      this.handleClienteChange(e, "direccion");
                    }}
                    style={{ margin: "10px" }}
                    disabled={
                      this.state.clienteExiste || !this.resolucionExiste()
                    }
                    inputProps={{ maxLength: 255 }}
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
          checkBeforeAdd={this.checkBeforeAdd}
          syncData={this.syncData}
          syncTempData={this.syncTempData}
          syncEditing={this.syncEditing}
        />

        <BottomNavigation style={{ width: "100%", marginTop: 30 }} showLabels>
          <BottomNavigationAction
            disabled
            label={"Q." + this.state.total.toFixed(2)}
            icon={<MoneyIcon />}
          />
          <BottomNavigationAction
            disabled
            label={this.state.cantidad}
            icon={<ProductsIcon />}
          />
          <BottomNavigationAction
            label="Guardar"
            disabled
            icon={
              <SaveIcon /> //style={{ color: "#0277bd" }}
            }
            onClick={() => {
              this.crearFactura(true);
            }}
          />
          <BottomNavigationAction
            label="Terminar"
            icon={<FinishIcon />}
            onClick={() => this.crearFactura(false)}
            disabled={!this.resolucionExiste()}
            style={{ color: this.resolucionExiste() ? "#0277bd" : "#78909c" }}
          />
        </BottomNavigation>
        {!this.resolucionExiste() && (
          <Warning message="No hay ninguna resolución vigente para facturar" />
        )}

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
          ContentProps={{ "aria-describedby": "message-id" }}
          message={<span id="message-id">{this.state.message}</span>}
        />
      </DefaultDashboard>
    );
  }
}

Facturacion.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Facturacion);
