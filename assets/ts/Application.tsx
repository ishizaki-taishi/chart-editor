import * as React from "react";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import AppBar from "@material-ui/core/AppBar";

export interface HelloProps {
  name: string;
}
import classNames from "classnames";
import Toolbar from "@material-ui/core/Toolbar";

import { withStyles, WithStyles, createStyles } from "@material-ui/core";

import Pixi from "./Pixi";
import Inspector from "./Inspector";

import config from "./config";

const drawerWidth: number = config.sidebarWidth;

const styles = (theme: Theme) =>
  createStyles({
    root: {
      /* ... */
    },

    drawerPaper: {
      position: "relative",
      width: drawerWidth
    },
    appFrame: {
      zIndex: 1,
      overflow: "hidden",
      position: "relative",
      display: "flex",
      width: "100%"
    },
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`
    },

    "appBar-left": {
      marginLeft: drawerWidth
    },
    toolbar: theme.mixins.toolbar,

    paper: {
      /* ... */
    },
    button: {
      /* ... */
    },
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default
      // padding: theme.spacing.unit * 3
    }
  });

interface Props extends WithStyles<typeof styles> {}

class Application extends React.Component<Props, {}> {
  render() {
    console.log(this.props.classes.paper);
    const { classes } = this.props;

    return (
      <div style={{ flexGrow: 1 }}>
        <div className={classes.appFrame}>
          <AppBar
            position="absolute"
            className={classNames(classes.appBar, classes[`appBar-left`])}
          >
            <Toolbar>toolbar</Toolbar>
          </AppBar>

          <Drawer
            variant="permanent"
            classes={{
              paper: classes.drawerPaper
            }}
            anchor="left"
          >
            left drawer
            <Inspector />
          </Drawer>
          <main
            className={classes.content}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <div className={classes.toolbar} />

            <div style={{ padding: "1rem" }}>
              form area
              <Button variant="contained" color="primary">
                Hello World
              </Button>
            </div>

            <div style={{ flex: 1, display: "flex" }}>
              <Pixi />
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Application);
