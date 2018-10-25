import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Theme from "../../themes/defaulTheme";

class AddEditDialog extends Component {
  state = {};

  handleOk = () => {
    if (this.props.handleOk) this.props.handleOk();
  };

  handleClose = () => {
    this.props.handleOpen(false);
  };

  render() {
    return (
      <Theme>
        <Dialog
          fullWidth
          open={this.props.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{this.props.title}</DialogTitle>
          <DialogContent>{this.props.children}</DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancelar
            </Button>
            <Button
              disabled={!this.props.open}
              onClick={this.handleOk}
              color="primary"
              type="submit"
            >
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>
      </Theme>
    );
  }
}

export default AddEditDialog;
