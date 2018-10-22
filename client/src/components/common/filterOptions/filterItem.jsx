import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Switch from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";
import Theme from "../../themes/defaulTheme";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
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
  row: {
    backgroundColor: "#2196f3"
  },
  title: {
    height: 25,
    paddingLeft: 20
  },
  formControl: {
    marginBottom: 20
  },
  toggleContainer: {
    height: 56,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    margin: `${theme.spacing.unit}px 0`,
    background: theme.palette.background.default
  },
  filterType: {
    marginTop: 15.5,
    paddingRight: 20
  }
});

class FilterItem extends Component {
  state = { enable: false, dir: null, canChangeEnable: false };

  constructor(props) {
    super(props);
    this.changeEnableAutomatic = this.changeEnableAutomatic.bind(this);
    this.enableSwitch = this.enableSwitch.bind(this);
    this.isEnable = this.isEnable.bind(this);
    this.getDir = this.getDir.bind(this);
  }

  /**
   * Retorna si el filtro esta activo o no
   */
  isEnable() {
    return this.state.enable;
  }

  /**
   * Retorna la direccion (ascendente o descendente)
   */
  getDir() {
    return this.state.dir;
  }

  /**
   * Activa/desactiva la capacidad de darle click al switch
   * @param {bool} val Valor que se le quiere poner
   */
  enableSwitch(val) {
    this.setState({ canChangeEnable: val });
  }

  /**
   * Cambia si el filtro actual esta activa o no
   * si lo queremos activar entonces lo hacemos sin ninguna revision
   * si lo queremos desactivar revisamos que no existan datos y tampoco este la direccion activada
   * @param {bool} val Valor que se le quiere poner
   * @param {bool} hasFilterData Tiene datos ingresados
   * @param {String} dir Tiene una direccion ingresada (nulo es falso)
   */
  changeEnableAutomatic(val, hasFilterData, dir = null) {
    if (dir === null) dir = this.state.dir !== null;
    var finalValue = true;
    if (val === true) {
      finalValue = true;
    } else {
      finalValue = !(!hasFilterData && !dir);
    }
    this.enableSwitch(finalValue);
    this.setState({ enable: finalValue });
  }

  /**
   * Eventos
   */
  handleChange = event => {
    this.setState({ enable: event.target.checked });
  };
  handleDirChange = (event, dir) => {
    this.setState({ dir });
    this.changeEnableAutomatic(
      dir !== null,
      this.props.hasFilterData,
      dir !== null
    );
  };

  handleFilterTypeSelect = event => {
    this.props.changeFilterType(event.target.value);
  };

  render() {
    const { classes } = this.props;
    let { filterTypeItems, currentFilterType } = this.props;
    if (filterTypeItems == null) filterTypeItems = [];
    if (currentFilterType == undefined) currentFilterType = "none";

    return (
      <Theme>
        <div className={classes.root}>
          <FormGroup row>
            <Grid container alignItems="center" spacing={0}>
              <Grid item xs={2}>
                <FormControl margin="normal" className={classes.title}>
                  <Typography variant="subtitle1">{this.props.name}</Typography>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <Grid container>
                  <Grid item xs={4}>
                    <Grid container className={classes.filterType}>
                      <FormControl fullWidth>
                        <InputLabel htmlFor="filterType">Filtrado</InputLabel>
                        <Select
                          value={currentFilterType}
                          onChange={this.handleFilterTypeSelect}
                          input={<Input name="filterType" id="filterType" />}
                          disabled={this.props.filterTypeItems == null}
                        >
                          {filterTypeItems.map(e => {
                            return (
                              <MenuItem key={e.value} value={e.value}>
                                {e.name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid item xs={8}>
                    <Grid container className={classes.formControl}>
                      {this.props.children}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={1}>
                <Grid container>
                  <div className={classes.toggleContainer}>
                    <ToggleButtonGroup
                      value={this.state.dir}
                      exclusive
                      onChange={this.handleDirChange}
                    >
                      <ToggleButton value="ASC">
                        <ArrowUpwardIcon />
                      </ToggleButton>
                      <ToggleButton value="DESC">
                        <ArrowDownwardIcon />
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </div>
                </Grid>
              </Grid>

              <Grid item xs={1}>
                <FormControlLabel
                  className={classes.title}
                  control={
                    <Switch
                      checked={this.state.enable}
                      onChange={this.handleChange}
                      value="enable"
                      color="primary"
                      disabled={!this.state.canChangeEnable}
                    />
                  }
                  label="Activo"
                />
              </Grid>
            </Grid>
          </FormGroup>
        </div>
      </Theme>
    );
  }
}

FilterItem.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FilterItem);
