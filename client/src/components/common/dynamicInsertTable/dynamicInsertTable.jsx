import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  table: {
    minWidth: 700
  },
  insertCell: {
    backgroundColor: "#CFD8DC"
  }
});

let id = 0;
function createData(name, calories, fat, carbs, protein) {
  id += 1;
  return { id, name, calories, fat, carbs, protein };
}

const rows = [
  { id: 0, codigo: "A", nombre: "ABC" },
  { id: 1, codigo: "B", nombre: "123" }
];

class DynamicInsertTable extends Component {
  state = {
    tempData: { id: 0, codigo: "", nombre: "" },
    elementStructure: { id: 0, codigo: "", nombre: "" },
    data: rows
  };

  constructor(props) {
    super(props);
    this.firstInput = React.createRef();
  }

  deleteRow = arrayID => {
    let originalData = [...this.state.data];
    originalData.splice(arrayID, 1);

    const data = originalData.map((el, id) => {
      const element = { ...el };
      element.id = id;
      return element;
    });

    this.setState({ data });
  };

  editRow = arrayID => {
    const { data } = this.state;
    let tempData = {
      id: arrayID,
      codigo: data[arrayID].codigo,
      nombre: data[arrayID].nombre
    };
    this.setState({ tempData });

    this.firstInput.current.focus();
  };

  insertRow = () => {
    let data = [...this.state.data];
    let tempData = { ...this.state.tempData };
    tempData.id = data.length;
    data.push(tempData);
    this.setState({ data }, () => {
      this.firstInput.current.focus();
    });
    this.setState({ tempData: this.state.elementStructure });
  };

  handleCodigo = e => {
    let tempData = { ...this.state.tempData };
    tempData.codigo = e.target.value;
    this.setState({ tempData });
  };

  handleNombre = e => {
    let tempData = { ...this.state.tempData };
    tempData.nombre = e.target.value;
    this.setState({ tempData });
  };

  render() {
    const { classes } = this.props;
    const { tempData } = this.state;
    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Codigo</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Opciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.data.map(row => {
              return (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {row.codigo}
                  </TableCell>
                  <TableCell>{row.nombre}</TableCell>
                  <TableCell align={"center"}>
                    <IconButton
                      color="primary"
                      aria-label="Editar"
                      onClick={() => this.editRow(row.id)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      aria-label="Eliminar"
                      onClick={() => this.deleteRow(row.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow key={rows.length}>
              <TableCell className={classes.insertCell}>
                <TextField
                  id="standard-name"
                  label="Name"
                  inputRef={this.firstInput}
                  className={classes.textField}
                  value={tempData.codigo}
                  autoFocus
                  onChange={this.handleCodigo}
                  //margin="normal"
                />
              </TableCell>
              <TableCell className={classes.insertCell}>
                <TextField
                  id="standard-name"
                  label="Name"
                  className={classes.textField}
                  value={tempData.nombre}
                  onChange={this.handleNombre}
                  //onChange={this.handleChange("name")}
                  //margin="normal"
                />
              </TableCell>
              <TableCell align={"center"} className={classes.insertCell}>
                <IconButton
                  color="primary"
                  aria-label="Agregar"
                  onClick={this.insertRow}
                >
                  <AddIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

DynamicInsertTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DynamicInsertTable);
