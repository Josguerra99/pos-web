import React, { Component } from "react";
import TableCell from "@material-ui/core/TableCell";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import AutoComplete from "../../common/autocompleter";
import TableMngr from "../../common/mngr/tableMngr";
import FormControl from "@material-ui/core/FormControl";
import Snackbar from "@material-ui/core/Snackbar";
import FormHelperText from "@material-ui/core/FormHelperText";

import MoneyFormat from "../../common/inputFormats/money";
import IntegerFormat from "../../common/inputFormats/integer";
import AdminDashboard from "../adminDashboard";

class UserTableMngr extends Component {
  state = {
    elementStructure: {
      user_name: "",
      pass: "",
      pass2: "",
      oldUserName: ""
    },
    snack: {
      open: false,
      vertical: "bottom",
      horizontal: "right",
      message: ""
    },
    errors: {
      user: false,
      pass: false
    }
  };

  constructor(props) {
    super(props);
    this.state.data = [];
  }

  componentDidMount() {
    this.bringUsers();
  }

  bringUsers() {
    //Realizar peticion get
    return fetch("/api/getUsers")
      .then(res => res.json())
      .then(d => {
        if (d.length > 0) {
          var data = [];
          d.forEach((el, id) => {
            var dataEl = { ...el };
            dataEl.pass2 = el.pass;
            dataEl.oldUserName = el.user_name;
            data.push(dataEl);
          });

          this.setState({ data });
        } else {
          this.setState({ data: null });
        }
        this.setState({ hasData: true });
      });
  }

  onInsert = callback => {
    this.addUser(this.state.tempElement, callback);
  };
  onUpdate = callback => {
    this.editUser(this.state.tempElement, callback);
  };

  addUser = (data, callback) => {
    const requestData = {
      user_name: data.user_name,
      pass: data.pass
    };
    fetch("/api/addUser", {
      method: "POST",
      body: JSON.stringify(requestData),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        var err = data["@err"];
        callback(parseInt(err));
      });
  };

  editUser = (data, callback) => {
    const requestData = {
      user_name: data.user_name,
      pass: data.pass,
      oldUserName: data.oldUserName
    };
    fetch("/api/editUser", {
      method: "POST",
      body: JSON.stringify(requestData),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        var err = data["@err"];
        callback(parseInt(err));
        this.bringUsers();
      });
  };
  /**
   * Events
   */
  handleText = (state, val) => {
    const tempElement = { ...this.state.tempElement };
    tempElement[state] = val;
    this.setState({ tempElement });
  };

  /**
   * Sincronizadores
   */
  syncTemp = tempElement => {
    this.setState({ tempElement });
  };

  syncMemoryData = (data, type) => {
    this.setState({ data });
  };

  checkForm = () => {
    if (this.state.tempElement.pass !== this.state.tempElement.pass2) {
      this.handleOpenSnack("Contraseñas no coinciden ");
      return false;
    }

    return true;
  };

  /**
   * Renderizar header de la tabla
   */
  renderTableHead = () => {
    return (
      <React.Fragment>
        <TableCell>Usuario</TableCell>
        <TableCell>Contraseña</TableCell>
      </React.Fragment>
    );
  };

  /**
   * Renderizar fila de la tabla
   */
  renderTableRow = row => {
    return (
      <React.Fragment>
        <TableCell>{row.user_name}</TableCell>
        <TableCell>{"●".repeat(row.pass.length)}</TableCell>
      </React.Fragment>
    );
  };

  //Abrir mensaje
  handleOpenSnack = message => {
    this.setState({
      snack: {
        open: true,
        vertical: "bottom",
        horizontal: "right",
        message: message
      }
    });
  };

  //Cerrar el mensaje
  handleCloseSnack = () => {
    this.setState({
      snack: {
        open: false,
        vertical: "bottom",
        horizontal: "right",
        message: ""
      }
    });
  };

  messageHandler(code, action) {
    if (code === 0) {
      return "Agregado exitosamente";
    }
    if (code === 1) {
      return "Error desconocido";
    }
    if (code === -1) {
      return "No autorizado";
    }
    if (code === 100) {
      return "No se pudo ingresar, valores repetidos";
    }
  }

  /**
   * Rendizar formulario de agregar o editar
   */
  dialogForm = () => {
    return (
      <React.Fragment>
        <Grid container style={{ padding: 10 }}>
          <TextField
            autoFocus
            required
            margin="dense"
            id="user"
            label="Usuario"
            autoComplete="false"
            value={this.state.tempElement.user_name}
            onChange={e => {
              this.handleText("user_name", e.target.value);
            }}
            autoComplete="off"
            fullWidth
            inputProps={{ maxLength: 20 }}
          />
        </Grid>
        <Grid container style={{ padding: 10 }}>
          <TextField
            required
            type="password"
            margin="dense"
            id="pass"
            label="Contraseña"
            autoComplete="false"
            value={this.state.tempElement.pass}
            onChange={e => {
              this.handleText("pass", e.target.value);
            }}
            autoComplete="off"
            fullWidth
            inputProps={{ maxLength: 64 }}
          />
        </Grid>
        <Grid container style={{ padding: 10 }}>
          <TextField
            required
            type="password"
            margin="dense"
            id="pass"
            label="Repetir contraseña"
            autoComplete="false"
            value={this.state.tempElement.pass2}
            onChange={e => {
              this.handleText("pass2", e.target.value);
            }}
            autoComplete="off"
            fullWidth
            inputProps={{ maxLength: 64 }}
          />
        </Grid>
      </React.Fragment>
    );
  };

  render() {
    return (
      <AdminDashboard>
        <TableMngr
          elementStructure={this.state.elementStructure}
          data={this.state.data}
          renderRow={this.renderTableRow}
          renderHead={this.renderTableHead}
          renderDialogForm={this.dialogForm}
          syncData={this.syncMemoryData}
          syncTemp={this.syncTemp}
          tempElement={this.state.tempElement}
          onInsert={this.onInsert}
          onUpdate={this.onUpdate}
          hasData={this.state.hasData}
          messageHandler={this.messageHandler}
          checkForm={this.checkForm}
          columns={2}
        />
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={this.state.snack.open}
          onClose={this.handleCloseSnack}
          ContentProps={{ "aria-describedby": "message-id" }}
          message={<span id="message-id">{this.state.snack.message}</span>}
        />
      </AdminDashboard>
    );
  }
}

export default UserTableMngr;
