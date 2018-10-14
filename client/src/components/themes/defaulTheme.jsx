import React, { Component } from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";

class Theme extends Component {
  render() {
    const theme = createMuiTheme({
      palette: {
        primary: blue
      }
    });
    return (
      <MuiThemeProvider theme={theme}>{this.props.children}</MuiThemeProvider>
    );
  }
}

export default Theme;
