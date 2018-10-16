import React, { Component } from "react";
import AdminDashboard from "./adminDashboard";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import formatDate from "date-fns/format";
import CircularProgress from "../common/circularprogress";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import history from "../common/history";
import Snackbar from "@material-ui/core/Snackbar";
import queryString from "query-string";
import { th } from "date-fns/locale";

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
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  table: {
    minWidth: 700
  },
  tablecells: {
    backgroundColor: "#f2f2f2"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  }
});

class ResolucionesActivas extends Component {
  state = {
    facData: false,
    ncData: false,
    ndData: false,
    fac: undefined,
    nc: undefined,
    nd: undefined,
    openSpecific: false,
    facOpen: false,
    ncOpen: false,
    ndOpen: false,
    snack: {
      open: false,
      vertical: "bottom",
      horizontal: "right",
      message: ""
    }
  };

  constructor() {
    super();
  }

  componentDidMount() {
    this.bringResolucion("FAC");
    this.bringResolucion("NC");
    this.bringResolucion("ND");

    let params = queryString.parse(this.props.location.search);
    if (params.addSuccess != null) {
      this.handleOpenSnack("Resolución añadida exitosamente");
      this.setState({ openSpecific: true });
      if (params.addSuccess == "FAC") this.setState({ facOpen: true });
      if (params.addSuccess == "NC") this.setState({ ncOpen: true });
      if (params.addSuccess == "ND") this.setState({ ndOpen: true });
    }
  }

  bringResolucion(doc, st) {
    //Realizar peticion get
    fetch("/api/resolucion_activa?doc=" + doc)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          if (doc == "FAC") this.setState({ fac: data[0] });
          if (doc == "NC") this.setState({ nc: data[0] });
          if (doc == "ND") this.setState({ nd: data[0] });
        } else {
          if (doc == "FAC") this.setState({ fac: null });
          if (doc == "NC") this.setState({ nc: null });
          if (doc == "ND") this.setState({ nd: null });
        }
        if (doc == "FAC") this.setState({ facData: true });
        if (doc == "NC") this.setState({ ncData: true });
        if (doc == "ND") this.setState({ ndData: true });
      });
  }
  /**********************EVENTS */

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

  /**********************EVENTS */

  renderPanelContent(doc, classes) {
    var data = null;
    var hasData = false;
    if (doc == "FAC") {
      data = this.state.fac;
      hasData = this.state.facData;
    }
    if (doc == "ND") {
      data = this.state.nd;
      hasData = this.state.ndData;
    }
    if (doc == "NC") {
      data = this.state.nc;
      hasData = this.state.ncData;
    }

    if (!hasData) {
      return <CircularProgress />;
    }

    if (data == null) {
      return <Typography>No hay ninguna resolución activa. </Typography>;
    }

    if (data) {
      return (
        <Table className={classes.root.table}>
          <TableHead>
            <TableRow>
              <TableCell className={classes.tablecells}>Numero</TableCell>
              <TableCell className={classes.tablecells}>Serie</TableCell>
              <TableCell className={classes.tablecells}>Rango</TableCell>
              <TableCell className={classes.tablecells}>
                Fecha de emisión
              </TableCell>
              <TableCell className={classes.tablecells}>Actual</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell className={classes.tablecells}>{data.Num}</TableCell>
              <TableCell className={classes.tablecells}>{data.Serie}</TableCell>
              <TableCell className={classes.tablecells}>
                {data.Inicio + " al " + data.Fin}
              </TableCell>
              <TableCell className={classes.tablecells}>
                {formatDate(data.Fecha, "dd/MM/yyyy")}
              </TableCell>
              <TableCell className={classes.tablecells}>
                {data.Actual}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
    }
  }

  renderPanel(doc, title, classes, open) {
    return (
      <ExpansionPanel defaultExpanded={open}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>{title}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          {this.renderPanelContent(doc, classes)}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }

  render() {
    const { vertical, horizontal, open, message } = this.state.snack;

    const { classes } = this.props;

    return (
      <AdminDashboard>
        <div className={classes.root}>
          {this.renderPanel(
            "FAC",
            "Factura",
            classes,
            (this.state.openSpecific == true && this.state.facOpen == true) ||
              this.state.openSpecific == false
          )}
          {this.renderPanel(
            "NC",
            "Nota de crédito",
            classes,
            (this.state.openSpecific == true && this.state.ncOpen == true) ||
              this.state.openSpecific == false
          )}
          {this.renderPanel(
            "ND",
            "Nota de débito",
            classes,
            (this.state.openSpecific == true && this.state.ndOpen == true) ||
              this.state.openSpecific == false
          )}
        </div>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          onClose={this.handleCloseSnack}
          ContentProps={{ "aria-describedby": "message-id" }}
          message={<span id="message-id">{this.state.snack.message}</span>}
        />
      </AdminDashboard>
    );
  }
}

ResolucionesActivas.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ResolucionesActivas);
