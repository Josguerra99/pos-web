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
import { th } from "date-fns/esm/locale";

import Avatar from "@material-ui/core/Avatar";
import MoneyIcon from "@material-ui/icons/AttachMoneyRounded";
import ProductsIcon from "@material-ui/icons/ShoppingCartRounded";
import Button from "@material-ui/core/Button";
import NavigationIcon from "@material-ui/icons/Save";

import Snackbar from "@material-ui/core/Snackbar";

import ReportMngr from "../../common/reporter/reportMngr";

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
    printURL: null
  };

  constructor(props) {
    super(props);
    this.firstInput = React.createRef();
    this.nitInput = React.createRef();

    this.scrollToBottom = this.scrollToBottom.bind(this);
  }

  componentDidMount() {
    this.bringProductos();
  }

  componentWillUnmount() {}

  scrollToBottom() {}

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
    this.setState({ sendingData: true });
    const requestData = {
      total: factura.total,
      cliente: factura.cliente,
      detalle: factura.detalle
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
        var err = parseInt(data["@err"]);
        this.setState({ sendingData: false });
        if (err === 0) {
          this.clear();
          this.setState({ message: "Venta realizada exitosamente" });
          this.setState({ open: true }, () => {
            const reportmngr = new ReportMngr();
            reportmngr.openReport(
              "factura?ntransaccion=" + data["ntransaccion"],
              fireURL => {
                window.open(fireURL).print();
              }
            );
          });
        } else {
          this.setState({ message: "Error al intentar realizar la venta" });
          this.setState({ open: true });
        }
        //   callback(parseInt(err));
      });
  };

  crearFactura() {
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

  handleClienteBlur = e => {
    var v = e.target.value;
    if (
      v === "cf" ||
      v === "CF" ||
      v === "." ||
      v === " " ||
      v === "" ||
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
      tempData.precio = producto.precioActual * tempData.cantidad;
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
                  />
                  <TextField
                    id="cliente"
                    label="Nombre"
                    value={this.state.cliente.nombre}
                    onChange={e => {
                      this.handleClienteChange(e, "nombre");
                    }}
                    style={{ margin: "10px" }}
                    disabled={this.state.clienteExiste}
                  />
                  <TextField
                    id="direccion"
                    label="Dirección"
                    value={this.state.cliente.direccion}
                    onChange={e => {
                      this.handleClienteChange(e, "direccion");
                    }}
                    style={{ margin: "10px" }}
                    disabled={this.state.clienteExiste}
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
        />

        <Grid container style={{ paddingTop: "20px" }}>
          <Grid item xs={12}>
            <Card className={classes.card}>
              <CardContent className={classes.content}>
                <Grid container>
                  <Grid item xs={4}>
                    <Grid container>
                      <Grid item xs={3}>
                        <Avatar className={classes.moneyAvatar}>
                          <MoneyIcon className={classes.moneyIcon} />
                        </Avatar>
                      </Grid>

                      <Grid item xs={6} className={classes.text}>
                        <Typography
                          color="textSecondary"
                          component="h6"
                          variant="h6"
                          gutterBottom
                        >
                          Total
                        </Typography>
                        <Typography component="h5" variant="h5" gutterBottom>
                          {"Q." + this.state.total.toFixed(2)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={4}>
                    <Grid container>
                      <Grid item xs={3}>
                        <Avatar className={classes.productsAvatar}>
                          <ProductsIcon className={classes.productIcon} />
                        </Avatar>
                      </Grid>

                      <Grid item xs={6} className={classes.text}>
                        <Typography
                          color="textSecondary"
                          component="h6"
                          variant="h6"
                          gutterBottom
                        >
                          Articulos
                        </Typography>
                        <Typography component="h5" variant="h5" gutterBottom>
                          {this.state.cantidad}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={4} className={classes.button}>
                    <Grid container>
                      <Grid item xs={3} />
                      <Grid item xs={3}>
                        <Button
                          variant="extendedFab"
                          aria-label="Delete"
                          className={classes.button1}
                          onClick={() => this.crearFactura()}
                          disabled={this.state.sendingData}
                        >
                          <NavigationIcon className={classes.extendedIcon} />
                          Terminar
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
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
