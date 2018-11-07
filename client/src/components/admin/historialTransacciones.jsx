import React, { Component } from "react";
import AdminDashboard from "./adminDashboard";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import PaginationTable from "../common/paginationTable";
import TableRow from "@material-ui/core/TableRow";

import formatDate from "date-fns/format";
import TableCell from "@material-ui/core/TableCell";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import DownloadIcon from "@material-ui/icons/GetApp";
import PrintIcon from "@material-ui/icons/Print";

import ReportMngr from "../common/reporter/reportMngr";

import Filters from "../common/filters";
import FilterNumberRange from "../common/filterOptions/filterNumberRange";
import FilterSearch from "../common/filterOptions/filterSearch";
import FilterSelect from "../common/filterOptions/filterSelect";
import { th } from "date-fns/esm/locale";
import nextFrame from "next-frame";

const reportmngr = new ReportMngr();

const select = [
  { id: "FAC", name: "Factura" },
  { id: "NC", name: "Nota de crédito" },
  { id: "ND", name: "Nota de débito" }
];

const estado = [
  { id: "E", name: "Emitido" },
  { id: "A", name: "Anulado" },
  { id: "D", name: "Devolución" }
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
  }
});

class HistorialTransacciones extends Component {
  state = {
    hasData: false,
    data: [],
    printURL: null
  };

  constructor(props) {
    super(props);
    this.doc = React.createRef();
    this.serie = React.createRef();
    this.monto = React.createRef();
    this.fecha = React.createRef();
    this.estado = React.createRef();

    const refs = [];
    refs.push(this.doc, this.serie, this.monto, this.fecha, this.estado);
    this.state.refs = refs;

    this.beforeFilters = this.beforeFilters.bind(this);
    this.bringResolucion = this.bringResolucion.bind(this);
  }

  componentDidMount() {
    this.bringResolucion();
    reportmngr.openReport("historialResoluciones", fireURL => {
      this.setState({ printURL: fireURL });
    });
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
    return Promise.resolve(this.bringResolucion(filters));
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
  async bringResolucion(filters = []) {
    // this.setState({ hasData: false });
    // this.setState({ data: [] });
    const request = { filters: filters };

    return fetch("/api/getTransacciones", {
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
              var documento = "???";
              var tipo = "???";
              if (el.tipo === "E") tipo = "Emitido";
              if (el.tipo === "A") tipo = "Anulado";
              if (el.tipo === "D") tipo = "Devolución";

              if (el.documento === "FAC") documento = "Factura";
              if (el.documento === "NC") documento = "Nota de Crédito";
              if (el.documento === "ND") documento = "Nota de Débito";
              var fecha = formatDate(el.fecha, "dd/MM/yyyy");
              return {
                id: index,
                ntransaccion: el.ntransaccion,
                documento: documento,
                correlativo: el.correlativo,
                serie: el.serie,
                monto: el.monto,
                fecha: fecha,
                tipo: tipo
              };
            })
          });
        }
        this.setState({ hasData: true });
      });
  }

  /*
    Se le pasa esta funcion como props para la tabla
     */
  renderTableHead() {
    return (
      <TableRow>
        <TableCell>Número de Transacción</TableCell>
        <TableCell>Documento</TableCell>
        <TableCell>Correlativo</TableCell>
        <TableCell>Serie</TableCell>
        <TableCell>Monto</TableCell>
        <TableCell>Fecha</TableCell>
        <TableCell>Estado</TableCell>
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
  bodyMap(row) {
    return (
      <TableRow key={row.id}>
        <TableCell>{row.ntransaccion}</TableCell>
        <TableCell>{row.documento}</TableCell>
        <TableCell>{row.correlativo}</TableCell>
        <TableCell>{row.serie}</TableCell>
        <TableCell>{row.monto}</TableCell>
        <TableCell>{row.fecha}</TableCell>
        <TableCell>{row.tipo}</TableCell>
      </TableRow>
    );
  }

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
            id={"T.documento"}
            name={"Tipo de documento"}
            label={"Documento"}
            items={select}
            innerRef={this.doc}
          />
          <FilterSearch
            id={"R.serie"}
            name={"Serie"}
            label={"Serie"}
            ref={this.serie}
          />
          <FilterNumberRange
            id={"T.monto"}
            name={"Monto"}
            label={"Monto"}
            ref={this.monto}
          />
          <FilterNumberRange
            id={"T.fecha"}
            name={"Fecha"}
            label={"Fecha"}
            ref={this.fecha}
          />
          <FilterSelect
            id={"T.tipo"}
            name={"Estado"}
            label={"Estado"}
            items={estado}
            innerRef={this.estado}
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
              onClick={() => window.open(this.state.printURL).print()}
              disabled={this.state.printURL === null}
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
          columns={7}
          loading={!this.state.hasData}
        />
      </AdminDashboard>
    );
  }
}

HistorialTransacciones.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(HistorialTransacciones);
