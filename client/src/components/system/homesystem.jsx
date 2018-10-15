import React, { Component } from "react";
import SessionChecker from "../common/sessionChecker";

class HomeSystem extends Component {
  state = {};
  render() {
    return (
      <SessionChecker role="SYS">
        <h1>System</h1>
      </SessionChecker>
    );
  }
}

export default HomeSystem;
