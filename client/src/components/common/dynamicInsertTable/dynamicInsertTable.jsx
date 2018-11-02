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
import CancelIcon from "@material-ui/icons/Close";
import DoneIcon from "@material-ui/icons/Done";
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

class DynamicInsertTable extends Component {
  state = {
    editing: false
  };

  constructor(props) {
    super(props);
  }

  deleteRow = arrayID => {
    let originalData = [...this.props.data];
    originalData.splice(arrayID, 1);

    const data = originalData.map((el, id) => {
      const element = { ...el };
      element.id = id;
      return element;
    });

    this.props.syncData(data);
  };

  editRow = arrayID => {
    const { data } = this.props;
    let tempData = data[arrayID];

    this.setState({ editing: true });

    this.props.syncTempData(tempData);
    //this.setState({ tempData });

    this.props.firstInput.current.focus();
  };
  doneEditing = () => {
    const { tempData } = this.props;
    const data = [...this.props.data];
    data[tempData.id] = tempData;

    this.props.syncData(data);
    this.cancelEditing();
  };

  cancelEditing = () => {
    this.props.syncTempData(this.props.elementStructure);
    this.setState({ editing: false }, () => {
      this.props.firstInput.current.focus();
    });
  };

  insertRow = () => {
    let data = [...this.props.data];
    let tempData = { ...this.props.tempData };
    tempData.id = data.length;
    data.push(tempData);
    this.props.syncData(data);
    this.props.firstInput.current.focus();
    this.props.syncTempData(this.props.elementStructure);
  };

  /**
   * Rendriza boton agregar o aceptar cancelar
   */
  renderInsertButtons() {
    if (!this.state.editing) {
      return (
        <IconButton
          color="primary"
          aria-label="Agregar"
          onClick={this.insertRow}
        >
          <AddIcon />
        </IconButton>
      );
    } else {
      return (
        <React.Fragment>
          <IconButton
            color="primary"
            aria-label="Aceptar"
            onClick={this.doneEditing}
          >
            <DoneIcon />
          </IconButton>
          <IconButton
            color="primary"
            aria-label="Cancelar"
            onClick={this.cancelEditing}
          >
            <CancelIcon />
          </IconButton>
        </React.Fragment>
      );
    }
  }

  render() {
    const { classes, data } = this.props;

    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              {this.props.tableHeader()}
              <TableCell>Opciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(row => {
              return (
                <TableRow key={row.id}>
                  {this.props.tableBody(row)}
                  <TableCell align={"center"}>
                    <IconButton
                      color="primary"
                      aria-label="Editar"
                      onClick={() => this.editRow(row.id)}
                      disabled={this.state.editing}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      aria-label="Eliminar"
                      onClick={() => this.deleteRow(row.id)}
                      disabled={this.state.editing}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow key={data.length}>
              {this.props.insertRow(classes)}
              <TableCell align={"center"} className={classes.insertCell}>
                {this.renderInsertButtons()}
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
