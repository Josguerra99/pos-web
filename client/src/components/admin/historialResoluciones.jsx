import React, { Component } from "react";
import AdminDashboard from "./adminDashboard";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Filters from "../common/filters";
import PaginationTable from "../common/paginationTable";
import TableRow from "@material-ui/core/TableRow";

import formatDate from "date-fns/format";
import TableCell from "@material-ui/core/TableCell";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import DownloadIcon from "@material-ui/icons/GetApp";
import PrintIcon from "@material-ui/icons/Print";

import ReportMngr from "../common/reporter/reportMngr";
const reportmngr = new ReportMngr();

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

  componentDidMount() {
    this.bringResolucion();
    reportmngr.openReport("historialResoluciones", fireURL => {
      this.setState({ printURL: fireURL });
    });
  }

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
  bringResolucion() {
    //Realizar peticion get
    fetch("/api/getResoluciones")
      .then(res => res.json())
      .then(data => {
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
                Fecha: fecha
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
        <TableCell>Número de Resolución</TableCell>
        <TableCell>Serie</TableCell>
        <TableCell>Documento</TableCell>
        <TableCell>Rango</TableCell>
        <TableCell>Fecha</TableCell>
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
        <TableCell>{row.Num}</TableCell>
        <TableCell>{row.Serie}</TableCell>
        <TableCell>{row.Documento}</TableCell>
        <TableCell>{row.Rango}</TableCell>
        <TableCell>{row.Fecha}</TableCell>
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
        <Filters />

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
          columns={5}
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
