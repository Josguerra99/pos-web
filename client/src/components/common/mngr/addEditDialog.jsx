import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Theme from "../../themes/defaulTheme";

class AddEditDialog extends Component {
  state = {};

  handleOk = e => {
    e.preventDefault();
    if (this.props.checkForm && !this.props.checkForm()) return;
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
          <form onSubmit={this.handleOk}>
            <DialogTitle id="alert-dialog-title">
              {this.props.title}
            </DialogTitle>
            <DialogContent>{this.props.children}</DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cancelar
              </Button>
              <Button type="submit" disabled={!this.props.open} color="primary">
                Aceptar
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Theme>
    );
  }
}

export default AddEditDialog;
