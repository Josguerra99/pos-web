import React, { Component } from "react";
import Routes from "./routes/routes";
import MuiPickersUtilsProvider from "material-ui-pickers/MuiPickersUtilsProvider";
import DateFnsUtils from "material-ui-pickers/utils/date-fns-utils";

class App extends Component {
  render() {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Routes />
      </MuiPickersUtilsProvider>
    );
  }
}

export default App;
