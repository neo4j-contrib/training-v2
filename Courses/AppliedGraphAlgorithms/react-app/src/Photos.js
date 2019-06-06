import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { AppBar, Button, Toolbar, Tabs, Tab, Typography, Grid, Paper } from "@material-ui/core";
import classNames from "classnames";
import { driver } from "./neo4j";
import { FETCH_RECOMMENDED_PHOTOS_QUERY } from "./exercises/exercise4";
import PhotoCard from "./PhotoCard";
import PhotoRecommender from "./PhotoRecommender";

const styles = theme => ({});

class Photos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPhotos: [],
      photos: []
    };
    this.fetchRandomPhotos();
  }

  fetchRandomPhotos = () => {
    const session = driver.session();
    session
      .run(FETCH_RECOMMENDED_PHOTOS_QUERY)
      .then(result => {
        console.log(result);
        const photos = result.records[0].get("photos");
        this.setState({
          photos
        });
      })
      .catch(e => {
        console.log(e);
      })
      .finally(() => {
        session.close();
      });
  };

  clearSelectedPhotos = () => {
      this.setState({
          selectedPhotos: []
      }, ()=>{this.fetchRandomPhotos()})
  }

  selectPhoto = id => {
    console.log(id);
    this.setState(
      {
        selectedPhotos: [...this.state.selectedPhotos, id]
      },
      () => {
        console.log(this.state);
      }
    );
  };

  render() {
    return (
      <div>
          <AppBar position="static" color="default">
            <Toolbar>
                <Typography color="inherit">
                    {this.state.selectedPhotos.length > 4 ? "Businesses recommended based on photo selections" : "Select 5 photos to seed business recommendations"}
                </Typography>
                {this.state.selectedPhotos.length > 4 ? (
                <Button onClick={this.clearSelectedPhotos}>
                    Reset
                </Button> ) : null}
            </Toolbar>
          </AppBar>
        {this.state.selectedPhotos.length > 4 ? (
          <PhotoRecommender selectedPhotos={this.state.selectedPhotos} />
        ) : (
          <Paper>
            <Grid container spacing={24}>
              {this.state.photos.map(photo => (
                <Grid item xs={6} md={3} key={photo.id}>
                  <PhotoCard
                    id={photo.photoId}
                    handleChange={this.selectPhoto}
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(Photos);
