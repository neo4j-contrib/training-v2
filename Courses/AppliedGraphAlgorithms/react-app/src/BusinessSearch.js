import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
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
import BusinessCard from "./BusinessCard";
import BusinessDetails from "./BusinessDetails";
import { driver } from "./neo4j";
import BusinessModal from "./BusinessModal";
import { FETCH_CATEGORIES_QUERY } from "./exercises/exercise1";
import { FETCH_BUSINESSES_QUERY } from "./exercises/exercise2";

const styles = theme => ({
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(12, 1fr)",
    gridGap: `${theme.spacing.unit * 3}px`
  },
  paper: {
    padding: theme.spacing.unit,
    textAlign: "center",
    color: theme.palette.text.secondary,
    whiteSpace: "nowrap",
    marginBottom: theme.spacing.unit
  },
  divider: {
    margin: `${theme.spacing.unit * 2}px 0`
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    minWidth: 400
  },
  dense: {
    marginTop: 16
  },
  menu: {
    width: 200
  }
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class BusinessSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      businesses: [],
      categories: [],
      showBusiness: false,
      selectedBusiness: null,
      open: false
    };

    this.timeout = null;

    this.fetchCategories();
  }

  handleChange = name => event => {
    const val = event.target.value;
    if (name === "searchText") {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.setState(
          {
            [name]: val
          },
          () => {
            this.fetchBusinesses();
          }
        );
      }, 500);
    } else {
      this.setState(
        {
          [name]: event.target.value
        },
        () => {
          this.fetchBusinesses();
        }
      );
    }
  };

  fetchBusinesses = () => {
    const session = driver.session();
    session
      .run(FETCH_BUSINESSES_QUERY, {
        category: this.state.category,
        searchText: this.state.searchText,
        userId: this.props.selectedUser
      })
      .then(result => {
        const record = result.records[0];
        const businesses = record.get("businesses");
        this.setState({
          businesses
        });
      })
      .catch(e => {
        console.log(e);
      })
      .finally(() => {
        session.close();
      });
  };

  fetchCategories = () => {
    const session = driver.session();
    session
      .run(FETCH_CATEGORIES_QUERY, {})
      .then(result => {
        const record = result.records[0];
        const categories = record.get("categories");
        this.setState({
          categories
        });
      })
      .catch(e => {
        console.log(e);
      })
      .finally(() => {
        session.close();
      });
  };

  businessCardSelected = business => {
    console.log("SHOW BUSINESS");
    console.log(business);

    this.setState({
      showBusiness: true,
      selectedBusiness: business,
      open: true
    });
  };

  handleClose = () => {
    this.setState({ showBusiness: false, selectedBusiness: null, open: false });
    console.log("handle close");
  };

  // shouldComponentUpdate(nextProps, nextState) {
  //     if (nextState.showBusiness !== this.state.showBusiness) {
  //         return false;
  //     } else {
  //         return true;
  //     }
  // }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Paper>
          <form className="classes.container" noValidate autoComplete="off">
            <TextField
              id="searchText"
              label="Search Text"
              className={classes.textField}
              value={this.state.search}
              onChange={this.handleChange("searchText")}
              margin="normal"
              variant="outlined"
            />

            <TextField
              id="outlined-select-currency"
              select
              //   label="Select"
              className={classes.textField}
              value={this.state.category}
              onChange={this.handleChange("category")}
              SelectProps={{
                MenuProps: {
                  className: classes.menu
                }
              }}
              helperText="Please select your category"
              margin="normal"
              variant="outlined"
            >
              {this.state.categories.map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </form>
        </Paper>
        <Paper>
          <Grid container spacing={24}>
            {this.state.businesses.map(b => (
              <Grid item xs={6} md={3} key={b.id}>
                <BusinessCard
                  business={b}
                  cardClicked={this.businessCardSelected}
                />
              </Grid>
            ))}
          </Grid>
          {/* <BusinessModal 
            open={this.state.showBusiness}
            business={this.state.selectedBusiness}
        /> */}
        </Paper>

        {this.state.showBusiness ? (
          <BusinessDetails
            business={this.state.selectedBusiness}
            open={this.state.showBusiness}
            handleClose={this.handleClose}
            selectedUser={this.props.selectedUser}
          />
        ) : null}
      </div>
    );
  }
}

export default withStyles(styles)(BusinessSearch);
