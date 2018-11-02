import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import DynamicTable from "../../common/dynamicInsertTable/dynamicInsertTable";
import AdminDashboard from "../adminDashboard";
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
    nit: undefined,
    cantidad: 0,
    total: 0
  };

  constructor(props) {
    super(props);
    this.firstInput = React.createRef();

    this.scrollToBottom = this.scrollToBottom.bind(this);
  }

  componentDidMount() {
    this.bringProductos();
  }

  componentWillUnmount() {}

  scrollToBottom() {}
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

  getProducto(codigo) {
    const { productos } = this.state;
    let producto = productos.filter(el => {
      return el.codigo === codigo;
    });

    if (producto != null && producto.length > 0) producto = producto[0];
    else producto = null;
    return producto;
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

  handleClienteChange = (e, name) => {
    this.setState({ [name]: e.target.value });
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
            autoFocus={this.state.nit != undefined}
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
      <AdminDashboard>
        <Grid container>
          <Grid item xs={4}>
            <Card>
              <CardContent>
                <Form>
                  <TextField
                    autoFocus
                    id="nit"
                    label="NIT"
                    onChange={e => {
                      this.handleClienteChange(e, "nit");
                    }}
                    value={this.state.nit}
                    style={{ margin: "10px" }}
                  />
                  <TextField
                    id="cliente"
                    label="Nombre"
                    style={{ margin: "10px" }}
                  />
                  <TextField
                    id="direccion"
                    label="Dirección"
                    style={{ margin: "10px" }}
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
      </AdminDashboard>
    );
  }
}

Facturacion.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Facturacion);
