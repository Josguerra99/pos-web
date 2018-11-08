import React, { Component } from "react";
import AdminDashboard from "../adminDashboard";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import PaginationTable from "../../common/paginationTable";

import formatDate from "date-fns/format";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import DownloadIcon from "@material-ui/icons/GetApp";
import MoreIcon from "@material-ui/icons/MoreHorizRounded";

import PrintIcon from "@material-ui/icons/Print";

import ReportMngr from "../../common/reporter/reportMngr";

import Filters from "../../common/filters";
import FilterNumberRange from "../../common/filterOptions/filterNumberRange";
import FilterSearch from "../../common/filterOptions/filterSearch";
import FilterSelect from "../../common/filterOptions/filterSelect";
import { th } from "date-fns/esm/locale";
import nextFrame from "next-frame";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import { isThisSecond } from "date-fns";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const reportmngr = new ReportMngr();

const select = [
  { id: "FAC", name: "Factura" },
  { id: "NC", name: "Nota de crédito" },
  { id: "ND", name: "Nota de débito" }
];

const styles = theme => ({
  list: {
    width: 250
  },
  fullList: {
    width: "auto"
  },
  iconSmall: {
    fontSize: 15
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  button: {
    margin: theme.spacing.unit
  },
  table: {
    minWidth: 700
  },
  dialogPaper: {
    minHeight: "20%",
    maxHeight: "80%",
    minWidth: "20%",
    maxWidth: "90%"
  }
});

let counter = 0;
function createData(name, calories, fat) {
  counter += 1;
  return { id: counter, name, calories, fat };
}

class HistorialFacturacion extends Component {
  state = {
    hasData: false,
    data: [],
    printURL: null,
    openDetalle: false,
    detalle: [],
    hasDetalle: false
  };

  constructor(props) {
    super(props);
    this.doc = React.createRef();
    this.nres = React.createRef();
    this.serie = React.createRef();
    this.inicio = React.createRef();
    this.fin = React.createRef();
    this.fecha = React.createRef();

    const refs = [];
    refs.push(
      this.doc,
      this.nres,
      this.serie,
      this.inicio,
      this.fin,
      this.fecha
    );
    this.state.refs = refs;

    this.beforeFilters = this.beforeFilters.bind(this);
    this.bringFacturas = this.bringFacturas.bind(this);
    this.VerDetalle = this.VerDetalle.bind(this);
  }

  componentDidMount() {
    this.bringFacturas();
    //reportmngr.openReport("historialResoluciones", fireURL => {
    //  this.setState({ printURL: fireURL });
    //});
  }

  async beforeFilters() {
    this.setState({ hasData: false });
    this.setState({ data: [] });
  }

  /**
   * Va a traer los datos de las resoluciones pero esta vez los va a traer con los filtros
   * que le pasemos
   * @param {Array} filters Array de filtros que les sera pasado por el componente Filters
   */
  handleFilterUpdate = filters => {
    return Promise.resolve(this.bringFacturas(filters));
  };

  /**
   * Traer la resolucion de la base de datos
   * Al traerla se creara un arreglo con map
   * este arreglo es el que se utilizara en
   * la tabla, tiene los datos de la base de
   * datos pero cambiamos el documento de
   * a palabra (FAC = Factura), se pone el
   * formato de la fecha y se agrega un id para
   * las filas, al final este array se guarda
   * como un state
   */
  async bringFacturas(filters = []) {
    // this.setState({ hasData: false });
    // this.setState({ data: [] });
    const request = { filters: filters };

    return fetch("/api/getFacturas", {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          this.setState({
            data: data.map((el, index) => {
              var rango = el.Inicio + " al " + el.Fin;
              var documento = "???";
              var fecha = formatDate(el.fecha, "dd/MM/yyyy");
              return {
                id: index,
                Num: el.NumTransaccion,
                Correlativo: el.correlativo,
                Monto: "Q." + el.monto.toFixed(2),
                Fecha: fecha
              };
            })
          });
        }
        this.setState({ hasData: true });
      });
  }

  /**
   *
   * Trae el detalle del elemento elemento actual
   * @param {int} ntransaccion
   */
  async bringDetalle(ntransaccion) {
    // this.setState({ hasData: false });
    // this.setState({ data: [] });
    const request = { ntransaccion: ntransaccion };
    this.setState({ detalle: [] });
    this.setState({ hasDetalle: false });

    return fetch("/api/getDetalle", {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          this.setState({ detalle: data });
        }
        this.setState({ hasDetalle: true });
      });
  }

  async VerDetalle(transaccion) {
    this.bringDetalle(transaccion);
    this.setState({ openDetalle: true });
  }
  handleDetalleClose = () => {
    this.setState({ openDetalle: false });
  };

  /*
    Se le pasa esta funcion como props para la tabla
     */
  renderTableHead() {
    return (
      <TableRow>
        <TableCell>Número de Transacción</TableCell>
        <TableCell>Número de factura</TableCell>
        <TableCell>Monto Total</TableCell>
        <TableCell>Fecha</TableCell>
        <TableCell>Detalle</TableCell>
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
        <TableCell>{row.Num}</TableCell>
        <TableCell>{row.Correlativo}</TableCell>
        <TableCell>{row.Monto}</TableCell>
        <TableCell>{row.Fecha}</TableCell>
        <TableCell>
          <IconButton
            //className={classes.button}
            aria-label="ViewMore"
            color="primary"
            onClick={() => {
              this.VerDetalle(row.Num);
            }}
            //onClick={() => reportmngr.downloadReport("historialResoluciones")}
          >
            <MoreIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  };

  /**
   * Renderiza la pagina, pimero el dashboard luego filtros
   * y luego botones de imprimir, por ultimo renderiza la tabla
   * a la cual le pasamos la informacion de la base de datos
   * y las dos funciones la de crear la cabecera y la de crear
   * las filas
   */
  render() {
    const { classes } = this.props;

    return (
      <AdminDashboard>
        <Filters
          refs={this.state.refs}
          afterFilters={this.handleFilterUpdate}
          beforeFilters={this.beforeFilters}
        >
          <FilterSelect
            id={"Documento"}
            name={"Tipo de documento"}
            label={"Documento"}
            items={select}
            innerRef={this.doc}
          />
          <FilterSearch
            id={"Num"}
            name={"Número de resolución"}
            label={"Resolución"}
            ref={this.nres}
          />
          <FilterSearch
            id={"Serie"}
            name={"Serie"}
            label={"Serie"}
            ref={this.serie}
          />
          <FilterNumberRange
            id={"Inicio"}
            name={"Inicio"}
            label={"Valor"}
            ref={this.inicio}
          />
          <FilterNumberRange
            id={"Fin"}
            name={"Fin"}
            label={"Valor"}
            ref={this.fin}
          />
          <FilterNumberRange
            id={"Fecha"}
            name={"Fecha"}
            label={"Date"}
            ref={this.fecha}
          />
        </Filters>

        {/* Icono de descargar e imprimir */}
        <Grid container>
          <Grid item xs={10} />

          <Grid item xs={2}>
            <IconButton
              className={classes.button}
              aria-label="Download"
              color="primary"
              onClick={() => reportmngr.downloadReport("historialResoluciones")}
            >
              <DownloadIcon />
            </IconButton>
            <IconButton
              className={classes.button}
              aria-label="Print"
              color="primary"
              disabled={
                this.state.printURL === null //onClick={() => window.open(this.state.printURL).print()}
              }
            >
              <PrintIcon />
            </IconButton>
          </Grid>
        </Grid>

        {/*Tabla de datos */}
        <PaginationTable
          tableHead={this.renderTableHead()}
          bodyMap={this.bodyMap}
          rows={this.state.data}
          columns={5}
          loading={!this.state.hasData}
        />

        <Dialog
          open={this.state.openDetalle}
          onClose={this.handleDetalleClose}
          aria-labelledby="simple-dialog-title"
          classes={{ paper: classes.dialogPaper }}
        >
          <DialogContent>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Producto</TableCell>
                  <TableCell>Cantidad</TableCell>
                  <TableCell>Precio Unitario</TableCell>
                  <TableCell>Sub total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.detalle.map((row, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>{row.codigoBarras}</TableCell>
                      <TableCell>{row.producto}</TableCell>
                      <TableCell>{row.cantidad}</TableCell>
                      <TableCell>{row.precioUnitario}</TableCell>
                      <TableCell>{row.precioVenta}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </DialogContent>
        </Dialog>
      </AdminDashboard>
    );
  }
}

HistorialFacturacion.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(HistorialFacturacion);
