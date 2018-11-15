import React, { Component } from "react";
import AdminDashboard from "../adminDashboard";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import PaginationTable from "../../common/paginationTable";

import IconButton from "@material-ui/core/IconButton";
import MoreIcon from "@material-ui/icons/AddToQueue";

import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

import CheckIcon from "@material-ui/icons/Check";
import WrongIcon from "@material-ui/icons/Close";

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

class RegistrarComputadora extends Component {
  state = {
    hasData: false,
    data: []
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.bringComputadoras();
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
  bringComputadoras(filters = []) {
    return fetch("/api/getComputadoras")
      .then(res => res.json())
      .then(data => {
        if (data["@err"] === 0 && data.data.length > 0) {
          this.setState({ data: data["data"] });
        }
        this.setState({ hasData: true });
      });
  }

  renderBoolIcon(val) {
    if (val) return <CheckIcon style={{ fontSize: 20, color: "#0091ea" }} />;
    else return <WrongIcon style={{ fontSize: 20, color: "#90a4ae" }} />;
  }

  /*
    Se le pasa esta funcion como props para la tabla
     */
  renderTableHead() {
    return (
      <TableRow>
        <TableCell>Número</TableCell>
        <TableCell>Código</TableCell>
        <TableCell>Registrada</TableCell>
        <TableCell>Registrar</TableCell>
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
      <TableRow key={row.num}>
        <TableCell>{row.num}</TableCell>
        <TableCell>{row.codigo}</TableCell>
        <TableCell>{this.renderBoolIcon(row.registrada)}</TableCell>
        <TableCell>
          <IconButton //className={classes.button}
            aria-label="ViewMore"
            color="primary"
            disabled={row.registrada}
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
        {/*Tabla de datos */}
        <PaginationTable
          tableHead={this.renderTableHead()}
          bodyMap={this.bodyMap}
          rows={this.state.data}
          columns={4}
          loading={!this.state.hasData}
        />
      </AdminDashboard>
    );
  }
}

RegistrarComputadora.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(RegistrarComputadora);
