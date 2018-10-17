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
  }
});

class FilterItem extends Component {
  state = { enable: false, dir: null };

  handleChange = event => {
    this.setState({ enable: event.target.checked });
  };
  handleDirChange = (event, dir) => this.setState({ dir });

  render() {
    const { classes } = this.props;

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
              <Grid item xs={2}>
                <Grid container className={classes.formControl}>
                  {this.props.children}
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
