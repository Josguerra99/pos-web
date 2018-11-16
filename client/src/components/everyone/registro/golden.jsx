import React, { Component } from "react";
import EveryOne from "../everyone";
import Registro from "./registro";

class Pro extends Component {
  state = {};
  render() {
    return (
      <EveryOne>
        <Registro computadoras={20} />
      </EveryOne>
    );
  }
}

export default Pro;
