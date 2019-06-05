import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Paper,
  TextField,
  MenuItem,
  Grid,
  Dialog,
  AppBar,
  Toolbar,
  Slide,
  IconButton,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { FETCH_REVIEWS_QUERY } from "./exercises/exercise3";

import { driver } from "./neo4j";

const styles = theme => ({
  appBar: {
    position: "relative"
  },
  flex: {
    flex: 1
  }
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

function stars(count) {
    return [...Array(count).keys()].reduce((acc, v) => {
        return acc + "⭐";
    }, "")
}

class BusinessDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: []
    };
    if (props.open) {
      console.log("FETCH REVIEWS");
      this.fetchReviews();
    } else {
      //this.fetchReviews();
    }
  }

  fetchReviews = () => {
    const session = driver.session();
    session
      .run(FETCH_REVIEWS_QUERY, {
        businessId: this.props.business.id,
        userId: this.props.selectedUser
      })
      .then(result => {
        const record = result.records[0];
        const reviews = record.get("reviews");
        console.log(reviews);
        this.setState({
          reviews
        });
      })
      .catch(e => {
        console.log(e);
      })
      .finally(() => {
        session.close();
      });
  };

  render() {
    const { classes } = this.props;

    return (
      <Dialog
        fullScreen
        open={this.props.open}
        onClose={this.props.handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={this.props.handleClose}
              aria-label="Close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.flex}>
              {this.props.business ? this.props.business.name : ""}
            </Typography>
          </Toolbar>
        </AppBar>
        <List>
          {this.state.reviews.map(r => {
            return (
              <div>
                <ListItem button key={r.id}>
                  <ListItemText primary={stars(r.stars) + " " + r.text} secondary={r.name + " " + r.date} />
                </ListItem>
                <Divider />
              </div>
            );
          })}
        </List>
      </Dialog>
    );
  }
}

export default withStyles(styles)(BusinessDetails);
