import React, { Component } from "react";
import AdminDashboard from "./adminDashboard";
import SimpleLineChart from "./chart";
import Typography from "@material-ui/core/Typography";

class HomeAdmin extends Component {
  state = {};
  render() {
    return (
      <AdminDashboard>
        <Typography component="div">
          <SimpleLineChart />
        </Typography>
      </AdminDashboard>
    );
  }
}

export default HomeAdmin;
