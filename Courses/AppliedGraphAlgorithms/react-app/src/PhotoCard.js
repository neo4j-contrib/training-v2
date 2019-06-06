import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Card,
  CardActions,
  Button,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography
} from "@material-ui/core";

const styles = {
    card: {
      maxWidth: 345,
    },
    media: {
      height: 140,
      borderStyle: "solid"
    },
    banner: {
        color: "green",
        fontSize: "42px",
        borderStyle: "solid",
        background: "gray",
        width: "auto%",
        whiteSpace: "nowrap"
    },

  };

class PhotoCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
        selected: false
    }
  }

  imageSelected = (e) => {
      console.log(e);
      this.setState({
          selected: true
      });
      this.props.handleChange(this.props.id);

  }

  render() {
    const { classes } = this.props;
    return (
      <Card className={classes.card} onClick={this.imageSelected}>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={`https://s3.amazonaws.com/yelp-photos.neo4j.com/${
              this.props.id
            }.jpg`}
            title="Contemplative Reptile"
          >
          {
              this.state.selected ? (<h1 className={classes.banner}>✔</h1>):null
          }
          
          </CardMedia>
          {/* <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              Lizard
            </Typography>
            <Typography component="p">
              Lizards are a widespread group of squamate reptiles, with over
              6,000 species, ranging across all continents except Antarctica
            </Typography>
          </CardContent>
        
        <CardActions>
          <Button size="small" color="primary">
            Share
          </Button>
          <Button size="small" color="primary">
            Learn More
          </Button>
        </CardActions> */}
        </CardActionArea>
      </Card>
    );
  }
}

export default withStyles(styles)(PhotoCard);
