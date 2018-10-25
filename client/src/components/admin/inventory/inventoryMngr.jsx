import React, { Component } from "react";
import AdminDashboard from "../adminDashboard";
import InventoryTable from "./inventoryTable";
import ProductBrandTable from "./productBrandTable";
import ProductDescriptionTable from "./productDescriptionTable";
import ProductMeasurmentTable from "./productMeasurementTable";
import ProductNamesTable from "./productNamesTable";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";

function TabContainer(props) {
  return (
    <Typography
      component="div"
      style={{ padding: 8 * 3, backgroundColor: "#f6f6f6" }}
    >
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  }
});

class InventoryMngr extends Component {
  state = {
    value: "inv",
    inventoryData: [
      {
        codigo: "5901234123457",
        marca: "A",
        nombre: "A",
        descripcion: "A",
        stock: 500,
        presentacion: "A",
        unidades: 1,
        precioActual: "30",
        delete: false
      },
      {
        codigo: "8401010101015",
        marca: "B",
        nombre: "B",
        descripcion: "B",
        stock: 20,
        presentacion: "A",
        unidades: 1,
        precioActual: "10",
        delete: false
      }
    ],
    measurmentData: [
      {
        codigo: "A",
        presentacion: "Unidad",
        delete: false
      },
      {
        codigo: "B",
        presentacion: "Caja",
        delete: false
      }
    ],
    brandData: [
      {
        codigo: "A",
        marca: "Yale",
        delete: false
      },
      {
        codigo: "B",
        marca: "Siemens",
        delete: false
      },
      {
        codigo: "C",
        marca: "STIHL",
        delete: false
      }
    ],
    descriptionData: [
      {
        codigo: "A",
        descripcion: "30 watts",
        delete: false
      },
      {
        codigo: "B",
        descripcion: "Amarillos",
        delete: false
      },
      {
        codigo: "C",
        descripcion: "Blancos",
        delete: false
      }
    ],
    nameData: [
      {
        codigo: "A",
        nombre: "Bombillo",
        delete: false
      },
      {
        codigo: "B",
        nombre: "Lentes de seguridad",
        delete: false
      },
      {
        codigo: "C",
        nombre: "Cinta industrial",
        delete: false
      },
      {
        codigo: "D",
        nombre: "Taladro",
        delete: false
      },
      {
        codigo: "E",
        nombre: "Generador electrico",
        delete: false
      },
      {
        codigo: "F",
        nombre: "Stepper",
        delete: false
      },
      {
        codigo: "G",
        nombre: "Multimetro",
        delete: false
      }
    ]
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;
    return (
      <AdminDashboard>
        <div className={classes.root}>
          <AppBar position="static">
            <Tabs value={value} onChange={this.handleChange}>
              <Tab value="inv" label="Inventario" />
              <Tab value="brand" label="Marcas" />
              <Tab value="product" label="Productos" />
              <Tab value="description" label="Descripciones" />
              <Tab value="measurment" label="Presentaciones" />
            </Tabs>
          </AppBar>
          {value === "inv" && (
            <TabContainer>
              <InventoryTable
                data={this.state.inventoryData}
                brandData={this.state.brandData}
                nameData={this.state.nameData}
                descriptionData={this.state.descriptionData}
                measurmentData={this.state.measurmentData}
              />
            </TabContainer>
          )}
          {value === "brand" && (
            <TabContainer>
              <ProductBrandTable data={this.state.brandData} />
            </TabContainer>
          )}
          {value === "product" && (
            <TabContainer>
              <ProductNamesTable data={this.state.nameData} />
            </TabContainer>
          )}
          {value === "description" && (
            <TabContainer>
              <ProductDescriptionTable data={this.state.descriptionData} />
            </TabContainer>
          )}
          {value === "measurment" && (
            <TabContainer>
              <ProductMeasurmentTable data={this.state.measurmentData} />
            </TabContainer>
          )}
        </div>
      </AdminDashboard>
    );
  }
}
InventoryMngr.propTypes = { classes: PropTypes.object.isRequired };

export default withStyles(styles)(InventoryMngr);
