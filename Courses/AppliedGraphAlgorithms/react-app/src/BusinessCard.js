import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import Grid from "@material-ui/core/Grid";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const styles = {
  card: {
    minWidth: 100
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    marginBottom: 16,
    fontSize: "0.5vw"
  },
  pos: {
    marginBottom: 12
  },
  media: {
    minHeight: 300
  },
  imageAnchor: {
    textDecoration: "none"
  }
};

const BusinessCard = props => {
  const { 
      classes,
        cardClicked
    } = props;
  console.log(props);
  return (
    <Card className={classes.title}>
      <CardActionArea
        onClick={() => {cardClicked(props.business)}}
      >
      
        <CardMedia
          className={classes.media}
          image={"https://s3.amazonaws.com/yelp-photos.neo4j.com/" + `${props.business.photo ? props.business.photo + ".jpg" : "default.png"}`} 
          title={props.business.name}
        >
          
        </CardMedia>
        
        <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
            {props.business.name}
            </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
          {/* <Grid container spacing={1}>
          {props.labels.map( h => {
            return (
            <Grid item xs={5} key={h.name}>
            <Button size="small" color="primary">
                {h.name}
            </Button>
            </Grid>)
          })}
          </Grid> */}
          
      </CardActions>
     
    </Card>
  );
};

export default withStyles(styles)(BusinessCard);