import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Typography, Modal, Button } from "@material-ui/core";

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const styles = theme => ({
  paper: {
    position: "absolute",
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4
  }
});

class BusinessModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: props.open
        };
    }

    handleClose = () => {
        this.setState({ open: false });
      };

    render() {
        const { classes } = this.props;

        return (
            <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onClose={this.handleClose}
        >
          <div style={getModalStyle()} className={classes.paper}>
            <Typography variant="h6" id="modal-title">
              Text in a modal
            </Typography>
            <Typography variant="subtitle1" id="simple-modal-description">
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography>
            
          </div>
        </Modal>
        )
    }
}
export default withStyles(styles)(BusinessModal);