import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import React, { Component } from "react";
import FilterItem from "./filterItem";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import { withStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    minWidth: 120,
    maxWidth: 500
  },
  chips: {
    display: "flex",
    flexWrap: "wrap"
  },
  selectContainer: {
    marginTop: 15.5
  }
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

class FilterSelectMultiple extends Component {
  state = { item: [] };

  constructor(props) {
    super(props);
    this.filterItem = React.createRef();
  }

  handleChange = event => {
    this.setState({ item: event.target.value });
    /*Si tengo mas de un item seleccionado entonces habilitamos el filtro*/
    this.filterItem.current.changeEnableAutomatic(
      event.target.value.length > 0,
      event.target.value.length > 0
    );
  };

  renderFilterItems = () => {
    return (
      <React.Fragment>
        <MenuItem value={"="}>{"Igual"}</MenuItem>
        <MenuItem value={"!="}>{"No Igual"}</MenuItem>
      </React.Fragment>
    );
  };

  render() {
    const { classes, theme } = this.props;
    return (
      <FilterItem
        innerRef={this.filterItem}
        name={this.props.name}
        hasFilterData={this.state.item.length > 0}
        filterItems={this.renderFilterItems()}
      >
        <Grid container className={classes.selectContainer}>
          <FormControl className={classes.formControl} fullWidth>
            <InputLabel htmlFor="select-multiple-checkbox">
              {this.props.label}
            </InputLabel>
            <Select
              multiple
              value={this.state.item}
              onChange={this.handleChange}
              input={<Input id="select-multiple-checkbox" />}
              renderValue={selected => selected.join(", ")}
              MenuProps={MenuProps}
            >
              {this.props.items.map(i => (
                <MenuItem key={i.id} value={i.id}>
                  <Checkbox checked={this.state.item.indexOf(i.id) > -1} />
                  <ListItemText primary={i.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </FilterItem>
    );
  }
}
FilterSelectMultiple.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(FilterSelectMultiple);
