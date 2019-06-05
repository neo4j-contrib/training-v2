import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import { FETCH_PHOTO_RECOMMENDATIONS } from "./exercises/exercise4";
import { driver } from "./neo4j";
import BusinessCard from "./BusinessCard";
import { Grid, Paper } from "@material-ui/core";

const styles = theme => ({});

class PhotoRecommender extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recommendations: []
    };
    this.fetchRecommendations();
  }

  fetchRecommendations = () => {
    const session = driver.session();
    session
      .run(FETCH_PHOTO_RECOMMENDATIONS, {
        selectedPhotos: this.props.selectedPhotos
      })
      .then(result => {
        const record = result.records[0];
        const recommendations = record.get("recommendations");
        this.setState({
          recommendations
        });
      })
      .catch(e => {
        console.log(e);
      })
      .finally(() => {
        session.close();
      });
  };

  businessCardSelected = b => {
    console.log(b);
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Paper>
          <Grid container spacing={24}>
            {this.state.recommendations.map(b => (
              <Grid item xs={6} md={3} key={b.id}>
                <BusinessCard
                  business={b}
                  cardClicked={this.businessCardSelected}
                />
              </Grid>
            ))}
          </Grid>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(PhotoRecommender);
