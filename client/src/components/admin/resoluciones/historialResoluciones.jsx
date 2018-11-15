import React, { Component } from "react";
import AdminDashboard from "../adminDashboard";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import PaginationTable from "../../common/paginationTable";
import TableRow from "@material-ui/core/TableRow";

import formatDate from "date-fns/format";
import TableCell from "@material-ui/core/TableCell";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import DownloadIcon from "@material-ui/icons/GetApp";
import PrintIcon from "@material-ui/icons/Print";
import ReportMngr from "../../common/reporter/reportMngr";
import Filters from "../../common/filters";
import FilterNumberRange from "../../common/filterOptions/filterNumberRange";
import FilterSearch from "../../common/filterOptions/filterSearch";
import FilterSelect from "../../common/filterOptions/filterSelect";
import CheckIcon from "@material-ui/icons/Check";
import WrongIcon from "@material-ui/icons/Close";

import { th } from "date-fns/esm/locale";
import nextFrame from "next-frame";

var reportmngr = new ReportMngr();

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
  }
});

let counter = 0;
function createData(name, calories, fat) {
  counter += 1;
  return { id: counter, name, calories, fat };
}

class HistorialResoluciones extends Component {
  state = {
    hasData: false,
    data: [],
    printURL: null
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
    this.bringResolucion = this.bringResolucion.bind(this);
  }

  componentDidMount() {
    this.bringResolucion();
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
    this.setState({ printURL: null });
    const request = { filters: filters };

    return fetch("/api/getResoluciones", {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        this.getReport(data);
        if (data.length > 0) {
          this.setState({
            data: data.map((el, index) => {
              var rango = el.Inicio + " al " + el.Fin;
              var documento = "???";
              if (el.Documento === "FAC") documento = "Factura";
              if (el.Documento === "NC") documento = "Nota de Crédito";
              if (el.Documento === "ND") documento = "Nota de Débito";
              var fecha = formatDate(el.Fecha, "dd/MM/yyyy");
              return {
                id: index,
                Num: el.Num,
                Serie: el.Serie,
                Documento: documento,
                Rango: rango,
                Fecha: fecha,
                Activa: el.Activo
              };
            })
          });
        }
        this.setState({ hasData: true });
      });
  }

  /**
   * Obtiene el reporte reseteandolo para crearlo de nuevo
   * @param {JSON} data datos que se le pasaran al backend para que cree el reporte
   */
  getReport(data) {
    reportmngr.reset();
    reportmngr.openReport("historialResoluciones", data, fireURL => {
      this.setState({ printURL: fireURL });
    });
  }

  /*
  Se le pasa esta funcion como props para la tabla
   */
  renderTableHead() {
    return (
      <TableRow>
        <TableCell>Número de Resolución</TableCell>
        <TableCell>Serie</TableCell>
        <TableCell>Documento</TableCell>
        <TableCell>Rango</TableCell>
        <TableCell>Fecha</TableCell>
        <TableCell>Actual</TableCell>
      </TableRow>
    );
  }

  renderBoolIcon(val) {
    if (val) return <CheckIcon style={{ fontSize: 20, color: "#0091ea" }} />;
    else return <WrongIcon style={{ fontSize: 20, color: "#90a4ae" }} />;
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
        <TableCell>{row.Serie}</TableCell>
        <TableCell>{row.Documento}</TableCell>
        <TableCell>{row.Rango}</TableCell>
        <TableCell>{row.Fecha}</TableCell>
        <TableCell>{this.renderBoolIcon(row.Activa)}</TableCell>
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
          columns={6}
          loading={!this.state.hasData}
        />
      </AdminDashboard>
    );
  }
}

HistorialResoluciones.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(HistorialResoluciones);
