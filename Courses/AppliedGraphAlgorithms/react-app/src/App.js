import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import Photos from "./Photos";
import BusinessSearch from "./BusinessSearch";
import UserProfile from "./UserProfile";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  CssBaseline,
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";

import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  ShoppingCart as ShoppingCartIcon,
  People as PeopleIcon
} from "@material-ui/icons";


import classNames from "classnames";

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: "flex"
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36
  },
  menuButtonHidden: {
    display: "none"
  },
  title: {
    flexGrow: 1
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing.unit * 9
    }
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: "100vh",
    overflow: "auto"
  },
  chartContainer: {
    marginLeft: -22
  },
  tableContainer: {
    height: 320
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 70
  },
  dateField: {
    //width: 300
  },
  searchField: {},
  input: {
    color: "white"
  }
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedView: "UserProfile",
      open: true,
      selectedUser: "7C4B2Skmh4X9f8xJDo9O4w"
    };

  
  }

  setSelectedView(viewName) {
    this.setState({
      selectedView: viewName
    });
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleUserChange = user => {
    this.setState({
      selectedUser: user
    })
    console.log("CHANGED USER");
    console.log(user);
  }

  handleChange = name => event => {

    const val = event.target.value;
    if (name === "search") {
      clearTimeout(this.timeout);

      this.timeout = setTimeout(() => {
        this.setState({
          [name]: val
        },);
      }, 500);
    } else {
      this.setState({
        [name]: event.target.value
      });
    }
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClick2 = event => {
    this.setState({ anchorEl2: event.currentTarget });
  };

  handleClose = event => {
    this.setState({
      anchorEl: null,
      selectedContent: event.target.textContent
    });
  };

  handleClose2 = event => {
    this.setState({
      anchorEl2: null,
      selectedCountry: event.target.textContent
    });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;
    const {
      anchorEl,
      anchorEl2,
      selectedContent,
      selectedCountry,
      startDate,
      endDate,
      search
    } = this.state;
    const pageSize = parseInt(this.state.pageSize);
    const page = parseInt(this.state.page);

    return (
      <div>
        <CssBaseline />
        <div className={classes.root}>
          <AppBar
            position="absolute"
            className={classNames(
              classes.appBar,
              this.state.open && classes.appBarShift
            )}
          >
            <Toolbar
              disableGutters={!this.state.open}
              className={classes.toolbar}
            >
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerOpen}
                className={classNames(
                  classes.menuButton,
                  this.state.open && classes.menuButtonHidden
                )}
              >
                <MenuIcon />
              </IconButton>

              <Typography
                component="h1"
                variant="title"
                color="inherit"
                noWrap
                className={classes.title}
              >
                Applied Graph Algorithms With Neo4j
              </Typography>

              

              
            </Toolbar>
          </AppBar>
          <Drawer
            variant="permanent"
            classes={{
              paper: classNames(
                classes.drawerPaper,
                !this.state.open && classes.drawerPaperClose
              )
            }}
            open={this.state.open}
          >
            <div className={classes.toolbarIcon}>
              <IconButton onClick={this.handleDrawerClose}>
                <ChevronLeftIcon />
              </IconButton>
            </div>
            <Divider />
            <List>

              <div>
                <ListItem
                  button
                  onClick={() => this.setSelectedView("UserProfile")}
                >
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="User Profile" />
                </ListItem>
                <ListItem
                  button
                  onClick={() => this.setSelectedView("BusinessSearch")}
                >
                  <ListItemIcon>
                    <PeopleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Business Search" />
                </ListItem>
                <ListItem
                  button
                  onClick={() => this.setSelectedView("Photos")}
                >
                  <ListItemIcon>
                    <ShoppingCartIcon />
                  </ListItemIcon>
                  <ListItemText primary="Photos" />
                </ListItem>
              </div>
            </List>
          </Drawer>
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />

            <Typography component="div" className={classes.chartContainer}>
              {this.state.selectedView === "UserProfile" ? (
               <UserProfile 
                selectedUser={this.state.selectedUser}
                handleUserChange={this.handleUserChange}
                
               />
              ) : null}
              {this.state.selectedView === "BusinessSearch" ? (
                <BusinessSearch 
                  selectedUser={this.state.selectedUser}
                />
              ) : null}
            
              {this.state.selectedView === "Photos" ? (
              <Photos 
                selectedUser={this.state.selectedUser}
              />
              
              ) : null}
              
           
            </Typography>
          </main>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(App);
